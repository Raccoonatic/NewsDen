/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   drive.ts                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/11/17 15:24:16 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/11/17 15:59:56 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { AssetCategory } from '@/types/enums';

export interface ProvisionedArchive {
  articleFolderId: string;
  articleFolderUrl: string | null;
  subfolders: Record<AssetCategory, string>;
}

export interface UploadedDriveFile {
  driveFileId: string;
  driveWebUrl: string | null;
  fileSizeBytes: number;
}

/**
 * Initializes the Google Drive client using the credentials from .env.local.
 * (When migrating to the Shared Drive, swap this block to google.auth.GoogleAuth).
 */
function getDriveClient(): drive_v3.Drive {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing Google Drive OAuth credentials in .env.local (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN).'
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Creates a folder inside an optional parent folder.
 */
async function createFolder(
  drive: drive_v3.Drive,
  name: string,
  parentId?: string
): Promise<{ id: string; webViewLink: string | null }> {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId ? { parents: [parentId] } : {}),
    },
    fields: 'id, webViewLink',
    supportsAllDrives: true,
  });

  if (!res.data.id) {
    throw new Error(`Failed to create Google Drive folder: ${name}`);
  }

  return {
    id: res.data.id,
    webViewLink: res.data.webViewLink || null,
  };
}

/**
 * Finds an existing folder by exact name (and optional parent) or creates it if missing.
 */
async function getOrCreateFolder(
  drive: drive_v3.Drive,
  name: string,
  parentId?: string
): Promise<{ id: string; webViewLink: string | null }> {
  const safeName = name.replace(/'/g, "\\'");
  const queryParts = [
    `name = '${safeName}'`,
    `mimeType = 'application/vnd.google-apps.folder'`,
    `trashed = false`,
  ];

  if (parentId) {
    queryParts.push(`'${parentId}' in parents`);
  }

  const listRes = await drive.files.list({
    q: queryParts.join(' and '),
    fields: 'files(id, name, webViewLink)',
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const existing = listRes.data.files?.[0];
  if (existing?.id) {
    return {
      id: existing.id,
      webViewLink: existing.webViewLink || null,
    };
  }

  return createFolder(drive, name, parentId);
}

/**
 * Gets the root NewsDen_Archive folder ID from .env.local or auto-creates it.
 */
async function getRootArchiveId(drive: drive_v3.Drive): Promise<string> {
  const configuredRootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim();
  if (configuredRootId) {
    return configuredRootId;
  }

  const rootFolder = await getOrCreateFolder(drive, 'NewsDen_Archive');
  console.log(
    `📁 Using NewsDen_Archive folder (${rootFolder.id}). Tip: Add GOOGLE_DRIVE_ROOT_FOLDER_ID="${rootFolder.id}" to .env.local to skip lookup.`
  );
  return rootFolder.id;
}

/**
 * Builds the full directory structure for a newly submitted article:
 * NewsDen_Archive / YYYY-MM / YYYY-MM-DD_slug / { body, img, vid, snd, doc }
 */
export async function provisionArticleArchive(
  slug: string,
  createdAt: Date = new Date()
): Promise<ProvisionedArchive> {
  const drive = getDriveClient();
  const rootId = await getRootArchiveId(drive);

  const iso = createdAt.toISOString();
  const yearMonth = iso.slice(0, 7);
  const datePrefix = iso.slice(0, 10);

  // Ensure YYYY-MM folder exists
  const monthFolder = await getOrCreateFolder(drive, yearMonth, rootId);

  // Create human-readable article folder
  const articleFolder = await createFolder(
    drive,
    `${datePrefix}_${slug}`,
    monthFolder.id
  );

  // Create the 5 category subfolders in parallel
  const categories: { key: AssetCategory; dirName: string }[] = [
    { key: 'BODY', dirName: 'body' },
    { key: 'IMG', dirName: 'img' },
    { key: 'VID', dirName: 'vid' },
    { key: 'SND', dirName: 'snd' },
    { key: 'DOC', dirName: 'doc' },
  ];

  const createdSubfolders = await Promise.all(
    categories.map(async ({ key, dirName }) => {
      const folder = await createFolder(drive, dirName, articleFolder.id);
      return [key, folder.id] as const;
    })
  );

  const subfolders = Object.fromEntries(createdSubfolders) as Record<
    AssetCategory,
    string
  >;

  return {
    articleFolderId: articleFolder.id,
    articleFolderUrl: articleFolder.webViewLink,
    subfolders,
  };
}

/**
 * Uploads a UTF-8 .txt snapshot (e.g., 00_original_submission.txt or editor revisions) to body/.
 */
export async function uploadTextSnapshot(params: {
  folderId: string;
  fileName: string;
  content: string;
}): Promise<UploadedDriveFile> {
  const drive = getDriveClient();
  const buffer = Buffer.from(params.content, 'utf-8');

  const res = await drive.files.create({
    requestBody: {
      name: params.fileName,
      parents: [params.folderId],
      mimeType: 'text/plain',
    },
    media: {
      mimeType: 'text/plain; charset=utf-8',
      body: Readable.from(buffer),
    },
    fields: 'id, webViewLink, size',
    supportsAllDrives: true,
  });

  if (!res.data.id) {
    throw new Error(`Failed to upload text snapshot: ${params.fileName}`);
  }

  return {
    driveFileId: res.data.id,
    driveWebUrl: res.data.webViewLink || null,
    fileSizeBytes: Number(res.data.size || buffer.byteLength),
  };
}

/**
 * Streams a binary media file (image, audio, video, or document) into its Drive subfolder.
 */
export async function uploadMediaFile(params: {
  folderId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<UploadedDriveFile> {
  const drive = getDriveClient();

  const res = await drive.files.create({
    requestBody: {
      name: params.fileName,
      parents: [params.folderId],
    },
    media: {
      mimeType: params.mimeType || 'application/octet-stream',
      body: Readable.from(params.buffer),
    },
    fields: 'id, webViewLink, size',
    supportsAllDrives: true,
  });

  if (!res.data.id) {
    throw new Error(`Failed to upload media file: ${params.fileName}`);
  }

  return {
    driveFileId: res.data.id,
    driveWebUrl: res.data.webViewLink || null,
    fileSizeBytes: Number(res.data.size || params.buffer.byteLength),
  };
}

/**
 * Resolves a category subfolder ('body', 'img', 'vid', 'snd', 'doc') inside an article's root Drive folder.
 */
export async function getSubfolderId(
  articleFolderId: string,
  category: AssetCategory
): Promise<string> {
  const dirMap: Record<AssetCategory, string> = {
    BODY: 'body',
    IMG: 'img',
    VID: 'vid',
    SND: 'snd',
    DOC: 'doc',
  };

  const drive = getDriveClient();
  const folder = await getOrCreateFolder(drive, dirMap[category], articleFolderId);
  return folder.id;
}

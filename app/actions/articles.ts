/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   articles.ts                                    ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/11/17 11:06:44 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/11/17 15:59:55 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import {
  provisionArticleArchive,
  uploadTextSnapshot,
  uploadMediaFile,
  getSubfolderId,
} from '@/lib/drive';
import { AssetCategory } from '@/types/enums';

function detectAssetCategory(mimeType: string): AssetCategory {
  if (mimeType.startsWith('image/')) return 'IMG';
  if (mimeType.startsWith('video/')) return 'VID';
  if (mimeType.startsWith('audio/')) return 'SND';
  return 'DOC';
}

function sanitizeFileSegment(input: string): string {
  return (
    input
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9_-]/g, '') || 'Editor'
  );
}

function formatSnapshotHeader(params: {
  title: string;
  summary: string | null;
  authorOrEditor: string;
  versionLabel: string;
  timestamp: Date;
  body: string | null;
}): string {
  return [
    `HEADLINE: ${params.title}`,
    `VERSION: ${params.versionLabel}`,
    `RECORDED BY: ${params.authorOrEditor}`,
    `TIMESTAMP (UTC): ${params.timestamp.toISOString()}`,
    `SUMMARY: ${params.summary || '(None)'}`,
    `${'='.repeat(60)}`,
    '',
    params.body || '(No body text provided)',
    '',
  ].join('\n');
}

export async function submitArticlePitch(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const summary = (formData.get('summary') as string)?.trim() || null;
  const body = (formData.get('body') as string)?.trim() || null;

  if (!title) {
    throw new Error('Title is required');
  }

  const now = new Date();
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  // Resolve seeded Field Reporter
  const reporterRes = await query(
    `SELECT id, full_name FROM reporters WHERE email = 'reporter@newsden.org' LIMIT 1;`
  );
  const authorId = reporterRes.rows[0]?.id || null;
  const authorName = reporterRes.rows[0]?.full_name || 'Field Reporter';

  // 2. Insert article record into PostgreSQL
  const articleRes = await query(
    `
    INSERT INTO articles (title, slug, summary, body, author_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
    `,
    [title, slug, summary, body, authorId, now]
  );
  const articleId: string = articleRes.rows[0].id;

  // Google Drive folder tree: YYYY-MM / YYYY-MM-DD_slug / {body,img,vid,snd,doc}
  const archive = await provisionArticleArchive(slug, now);

  await query(
    `
    UPDATE articles
    SET drive_folder_id = $1, drive_folder_url = $2
    WHERE id = $3;
    `,
    [archive.articleFolderId, archive.articleFolderUrl, articleId]
  );

  // Write 00_original_submission.txt to body/
  const originalFileName = '00_original_submission.txt';
  const snapshotText = formatSnapshotHeader({
    title,
    summary,
    authorOrEditor: authorName,
    versionLabel: 'v00 (Original Submission)',
    timestamp: now,
    body,
  });

  const bodyUpload = await uploadTextSnapshot({
    folderId: archive.subfolders.BODY,
    fileName: originalFileName,
    content: snapshotText,
  });

  await query(
    `
    INSERT INTO article_assets (
      article_id, category, drive_file_id, drive_web_url,
      file_name, mime_type, file_size_bytes, version_number, uploaded_by
    )
    VALUES ($1, 'BODY', $2, $3, $4, 'text/plain', $5, 0, $6);
    `,
    [
      articleId,
      bodyUpload.driveFileId,
      bodyUpload.driveWebUrl,
      originalFileName,
      bodyUpload.fileSizeBytes,
      authorName,
    ]
  );

  // Upload any attached media files (img, vid, snd, doc)
  const rawFiles = formData.getAll('media') as File[];
  const validFiles = rawFiles.filter((file) => file && file.size > 0);

  for (const file of validFiles) {
    const category = detectAssetCategory(file.type);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadMediaFile({
      folderId: archive.subfolders[category],
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      buffer,
    });

    await query(
      `
      INSERT INTO article_assets (
        article_id, category, drive_file_id, drive_web_url,
        file_name, mime_type, file_size_bytes, uploaded_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,
      [
        articleId,
        category,
        uploaded.driveFileId,
        uploaded.driveWebUrl,
        file.name,
        file.type || 'application/octet-stream',
        uploaded.fileSizeBytes,
        authorName,
      ]
    );
  }

  revalidatePath('/');
}

export async function saveArticleRevision(formData: FormData) {
  const articleId = formData.get('articleId') as string;
  const editorName =
    (formData.get('editorName') as string)?.trim() || 'El Director';
  const updatedBody = (formData.get('body') as string)?.trim() || '';

  if (!articleId) {
    throw new Error('Article ID is required');
  }

  // Load article metadata & Drive folder pointer
  const articleRes = await query(
    `SELECT id, title, slug, summary, drive_folder_id FROM articles WHERE id = $1;`,
    [articleId]
  );
  const article = articleRes.rows[0];
  if (!article) {
    throw new Error('Article not found');
  }

  let folderId: string | null = article.drive_folder_id;
  if (!folderId) {
    const provisioned = await provisionArticleArchive(article.slug);
    folderId = provisioned.articleFolderId;
    await query(
      `UPDATE articles SET drive_folder_id = $1, drive_folder_url = $2 WHERE id = $3;`,
      [provisioned.articleFolderId, provisioned.articleFolderUrl, articleId]
    );
  }

  // Determine next revision number (v01, v02, ...)
  const countRes = await query(
    `SELECT COALESCE(MAX(version_number), 0) AS max_ver FROM article_assets WHERE article_id = $1 AND category = 'BODY';`,
    [articleId]
  );
  const nextVersion = Number(countRes.rows[0].max_ver) + 1;
  const versionTag = `v${String(nextVersion).padStart(2, '0')}`;

  const now = new Date();
  // Format timestamp as YYYY-MM-DDTHHMM (UTC) to avoid same-day filename collisions
  const dateStamp = now.toISOString().slice(0, 16).replace(':', '');
  const safeEditor = sanitizeFileSegment(editorName);
  const revisionFileName = `${versionTag}_${dateStamp}_${safeEditor}.txt`;

  // Update live draft in PostgreSQL
  await query(
    `UPDATE articles SET body = $1, updated_at = NOW() WHERE id = $2;`,
    [updatedBody, articleId]
  );

  // Upload immutable revision snapshot to body/ in Google Drive
  const bodyFolderId = await getSubfolderId(folderId, 'BODY');
  const snapshotContent = formatSnapshotHeader({
    title: article.title,
    summary: article.summary,
    authorOrEditor: editorName,
    versionLabel: versionTag,
    timestamp: now,
    body: updatedBody,
  });

  const uploadedSnapshot = await uploadTextSnapshot({
    folderId: bodyFolderId,
    fileName: revisionFileName,
    content: snapshotContent,
  });

  await query(
    `
    INSERT INTO article_assets (
      article_id, category, drive_file_id, drive_web_url,
      file_name, mime_type, file_size_bytes, version_number, uploaded_by
    )
    VALUES ($1, 'BODY', $2, $3, $4, 'text/plain', $5, $6, $7);
    `,
    [
      articleId,
      uploadedSnapshot.driveFileId,
      uploadedSnapshot.driveWebUrl,
      revisionFileName,
      uploadedSnapshot.fileSizeBytes,
      nextVersion,
      editorName,
    ]
  );

  // Upload any supplementary media attached during revision
  const rawFiles = formData.getAll('media') as File[];
  const validFiles = rawFiles.filter((file) => file && file.size > 0);

  for (const file of validFiles) {
    const category = detectAssetCategory(file.type);
    const targetFolderId = await getSubfolderId(folderId, category);
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await uploadMediaFile({
      folderId: targetFolderId,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      buffer,
    });

    await query(
      `
      INSERT INTO article_assets (
        article_id, category, drive_file_id, drive_web_url,
        file_name, mime_type, file_size_bytes, uploaded_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,
      [
        articleId,
        category,
        uploaded.driveFileId,
        uploaded.driveWebUrl,
        file.name,
        file.type || 'application/octet-stream',
        uploaded.fileSizeBytes,
        editorName,
      ]
    );
  }

  revalidatePath('/');
}

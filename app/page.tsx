/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   page.tsx                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/23 23:27:08 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/11/17 15:59:54 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { query } from '@/lib/db';
import { EditorWithKeycard } from '@/types/keycard';
import { Article } from '@/types/article';
import { ArticleAsset, ArticleWithAssets } from '@/types/archive';
import { submitArticlePitch, saveArticleRevision } from './actions/articles';

function formatBytes(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function Home() {
  const editorsSql = `
    SELECT
      e.id, e.email, e.full_name, e.avatar_url, e.created_at,
      JSON_BUILD_OBJECT(
        'id', k.id,
        'editor_id', k.editor_id,
        'status', k.status,
        'id_checked', k.id_checked,
        'badges', k.badges,
        'updated_at', k.updated_at
      ) as keycard
    FROM editors e
    LEFT JOIN editor_keycards k ON e.id = k.editor_id
    ORDER BY e.created_at DESC;
  `;

  const articlesSql = `
    SELECT * FROM articles
    ORDER BY priority_score DESC, created_at DESC;
  `;

  const assetsSql = `
    SELECT * FROM article_assets
    ORDER BY version_number ASC NULLS LAST, created_at ASC;
  `;

  const [editorsRes, articlesRes, assetsRes] = await Promise.all([
    query(editorsSql),
    query(articlesSql),
    query(assetsSql),
  ]);

  const editors = editorsRes.rows as EditorWithKeycard[];
  const rawArticles = articlesRes.rows as Article[];
  const allAssets = assetsRes.rows as ArticleAsset[];

  // Group archive assets by article_id
  const assetsByArticle = new Map<string, ArticleAsset[]>();
  for (const asset of allAssets) {
    const existing = assetsByArticle.get(asset.article_id) || [];
    existing.push(asset);
    assetsByArticle.set(asset.article_id, existing);
  }

  const articles: ArticleWithAssets[] = rawArticles.map((article) => ({
    ...article,
    assets: assetsByArticle.get(article.id) || [],
  }));

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">NewsDen Workspace</h1>
          <p className="text-gray-400">
            Internal Editorial Dashboard, Archive &amp; Intake
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Stage 1 Intake + Multimedia Archive Upload */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              Submit News Pitch &amp; Media (Stage 1)
            </h2>
            <form action={submitArticlePitch} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Headline *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Douro River Water Quality Report Released"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Summary / Angle
                </label>
                <input
                  type="text"
                  name="summary"
                  placeholder="Brief 1-sentence pitch..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Raw Notes / Draft (Saved to body/00_original_submission.txt)
                </label>
                <textarea
                  name="body"
                  rows={4}
                  placeholder="Paste field notes, quotes, or initial draft..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Attach Media (Photos, Video, Audio, Docs)
                </label>
                <input
                  type="file"
                  name="media"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  className="w-full text-sm text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Auto-sorted into Drive subfolders: <code>img/</code>,{' '}
                  <code>vid/</code>, <code>snd/</code>, and <code>doc/</code>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 font-semibold rounded transition cursor-pointer"
              >
                Ingest &amp; Archive to Drive
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: Registered Editors */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              Registered Editors
            </h2>
            {editors.length === 0 ? (
              <p className="text-gray-400 italic">No editors found.</p>
            ) : (
              <div className="space-y-3">
                {editors.map((editor) => (
                  <div
                    key={editor.id}
                    className="bg-gray-700 p-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{editor.full_name}</h3>
                      <p className="text-xs text-gray-400">{editor.email}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                          editor.keycard?.status === 'ACTIVE'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {editor.keycard?.status || 'UNKNOWN'}
                      </span>
                      <div className="flex gap-1 justify-end mt-1">
                        {editor.keycard?.badges?.map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs rounded"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Live Editorial Queue & Drive Archive Inspector */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Editorial Pipeline &amp; Archive ({articles.length})
          </h2>
          {articles.length === 0 ? (
            <p className="text-gray-400 italic">
              No articles in the pipeline yet. Submit a pitch above to test
              Drive archiving.
            </p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-700/80 p-4 rounded-md border border-gray-600 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-900 text-purple-200">
                          Priority {article.priority_score}/5
                        </span>
                        <h3 className="font-semibold text-lg">
                          {article.title}
                        </h3>
                      </div>
                      {article.summary && (
                        <p className="text-sm text-gray-300 mt-1">
                          {article.summary}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        /{article.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {article.drive_folder_url && (
                        <a
                          href={article.drive_folder_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600 text-xs font-semibold rounded text-emerald-200 transition"
                        >
                          Drive Folder ↗
                        </a>
                      )}
                      <span className="px-2.5 py-1 bg-gray-900 border border-gray-600 text-xs font-mono rounded text-amber-300">
                        {article.stage}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-950 border border-blue-800 text-xs font-mono rounded text-blue-300">
                        {article.status}
                      </span>
                    </div>
                  </div>

                  {/* Linked Google Drive Archive Assets */}
                  <div className="bg-gray-900/70 rounded p-3 border border-gray-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Archived Files &amp; Revisions ({article.assets.length})
                    </p>
                    {article.assets.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">
                        No Drive files linked yet.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {article.assets.map((asset) => (
                          <a
                            key={asset.id}
                            href={asset.drive_web_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-750 border border-gray-600 text-xs transition"
                          >
                            <span className="font-mono font-bold text-blue-400">
                              [{asset.category}]
                            </span>
                            <span className="text-gray-200">
                              {asset.file_name}
                            </span>
                            {asset.file_size_bytes && (
                              <span className="text-gray-500">
                                ({formatBytes(asset.file_size_bytes)})
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inline Editorial Revision Form (Writes new EditorName_Date .txt to body/) */}
                  <details className="bg-gray-800/90 rounded border border-gray-600 p-3">
                    <summary className="text-xs font-semibold text-blue-300 cursor-pointer select-none">
                      + Edit Draft &amp; Record Timestamped Revision Snapshot
                    </summary>
                    <form
                      action={saveArticleRevision}
                      className="mt-3 space-y-3"
                    >
                      <input
                        type="hidden"
                        name="articleId"
                        value={article.id}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Editing As
                          </label>
                          <select
                            name="editorName"
                            className="w-full px-2.5 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                          >
                            {editors.map((ed) => (
                              <option key={ed.id} value={ed.full_name}>
                                {ed.full_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Add Supplementary Media (Optional)
                          </label>
                          <input
                            type="file"
                            name="media"
                            multiple
                            className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-700 file:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Article Draft Text
                        </label>
                        <textarea
                          name="body"
                          rows={3}
                          defaultValue={article.body || ''}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-xs font-semibold rounded transition cursor-pointer"
                      >
                        Save Revision Snapshot to Drive
                      </button>
                    </form>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

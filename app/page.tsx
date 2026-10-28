/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   page.tsx                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/23 23:27:08 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/28 12:25:07 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { query } from '@/lib/db';
import { EditorWithKeycard } from '@/types/keycard';

export default async function Home() {
  const sql = `
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

  const { rows } = await query(sql);
  const editors = rows as EditorWithKeycard[];

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">NewsDen Workspace</h1>
        <p className="text-gray-400 mb-8">Internal Editorial Dashboard</p>
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Registered Editors</h2>
          {editors.length === 0 ? (
            <p className="text-gray-400 italic">No editors found in the database.</p>
          ) : (
            <div className="space-y-4">
              {editors.map((editor) => (
                <div key={editor.id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{editor.full_name}</h3>
                    <p className="text-sm text-gray-400">{editor.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                      editor.keycard?.status === 'ACTIVE' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {editor.keycard?.status || 'UNKNOWN'}
                    </span>
                    <div className="flex gap-1 justify-end mt-1">
                      {editor.keycard?.badges?.map((badge) => (
                        <span key={badge} className="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs rounded">
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
    </main>
  );
}

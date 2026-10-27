/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   page.tsx                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/23 23:27:08 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/27 23:01:41 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

// import pool from '@/lib/db';

// export default async function Home() {
//   const result = await pool.query('SELECT NOW()');
//   const dbTime = result.rows[0].now;

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
//       <h1 className="text-4xl font-bold text-emerald-400 mb-4">
//         🦝 NewsDen Database Connected!
//       </h1>
//       <p className="text-xl">
//         Database Time: <span className="font-mono text-pink-400">{dbTime.toString()}</span>
//       </p>
//     </main>
//   );
// }

import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';

interface User {
  id: string;
  email: string;
  full_name: string;
  status: string;
  id_checked: boolean;
}

async function createUser(formData: FormData) {
  'use server';
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;

  try {
    // We are inserting 'id_checked' explicitly as false as per your DBeaver table defaults
    await pool.query(
      'INSERT INTO users (full_name, email, id_checked) VALUES ($1, $2, $3)',
      [fullName, email, false]
    );
    // This tells Next.js to wipe its cache and rebuild the page with the new user!
    revalidatePath('/');
  } catch (error) {
    console.error("Failed to create user:", error);
  }
}

export default async function Home() {
  // Fetch existing users
  const { rows: users } = await pool.query('SELECT id, full_name, email FROM editors ORDER BY created_at DESC');
  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white font-sans">
        <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-teal-400">Huella Latina: User Registration</h1>

        {/* The Submission Form */}
        <form action={createUser} className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-teal-400 outline-none text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-teal-400 outline-none text-white"
            />
          </div>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-400 text-gray-900 font-bold py-2 px-4 rounded w-full transition-colors"
          >
            Register User
          </button>
        </form>

        {/* Displaying the Database Records */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Registered Accounts</h2>
          {users.length === 0 ? (
            <p className="text-gray-400">No users found. Create one above.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-gray-800 p-4 rounded-lg border-l-4 border-teal-500 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{user.full_name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className="bg-gray-700 text-teal-300 text-xs px-2 py-1 rounded uppercase tracking-wide">
                    {user.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    ID Checked: {user.id_checked ? '✅' : '❌'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   db.ts                                          ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/23 23:22:42 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/28 12:46:35 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { Pool } from 'pg';

// Next.js hot-reloading safe pool initialization
const globalWithPg = global as typeof globalThis & { pgPool?: Pool };

// Use existing cached pool if it exists, otherwise create a new one
export const pool =
  globalWithPg.pgPool ||
  new Pool({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
  });

// Cache the pool globally in development so hot-reloads don't drain database connections
if (process.env.NODE_ENV !== 'production') {
  globalWithPg.pgPool = pool;
}

// A helper function to safely execute queries with performance tracking
export async function query(text: string, params?: any[]) {
  const start = performance.now();
  const res = await pool.query(text, params);
  const duration = (performance.now() - start).toFixed(2);
  console.log(`Executed query: { text: ${text}, duration: ${duration}ms, rows: ${res.rowCount} }`);
  return res;
}

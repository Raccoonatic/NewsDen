/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   db.ts                                          ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/23 23:22:42 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/24 00:23:55 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is not defined in your .env.local file.");
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({ connectionString });
} else {
  let globalWithPg = global as typeof globalThis & { pgPool?: Pool; };
  if (!globalWithPg.pgPool) {
    globalWithPg.pgPool = new Pool({ connectionString });
  }
  pool = globalWithPg.pgPool;
}

export default pool;

// import { Pool } from 'pg';

// // 1. Ensure the URL actually exists before doing anything
// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("❌ DATABASE_URL is not defined in your .env.local file.");
// }

// let pool: Pool;

// if (process.env.NODE_ENV === 'production') {
//   pool = new Pool({
//     connectionString,
//   });
// } else {
//   // In development, attach the pool to the global object to prevent
//   // Next.js fast-refresh from exhausting database connections.
//   let globalWithPg = global as typeof globalThis & {
//     pgPool?: Pool;
//   };

//   if (!globalWithPg.pgPool) {
//     globalWithPg.pgPool = new Pool({
//       connectionString,
//     });
//   }
//   pool = globalWithPg.pgPool;
// }

// export default pool;

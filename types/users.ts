/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   users.ts                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/28 11:27:57 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/28 11:53:18 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

export interface Reporter
{
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface Editor
{
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: Date;
}

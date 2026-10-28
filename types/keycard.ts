/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   keycard.ts                                     ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/28 11:17:57 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/28 11:53:19 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { UserState, ReporterBadge, EditorBadge } from './enums';
import { Reporter, Editor } from "./users";

export interface ReporterKeycard
{
  id: string;
  reporter_id: string;
  status: UserState;
  id_checked: boolean;
  badges: ReporterBadge[];
  updated_at: Date;
}

export interface EditorKeycard
{
  id: string;
  editor_id: string;
  status: UserState;
  id_checked: boolean;
  badges: EditorBadge[];
  updated_at: Date;
}

export interface ReporterWithKeycard extends Reporter
{
  keycard: ReporterKeycard;
}

export interface EditorWithKeycard extends Editor
{
  keycard: EditorKeycard;
}

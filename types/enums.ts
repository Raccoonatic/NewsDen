/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   enums.ts                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/28 11:17:45 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/28 11:53:19 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

export type ArticleStatus =
	| 'INGESTED'
	| 'EVALUATED'
	| 'RESOURCE_ALLOCATION'
	| 'DRAFTING'
	| 'IN_REVIEW'
	| 'PUBLISHED'
	| 'REJECTED'
	| 'ARCHIVED';

export type ArticleStage =
	| 'INGESTION'
	| 'EVALUATION'
	| 'NEWSROOM_REVIEW'
	| 'DRAFTING'
	| 'DIRECTOR_REVIEW'
	| 'PUBLICATION'
	| 'ARCHIVE';

export type UserState =
	|'REGISTERED'
	| 'ACTIVE'
	| 'RESTRICTED'
	| 'DEACTIVATED';

export type ReporterBadge =
	| 'VIEWER'
	| 'FIELD'
	| 'PHOTOGRAPHER'
	| 'VIDEOGRAPHER'
	| 'REDACTER'
	| 'INTERVIEWER'
	| 'INSPECTOR';

export type EditorBadge =
	| 'DEV'
	| 'ADMIN'
	| 'DIRECTOR'
	| 'COORDINATOR'
	| 'DESIGNER'
	| 'WRITER'
	| 'AGENT'
	| 'MOD'
	| 'NITWIT';

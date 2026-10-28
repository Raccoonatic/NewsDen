-- ************************************************************************** --
--                                                                            --
--                                                   ▒▓              ▓▒       --
--   01_enum_schema.sql                             ▒▒ ▓▓▓        ▓▓▓ ▒▒      --
--                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      --
--   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       --
--                                                   ███████░░░░███████       --
--   Created: 2026/10/19 12:17:42 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      --
--   Updated: 2026/10/28 11:26:54 by Mapache            ▒ ░██  ██░ ▒          --
--                                                         ██████             --
--                                                                            --
-- ************************************************************************** --

CREATE TYPE article_status AS ENUM
(
	'INGESTED',
	'EVALUATED',
	'RESOURCE_ALLOCATION',
	'DRAFTING',
	'IN_REVIEW',
	'PUBLISHED',
	'REJECTED',
	'ARCHIVED'
);

CREATE TYPE article_stage AS ENUM
(
	'INGESTION',
	'EVALUATION',
	'NEWSROOM_REVIEW',
	'DRAFTING',
	'DIRECTOR_REVIEW',
	'PUBLICATION',
	'ARCHIVE'
);

CREATE TYPE user_state AS ENUM
(
	'REGISTERED',
	'ACTIVE',
	'RESTRICTED',
	'DEACTIVATED'
);

CREATE TYPE reporter_badge AS ENUM
(
	'VIEWER',
	'FIELD',
	'PHOTOGRAPHER',
	'VIDEOGRAPHER',
	'REDACTER',
	'INTERVIEWER',
	'INSPECTOR'
);

CREATE TYPE editor_badge AS ENUM
(
	'DEV',
	'ADMIN',
	'DIRECTOR',
	'COORDINATOR',
	'DESIGNER',
	'WRITER',
	'AGENT',
	'MOD',
	'NITWIT'
);

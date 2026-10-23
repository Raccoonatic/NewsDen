-- ************************************************************************** --
--                                                                            --
--                                                   ▒▓              ▓▒       --
--   01_enum_schema.sql                             ▒▒ ▓▓▓        ▓▓▓ ▒▒      --
--                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      --
--   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       --
--                                                   ███████░░░░███████       --
--   Created: 2026/10/19 12:17:42 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      --
--   Updated: 2026/10/22 16:09:27 by Mapache            ▒ ░██  ██░ ▒          --
--                                                         ██████             --
--                                                                            --
-- ************************************************************************** --

CREATE TYPE article_stage AS ENUM (
    'INGESTION',
    'EVALUATION',
    'NEWSROOM_REVIEW',
    'DRAFTING',
    'DIRECTOR_REVIEW',
    'PUBLISHED'
);

CREATE TYPE user_status AS ENUM (
    'REGISTERED',
    'VIEWER',
    'FIELD',
    'RESTRICTED',
    'DEACTIVATED'
);

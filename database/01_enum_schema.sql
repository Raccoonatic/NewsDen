# **************************************************************************** #
#                                                                              #
#                                                    ▒▓              ▓▒        #
#    01_enum_schema.sql                             ▒▒ ▓▓▓        ▓▓▓ ▒▒       #
#                                                   ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒       #
#    By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█        #
#                                                    ███████░░░░███████        #
#    Created: 2026/10/19 10:07:56 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░       #
#    Updated: 2026/10/19 11:15:09 by Mapache            ▒ ░██  ██░ ▒           #
#                                                          ██████              #
#                                                                              #
# **************************************************************************** #

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

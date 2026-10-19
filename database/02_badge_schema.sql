# **************************************************************************** #
#                                                                              #
#                                                    ▒▓              ▓▒        #
#    badge_schema.sql                               ▒▒ ▓▓▓        ▓▓▓ ▒▒       #
#                                                   ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒       #
#    By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█        #
#                                                    ███████░░░░███████        #
#    Created: 2026/10/19 10:10:04 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░       #
#    Updated: 2026/10/19 10:10:54 by Mapache            ▒ ░██  ██░ ▒           #
#                                                          ██████              #
#                                                                              #
# **************************************************************************** #

CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(20) NOT NULL,
    description TEXT
);

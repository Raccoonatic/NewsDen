# **************************************************************************** #
#                                                                              #
#                                                    ▒▓              ▓▒        #
#    schema.sql                                     ▒▒ ▓▓▓        ▓▓▓ ▒▒       #
#                                                   ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒       #
#    By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█        #
#                                                    ███████░░░░███████        #
#    Created: 2026/10/15 11:53:54 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░       #
#    Updated: 2026/10/19 10:10:23 by Mapache            ▒ ░██  ██░ ▒           #
#                                                          ██████              #
#                                                                              #
# **************************************************************************** #

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    body_content TEXT,
    priority_score INT DEFAULT 0,
    current_stage article_stage DEFAULT 'INGESTION',
    author_id UUID REFERENCES users(id),
    drive_folder_url TEXT,
    ai_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

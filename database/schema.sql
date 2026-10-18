# **************************************************************************** #
#                                                                              #
#                                                    ▒▓              ▓▒        #
#    schema.sql                                     ▒▒ ▓▓▓        ▓▓▓ ▒▒       #
#                                                   ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒       #
#    By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█        #
#                                                    ███████░░░░███████        #
#    Created: 2026/10/15 11:53:54 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░       #
#    Updated: 2026/10/18 16:24:59 by Mapache            ▒ ░██  ██░ ▒           #
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

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    status user_status DEFAULT 'REGISTERED',
    id_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(20) NOT NULL,
    description TEXT
);

CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, badge_id)
);

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

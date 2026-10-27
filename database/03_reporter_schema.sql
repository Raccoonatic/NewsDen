-- ************************************************************************** --
--                                                                            --
--                                                   ▒▓              ▓▒       --
--   03_reporter_schema.sql                         ▒▒ ▓▓▓        ▓▓▓ ▒▒      --
--                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      --
--   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       --
--                                                   ███████░░░░███████       --
--   Created: 2026/10/19 10:08:58 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      --
--   Updated: 2026/10/27 22:05:11 by Mapache            ▒ ░██  ██░ ▒          --
--                                                         ██████             --
--                                                                            --
-- ************************************************************************** --

CREATE TABLE reporters (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email VARCHAR(255) UNIQUE NOT NULL,
	full_name VARCHAR(255) NOT NULL,
	avatar_url TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reporter_keycards (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	reporter_id UUID UNIQUE NOT NULL REFERENCES reporters(id) ON DELETE CASCADE,
	status user_state NOT NULL DEFAULT 'REGISTERED',
	id_checked BOOLEAN NOT NULL DEFAULT FALSE,
	badges reporter_badge[] NOT NULL DEFAULT ARRAY['VIEWER']::reporter_badge[],
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reporter_keycards_badges ON reporter_keycards USING GIN (badges);

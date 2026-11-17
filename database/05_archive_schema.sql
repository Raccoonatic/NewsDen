-- ************************************************************************** --
--                                                                            --
--                                                   ▒▓              ▓▒       --
--   05_archive_schema.sql                          ▒▒ ▓▓▓        ▓▓▓ ▒▒      --
--                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      --
--   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       --
--                                                   ███████░░░░███████       --
--   Created: 2026/11/17 12:54:33 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      --
--   Updated: 2026/11/17 16:00:01 by Mapache            ▒ ░██  ██░ ▒          --
--                                                         ██████             --
--                                                                            --
-- ************************************************************************** --

DO $$ BEGIN
    CREATE TYPE asset_category AS ENUM ('BODY', 'IMG', 'VID', 'SND', 'DOC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE articles
ADD COLUMN IF NOT EXISTS drive_folder_id TEXT,
ADD COLUMN IF NOT EXISTS drive_folder_url TEXT;

CREATE TABLE IF NOT EXISTS article_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    category asset_category NOT NULL,
    drive_file_id TEXT NOT NULL UNIQUE,
    drive_web_url TEXT,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT,
    version_number INT, -- Used for 'BODY' snapshots (0 = original submission, 1+ = editor revisions)
    uploaded_by TEXT,   -- name/email of the reporter or editor
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_assets_article_id ON article_assets(article_id);
CREATE INDEX IF NOT EXISTS idx_article_assets_category ON article_assets(category);

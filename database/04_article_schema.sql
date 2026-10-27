-- ************************************************************************** --
--                                                                            --
--                                                   ▒▓              ▓▒       --
--   04_article_schema.sql                          ▒▒ ▓▓▓        ▓▓▓ ▒▒      --
--                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      --
--   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       --
--                                                   ███████░░░░███████       --
--   Created: 2026/10/15 11:53:54 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      --
--   Updated: 2026/10/27 22:10:34 by Mapache            ▒ ░██  ██░ ▒          --
--                                                         ██████             --
--                                                                            --
-- ************************************************************************** --

CREATE TABLE articles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title VARCHAR(255) NOT NULL,
	slug VARCHAR(255) UNIQUE NOT NULL,
	summary TEXT,
	body TEXT,

	-- Editorial Workflow State Machine & Lifecycle (Layers 4 & 15)
	stage article_stage NOT NULL DEFAULT 'INGESTION',
	status article_status NOT NULL DEFAULT 'INGESTED',
	priority_score INT DEFAULT 1 CHECK (priority_score BETWEEN 1 AND 5),

	-- Extensible JSONB Metadata (Layer 4)
	-- Stores Google Drive asset IDs, AI tags/transcripts, and custom dynamic badges
	metadata JSONB DEFAULT '{}'::jsonb,

	-- User Associations (Updated for Reporter/Editor Keycards)
	author_id UUID REFERENCES reporters(id) ON DELETE SET NULL,
	assigned_editor_id UUID REFERENCES editors(id) ON DELETE SET NULL,

	-- Timestamps & Lifecycle Tracking
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for Read Optimization & Search (Layers 1 & 11)
CREATE INDEX idx_articles_stage ON articles(stage);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_priority ON articles(priority_score DESC);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE status = 'PUBLISHED';
CREATE INDEX idx_articles_metadata ON articles USING GIN (metadata);

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

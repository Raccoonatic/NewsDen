-- ************************************************************************** --
--                                                                            --
--                                                   ▒▓              ▓▒       --
--   seed.sql                                       ▒▒ ▓▓▓        ▓▓▓ ▒▒      --
--                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      --
--   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       --
--                                                   ███████░░░░███████       --
--   Created: 2026/10/28 11:50:28 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      --
--   Updated: 2026/10/28 11:51:04 by Mapache            ▒ ░██  ██░ ▒          --
--                                                         ██████             --
--                                                                            --
-- ************************************************************************** --

-- Insert a verified Field Reporter
WITH new_reporter AS (
    INSERT INTO reporters (email, full_name)
    VALUES ('reporter@newsden.org', 'Jane Field Reporter')
    RETURNING id
)
INSERT INTO reporter_keycards (reporter_id, status, id_checked, badges)
SELECT id, 'ACTIVE', TRUE, ARRAY['FIELD']::reporter_badge[]
FROM new_reporter;

-- Insert an approved Director
WITH new_director AS (
    INSERT INTO editors (email, full_name)
    VALUES ('director@newsden.org', 'El Director')
    RETURNING id
)
INSERT INTO editor_keycards (editor_id, status, id_checked, badges)
SELECT id, 'ACTIVE', TRUE, ARRAY['DIRECTOR']::editor_badge[]
FROM new_director;

-- Insert a newly registered Agent waiting for approval
WITH new_agent AS (
    INSERT INTO editors (email, full_name)
    VALUES ('agent@newsden.org', 'New Agent')
    RETURNING id
)
-- Defaults to 'REGISTERED' and 'NITWIT' automatically based on your schema rules
INSERT INTO editor_keycards (editor_id)
SELECT id FROM new_agent;

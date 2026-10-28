/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   article.ts                                     ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/10/28 11:17:28 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/10/28 11:53:17 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { ArticleStage, ArticleStatus } from './enums';

export interface ArticleMetadata
{
  drive_folder_id?: string;
  drive_assets?: {
    photos?: string[];
    audio?: string[];
    transcripts?: string[];
  };
  ai_summary?: string;
  rejection_reason?: string;
  category_tags?: string[];
}

export interface Article
{
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  stage: ArticleStage;
  status: ArticleStatus;
  priority_score: number;
  metadata: ArticleMetadata;
  author_id: string | null;
  assigned_editor_id: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

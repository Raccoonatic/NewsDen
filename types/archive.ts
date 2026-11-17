/* ************************************************************************** */
/*                                                                            */
/*                                                   ▒▓              ▓▒       */
/*   archive.ts                                     ▒▒ ▓▓▓        ▓▓▓ ▒▒      */
/*                                                  ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒      */
/*   By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█       */
/*                                                   ███████░░░░███████       */
/*   Created: 2026/11/17 13:01:43 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░      */
/*   Updated: 2026/11/17 16:00:00 by Mapache            ▒ ░██  ██░ ▒          */
/*                                                         ██████             */
/*                                                                            */
/* ************************************************************************** */

import { AssetCategory } from './enums';
import { Article } from './article';

export interface ArticleAsset {
  id: string;
  article_id: string;
  category: AssetCategory;
  drive_file_id: string;
  drive_web_url: string | null;
  file_name: string;
  mime_type: string;
  file_size_bytes: number | null;
  version_number: number | null;
  uploaded_by: string | null;
  created_at: Date;
}

export interface ArticleWithAssets extends Article {
  assets: ArticleAsset[];
}

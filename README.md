<!-- ********************************************************************** -->
<!--                                                                        -->
<!--                                                 ▒▓              ▓▒     -->
<!-- README.md                                      ▒▒ ▓▓▓        ▓▓▓ ▒▒    -->
<!--                                                ▒▒▒░░▒▒░▓░░▓░▒▒░░▒▒▒    -->
<!-- By: Mapache <ljtorcate@gmail.com>               █░  ░░░ ░░ ░░░  ░█     -->
<!--                                                 ███████░░░░███████     -->
<!-- Created: 2026/10/22 16:10:08 by Mapache        ░▒▒██ ▓  ██  ▓ ██▒▒░    -->
<!-- Updated: 2026/10/22 16:10:13 by Mapache            ▒ ░██  ██░ ▒        -->
<!--                                                       ██████           -->
<!--                                                                        -->
<!-- ********************************************************************** -->

<p align="center">
 <img src=".assets/README_img/newsden_banner.png" alt="Banner" width="800">
</p>

<p align="center"><i>This project has been created as the central repository for the NewsDen infrastructure</i></p>

<h1 align="center">📰🌍 NewsDen - The Backend 🌍📰</h1>
<p align="center"><b><em>Designed to empower independent journalism.</em></b></p>

---

## 📰 Description
The end product is the entire infrastructure for an Online Newspaper. The system features a modular architecture designed with a default directive: posting the incoming article. The article is reviewed and developed in different stages, and every step of the article's lifetime can be toggled on or off. If all steps are shut off, all incoming work must be published directly.

The infrastructure supports three types of visitors: Readers who only view news on the front page, "Editors" (staff making publishing decisions), and "Reporters" (contributors authorized to submit news, video, and research). Badges and Priority Scales are designed to be modular, therefore, while the system defines some by default, they can be tweaked to the needs of the Newspaper.

**This prototype**, is built as a proof of concept, that can be run locally from an Linux Ubuntu/Debian system to explore the capabilities of the system and taylor it to the companies needs before deployment.

## ⚙️ Instructions
TBD

### 🛠️ Compilation
TBD

## 🌍 Users

The infrastructure heavily relies on a modular priority and badge system that controls access and permissions without needing to modify the source code. Below is a breakdown of the specific roles and pipeline stages:

 #### 🖥️ Editor Badges

 - **`Admin`** : The Mapache badge for developers; manages badges, priority scales, and editorial meets
 - **`Registered`** : Basic Badge. A user completed their registration and is waiting for approval.
 - **`Agent`** : Edits article priority, allocates resources, and sends items to development
 - **`Writer`** : Edits articles, accesses archives, and synthesizes reporting into final written pieces
 - **`Mod`** : Schedules meets and manages registrants and badges
 - **`Designer`** : Accesses the weekly finalized article queue to build newsletters
 - **`Director`** : Accesses the composing bay, selects the final view of articles, and publishes them
 - **`Coordinator`** : Support role for the Director with all permissions except final publication
 - **`Deactivated`** : Has no permissions, PII is saved temporarily on a blacklist database

 #### 📸 Reporter Badges

 - **`Viewer`** : A valid user without an ID check. Can view news and submit feedback.
 - **`Field`** : Completed ID check. Can submit news requests. All Reporters are credited on the final publication
 - **`Photographer`**: Same permissions as a `Viewer`. Can receive a photo assingment for an article
 - **`Videographer`**: Same permissions as a `Viewer`. Can receive a video assingment for an article
 - **`Redacter`**: Same permissions as a `Viewer`. Can receive a writing assingment for an article
 - **`Interviewer`**: Same permissions as a `Viewer`. Can receive an interview assingment for an article
 - **`Inspector`**: Same permissions as a `Viewer`. Can receive an inspecting assingment for an article
 - **`Deactivated`** : Has no permissions, PII is saved temporarily on a blacklist database
 - **`Restricted`** : Same permissions as a `Viewer`, but cannot become Field.

 ## 🗺️ Workflow Stages

 - **`[1] Content Ingestion`** : Submissions pass through an automated AI quality check

 - **`[2] Editorial Evaluation`** : Editors review for thematic alignment and assign priority scores

 - **`[3] Newsroom Review`** : Asset audit to resolve missing media via archives or field reporters

 - **`[4] Drafting`** : Final copywriting and resource verification

 - **`[5] Director Review`** : Executive quality control and web publication

 - **`[6] Newsletter Layout`** : Curation of published stories into a weekly layout

 - **`[7] Revision Loop`** : Rework protocols if benchmarks are unmet at any stage
<br></br>


<p align="center">
 <img src=".assets/README_img/lifetime_flowchart.png" alt="Lifetime of an Article">
</p>




















---

### API Endpoints
TBD

<br></br>



---

## 🧠 Technical Overview

- Public Website: **TBD**. Considering -> *Next.js or Hugo (Cloudflare/GitHub Pages)*
- Newsroom Application: **TBD**. Considering ->  *Strapi or Ghost*
- Back End API: **TBD**. Considering ->  *Python (FastAPI) or Node.js (Express)*
- Database: **TBD**. Considering ->  *PostgreSQL (or MariaDB)*
- AI Processing Layer: **TBD**. Considering ->  *Whisper, Llama 3, Groq, or Gemini*
- AI Orchestration: **TBD**. Considering ->  *LangChain, LlamaIndex, CrewAI, or custom (Odysseus)*
- File Archive: **TBD**. Considering ->  *100 TB Google Drive via Service Account*
- Submission System: **TBD**. Considering -> *Tally.so or SecureDrop/React form*
- Editorial Workflow State Machine: **TBD**. Considering ->  *Managed via PostgreSQL Enums and timestamps*

---

## 🤖 AI Usage
TBD

## 📚 Resources
- Managing Databases: DBeaver
- Website Framework: Next.js
- Website Back End API: Node.js
- Testing ProstgreSQL: Docker
- Version Control for Node.js & NPM: NVM (Node Version Manager)
- PostgresSQL Interaction Functions: NPM (Node Package Management)
- Web Design & Infrastructure Tools: NPX (Node Package Execute)

---

## ⚖️ License

**Copyright (c) 2026 Luis "Mapache" Torcate & HUELLATINA coop. All Rights Reserved.**

This repository and its contents are proprietary and confidential. No part of this software may be copied, modified, distributed, or used without explicit written permission from the copyright holders.

---

## 🧾 Final Notes 🦝

If you made it this far…

Merry Christmas.
Take a break. Drink water. Maybe eat an arepa.

The future of journalism, is [here](https://github.com/Raccoonatic/NewsDen).

📰✨💜

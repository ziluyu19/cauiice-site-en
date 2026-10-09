# CAUIICE International Portal & Content Management System

Official English digital portal and administrative Content Management System (CMS) for the **International Cooperation and Exchange Committee of the Chinese Association of University-run Industries** (CAUIICE / 国专委).

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
  - [Public English Portal](#public-english-portal)
  - [Administration CMS](#administration-cms)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation and Local Development](#installation-and-local-development)
- [Environment Variables](#environment-variables)
- [Firebase Configuration](#firebase-configuration)
  - [Dedicated Project](#dedicated-project)
  - [Firestore Collections](#firestore-collections)
  - [Security Rules Overview](#security-rules-overview)
  - [Data Seeding Script](#data-seeding-script)
- [Administrator Access](#administrator-access)
- [Build and Validation](#build-and-validation)
- [Security Notes](#security-notes)
- [Deployment Status and Future Roadmap](#deployment-status-and-future-roadmap)
- [License and Disclaimer](#license-and-disclaimer)

---

## Project Overview

The **International Cooperation and Exchange Committee of the Chinese Association of University-run Industries** (CAUIICE / 中国高校校办产业协会国际合作与交流专业委员会) serves as a specialized bridge connecting Chinese higher-education institutions, university science parks, spin-offs, and technology transfer offices with international universities, research institutes, and global innovation partners.

This repository hosts the **official English digital portal** (`/en`) and the **dedicated administrative CMS** (`/admin`). It is designed specifically for an international audience, enabling overseas partners to:

- Understand the committee's mandate, statutory status, and governance.
- Explore international industry-university-research cooperation projects.
- Browse the member network across key Chinese universities and science parks.
- Read official news, event announcements, and cross-border tech transfer insights.
- Submit direct partnership enquiries through a standardized, privacy-compliant channel.

---

## Key Features

### Public English Portal

All public English routes reside under `/en`:

| Route | Page | Key Capabilities |
| :--- | :--- | :--- |
| `/en` | **Home Portal** | Hero banner, core mission, strategic metrics, featured cooperation projects, latest news highlights, quick access cards. |
| `/en/about` | **About Overview** | Landing page introducing the committee's history, mission, and mandate. |
| `/en/about/committee` | **Committee Profile** | Overview, statutory positioning, affiliated network, and service scope. Reads dynamically from Firestore `siteConfig/committee`. |
| `/en/about/organisation` | **Governance & Team** | Council governance, secretariat departments, and leadership responsibilities. Reads dynamically from Firestore `siteConfig/organisation`. |
| `/en/cooperation` | **Cooperation Hub** | Overview of international collaborative initiatives and operational workflow. |
| `/en/cooperation/projects` | **Projects Directory** | Search and filter international projects across domains (`smart_mfg`, `green_tech`, `biomedicine`, `ai`, `edutech`) and status (`recruiting`, `ongoing`, `preparing`, `completed`). |
| `/en/cooperation/enquiry` | **Partnership Enquiry** | Standardized 8-field submission form (institution, country/region, contact, position, email, category, requirement summary, privacy consent) writing securely to Firestore `enquiries`. |
| `/en/network` | **Network Overview** | Introduction to member university coverage, science park alliances, and regional distribution. |
| `/en/network/members` | **Member Directory** | Interactive filter by member type (universities, science parks, spin-off enterprises, transfer agencies) and region. |
| `/en/news` | **News & Insights** | Multi-category news listings (`work_updates`, `events`, `policy_insights`) with pagination support. |
| `/en/news/[id]` | **News Article Detail** | Full-text article rendering with executive summaries, publication dates, category badges, and graceful 404 handling. |
| `/en/contact` | **Contact Secretariat** | Official secretariat contact channels, specialized departmental emails, telephone inquiries, and embedded inquiry access. Reads dynamically from Firestore `siteConfig/contact`. |

### Administration CMS

The administrative backend is located under `/admin`:

- **Authentication Guard (`/admin/login` & `/admin/dashboard/layout.tsx`)**:
  - Enforces Firebase Authentication via email and password.
  - Automatically verifies the authenticated user UID against `NEXT_PUBLIC_ADMIN_UID`.
  - Redirects unauthenticated visitors or non-admin accounts to `/admin/login` within 800ms.
- **Dashboard Workspace (`/admin/dashboard`)**:
  - Metric overview displaying live record counts for News, Projects, Members, and Enquiries.
  - Quick action shortcuts to core management channels.
- **News Management (`/admin/dashboard/news`)**:
  - Add, edit, and delete news articles.
  - Fields: title, publication date, category, summary, content, read time.
- **Projects Management (`/admin/dashboard/projects`)**:
  - Add, edit, and delete international cooperation projects.
  - Fields: title, status, technical field, lead university, international partner, objective, summary, featured badge.
- **Members Management (`/admin/dashboard/members`)**:
  - Add, edit, and delete member institution profiles.
  - Fields: institution name, member type, region, establishment year, description, key focus fields.
- **Enquiries Management (`/admin/dashboard/enquiries`)**:
  - View inbound visitor partnership submissions submitted through `/en/cooperation/enquiry`.
  - Filter by processing status (`pending`, `reviewing`, `contacted`, `archived`).
  - Update status and review institution details.
- **Site Configuration (`/admin/dashboard/profile`)**:
  - Unified 3-tab editor managing global institutional documents:
    - Tab 1: Committee Profile (`siteConfig/committee`)
    - Tab 2: Governance & Leadership (`siteConfig/organisation`)
    - Tab 3: Official Contact Channels (`siteConfig/contact`)
  - Direct real-time persistence to Cloud Firestore.

---

## Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.3.5** | App Router, React Server Components (RSC), Turbopack compilation |
| **UI Library** | **React 19.2.8** | Modern React with hooks-driven state architecture |
| **Language** | **TypeScript 5.x** | Strict static typing across data contracts and component props |
| **Styling** | **Tailwind CSS v4** | Modern CSS-first utility styling via `@tailwindcss/postcss` |
| **Database** | **Cloud Firestore** | NoSQL document database (Firebase SDK v12 client-side) |
| **Authentication**| **Firebase Auth** | Email/Password admin authentication with UID-level access control |
| **Admin Scripting**| **Firebase Admin SDK** | Node.js v14 Admin SDK for seed automation and integrity verification |

---

## Project Structure

```text
companysite-en/
├── app/
│   ├── layout.tsx                     # Global HTML root layout
│   ├── page.tsx                       # Root redirect / landing entry
│   ├── globals.css                    # Global CSS & Tailwind imports
│   ├── en/                            # Public English Portal
│   │   ├── layout.tsx                 # English layout with EnglishHeader and EnglishFooter
│   │   ├── page.tsx                   # English Portal Homepage
│   │   ├── about/                     # About section routes
│   │   │   ├── page.tsx               # About index
│   │   │   ├── committee/page.tsx     # Committee profile & mandate
│   │   │   └── organisation/page.tsx  # Governance & department structure
│   │   ├── cooperation/               # Cooperation section routes
│   │   │   ├── page.tsx               # Cooperation index
│   │   │   ├── projects/page.tsx      # International project directory
│   │   │   └── enquiry/page.tsx       # Standardized partnership inquiry form
│   │   ├── network/                   # Member network routes
│   │   │   ├── page.tsx               # Network index
│   │   │   └── members/page.tsx       # Member institution directory
│   │   ├── news/                      # News & Insights routes
│   │   │   ├── page.tsx               # News listing with categories & pagination
│   │   │   └── [id]/page.tsx          # Dynamic news article reader
│   │   └── contact/                   # Contact route
│   │       └── page.tsx               # Official contact channels
│   └── admin/                         # Administration CMS
│       ├── login/page.tsx             # Firebase Auth administrator login
│       └── dashboard/                 # Protected admin workspace
│           ├── layout.tsx             # Admin sidebar layout & auth guard
│           ├── page.tsx               # Operational metrics overview
│           ├── news/page.tsx          # News articles manager
│           ├── projects/page.tsx      # Projects manager
│           ├── members/page.tsx       # Members manager
│           ├── enquiries/page.tsx     # Partnership enquiries manager
│           └── profile/page.tsx       # SiteConfig manager (Committee / Org / Contact)
├── components/
│   └── en/                            # English Portal components
│       ├── EnglishHeader.tsx          # Top navigation bar
│       ├── EnglishFooter.tsx          # Multi-column footer with legal disclaimers
│       ├── InquiryForm.tsx            # Form component with validation & Firestore write
│       ├── NewsCard.tsx               # News listing card
│       ├── ProjectCard.tsx            # Project showcase card
│       ├── MemberCard.tsx             # Member directory card
│       ├── FilterBar.tsx              # Interactive filter controls
│       ├── ProcessSteps.tsx           # Step-by-step collaboration workflow
│       ├── FAQ.tsx                    # Frequently asked questions accordion
│       └── ...                        # Supporting layout widgets
├── lib/
│   ├── firebase.ts                    # Firebase App, Auth, and Firestore client initialization
│   ├── enFirestore.ts                 # Firestore queries, mutations, and data normalization
│   └── enData.ts                      # Baseline data models, constants, and fallback prototypes
├── scripts/
│   ├── seed-en-firestore.mjs          # Admin SDK baseline database seeder
│   └── verify-acceptance.mjs         # Acceptance test script verifying Firestore rules and reads
├── firestore.rules                    # Cloud Firestore Security Rules for cauiice-site-en
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Project dependencies and script definitions
└── .gitignore                         # Git exclusion rules (credentials, .env, .next)
```

---

## Requirements

Before running the project locally, ensure your environment meets the following specifications:

- **Node.js**: `>= 18.18.0` (LTS `20.x` or `22.x` recommended; fully compatible with Node.js `24.x`).
- **npm**: `>= 9.x` (or `pnpm` / `yarn`).
- **Modern Browser**: Chromium-based (Chrome, Edge) or Firefox with modern ES2022+ and WebSocket support.

---

## Installation and Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/cauiice-site-en.git
cd cauiice-site-en
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Local Environment Variables

Create a `.env.local` file in the project root:

```bash
# On Linux / macOS
cp .env.example .env.local

# On Windows PowerShell
Copy-Item .env.example .env.local
```

Populate `.env.local` with your development Firebase project credentials (see [Environment Variables](#environment-variables)).

### 4. Start Development Server

```bash
npm run dev
```

The application will boot on `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied):

- **English Public Portal**: [http://localhost:3000/en](http://localhost:3000/en)
- **Admin CMS Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Admin Login Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Environment Variables

The application relies on the following environment variables. None of these contain private keys or secrets suitable for client exposure. **Never commit `.env.local` to Git.**

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | **Yes** | Firebase Web API key for the dedicated English project |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **Yes** | Firebase Auth domain (e.g., `<project-id>.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | **Yes** | Firebase Project ID (`cauiice-site-en`) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | **Yes** | Cloud Storage bucket address |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | **Yes** | Firebase Cloud Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | **Yes** | Firebase Web Application ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional | Google Analytics Measurement ID (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_ADMIN_UID` | **Yes** | UID of the authorized administrator in Firebase Auth |
| `GOOGLE_APPLICATION_CREDENTIALS` | Optional | Local file path to service account JSON (CLI scripts only) |

### Sample `.env.example` Template

```env
# Firebase Web Client Configuration (Project: cauiice-site-en)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-web-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="cauiice-site-en.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="cauiice-site-en"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="cauiice-site-en.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-web-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# Authorized Administrator UID in cauiice-site-en Firebase Auth
NEXT_PUBLIC_ADMIN_UID="your-authorized-admin-uid"
```

---

## Firebase Configuration

### Dedicated Project

The English website connects exclusively to its independent Firebase project: **`cauiice-site-en`**. It is strictly separated from any Chinese portal databases, ensuring isolated security boundaries and localized content lifecycles.

### Firestore Collections

The Firestore schema is structured into 5 collections:

1. **`news`**: News and insights articles.
   - Public read; admin-only write.
2. **`projects`**: International cooperation projects.
   - Public read; admin-only write.
3. **`members`**: Member directory records.
   - Public read; admin-only write.
4. **`siteConfig`**: Global configuration documents (`committee`, `organisation`, `contact`).
   - Public read; admin-only write.
5. **`enquiries`**: Visitor partnership inquiries submitted from `/en/cooperation/enquiry`.
   - Public create with strict field whitelist and length validation (`<= 4000` chars).
   - Read, update, and delete are strictly restricted to authenticated administrators.

### Security Rules Overview

The repository includes [`firestore.rules`](file:///d:/companysite-en/firestore.rules). Key security characteristics:

- **Admin Check**:
  ```javascript
  function isAdmin() {
    return request.auth != null && request.auth.uid == '<configured-admin-uid>';
  }
  ```
- **Inquiry Whitelist**: Rejects any submission containing unexpected or malicious fields.
- **Default Deny**: Any collection or sub-collection not explicitly whitelisted is denied access:
  ```javascript
  match /{document=**} {
    allow read, write: if false;
  }
  ```

### Data Seeding Script

To initialize baseline test records in `cauiice-site-en`:

1. Download a temporary Service Account Key JSON from the Firebase Console (`Project Settings > Service Accounts`).
2. Place it locally in the project root as `service-account.json` (already ignored by `.gitignore`).
3. Run the seed script:
   ```bash
   node scripts/seed-en-firestore.mjs
   ```
4. Verify that 4 news articles, 4 projects, 7 members, and 3 site configuration documents are seeded.
5. **Immediately delete `service-account.json`** from your local filesystem and revoke the temporary key in Firebase Console if no longer needed.

---

## Administrator Access

- **Login Entrance**: `/admin/login`
- **Authentication Flow**:
  1. The administrator enters credentials (email and password registered in Firebase Authentication under `cauiice-site-en`).
  2. The system calls `signInWithEmailAndPassword`.
  3. Upon successful credential validation, the client checks `user.uid === process.env.NEXT_PUBLIC_ADMIN_UID`.
  4. If the UID matches, the user is redirected to `/admin/dashboard`.
  5. If the UID does not match, the session is immediately signed out with a permission denied notice.

> [!IMPORTANT]
> The repository **does not and must not** contain hardcoded administrator credentials. Administrator accounts must be created directly in the Firebase Console under `Authentication > Users`.

---

## Build and Validation

### Production Build

Run the standard Next.js build:

```bash
npm run build
```

This performs TypeScript type verification and static/dynamic page generation.

### Acceptance and Integrity Verification

A validation script is provided to verify Firestore data access and security rule enforcement against `cauiice-site-en`:

```bash
node scripts/verify-acceptance.mjs
```

### Verification Status Summary

| Item | Status | Verification Method |
| :--- | :---: | :--- |
| **Real Browser News Navigation** | **Verified** | Automated Edge CDP test: clicked "查看全文", verified `/en/news/[id]` DOM rendering, back navigation, refresh, and 404 handling. |
| **Public Inquiry Submission** | **Verified** | Real browser form completion on `/en/cooperation/enquiry` successfully writes to Firestore and triggers confirmation view. |
| **Unauthenticated Enquiries Read** | **Verified** | Confirmed rejected with `permission-denied` via security rules. |
| **Unauthenticated Content Write** | **Verified** | Writing to `news`, `projects`, `siteConfig` without admin auth confirmed rejected with `permission-denied`. |
| **Auth Guard Interception** | **Verified** | Accessing `/admin/dashboard` unauthenticated redirects to `/admin/login`. |
| **Admin Content Mutations (Add/Edit/Del)** | *Requires Manual Admin Login* | Admin writes require manual login via `/admin/login` using confidential administrator credentials. |

---

## Security Notes

1. **Credential Hygiene**: Never commit `.env.local`, `.env.*.local`, service account JSON files (`*service-account*.json`), or private keys to version control.
2. **Access Control**: Keep `NEXT_PUBLIC_ADMIN_UID` synchronized between `.env.local` and `firestore.rules` on the cloud.
3. **Data Protection**: Inbound partnership enquiries contain contact information and institution names. The security rules strictly forbid unauthenticated reading of the `enquiries` collection.
4. **Least Privilege**: The client-side application only uses the Firebase Web SDK with restricted API keys. Administrative operations require explicit user authentication.

---

## Deployment Status and Future Roadmap

### Current Status

- **Development & Staging Verified**: The codebase has passed full local verification, CDP browser automation, data read tests on `cauiice-site-en`, and successful Next.js production builds.
- **Production Hosting**: **Not yet deployed to public production hosting**.

### Future Roadmap

- [ ] Connect production hosting infrastructure (e.g., Firebase App Hosting or Vercel).
- [ ] Configure custom institutional domain and SSL certificates.
- [ ] Implement multi-language localization switcher (English / Chinese).
- [ ] Set up automated CI/CD workflows for pull request validation and build checks.

---

## License and Disclaimer

1. **Statutory Status**: The International Cooperation and Exchange Committee (CAUIICE / 国专委) is an official branch committee of the Chinese Association of University-run Industries (CAUI).
2. **Copyright**: &copy; 2026 International Cooperation and Exchange Committee of CAUIICE. All rights reserved.
3. **Usage**: This codebase is private and maintained for official institutional use.

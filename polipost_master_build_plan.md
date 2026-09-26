# Polipost (AI Political Poster Maker) — Master Architecture & Implementation Plan

> **Author**: Software Manager (Antigravity) for Ifti  
> **Target Version**: v1.0.0 (MVP)  
> **Date**: September 26, 2026  
> **Status**: Ready for Review & Execution  

---

## 1. Executive Summary & Vision

**Polipost** is an automated web platform tailored for local political workers, committee members, and publicity agents in Bangladesh to create authentic, print-ready political posters (বিজয় দিবস, শোক দিবস, নির্বাচনী প্রচার, ঈদ ও শুভেচ্ছা) in minutes.

Traditional political poster design in Bangladesh is hindered by:
1. **Broken Bangla Typography in Pure AI Image Models**: AI image generators (e.g. Midjourney, DALL-E, pure Gemini Imagen) produce distorted or unreadable Bangla characters and broken conjuncts (`যুক্তবর্ণ`).
2. **Complex Layout Conventions**: Bangladeshi political posters follow strict hierarchical rules:
   - Senior party leaders placed at the top (1 to 3 cutout/framed portraits).
   - Occasion-specific banners, floral/national motifs, and bold central Bangla headlines.
   - Requester portrait, designation, party affiliation, and "প্রচারে" (publicized by) credit line anchored at the footer.
3. **Print Resolution Requirements**: Local printing presses require high-resolution files (minimum 1200×1600px at 150–300 DPI) that cannot be blurry when printed on demy/double-demy paper.

### Core Architectural Solution: Hybrid Render Pipeline (Option B)
We implement a **hybrid AI + Server-Side Canvas/HTML engine**:
- **Gemini AI**: Generates context-aware Bangla slogans, color harmony recommendations, decorative background art, and intelligent layout parameters.
- **Server-Side Render Engine (Puppeteer / Sharp / Canvas)**: Combines user photo cutouts, Gemini background art, and exact web-font-rendered Bangla typography (`Hind Siliguri`, `Kalpurush`, `Anek Bangla`) into a pixel-perfect, high-DPI poster image.

---

## 2. System Architecture

```
                       ┌────────────────────────────────────────────────────────┐
                       │                   Next.js 14+ Frontend                 │
                       │  - Impeccable Design System (Tailwind + CSS Tokens)     │
                       │  - Bangla Font Subsets (Kalpurush, Hind Siliguri)      │
                       │  - Live Interactive Client Preview (HTML5 Canvas)       │
                       │  - Multi-step Wizard (Occasion -> Form -> Cutouts)     │
                       └───────────────────────────┬────────────────────────────┘
                                                   │ HTTPS / REST (JWT)
                                                   ▼
                       ┌────────────────────────────────────────────────────────┐
                       │                  Express.js + TypeScript               │
                       │  - Modular Controllers, Services & Auth Middleware     │
                       │  - Cloudinary / S3 File Upload Handler                 │
                       │  - Rate Limiter & Poster Generation Queue              │
                       └─────────────┬───────────────────────────┬──────────────┘
                                     │                           │
                   ┌─────────────────┴─────────────┐             │
                   ▼                               ▼             ▼
       ┌───────────────────────┐       ┌───────────────────────┐ ┌───────────────────────┐
       │   MongoDB (Mongoose)  │       │  Google Gemini API    │ │  Server Render Engine │
       │  - Users & Roles      │       │  - Slogan generation  │ │  - Puppeteer/node-    │
       │  - Templates (JSON)   │       │  - Visual theme &     │ │    canvas/Sharp       │
       │  - Posters & History  │       │    motifs             │ │  - High-res PNG/PDF   │
       │  - Generation Logs    │       │  - Moderation check   │ │    (1200x1600+ 300DPI)│
       └───────────────────────┘       └───────────────────────┘ └───────────────────────┘
```

---

## 3. Technology Stack & Directory Structure

Confirmed structure: Two clean root-level directories (`frontend/` and `backend/`).

```
Polipost/
├── frontend/                        # Next.js 14+ (App Router, TypeScript)
│   ├── src/
│   │   ├── app/                     # Pages: /, /login, /register, /create, /preview/[id], /history
│   │   ├── components/
│   │   │   ├── ui/                  # Buttons, inputs, modals, cards, badges (Design tokens)
│   │   │   ├── poster/              # LiveCanvas, StepOccasion, StepDetails, StepPhotos, ExportBar
│   │   │   └── layout/              # Navbar, Footer, DashboardSidebar
│   │   ├── hooks/                   # usePoster, useAuth, useCanvasPreview
│   │   ├── lib/                     # api-client, fonts, utils
│   │   └── styles/                  # tokens.css, globals.css
│   └── package.json
│
├── backend/                         # Express.js (TypeScript)
│   ├── src/
│   │   ├── config/                  # db.ts, env.ts, cloudinary.ts, gemini.ts
│   │   ├── controllers/             # auth, template, poster, upload, admin
│   │   ├── middleware/              # authGuard, roleGuard, rateLimiter, errorHandler
│   │   ├── models/                  # User, Template, Poster, GenerationLog
│   │   ├── routes/                  # auth.routes, template.routes, poster.routes, upload.routes
│   │   ├── services/
│   │   │   ├── gemini.service.ts     # AI prompt engineering & slogan extraction
│   │   │   ├── render.service.ts     # Server-side canvas/Puppeteer rendering
│   │   │   └── storage.service.ts    # Cloudinary upload wrapper
│   │   ├── templates/               # Static SVG/HTML template overlays
│   │   └── server.ts
│   └── package.json
│
├── .agents/                         # Custom skills and design tokens
├── version_documentation.md         # Detailed changelog & versions (ver 1.x.x)
├── agent_context.md                 # Running instructions & preferences from Ifti
├── readme.md                        # Clean repository documentation
├── polipost_master_build_plan.md    # Master architecture blueprint
└── .gitignore                       # Global git ignore configuration
```

---

## 4. Database Schema (MongoDB / Mongoose)

### 1. User Model (`User`)
- `_id`: ObjectId
- `name`: String (Required)
- `email`: String (Unique, Indexed)
- `phone`: String (Optional/Indexed)
- `passwordHash`: String (Argon2 / bcrypt)
- `role`: `'user' | 'admin'` (Default `'user'`)
- `posterQuota`: Number (Default 15 for free tier)
- `createdAt`, `updatedAt`: Timestamps

### 2. Template Model (`Template`)
- `_id`: ObjectId
- `title`: String (e.g., "বিজয় দিবস - জাতীয় স্মৃতিসৌধ থিম")
- `occasionType`: `'victory_day' | 'mourning' | 'campaign' | 'greetings' | 'eid'`
- `partyMotif`: `'neutral' | 'bnp' | 'al' | 'general_bangladesh'`
- `thumbnailUrl`: String
- `layoutConfig`:
  - `dimensions`: `{ width: 1200, height: 1600 }`
  - `photoSlots`: Array of `{ id: 'leader_1' | 'leader_2' | 'requester', x, y, width, height, shape: 'oval' | 'rect' | 'circle' | 'cutout', label: string }`
  - `textSlots`: Array of `{ id: 'headline' | 'slogan' | 'requester_name' | 'designation' | 'organization' | 'credit', x, y, fontSize, fontWeight, color, align, font: 'Hind Siliguri' | 'Kalpurush' }`
  - `bgLayers`: Array of `{ type: 'color' | 'image' | 'gradient', url?: string, blendMode?: string }`
- `isActive`: Boolean (Default `true`)

### 3. Poster Model (`Poster`)
- `_id`: ObjectId
- `userId`: ObjectId (Ref: User, Indexed)
- `templateId`: ObjectId (Ref: Template)
- `formData`:
  - `occasionType`: String
  - `headline`: String (Bangla)
  - `slogan`: String (Bangla)
  - `requesterName`: String (Bangla)
  - `designation`: String (Bangla)
  - `party`: String (Bangla)
  - `unionThanaDistrict`: String (Bangla)
  - `creditLine`: String (Default: "প্রচারে: এলাকাবাসী / সর্বস্তরের জনগণ")
- `uploadedPhotos`: Array of `{ slotId: string, originalUrl: string, cutoutUrl?: string }`
- `aiSuggestions`: `{ suggestedSlogans: string[], bgVariationUrl?: string }`
- `generatedImageUrl`: String (High-res export)
- `thumbnailUrl`: String
- `status`: `'draft' | 'queued' | 'processing' | 'completed' | 'failed'`
- `retryCount`: Number (Default 0, max 3)
- `createdAt`, `updatedAt`: Timestamps

### 4. GenerationLog Model (`GenerationLog`)
- `posterId`: ObjectId (Ref: Poster)
- `userId`: ObjectId (Ref: User)
- `promptUsed`: String
- `tokensUsed`: Number
- `renderLatencyMs`: Number
- `success`: Boolean
- `error`: String (Optional)

---

## 5. API Endpoints Specification

### Authentication
- `POST /api/auth/register` — Register user, returns JWT token & user profile.
- `POST /api/auth/login` — Authenticate user, returns JWT token.
- `GET /api/auth/me` — Current authenticated user context.

### Templates
- `GET /api/templates` — List all active templates with occasion and party filters.
- `GET /api/templates/:id` — Get template details and layout configuration.

### Poster Creation & Pipeline
- `POST /api/upload` — Multi-part photo upload to Cloudinary/S3, returns secure URL.
- `POST /api/posters` — Initiate poster creation. Triggers AI suggestions & server render.
- `GET /api/posters/:id` — Fetch poster status and result URL (polled by frontend).
- `GET /api/posters/user/:userId` — Fetch user's poster history with pagination.
- `POST /api/posters/:id/regenerate` — Re-render poster with modified text or layout tweaks.
- `DELETE /api/posters/:id` — Delete poster from user history.

### Admin & Moderation
- `GET /api/admin/posters` — Moderation queue (flagged posters, usage stats).
- `POST /api/admin/templates` — Create or seed new template with layout JSON.
- `PATCH /api/admin/templates/:id` — Update template layout or visibility.
- `DELETE /api/admin/templates/:id` — Deactivate template.

---

## 6. Poster Rendering Pipeline & Bangla Font Engine

### Typography Guarantee
To ensure 100% authentic and error-free Bangla text rendering without missing glyphs or broken conjuncts:
1. Embed standard Unicode Bangla OpenType fonts:
   - **Hind Siliguri** (Modern, clean sans-serif for designations and credit lines)
   - **Kalpurush** (Classic bookish serif, the gold standard for formal Bangla announcements)
   - **Anek Bangla / Tiro Bangla** (High-impact display weights for bold headlines)
2. The server-side rendering pipeline builds an SVG/HTML template where fonts are embedded via `@font-face` base64/local paths.
3. Headless Chrome (via Puppeteer) or Sharp renders the DOM tree to a high-DPI canvas (pixel density scale: 2x or 3x) and outputs an uncompressed PNG and print-ready PDF.

### Leader Photo Cutouts & Framing
- Each template supports flexible slots:
  - Top header row: 1, 2, or 3 leader slots.
  - Slots support either **curved/oval graphical frames** (no transparent background needed) or **transparent PNG cutouts**.
  - A client-side visual crop & position tool allows the user to pan/zoom their uploaded photos into each slot accurately.

---

## 7. Step-by-Step Implementation Roadmap

- **Milestone 1 (Foundations & Scaffold)**:
  - Initialize monorepo structure (`apps/web` with Next.js 14+ App Router, `apps/api` with Express & TypeScript).
  - MongoDB models (User, Template, Poster) and JWT authentication flow.
- **Milestone 2 (Design System & Seed Templates)**:
  - Apply `ui-design-system` tokens (colors, typography, spacing, shadows, motion tokens).
  - Seed 3 distinct Bangladeshi poster templates (Victory Day, Memorial/Tribute, Campaign/Greetings).
- **Milestone 3 (Interactive Creation Flow)**:
  - Build responsive multi-step wizard:
    1. Select occasion & template style.
    2. Enter Bangla details (headline, slogan, requester designation, location).
    3. Upload & crop leader photos and requester photo.
  - Implement client-side preview with real-time text reflection.
- **Milestone 4 (Gemini Intelligence & Server Renderer)**:
  - Integrate Gemini API for Bangla slogan generator and color theme tuning.
  - Build server-side Puppeteer/Canvas rendering service with embedded Bangla fonts for 1200×1600+ print resolution.
- **Milestone 5 (Export, History & Launch)**:
  - High-res PNG & PDF download.
  - User poster history with re-generation and tweak capabilities.
  - Content moderation checks and basic rate limiting.

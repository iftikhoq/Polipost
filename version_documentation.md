# Version Documentation

## ver 1.0.0 (2026-09-26)
- **Project Initiation**: AI Political Poster Maker (Polipost) architecture and MVP plan initiated.
- **Specification**: Outlined technical architecture for Next.js (TypeScript) frontend, Express.js (TypeScript) backend, MongoDB (Mongoose) database, Gemini AI integration, and template/canvas rendering pipeline.
- **Core Design Decisions (Confirmed by Ifti on 2026-09-26)**:
  - **Option B Rendering Architecture**: Hybrid AI layout/slogan generation + Server-side HTML/Canvas/Puppeteer high-res renderer to ensure 100% accurate, crisp Bangla typography and exact layout control.
  - **Photo Framing**: Dual support for both framed portraits (oval/shield borders with pan & zoom) and transparent cutouts.
  - **Directory Structure**: Two separate folders at root (`frontend/` and `backend/`).
  - **File Storage**: Cloudinary for user photo uploads and generated high-resolution posters.
  - Core project documentation structure initialized (`version_documentation.md`, `agent_context.md`, `readme.md`, `.gitignore`, `polipost_master_build_plan.md`).
- **Milestones Completed**:
  - **Backend Scaffolding & Architecture**: Initialized `backend/` with Express.js, TypeScript, Mongoose, JWT auth, rate limiter, and helmet.
  - **Data Models**: Created `User`, `Template`, `Poster`, and `GenerationLog` schemas with comprehensive typing and indexes.
  - **Template Seeder**: Created Bangladeshi political poster seed templates (Victory Day, Memorial/Mourning, and Campaign) with coordinates for leader slots and Bangla typography.
  - **Google Gemini Service**: Implemented AI slogan generation, layout recommendations, and content moderation checks.
  - **High-Resolution Puppeteer Renderer**: Developed server-side rendering pipeline utilizing Puppeteer with embedded Google Bangla Web Fonts (`Hind Siliguri`, `Anek Bangla`, `Tiro Bangla`) at 300 DPI (2400×3200px export).
  - **Photo Upload & Storage**: Multi-part photo handler supporting Cloudinary and local disk fallback for zero-friction development.
  - **Frontend Scaffolding & Design System**: Next.js 14+ App Router initialized in `frontend/` with design system tokens (`ui-design-system`), custom Tailwind configurations, and accessible components (`Button`, `Input`, `Badge`, `Card`).
  - **Live Real-time HTML5 Canvas**: Created interactive client-side canvas that reflects text, leader portraits, and theme colors instantly as the user types.
  - **Multi-step Poster Wizard**: Implemented step-by-step poster creator (`/create`) with AI slogan generation, framing toggles (framed badges vs cutouts), and instant export (`/preview/[id]`).
  - **User History & Dashboard**: Built `/history` to manage, re-edit, regenerate, and download previous posters.
  - **Authentication**: JWT login (`/login`) and registration (`/register`) with quota tracking.
  - **Guest Draft UX Enhancement (Fix)**: Unlocked `/api/upload` and `/api/posters/slogans` from mandatory auth so guest users drafting a poster can upload photos, generate AI slogans, and see the live canvas preview without being blocked before registration. Instant local blob URL preview added for zero-latency image feedback.
  - **World-Renowned Poster Styles (Curated Templates)**: Curated and integrated 4 iconic political poster design movements from around the world into both the database and live preview:
    1. *American Pop-Art "Hope" Style (Shepard Fairey)* — Iconic 4-color posterized stencil aesthetic (Navy, Sky Blue, Cream, Crimson).
    2. *Constructivist Agitprop Style (Soviet Avant-Garde 1920s)* — Stark diagonal dynamism, revolutionary red and black contrasts.
    3. *Swiss International Typographic Style (Zurich Modernism)* — Strict mathematical grid, asymmetric negative space, objective civic clarity.
    4. *Latin American Solidarity & Muralist Style* — Warm terracotta, sunflower gold, radiant sunburst lines, and grassroots community power.

## ver 1.1.0 (2026-09-26)
- **Rich Vector Background Motifs (Fixed Gradient-Only Issue)**:
  - Replaced flat gradient backgrounds with authentic occasion-specific vector graphics on both the real-time client canvas (`LiveCanvasPreview.tsx`) and the server-side 300 DPI Puppeteer renderer (`render.service.ts`).
  - **Victory Day (মহান বিজয় দিবস)**: Rendered the iconic 7-stepped triangular architectural spires of National Martyrs' Memorial (জাতীয় স্মৃতিসৌধ), a glowing Bangladesh flag red sun, and golden victory laurel accents.
  - **Campaign & Elections (নির্বাচনী প্রচার)**: 24-ray dynamic sunburst beams, celebratory 5-pointed stars, and festive dual ribbon swooshes.
  - **Memorial & Tribute (শোক ও শ্রদ্ধা)**: Draped vector black mourning ribbons, warm golden candle flame / eternal lamp illumination, and somber atmosphere.
  - **Eid & Cultural Greetings (ঈদ মোবারক)**: Golden crescent moon & star, and subtle arabesque geometric watermark rays.
  - **World Styles**: Shepard Fairey split-tone blocks, 45° Constructivist scarlet wedge, and Swiss precision architectural gridlines.
- **Variable Political Leader Showcase Options**:
  - Implemented intuitive user controls to choose the number of top leaders displayed:
    * `১ জন নেতা` (1 Leader): Grand central hero portrait with scaled prominence.
    * `২ জন নেতা` (2 Leaders): Balanced dual leadership portrait arrangement.
    * `৩ জন নেতা` (3 Leaders): Classic Bangladeshi political trio (Founder, Chairperson, Secretary).
    * `কোনো নেতা নয়` (0 Leaders): Grassroots candidate-only / event flyer mode with auto-balanced vertical text and motif positioning.
- **Leader Image Framing & Showcase Styles**:
  - Added 5 distinct framing styles for leaders and candidates:
    1. *Royal Golden Oval (`oval`)*: Polished double gold rim with radial metallic glow.
    2. *Circular Medallion (`circle`)*: Clean circular emblem with inner ring.
    3. *Royal Arch / Mughal Dome (`arch`)*: Majestic arched dome with rounded top and flat base.
    4. *Patriotic Shield Crest (`shield`)*: Heraldic shield badge with flared crown and pointed tip.
    5. *Cutout Aura Glow (`cutout`)*: Modern billboard cutout mode with ambient golden halo.
- **Backend & Database Synchronization**:
  - Updated `Poster` Mongoose schema and `render.service.ts` to accept `leaderCount` and `leaderFrameStyle`, ensuring identical visuals between preview and final 300 DPI export.

## ver 1.2.0 (2026-09-26)
- **New Authentic Templates (Inspired by User-Provided Reference Posters)**:
  - Added 4 brand new high-impact templates seeded into MongoDB Atlas:
    1. *অমর একুশে ফেব্রুয়ারি - শহীদ মিনার ও শান্তির পায়রা (`shaheed-minar-language-day`)*: Minimalist pearl white/grey backdrop with Central Shaheed Minar silhouette, glowing crimson sun disc, and flying peace doves.
    2. *১৬ই ডিসেম্বর - দৃপ্ত বজ্রমুষ্টি ও মুক্তির সংগ্রাম (`victory-day-fist-of-freedom`)*: Deep emerald waving silk, giant crimson sun, and a powerful raised fist of liberty and sovereignty.
    3. *গৌরবময় প্রতিষ্ঠা বার্ষিকী ও দলীয় সম্মেলন (`party-anniversary-celebration`)*: Embossed golden anniversary headlines, Bangladesh map watermark, dual leadership arch frames, and celebration ribbon stars.
    4. *তারুণ্যের গণজোয়ার ও নির্বাচনী মার্কা (`youth-rally-campaign`)*: Cheering grassroots crowd silhouette, election symbol ("মার্কা") crest, and dynamic campaign sunburst.
- **Generate Entire Poster Using Gemini (এআই দিয়ে সম্পূর্ণ পোস্টার জেনারেটর)**:
  - Added backend intelligent AI workflow `generateFullPosterWithGemini` and endpoint `POST /api/posters/generate-full`.
  - Given any natural language input or brief topic (e.g. "১৬ই ডিসেম্বর মহান বিজয় দিবসে আওয়ামী লীগের সাধারণ সম্পাদক হিসেবে শুভেচ্ছা পোস্টার"), Gemini:
    * Selects the most appropriate occasion and template from the library.
    * Crafts inspiring, poetic, culturally authentic Bangla headlines and slogans.
    * Recommends political party attribution, candidate designation, and location.
    * Chooses the optimal leader count (0, 1, 2, or 3) and frame style (oval, circle, arch, shield, cutout).
    * Automatically applies colors, switches the active template, and re-renders the live canvas instantly.
  - Implemented an interactive Gemini AI Assistant Banner in the poster creation wizard (`/create`) with 1-click inspiration pills for effortless auto-drafting.

## ver 1.3.0 (2026-09-26)
- **Radical Template Layout & Composition Differentiation**:
  - Transformed template renderings so each design has a genuinely distinct composition, macro layout, and artwork rather than simple color shifts:
    1. *অমর একুশে ফেব্রুয়ারি (`shaheed-minar-language-day`)*: Pristine marble stone backdrop, Central Shaheed Minar with 3D columns, blood-red sun disc, soaring peace doves, and traditional Bengali circular floral Alpana (`আলপনা`) wreath plinth.
    2. *১৬ই ডিসেম্বর (`victory-day-fist-of-freedom`)*: Clenched Fist of Liberty (`বজ্রমুষ্টি`) with electric energy fissures, glowing 380px radiant red sun, and dynamic diagonal victory action ribbon.
    3. *আমেরিকান পপ-আর্ট "হোপ" (`pop-art-hope-style`)*: 3-tone Shepard Fairey color-blocked panels (Navy `#003049`, Sky Blue `#669bbc`, Scarlet `#780001`), stencil drop shadows, and high-impact posterized framing.
    4. *কনস্ট্রাক্টিভিস্ট অ্যাজিটপ্রপ (`constructivist-agitprop-style`)*: Soviet Avant-Garde 45° diagonal scarlet wedge across pitch black, geometric red star, and bold angular framing.
    5. *সুইস মিনিম্যালিস্ট গ্রিড (`swiss-minimalist-grid`)*: Asymmetric grid structure with blueprint hairline rules, International Klein Blue (`#0284c7`) vertical structural bar, and strict left-aligned typography.
    6. *তারুণ্যের গণজোয়ার (`youth-rally-campaign`)*: Dense cheering grassroots rally crowd silhouette with raised flags/hands, golden circular ballot symbol badge ("মার্কা প্রতীক"), and dynamic celebration stars.
    7. *গৌরবময় প্রতিষ্ঠা বার্ষিকী (`party-anniversary-celebration`)*: 32-ray radiant golden sunburst, twin golden laurel victory wreaths, and jubilee ribbon banner.
- **Multiple Bangla Typography & Font Selection**:
  - Embedded 5 curated Bangla Google Web Fonts and visual font selector cards with real-time preview:
    * `Anek Bangla` (আধুনিক ও বলিষ্ঠ বোল্ড - Modern Bold)
    * `Hind Siliguri` (ক্লাসিক ও আনুষ্ঠানিক প্রেস - Official Press Standard)
    * `Tiro Bangla` (ঐতিহ্যবাহী সাহিত্যিক সেরিক - Traditional Literary Serif)
    * `Noto Serif Bengali` (রাজকীয় ও গম্ভীর সৌধ - Monumental Serif)
    * `Mina` (গতিশীল ও উন্মুক্ত ক্যালিগ্রাফি - Dynamic Open Curves)
  - Applied selected font across headlines, slogans, party badges, requester names, and designations in real time.
- **Full Bottom Section Customization**:
  - Implemented 5 distinct layout styles:
    * `classic` (ঐতিহ্যবাহী ডার্ক বার): Full-width solid dark bar with gold divider.
    * `floating` (ফ্লোটিং গ্লাস কার্ড): Rounded glassmorphic floating panel with outer glow.
    * `split` (স্প্লিট হিরো প্যানেল): Angular split panel separating candidate portrait and info text with dynamic accent polygon.
    * `minimal` (মিনিমালিস্ট লাইন): Refined translucent overlay with hairline border.
    * `royal` (রয়্যাল গোল্ডেন ক্রেস্ট): Double gold border with metallic sheen and golden crest badge.
  - Candidate Portrait Re-positioning:
    * `right` (ডানপাশে - Traditional Bangladeshi political layout).
    * `left` (বামপাশে - Modern alternative).
    * `center` (কেন্দ্রে - Hero breakout positioning lifting above the footer).
  - Footer Color Modes:
    * `dark` (ডিপ ব্ল্যাক `#09090b`).
    * `theme` (থিমের সাথে ম্যাচিং).
    * `gold` (রয়্যাল গোল্ড ও অ্যাম্বার গ্র্যাডিয়েন্ট).
    * `transparent` (স্বচ্ছ ফ্রস্টেড গ্লাস).
- **Backend & Export Synchronization**:
  - Updated Mongoose `IPosterFormData` and `PosterFormDataSchema` with `fontFamily`, `footerStyle`, `candidatePosition`, and `footerColorMode`.
  - Updated Puppeteer renderer (`render.service.ts`) with all 5 Google Web Fonts, candidate flex realignment, and high-res export fidelity.



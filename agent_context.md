# Agent Context & Instructions

## Project Overview
- **Name**: Polipost (AI Political Poster Maker)
- **Primary Owner / Lead**: Ifti
- **Role**: Software manager and primary heavy-lifter in code and architecture.

## Standing Instructions & Rules
1. **Role Alignment**: Always work as a software manager and heavy lifter for Ifti. Think ahead, provide proactive structure, clean code, and robust implementation.
2. **Version Documentation**:
   - Maintain `version_documentation.md`.
   - Record exact version numbers (ver 1.x.x) and dates.
   - Maintain granular details of every change, architecture decision, and progress milestone.
   - If updates happen months apart, ask Ifti before doing major version bumps (ver 1.x.x -> ver 2.x.x).
3. **Agent Context**:
   - Keep this `agent_context.md` updated with all specific instructions, preferences, and design decisions given by Ifti throughout the project lifecycle.
4. **README**:
   - Maintain `readme.md` for GitHub. Keep it clean, simple, human-written, explaining the workflow and how to run/use the project.
5. **Gitignore**:
   - Maintain `.gitignore` rigorously, ensuring environment secrets, build artifacts, upload folders, and temporary files are excluded.
6. **Frontend Design Standard**:
   - Always use impeccable frontend design standards:
     - Rich visual aesthetics, tailored color palettes, dark/light coherence, glassmorphism/depth, micro-animations.
     - Strict design token usage (`ui-design-system` tokens, no hardcoded magic hexes or values).
     - Full state coverage (idle, loading, active, empty, error).
     - Native typography support for Bangla (e.g. Kalpurush, Hind Siliguri, Tiro Bangla, Anek Bangla) with proper line-height and letter-spacing.
7. **Tech Stack & Architecture Decisions (Confirmed by Ifti)**:
   - **Frontend**: Next.js 14+ (TypeScript) located in `/frontend`, using Tailwind CSS with custom tokens from `.agents/skills/ui-design-system`.
   - **Backend**: Express.js (TypeScript) located in `/backend`.
   - **Database**: MongoDB with Mongoose.
   - **AI Engine**: Google Gemini API (slogan suggestions, theme intelligence, layout parameters).
   - **Rendering Engine**: Option B (Hybrid AI + Server-side HTML/Canvas/Puppeteer high-res renderer) to guarantee 100% accurate, crisp Bangla typography (`Hind Siliguri`, `Kalpurush`, `Anek Bangla`) without broken conjuncts (`যুক্তবর্ণ`).
   - **Photo Framing**: Support both framed photos (oval/curved decorative borders with pan/zoom) and transparent cutouts.
   - **File Storage**: Cloudinary for user photo uploads and generated high-res posters.
   - **Repository Structure**: Two distinct directories at root: `frontend/` and `backend/`.
8. **Poster Visual Elements & Leader Framing (Added 2026-09-26)**:
   - Do NOT use plain, flat gradient backgrounds. Always render rich, occasion-tailored symbolic vector motifs:
     * Victory Day: 7-tier stepped National Memorial (জাতীয় স্মৃতিসৌধ) triangular spires, radiant red sun, and golden laurels.
     * Campaign: 24-ray dynamic sunburst beams, celebratory stars, and dynamic banners.
     * Memorial: Draped black mourning ribbons, warm eternal flame candlelight, and somber floral wreaths.
     * Eid: Golden crescent moon & star, arabesque rays, and lanterns.
   - Support variable leader count (1 leader, 2 leaders, 3 leaders, or 0/candidate-only) with dynamic layout adjustments.
   - Support 5 distinct leader framing styles: Royal Oval (`oval`), Medallion Circle (`circle`), Royal Arch (`arch`), Shield Crest (`shield`), and Cutout Aura (`cutout`).
9. **Full Poster AI Generation with Gemini (Added 2026-09-26)**:
   - Provide direct 1-click option to generate entire posters using Gemini AI based on natural language prompts.
   - Gemini automatically selects the ideal template, crafts poetic Bangla headlines and slogans, extracts or proposes designations and locations, selects the leader count, and switches theme colors instantly.
   - Reference templates inspired by real posters: Shaheed Minar Language Day, Victory Day Fist of Freedom, Party Foundation Anniversary, and Youth Grassroots Campaign.
10. **Distinct Template Compositions, Typography Options & Footer Customization (Added 2026-09-26)**:
   - Ensure templates have genuinely unique compositional macro-layouts and artistic motifs rather than simple color shifts:
     * *Shaheed Minar (`shaheed-minar-language-day`)*: Centered 3D columns, blood-red sun, soaring peace doves, floral circular Alpana wreath plinth, marble/stone light backdrop.
     * *16 Dec Fist of Freedom (`victory-day-fist-of-freedom`)*: Clenched Fist of Liberty with lightning energy fissures, glowing red sun, dynamic diagonal action ribbon.
     * *American Pop-Art "Hope" (`pop-art-hope-style`)*: 3-tone Shepard Fairey split blocks, stencil typography, bold posterized framing.
     * *Constructivist (`constructivist-agitprop-style`)*: 45° Soviet diagonal wedge across black, geometric red star.
     * *Swiss Minimalist Grid (`swiss-minimalist-grid`)*: Architectural blueprint gridlines, Klein Blue vertical structural bar, asymmetric left-aligned typography.
     * *Youth Rally (`youth-rally-campaign`)*: Grassroots cheering crowd silhouette, ballot symbol ("মার্কা") badge.
     * *Party Anniversary (`party-anniversary-celebration`)*: 32-ray golden sunburst, twin golden laurel victory wreaths, jubilee crest.
   - Provide 5 Bangla font options: `Anek Bangla` (Modern Bold), `Hind Siliguri` (Official Press), `Tiro Bangla` (Literary Serif), `Noto Serif Bengali` (Monumental Serif), and `Mina` (Dynamic Calligraphic).
   - Provide complete bottom section customization:
     * 5 Layout Styles: `classic` (ঐতিহ্যবাহী ডার্ক বার), `floating` (ফ্লোটিং গ্লাস কার্ড), `split` (স্প্লিট হিরো প্যানেল), `minimal` (মিনিমালিস্ট লাইন), `royal` (রয়্যাল গোল্ডেন ক্রেস্ট).
     * Candidate Position: `right` (ডানপাশে), `left` (বামপাশে), `center` (কেন্দ্রে/Hero breakout).
     * Footer Color Mode: `dark` (ডিপ ব্ল্যাক), `theme` (থিমের সাথে ম্যাচিং), `gold` (রয়্যাল গোল্ড আভা), `transparent` (স্বচ্ছ/গ্লাস).


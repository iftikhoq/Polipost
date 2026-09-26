# Polipost - AI Political Poster Maker 🇧🇩

Polipost is a web application designed to help political workers, committee members, and publicity agents create professional, print-ready political posters in minutes.

Traditional political poster design in Bangladesh requires Photoshop expertise, custom Bangla font manipulation, and manual photo framing. Polipost automates this process using intelligent layout templates and Google Gemini AI, ensuring authentic visual styling with 100% crisp and accurate Bangla typography.

---

## Key Features

- **Radically Distinct Templates**: Genuine compositional variations inspired by authentic Bangladeshi politics and world-famous movements (Shaheed Minar Language Day, 16 Dec Fist of Freedom, Party Anniversary, Youth Rally, American Pop-Art "Hope", Soviet Constructivist, and Swiss Minimalist Grid).
- **Bangla-First Typography Selection**: Choose from 5 beautiful Bangla web fonts (`Anek Bangla`, `Hind Siliguri`, `Tiro Bangla`, `Noto Serif Bengali`, and `Mina`) with instant live preview.
- **Customizable Bottom Section**:
  - 5 Layout Styles (`classic` dark bar, `floating` glass card, `split` hero panel, `minimal` line, `royal` golden crest).
  - Candidate Portrait Positioning (`right`, `left`, `center` hero breakout).
  - Footer Color Modes (`dark`, `theme`, `gold`, `transparent`).
- **1-Click Full Poster Generation with Gemini**: Enter any brief prompt in Bangla or English and let Gemini automatically choose the template, write authentic slogans, and customize the layout.
- **Leader & Candidate Cutout Slots**: Clean photo placement for 0, 1, 2, or 3 senior leaders with 5 framing styles (`oval`, `circle`, `arch`, `shield`, `cutout`).
- **Print-Ready High-Res Export**: Generates export files ready for physical printing (at 300 DPI) and digital social sharing.
- **Poster History & Re-editing**: Save posters to your account, make tweaks, and re-download anytime.

---

## How It Works (Workflow)

```
1. Select Occasion & Template
   └── Choose from Victory Day, Mourning, Campaign, or Eid/Festival styles

2. Fill In Poster Information
   ├── Requester Details (Name, Designation, Party, Union/Thana/District)
   ├── Bangla Headline / Slogan
   └── Upload Photos (1–3 leader photos + requester portrait)

3. AI Generation & Layout Composition
   └── Gemini suggests decorative motifs & layout tweaks;
       Server-side canvas renders high-resolution composite with exact Bangla fonts

4. Preview, Tweak & Export
   └── Real-time interactive preview, instant text updates, high-res PNG / PDF download
```

---

## Tech Stack

- **Frontend**: Next.js 14+ (TypeScript), Tailwind CSS, Framer Motion
- **Backend**: Express.js (TypeScript), Node.js
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Gemini API
- **Render Engine**: Server-side HTML/Canvas / Puppeteer for pixel-perfect Bangla typography
- **Storage**: Cloudinary / S3 for photo assets & generated poster files
- **Auth**: JWT-based authentication

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/polipost` or MongoDB Atlas URI)
- Google Gemini API Key (Optional — built-in authentic political slogan presets exist for local development)
- Cloudinary credentials (Optional — automatically falls back to local disk storage in development)

### 1. Backend Setup & Running

Navigate to the `backend/` directory:
```bash
cd backend
npm install
```

Configure your environment variables:
```bash
cp .env.example .env
```

Seed the authentic Bangladeshi political poster templates into MongoDB:
```bash
npm run seed
```

Start the backend development server:
```bash
npm run dev
# The API will start on http://localhost:5000
```

### 2. Frontend Setup & Running

In a separate terminal, navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
# The Next.js web application will open on http://localhost:3000
```

---

## API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT token |
| `GET` | `/api/auth/me` | Current authenticated user context |
| `GET` | `/api/templates` | List all available poster templates |
| `POST` | `/api/upload` | Upload leader or requester photo |
| `POST` | `/api/posters` | Generate print-ready poster with AI |
| `POST` | `/api/posters/slogans` | Generate occasion-tailored Bangla slogans with Gemini |
| `GET` | `/api/posters/user/history` | User's saved poster history |
| `POST` | `/api/posters/:id/regenerate` | Tweak copy and regenerate poster |

---

## License
MIT

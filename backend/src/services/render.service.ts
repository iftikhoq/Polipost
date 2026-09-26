import puppeteer, { Browser } from 'puppeteer';
import { ITemplate } from '../models/Template.js';
import { IPoster } from '../models/Poster.js';
import { uploadBuffer } from './storage.service.js';

let sharedBrowser: Browser | null = null;

const getBrowser = async (): Promise<Browser> => {
  if (!sharedBrowser || !sharedBrowser.connected) {
    sharedBrowser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });
  }
  return sharedBrowser;
};

/**
 * Builds the standalone HTML string for the poster using authentic Bangladeshi political poster styling.
 */
export const buildPosterHtml = (template: ITemplate, poster: IPoster): string => {
  const { width = 1200, height = 1600 } = template.layoutConfig?.dimensions || {};
  const {
    headline,
    slogan,
    requesterName,
    designation,
    party,
    unionThanaDistrict,
    creditLine = 'প্রচারে: এলাকাবাসী ও দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ',
    leaderCount = 3,
    leaderFrameStyle = 'oval',
    fontFamily = 'Anek Bangla',
    footerStyle = 'classic',
    candidatePosition = 'right',
    footerColorMode = 'dark',
  } = poster.formData;

  // Find photo mappings
  const photos = poster.uploadedPhotos || [];
  const leader1 = photos.find((p) => p.slotId === 'leader_1');
  const leader2 = photos.find((p) => p.slotId === 'leader_2');
  const leader3 = photos.find((p) => p.slotId === 'leader_3');
  const requesterPhoto = photos.find((p) => p.slotId === 'requester');

  // Occasion & template-specific theme accents
  const occasion = template.occasionType;
  const slug = template.slug;
  const isMourning = occasion === 'mourning';
  const isCampaign = occasion === 'campaign';
  const isEid = occasion === 'eid';
  const isVictory = occasion === 'victory_day';
  const isAnniversary = occasion === 'anniversary' || slug === 'party-anniversary-celebration' || headline.includes('প্রতিষ্ঠা বার্ষিকী');
  const isLanguageDay = occasion === 'mourning' && (slug === 'shaheed-minar-language-day' || headline.includes('একুশ') || headline.includes('শহীদ মিনার') || headline.includes('ভাষা'));
  const isFistOfFreedom = slug === 'victory-day-fist-of-freedom' || headline.includes('বজ্রমুষ্টি');
  const isYouthRally = slug === 'youth-rally-campaign' || headline.includes('মার্কা') || headline.includes('গণজোয়ার');

  const isPopArt = slug === 'pop-art-hope-style';
  const isConstructivist = slug === 'constructivist-agitprop-style';
  const isSwiss = slug === 'swiss-minimalist-grid';
  const isLatin = slug === 'latin-solidarity-mural';

  const themePrimary = template.layoutConfig?.bgColor || (isMourning ? '#18181b' : '#043927');
  const themeBgGradient = template.layoutConfig?.bgGradient || (isMourning ? 'linear-gradient(180deg, #18181b 0%, #09090b 100%)' : 'linear-gradient(180deg, #043927 0%, #021f15 100%)');
  const themeAccent = template.layoutConfig?.bannerColor || (isMourning ? '#52525b' : '#c9182b');
  
  let themeGold = isMourning ? '#a1a1aa' : '#f59e0b';
  let textColor = '#ffffff';
  let headlineColor = '#ffffff';
  let sloganColor = '#fef08a';

  if (isPopArt) {
    themeGold = '#fdf0d5';
    headlineColor = '#fdf0d5';
    sloganColor = '#669bbc';
  } else if (isConstructivist) {
    themeGold = '#ffffff';
    headlineColor = '#ffffff';
    sloganColor = '#f87171';
  } else if (isSwiss) {
    themeGold = '#0284c7';
    textColor = '#0f172a';
    headlineColor = '#0f172a';
    sloganColor = '#475569';
  } else if (isLatin) {
    themeGold = '#fef08a';
    headlineColor = '#fef08a';
    sloganColor = '#fed7aa';
  }

  // Frame style CSS mapping
  let frameRadiusCss = 'border-radius: 50% 50% 50% 50% / 60% 60% 60% 60%;';
  let frameClipCss = '';
  if (leaderFrameStyle === 'circle') {
    frameRadiusCss = 'border-radius: 50%; aspect-ratio: 1;';
  } else if (leaderFrameStyle === 'arch') {
    frameRadiusCss = 'border-radius: 95px 95px 12px 12px;';
  } else if (leaderFrameStyle === 'shield') {
    frameClipCss = 'clip-path: polygon(0 0, 100% 0, 100% 68%, 50% 100%, 0 68%); border-radius: 14px 14px 0 0;';
  } else if (leaderFrameStyle === 'cutout') {
    frameRadiusCss = 'border-radius: 24px; box-shadow: 0 0 35px rgba(245, 158, 11, 0.6);';
  }

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${headline}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@700;800&family=Hind+Siliguri:wght@400;600;700&family=Mina:wght@400;700&family=Noto+Serif+Bengali:wght@600;800&family=Tiro+Bangla&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      background: ${themeBgGradient};
      color: ${textColor};
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Background decorative pattern */
    .bg-pattern {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    /* Decorative border framing */
    .poster-border {
      position: absolute;
      inset: 20px;
      border: 4px solid ${themeGold};
      border-radius: 12px;
      z-index: 1;
      pointer-events: none;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
    }
    .poster-border::after {
      content: '';
      position: absolute;
      inset: 6px;
      border: 1.5px ${isSwiss ? 'solid' : 'dashed'} ${themeGold};
      opacity: 0.6;
      border-radius: 8px;
    }

    /* Top Leader Section */
    .top-leaders {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 36px;
      padding-top: ${leaderCount === 1 ? '40px' : '50px'};
      height: ${leaderCount === 0 ? '40px' : '380px'};
    }
    .leader-frame {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .leader-frame.primary {
      transform: scale(${leaderCount === 1 ? 1.3 : 1.15});
      z-index: 3;
    }
    .leader-avatar {
      width: 170px;
      height: 220px;
      ${frameRadiusCss}
      ${frameClipCss}
      border: 5px solid ${themeGold};
      overflow: hidden;
      background: #1e293b;
      box-shadow: 0 12px 24px rgba(0,0,0,0.4), 0 0 20px rgba(245, 158, 11, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .leader-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Central Headline & Occasion Banner */
    .center-content {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 0 40px;
      margin-top: ${leaderCount === 0 ? '-60px' : '10px'};
    }
    .party-banner {
      display: inline-block;
      background: ${themeAccent};
      color: #ffffff;
      padding: 8px 36px;
      border-radius: 8px;
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
      border: 2px solid ${themeGold};
      box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      margin-bottom: 25px;
    }
    .headline {
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      font-size: 82px;
      font-weight: 800;
      line-height: 1.15;
      color: ${headlineColor};
      text-shadow: ${isSwiss ? 'none' : `0 4px 0 #000000, 0 8px 15px rgba(0,0,0,0.8), 0 0 30px ${themeGold}`};
      letter-spacing: -0.5px;
      margin-bottom: 20px;
    }
    .slogan {
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      font-size: 32px;
      font-weight: 600;
      color: ${sloganColor};
      line-height: 1.4;
      max-width: 950px;
      margin: 0 auto;
      text-shadow: ${isSwiss ? 'none' : '0 2px 8px rgba(0,0,0,0.9)'};
      padding: 12px 24px;
      background: ${isSwiss ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.3)'};
      border-radius: 12px;
      border-left: 4px solid ${themeGold};
      border-right: 4px solid ${themeGold};
    }

    /* Requester & Footer Section */
    .footer-section {
      position: relative;
      z-index: 2;
      background: ${
        footerColorMode === 'theme'
          ? themePrimary
          : footerColorMode === 'gold'
          ? 'linear-gradient(135deg, #78350f 0%, #451a03 100%)'
          : footerColorMode === 'transparent'
          ? 'rgba(15, 23, 42, 0.55)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.96) 100%)'
      };
      border-top: ${footerStyle === 'royal' ? `6px solid #f59e0b` : footerStyle === 'minimal' ? '1.5px solid rgba(255,255,255,0.2)' : `4px solid ${themeGold}`};
      ${footerStyle === 'floating' ? `margin: 0 40px 35px 40px; border-radius: 24px; border: 4px solid ${themeGold};` : ''}
      ${footerStyle === 'minimal' ? `margin: 0 35px 30px 35px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.2);` : ''}
      padding: 25px 45px 30px 45px;
      display: flex;
      flex-direction: ${candidatePosition === 'left' ? 'row-reverse' : candidatePosition === 'center' ? 'column' : 'row'};
      align-items: center;
      justify-content: space-between;
      text-align: ${candidatePosition === 'center' ? 'center' : 'left'};
    }
    .requester-info {
      flex: 1;
      padding: ${candidatePosition === 'left' ? '0 0 0 30px' : candidatePosition === 'center' ? '15px 0 0 0' : '0 30px 0 0'};
    }
    .credit-badge {
      display: inline-block;
      background: ${themeGold};
      color: #000000;
      font-size: 20px;
      font-weight: 800;
      padding: 4px 16px;
      border-radius: 4px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .requester-name {
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      font-size: 52px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      text-shadow: 0 2px 10px rgba(0,0,0,0.8);
      margin-bottom: 8px;
    }
    .requester-designation {
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      font-size: 26px;
      color: #fef08a;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .requester-location {
      font-family: '${fontFamily}', 'Hind Siliguri', sans-serif;
      font-size: 22px;
      color: #cbd5e1;
      font-weight: 500;
    }
    .requester-avatar {
      width: 200px;
      height: 250px;
      border-radius: 16px;
      border: 4px solid ${themeGold};
      overflow: hidden;
      background: #0f172a;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      flex-shrink: 0;
    }
    .requester-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .credit-footer-line {
      position: absolute;
      bottom: 6px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 15px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <!-- SVG Rich Background Motifs -->
  <div class="bg-pattern">
    ${isLanguageDay ? `
      <svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="600" cy="540" r="190" fill="url(#shaheedRedSun)" />
        <defs>
          <radialGradient id="shaheedRedSun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#ef4444" />
            <stop offset="80%" stop-color="#dc2626" />
            <stop offset="100%" stop-color="#991b1b" stop-opacity="0" />
          </radialGradient>
        </defs>
        <!-- Plinth -->
        <rect x="360" y="860" width="480" height="24" fill="#334155" />
        <rect x="400" y="844" width="400" height="16" fill="#475569" />
        <!-- Central Column -->
        <polygon points="568,844 560,524 640,524 632,844" fill="#1e293b" stroke="#94a3b8" stroke-width="3" />
        <polygon points="560,524 545,454 655,454 640,524" fill="#0f172a" stroke="#94a3b8" stroke-width="3" />
        <!-- Left Columns -->
        <rect x="488" y="594" width="34" height="250" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />
        <rect x="436" y="654" width="28" height="190" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />
        <!-- Right Columns -->
        <rect x="678" y="594" width="34" height="250" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />
        <rect x="736" y="654" width="28" height="190" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />
      </svg>
    ` : isFistOfFreedom ? `
      <svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="600" cy="540" r="320" fill="url(#fistSun)" />
        <defs>
          <radialGradient id="fistSun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.95" />
            <stop offset="70%" stop-color="#dc2626" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#991b1b" stop-opacity="0" />
          </radialGradient>
        </defs>
        <g opacity="0.9" fill="#065f46" stroke="#34d399" stroke-width="4">
          <polygon points="555,700 565,560 640,560 655,700" />
          <circle cx="600" cy="530" r="55" />
        </g>
      </svg>
    ` : isVictory ? `
      <svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Glowing Red Sun -->
        <circle cx="600" cy="580" r="340" fill="url(#victoryRedSun)" />
        <defs>
          <radialGradient id="victoryRedSun" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.85" />
            <stop offset="70%" stop-color="#dc2626" stop-opacity="0.45" />
            <stop offset="100%" stop-color="#991b1b" stop-opacity="0" />
          </radialGradient>
        </defs>
        <!-- Jatiyo Sriti Shoudho 7 Stepped Triangular Spires -->
        <g opacity="0.45">
          <!-- Pylon 7 -->
          <polygon points="600,480 320,950 600,950" fill="#064e3b" stroke="#f59e0b" stroke-width="1.5" />
          <polygon points="600,480 880,950 600,950" fill="#022c22" stroke="#f59e0b" stroke-width="1.5" />
          <!-- Pylon 6 -->
          <polygon points="600,420 360,950 600,950" fill="#047857" stroke="#f59e0b" stroke-width="1.5" />
          <polygon points="600,420 840,950 600,950" fill="#064e3b" stroke="#f59e0b" stroke-width="1.5" />
          <!-- Pylon 5 -->
          <polygon points="600,360 400,950 600,950" fill="#059669" stroke="#f59e0b" stroke-width="1.5" />
          <polygon points="600,360 800,950 600,950" fill="#047857" stroke="#f59e0b" stroke-width="1.5" />
          <!-- Pylon 4 -->
          <polygon points="600,300 440,950 600,950" fill="#10b981" stroke="#f59e0b" stroke-width="2" />
          <polygon points="600,300 760,950 600,950" fill="#059669" stroke="#f59e0b" stroke-width="2" />
          <!-- Pylon 3 -->
          <polygon points="600,240 480,950 600,950" fill="#34d399" stroke="#f59e0b" stroke-width="2" />
          <polygon points="600,240 720,950 600,950" fill="#10b981" stroke="#f59e0b" stroke-width="2" />
          <!-- Pylon 2 -->
          <polygon points="600,180 520,950 600,950" fill="#6ee7b7" stroke="#f59e0b" stroke-width="2.5" />
          <polygon points="600,180 680,950 600,950" fill="#34d399" stroke="#f59e0b" stroke-width="2.5" />
          <!-- Pylon 1 (Central Spire) -->
          <polygon points="600,120 560,950 600,950" fill="#fef08a" stroke="#f59e0b" stroke-width="3" />
          <polygon points="600,120 640,950 600,950" fill="#f59e0b" stroke="#f59e0b" stroke-width="3" />
        </g>
      </svg>
    ` : isCampaign ? `
      <svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 24 Sunburst Rays -->
        <g opacity="0.12" fill="#f59e0b">
          <polygon points="600,450 1200,0 1200,200" />
          <polygon points="600,450 1200,400 1200,600" />
          <polygon points="600,450 1200,800 1200,1000" />
          <polygon points="600,450 1200,1200 1000,1400" />
          <polygon points="600,450 800,1600 600,1600" />
          <polygon points="600,450 400,1600 200,1600" />
          <polygon points="600,450 0,1400 0,1200" />
          <polygon points="600,450 0,1000 0,800" />
          <polygon points="600,450 0,600 0,400" />
          <polygon points="600,450 0,200 0,0" />
          <polygon points="600,450 200,0 400,0" />
          <polygon points="600,450 600,0 800,0" />
          <polygon points="600,450 1000,0 1200,0" />
        </g>
        <!-- Floating Stars -->
        <g fill="rgba(245, 158, 11, 0.4)">
          <circle cx="150" cy="200" r="12" />
          <circle cx="1050" cy="200" r="12" />
          <circle cx="180" cy="720" r="10" />
          <circle cx="1020" cy="720" r="10" />
        </g>
      </svg>
    ` : isMourning ? `
      <svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Mourning Candle Glow -->
        <circle cx="600" cy="500" r="350" fill="url(#mournCandleGlow)" />
        <defs>
          <radialGradient id="mournCandleGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25" />
            <stop offset="70%" stop-color="#71717a" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#09090b" stop-opacity="0" />
          </radialGradient>
        </defs>
      </svg>
    ` : ''}
  </div>

  <div class="poster-border"></div>

  <!-- Top Leaders Row -->
  <div class="top-leaders">
    ${leaderCount === 1 ? `
      ${leader1 ? `
        <div class="leader-frame primary">
          <div class="leader-avatar">
            <img src="${leader1.originalUrl}" alt="Primary Leader">
          </div>
        </div>
      ` : ''}
    ` : leaderCount === 2 ? `
      ${leader1 ? `
        <div class="leader-frame primary">
          <div class="leader-avatar">
            <img src="${leader1.originalUrl}" alt="Leader 1">
          </div>
        </div>
      ` : ''}
      ${leader2 ? `
        <div class="leader-frame primary">
          <div class="leader-avatar">
            <img src="${leader2.originalUrl}" alt="Leader 2">
          </div>
        </div>
      ` : ''}
    ` : leaderCount === 3 ? `
      ${leader2 ? `
        <div class="leader-frame">
          <div class="leader-avatar">
            <img src="${leader2.originalUrl}" alt="Leader 2">
          </div>
        </div>
      ` : ''}
      ${leader1 ? `
        <div class="leader-frame primary">
          <div class="leader-avatar">
            <img src="${leader1.originalUrl}" alt="Primary Leader">
          </div>
        </div>
      ` : ''}
      ${leader3 ? `
        <div class="leader-frame">
          <div class="leader-avatar">
            <img src="${leader3.originalUrl}" alt="Leader 3">
          </div>
        </div>
      ` : ''}
    ` : ''}
  </div>

  <!-- Center Content -->
  <div class="center-content">
    ${party ? `<div class="party-banner">${party}</div>` : ''}
    <h1 class="headline">${headline}</h1>
    ${slogan ? `<p class="slogan">${slogan}</p>` : ''}
  </div>

  <!-- Requester Footer -->
  <div class="footer-section">
    <div class="requester-info">
      <div class="credit-badge">প্রচারে</div>
      <h2 class="requester-name">${requesterName}</h2>
      ${designation ? `<div class="requester-designation">${designation}</div>` : ''}
      ${unionThanaDistrict ? `<div class="requester-location">${unionThanaDistrict}</div>` : ''}
    </div>

    ${requesterPhoto ? `
      <div class="requester-avatar">
        <img src="${requesterPhoto.originalUrl}" alt="${requesterName}">
      </div>
    ` : ''}

    <div class="credit-footer-line">${creditLine}</div>
  </div>
</body>
</html>
  `;
};

/**
 * Renders the poster HTML into a high-resolution PNG buffer using Puppeteer.
 */
export const renderPosterImage = async (
  template: ITemplate,
  poster: IPoster,
  scale: number = 2
): Promise<Buffer> => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const { width = 1200, height = 1600 } = template.layoutConfig?.dimensions || {};

    await page.setViewport({
      width,
      height,
      deviceScaleFactor: scale,
    });

    const htmlContent = buildPosterHtml(template, poster);
    await page.setContent(htmlContent, {
      waitUntil: ['load'] as any,
      timeout: 30000,
    });

    // Wait for fonts to be ready
    await page.evaluateHandle('document.fonts.ready');

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });

    return screenshotBuffer as Buffer;
  } finally {
    await page.close();
  }
};

/**
 * Full render pipeline: HTML -> Puppeteer -> Buffer -> Cloudinary -> Update Poster model.
 */
export const processPosterRender = async (posterId: string): Promise<IPoster | null> => {
  const poster = await (await import('../models/Poster.js')).Poster.findById(posterId).populate('templateId');
  if (!poster) throw new Error('Poster not found');

  const template = poster.templateId as unknown as ITemplate;

  try {
    poster.status = 'processing';
    await poster.save();

    // 1. Render standard PNG (scale 1.5 for web display)
    const imageBuffer = await renderPosterImage(template, poster, 1.5);
    const uploadedImage = await uploadBuffer(imageBuffer, `${posterId}_render.png`, 'polipost_renders');

    // 2. Render 300 DPI high-res print export (scale 2.5)
    const highResBuffer = await renderPosterImage(template, poster, 2.5);
    const uploadedHighRes = await uploadBuffer(highResBuffer, `${posterId}_highres.png`, 'polipost_highres');

    poster.generatedImageUrl = uploadedImage.url;
    poster.highResPdfUrl = uploadedHighRes.url;
    poster.thumbnailUrl = uploadedImage.url;
    poster.status = 'completed';
    await poster.save();

    return poster;
  } catch (error: any) {
    poster.status = 'failed';
    poster.error = error.message;
    await poster.save();
    throw error;
  }
};

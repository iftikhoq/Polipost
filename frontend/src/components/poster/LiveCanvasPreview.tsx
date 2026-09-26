'use client';

import React, { useRef, useEffect } from 'react';

export interface PosterData {
  occasionType: string;
  headline: string;
  slogan: string;
  requesterName: string;
  designation: string;
  party: string;
  unionThanaDistrict: string;
  creditLine: string;
  leaderCount?: number; // 0, 1, 2, or 3
  leaderFrameStyle?: 'oval' | 'circle' | 'arch' | 'shield' | 'cutout';
  fontFamily?: string;
  footerStyle?: 'classic' | 'floating' | 'split' | 'minimal' | 'royal';
  candidatePosition?: 'right' | 'left' | 'center';
  footerColorMode?: 'dark' | 'theme' | 'gold' | 'transparent';
}

export interface PhotoData {
  slotId: string;
  originalUrl: string;
  useCutout?: boolean;
}

interface LiveCanvasPreviewProps {
  formData: PosterData;
  photos: PhotoData[];
  bgColor?: string;
  bannerColor?: string;
  templateSlug?: string;
}

/**
 * Traditional Bengali Circular Floral Alpana (আলপনা) for 21st Feb
 */
function drawAlpanaMotif(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;

  // Concentric rings
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
  ctx.arc(0, 0, radius * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // Lotus Petals
  const petals = 12;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.44);
    ctx.quadraticCurveTo(radius * 0.22, radius * 0.72, 0, radius);
    ctx.quadraticCurveTo(-radius * 0.22, radius * 0.72, 0, radius * 0.44);
    ctx.fillStyle = 'rgba(220, 38, 38, 0.28)';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Twin Golden Laurel Wreath for Party Anniversary Gala
 */
function drawLaurelWreath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  gold: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.strokeStyle = gold;
  ctx.fillStyle = gold;
  ctx.lineWidth = 3;

  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(
      side * 90,
      0,
      100,
      side > 0 ? 0.6 * Math.PI : -0.1 * Math.PI,
      side > 0 ? 1.4 * Math.PI : 0.4 * Math.PI
    );
    ctx.stroke();

    for (let t = 0; t <= 5; t++) {
      const theta = 0.75 * Math.PI + (t / 5) * 0.65 * Math.PI;
      const lx = side * 90 + Math.cos(theta) * 100;
      const ly = Math.sin(theta) * 100;
      ctx.beginPath();
      ctx.ellipse(lx, ly, 14, 6, theta + (side * Math.PI) / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Election Ballot Marka Badge for Campaign Rally
 */
function drawBallotSymbolBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  accentColor: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer circular glow
  ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Inner ring
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // "মার্কা" title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('নির্বাচনী মার্কা', 0, -18);

  // Checkmark symbol
  ctx.font = '800 28px "Hind Siliguri", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText('✓', 0, 10);

  ctx.font = 'bold 11px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('ভোট দিন', 0, 26);
  ctx.restore();
}

/**
 * Helper to create leader frame path on canvas based on chosen frame style
 */
function createLeaderPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  style: string
) {
  ctx.beginPath();
  if (style === 'circle') {
    const r = (rx + ry) / 2;
    ctx.arc(x, y, r, 0, Math.PI * 2);
  } else if (style === 'arch') {
    // Royal Arch / Dome: Rounded dome top, vertical straight sides, flat bottom
    const topRadius = rx;
    ctx.moveTo(x - rx, y - ry + topRadius);
    ctx.arc(x, y - ry + topRadius, topRadius, Math.PI, 0, false);
    ctx.lineTo(x + rx, y + ry);
    ctx.lineTo(x - rx, y + ry);
    ctx.closePath();
  } else if (style === 'shield') {
    // Heraldic Shield Crest: Flat/slight arched top, vertical sides curving into pointed bottom
    ctx.moveTo(x - rx, y - ry);
    ctx.lineTo(x + rx, y - ry);
    ctx.lineTo(x + rx, y + ry * 0.25);
    ctx.quadraticCurveTo(x + rx, y + ry * 0.85, x, y + ry * 1.15);
    ctx.quadraticCurveTo(x - rx, y + ry * 0.85, x - rx, y + ry * 0.25);
    ctx.closePath();
  } else if (style === 'cutout') {
    // Cutout Mode: Soft rounded rectangle with aura
    const r = 24;
    ctx.roundRect(x - rx, y - ry, rx * 2, ry * 2, r);
  } else {
    // Default: Royal Golden Oval
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  }
}

/**
 * Draw 5-pointed star helper
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  color: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

/**
 * Draw National Martyrs' Memorial (জাতীয় স্মৃতিসৌধ) Silhouette
 * 7 stepped triangular spires rising symmetrically
 */
function drawNationalMemorial(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number,
  height: number,
  accentColor: string
) {
  ctx.save();
  const tiers = 7;
  for (let i = tiers; i >= 1; i--) {
    const tierRatio = i / tiers;
    const h = height * (0.35 + (1 - tierRatio) * 0.65);
    const w = width * (0.15 + (tierRatio) * 0.85);

    // Left pylon
    ctx.beginPath();
    ctx.moveTo(cx, baseY - h);
    ctx.lineTo(cx - w / 2, baseY);
    ctx.lineTo(cx, baseY);
    ctx.closePath();

    const gradLeft = ctx.createLinearGradient(cx - w / 2, baseY, cx, baseY - h);
    gradLeft.addColorStop(0, 'rgba(4, 57, 39, 0.4)');
    gradLeft.addColorStop(0.7, 'rgba(16, 185, 129, 0.25)');
    gradLeft.addColorStop(1, 'rgba(245, 158, 11, 0.35)');
    ctx.fillStyle = gradLeft;
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Right pylon (with slight shadow shading for 3D monument depth)
    ctx.beginPath();
    ctx.moveTo(cx, baseY - h);
    ctx.lineTo(cx + w / 2, baseY);
    ctx.lineTo(cx, baseY);
    ctx.closePath();

    const gradRight = ctx.createLinearGradient(cx, baseY - h, cx + w / 2, baseY);
    gradRight.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
    gradRight.addColorStop(0.5, 'rgba(5, 150, 105, 0.3)');
    gradRight.addColorStop(1, 'rgba(2, 31, 21, 0.5)');
    ctx.fillStyle = gradRight;
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draw 24-ray dynamic sunburst beams
 */
function drawSunburst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rayCount: number,
  color: string
) {
  ctx.save();
  const step = (Math.PI * 2) / rayCount;
  ctx.fillStyle = color;
  for (let i = 0; i < rayCount; i += 2) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, i * step, (i + 1) * step);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draw solemn black mourning ribbon with gold trim
 */
function drawMourningRibbon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 100;

  // Ribbon loop
  ctx.beginPath();
  ctx.ellipse(0, -20 * s, 26 * s, 36 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 3 * s;
  ctx.stroke();

  // Inner cutout
  ctx.beginPath();
  ctx.ellipse(0, -20 * s, 12 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#18181b';
  ctx.fill();
  ctx.strokeStyle = '#71717a';
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  // Left tail
  ctx.beginPath();
  ctx.moveTo(-16 * s, -5 * s);
  ctx.lineTo(-32 * s, 60 * s);
  ctx.lineTo(-18 * s, 50 * s);
  ctx.lineTo(-4 * s, 60 * s);
  ctx.lineTo(-4 * s, 0);
  ctx.closePath();
  ctx.fillStyle = '#18181b';
  ctx.fill();
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2 * s;
  ctx.stroke();

  // Right tail
  ctx.beginPath();
  ctx.moveTo(4 * s, 0);
  ctx.lineTo(4 * s, 60 * s);
  ctx.lineTo(18 * s, 50 * s);
  ctx.lineTo(32 * s, 60 * s);
  ctx.lineTo(16 * s, -5 * s);
  ctx.closePath();
  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2 * s;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw crescent moon and glowing star for Eid
 */
function drawCrescentAndStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, gold: string) {
  ctx.save();
  ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
  ctx.shadowBlur = 30;

  // Crescent
  ctx.beginPath();
  ctx.arc(cx, cy, r, -0.4 * Math.PI, 0.8 * Math.PI, false);
  ctx.arc(cx + r * 0.45, cy - r * 0.25, r * 0.82, 0.7 * Math.PI, -0.3 * Math.PI, true);
  ctx.closePath();
  ctx.fillStyle = gold;
  ctx.fill();

  // Star
  drawStar(ctx, cx + r * 0.7, cy - r * 0.4, 5, r * 0.35, r * 0.16, gold);
  ctx.restore();
}

/**
 * Draw Central Shaheed Minar & Flying Peace Doves for 21st February
 */
function drawShaheedMinar(ctx: CanvasRenderingContext2D, cx: number, baseY: number, goldColor: string) {
  ctx.save();
  // 1. Glowing Red Sun behind the columns
  const sunGrad = ctx.createRadialGradient(cx, baseY - 220, 20, cx, baseY - 220, 180);
  sunGrad.addColorStop(0, '#ef4444');
  sunGrad.addColorStop(0.75, '#dc2626');
  sunGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(cx, baseY - 220, 180, 0, Math.PI * 2);
  ctx.fill();

  // 2. Base stairs plinth
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx - 240, baseY, 480, 24);
  ctx.fillStyle = '#475569';
  ctx.fillRect(cx - 200, baseY - 16, 400, 16);

  // 3. Central Pylon (slanted backward at top)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 32, baseY - 16);
  ctx.lineTo(cx - 40, baseY - 320);
  ctx.lineTo(cx + 40, baseY - 320);
  ctx.lineTo(cx + 32, baseY - 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Backward roof tilt of central pylon
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(cx - 40, baseY - 320);
  ctx.lineTo(cx - 55, baseY - 390);
  ctx.lineTo(cx + 55, baseY - 390);
  ctx.lineTo(cx + 40, baseY - 320);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 4. Flanking Side Columns (Left & Right pairs)
  const drawColumn = (colX: number, colW: number, colH: number) => {
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.rect(colX - colW / 2, baseY - colH - 16, colW, colH);
    ctx.fill();
    ctx.stroke();
  };

  // Left columns
  drawColumn(cx - 95, 34, 250);
  drawColumn(cx - 150, 28, 190);

  // Right columns
  drawColumn(cx + 95, 34, 250);
  drawColumn(cx + 150, 28, 190);

  // 5. Flying White Peace Doves in sky
  const doves = [
    { x: cx + 240, y: baseY - 340, s: 0.9 },
    { x: cx + 320, y: baseY - 390, s: 0.7 },
    { x: cx + 370, y: baseY - 330, s: 0.6 },
  ];
  doves.forEach((d) => {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.scale(d.s, d.s);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(15, -20, 30, -10);
    ctx.quadraticCurveTo(15, -5, 10, 5);
    ctx.quadraticCurveTo(0, 15, -10, 20);
    ctx.quadraticCurveTo(-15, 5, 0, 0);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

/**
 * Draw Raised Fist of Liberty & Freedom
 */
function drawRaisedFist(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Arm forearm
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.moveTo(-45, 180);
  ctx.lineTo(-35, 30);
  ctx.lineTo(40, 30);
  ctx.lineTo(55, 180);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Clenched Fist Base & Thumb
  ctx.beginPath();
  ctx.ellipse(0, 0, 60, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 4 Folded Finger Knuckles
  for (let i = -3; i <= 3; i += 2) {
    ctx.beginPath();
    ctx.roundRect(i * 16 - 12, -50, 24, 40, 8);
    ctx.fill();
    ctx.stroke();
  }

  // Energy crack fissure lines (electric lightning)
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-15, 140);
  ctx.lineTo(5, 90);
  ctx.lineTo(-10, 50);
  ctx.lineTo(15, 0);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw Cheering Rally Crowd Silhouette
 */
function drawRallyCrowd(ctx: CanvasRenderingContext2D, width: number, baseY: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 44, 34, 0.45)';
  for (let x = 60; x < width - 60; x += 40) {
    const headY = baseY - 60 - (x % 3) * 15;
    // Head
    ctx.beginPath();
    ctx.arc(x, headY, 14, 0, Math.PI * 2);
    ctx.fill();
    // Torso & Raised arms
    ctx.beginPath();
    ctx.moveTo(x - 18, baseY);
    ctx.lineTo(x - 22, headY + 15);
    ctx.lineTo(x - 30, headY - 15); // Left raised hand
    ctx.lineTo(x - 24, headY - 15);
    ctx.lineTo(x - 12, headY + 20);
    ctx.lineTo(x + 12, headY + 20);
    ctx.lineTo(x + 24, headY - 15); // Right raised hand
    ctx.lineTo(x + 30, headY - 15);
    ctx.lineTo(x + 22, headY + 15);
    ctx.lineTo(x + 18, baseY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export const LiveCanvasPreview: React.FC<LiveCanvasPreviewProps> = ({
  formData,
  photos,
  bgColor = '#043927',
  bannerColor = '#c9182b',
  templateSlug,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Internal resolution for crisp 300 DPI preview
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    const occasion = formData.occasionType || 'victory_day';
    const isMourning = occasion === 'mourning';
    const isCampaign = occasion === 'campaign';
    const isEid = occasion === 'eid';
    const isVictory = occasion === 'victory_day';
    const isInternational = occasion === 'international';

    const slug = templateSlug || '';
    const isPopArt = slug === 'pop-art-hope-style' || bgColor === '#003049';
    const isConstructivist = slug === 'constructivist-agitprop-style' || bgColor === '#171717';
    const isSwiss = slug === 'swiss-minimalist-grid' || bgColor === '#f8fafc';
    const isLatin = slug === 'latin-solidarity-mural' || bgColor === '#7c2d12';
    const isLanguageDay =
      slug === 'shaheed-minar-language-day' ||
      formData.headline?.includes('একুশ') ||
      formData.headline?.includes('শহীদ মিনার') ||
      formData.headline?.includes('ভাষা');
    const isFistOfFreedom =
      slug === 'victory-day-fist-of-freedom' ||
      formData.headline?.includes('বজ্রমুষ্টি') ||
      formData.headline?.includes('মুক্তির') ||
      formData.headline?.includes('১৬ই ডিসেম্বর');
    const isAnniversary =
      slug === 'party-anniversary-celebration' ||
      occasion === 'anniversary' ||
      formData.headline?.includes('প্রতিষ্ঠা বার্ষিকী') ||
      formData.headline?.includes('সম্মেলন');
    const isYouthRally =
      slug === 'youth-rally-campaign' ||
      (isCampaign &&
        (formData.headline?.includes('গণজোয়ার') ||
          formData.headline?.includes('মার্কা') ||
          formData.headline?.includes('এক হই')));

    let primaryColor = isMourning ? '#18181b' : bgColor;
    let accentColor = isMourning ? '#52525b' : bannerColor;
    let goldColor = isMourning ? '#a1a1aa' : '#f59e0b';
    let textColor = '#ffffff';
    let sloganColor = '#fef08a';

    if (isPopArt) {
      goldColor = '#fdf0d5';
      sloganColor = '#669bbc';
    } else if (isConstructivist) {
      goldColor = '#ffffff';
      sloganColor = '#f87171';
    } else if (isSwiss) {
      goldColor = '#0284c7';
      textColor = '#0f172a';
      sloganColor = '#475569';
    } else if (isLatin) {
      goldColor = '#fef08a';
      sloganColor = '#fed7aa';
    } else if (isLanguageDay) {
      goldColor = '#dc2626';
      textColor = '#0f172a';
      sloganColor = '#991b1b';
    }

    const leaderCount = formData.leaderCount !== undefined ? formData.leaderCount : 3;
    const frameStyle = formData.leaderFrameStyle || 'oval';
    const chosenFont = formData.fontFamily || 'Anek Bangla';
    const footerStyle = formData.footerStyle || 'classic';
    const candidatePosition = formData.candidatePosition || 'right';
    const footerColorMode = formData.footerColorMode || 'dark';

    // ----------------------------------------------------
    // 1. BASE BACKGROUND & RADICALLY DIFFERENT OCCASION MOTIFS
    // ----------------------------------------------------
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isPopArt) {
      // 3-Tone Pop-Art Color Block background
      ctx.fillStyle = '#669bbc';
      ctx.fillRect(0, 0, width, height * 0.35);
      ctx.fillStyle = '#003049';
      ctx.fillRect(0, height * 0.35, width, height * 0.35);
      ctx.fillStyle = '#780001';
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
    } else if (isConstructivist) {
      gradient.addColorStop(0, '#991b1b');
      gradient.addColorStop(0.5, '#171717');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (isSwiss) {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (isLatin) {
      gradient.addColorStop(0, '#d97706');
      gradient.addColorStop(0.6, '#7c2d12');
      gradient.addColorStop(1, '#451a03');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (isLanguageDay) {
      // Soft marble / pristine off-white for Language Day Shaheed Minar
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.6, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, isMourning ? '#09090b' : '#021f15');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Occasion-Specific Graphic Motifs
    if (isLanguageDay) {
      // Shaheed Minar, Radiant Red Sun, Flying White Doves, and Circular Floral Alpana
      drawShaheedMinar(ctx, width / 2, 870, goldColor);
      drawAlpanaMotif(ctx, width / 2, 890, 85, 'rgba(220, 38, 38, 0.45)');
    } else if (isFistOfFreedom) {
      // 16 December: Clenched Fist of Liberty & Giant Radiant Red Sun
      const sunGradient = ctx.createRadialGradient(width / 2, 540, 40, width / 2, 540, 380);
      sunGradient.addColorStop(0, 'rgba(239, 68, 68, 0.98)');
      sunGradient.addColorStop(0.7, 'rgba(220, 38, 38, 0.65)');
      sunGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width / 2, 540, 380, 0, Math.PI * 2);
      ctx.fill();

      // Angled Dynamic Victory Sash
      ctx.save();
      ctx.fillStyle = 'rgba(220, 38, 38, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, 680);
      ctx.lineTo(width, 480);
      ctx.lineTo(width, 580);
      ctx.lineTo(0, 780);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      drawRaisedFist(ctx, width / 2, 520, 1.3);
    } else if (isVictory) {
      // National Martyrs' Memorial (জাতীয় স্মৃতিসৌধ) 7 stepped triangular spires
      const sunGradient = ctx.createRadialGradient(width / 2, 600, 30, width / 2, 600, 380);
      sunGradient.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
      sunGradient.addColorStop(0.7, 'rgba(220, 38, 38, 0.45)');
      sunGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width / 2, 600, 380, 0, Math.PI * 2);
      ctx.fill();

      drawNationalMemorial(ctx, width / 2, 920, 750, 480, goldColor);

      // Subtle victory laurels on the sides
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 4;
      for (let side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        const startX = width / 2 + side * 420;
        ctx.ellipse(startX, 680, 40, 160, (side * Math.PI) / 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (isAnniversary) {
      // Party Foundation Anniversary: 32-Ray Sunburst & Twin Golden Laurel Wreaths
      drawSunburst(ctx, width / 2, 450, 900, 32, 'rgba(245, 158, 11, 0.18)');
      drawLaurelWreath(ctx, width / 2, 580, 1.4, 'rgba(245, 158, 11, 0.45)');
      drawStar(ctx, 160, 180, 5, 24, 10, '#f59e0b');
      drawStar(ctx, 1040, 180, 5, 24, 10, '#f59e0b');
      drawStar(ctx, 220, 420, 5, 16, 7, '#fef08a');
      drawStar(ctx, 980, 420, 5, 16, 7, '#fef08a');
    } else if (isYouthRally) {
      // Youth Rally: Cheering crowd silhouette + Election Marka badge
      drawSunburst(ctx, width / 2, 450, 900, 24, 'rgba(245, 158, 11, 0.14)');
      drawRallyCrowd(ctx, width, 890);
      drawBallotSymbolBadge(ctx, width - 150, 180, accentColor);

      const stars = [
        { cx: 120, cy: 180, r: 18 },
        { cx: 220, cy: 380, r: 12 },
        { cx: 160, cy: 750, r: 15 },
        { cx: 1040, cy: 750, r: 15 },
      ];
      stars.forEach((st) => drawStar(ctx, st.cx, st.cy, 5, st.r, st.r * 0.45, 'rgba(245, 158, 11, 0.35)'));
    } else if (isCampaign) {
      drawSunburst(ctx, width / 2, 450, 900, 24, 'rgba(245, 158, 11, 0.12)');
      const stars = [
        { cx: 120, cy: 180, r: 18 },
        { cx: 220, cy: 380, r: 12 },
        { cx: 1080, cy: 180, r: 18 },
        { cx: 980, cy: 380, r: 12 },
      ];
      stars.forEach((st) => drawStar(ctx, st.cx, st.cy, 5, st.r, st.r * 0.45, 'rgba(245, 158, 11, 0.35)'));
    } else if (isMourning) {
      // Somber atmospheric glow with mourning ribbon
      const mournGlow = ctx.createRadialGradient(width / 2, 500, 40, width / 2, 500, 500);
      mournGlow.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
      mournGlow.addColorStop(0.5, 'rgba(113, 113, 122, 0.15)');
      mournGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mournGlow;
      ctx.fillRect(0, 0, width, height);

      drawMourningRibbon(ctx, 130, 130, 85);
      drawMourningRibbon(ctx, width - 130, 130, 85);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2, 700);
      ctx.quadraticCurveTo(width / 2 + 25, 760, width / 2, 800);
      ctx.quadraticCurveTo(width / 2 - 25, 760, width / 2, 700);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.fill();
      ctx.restore();
    } else if (isEid) {
      drawCrescentAndStar(ctx, width - 200, 200, 75, 'rgba(245, 158, 11, 0.8)');
      drawSunburst(ctx, width / 2, 500, 600, 16, 'rgba(245, 158, 11, 0.08)');
    } else if (isConstructivist) {
      // Heavy 45° Constructivist scarlet diagonal wedge
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.lineTo(width, height * 0.2);
      ctx.lineTo(width, height * 0.45);
      ctx.lineTo(0, height * 0.95);
      ctx.closePath();
      ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.fill();

      drawStar(ctx, 150, 150, 5, 50, 22, '#dc2626');
      ctx.restore();
    } else if (isSwiss) {
      // Precision grid lines and solid Klein Blue structural bar
      ctx.save();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1.5;
      for (let x = 100; x < width; x += 125) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 100; y < height; y += 150) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Solid International Klein Blue vertical accent line
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(80, 480, 8, 260);
      ctx.restore();
    } else if (isPopArt) {
      drawSunburst(ctx, width / 2, 380, 800, 12, 'rgba(253, 240, 213, 0.15)');
    } else if (isLatin) {
      drawSunburst(ctx, width / 2, 700, 800, 20, 'rgba(245, 158, 11, 0.18)');
    }

    // ----------------------------------------------------
    // 2. DECORATIVE OUTER BORDER
    // ----------------------------------------------------
    if (!isSwiss) {
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = isMourning ? 'rgba(161, 161, 170, 0.4)' : 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([14, 8]);
      ctx.strokeRect(46, 46, width - 92, height - 92);
      ctx.setLineDash([]);

      const corners = [
        { x: 46, y: 46 },
        { x: width - 46, y: 46 },
        { x: 46, y: height - 46 },
        { x: width - 46, y: height - 46 },
      ];
      ctx.fillStyle = goldColor;
      corners.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ----------------------------------------------------
    // 3. TOP LEADER PORTRAITS (0, 1, 2, OR 3 LEADERS)
    // ----------------------------------------------------
    let leaderSlots: Array<{
      id: string;
      x: number;
      y: number;
      rx: number;
      ry: number;
      isPrimary: boolean;
      label: string;
    }> = [];

    if (leaderCount === 1) {
      leaderSlots = [
        { id: 'leader_1', x: 600, y: 225, rx: 130, ry: 165, isPrimary: true, label: 'প্রধান নেতা' },
      ];
    } else if (leaderCount === 2) {
      leaderSlots = [
        { id: 'leader_1', x: 430, y: 225, rx: 105, ry: 135, isPrimary: true, label: 'শীর্ষ নেতা ১' },
        { id: 'leader_2', x: 770, y: 225, rx: 105, ry: 135, isPrimary: true, label: 'শীর্ষ নেতা ২' },
      ];
    } else if (leaderCount === 3) {
      leaderSlots = [
        { id: 'leader_2', x: 310, y: 230, rx: 90, ry: 120, isPrimary: false, label: 'নেতা ২' },
        { id: 'leader_1', x: 600, y: 205, rx: 115, ry: 145, isPrimary: true, label: 'প্রধান নেতা' },
        { id: 'leader_3', x: 890, y: 230, rx: 90, ry: 120, isPrimary: false, label: 'নেতা ৩' },
      ];
    }

    leaderSlots.forEach((slot) => {
      const photo = photos.find((p) => p.slotId === slot.id);

      ctx.save();
      const halo = ctx.createRadialGradient(slot.x, slot.y, slot.rx * 0.4, slot.x, slot.y, slot.rx * 1.4);
      halo.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, slot.rx * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      createLeaderPath(ctx, slot.x, slot.y, slot.rx, slot.ry, frameStyle);
      ctx.clip();

      if (photo && photo.originalUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = photo.originalUrl;
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, slot.x - slot.rx, slot.y - slot.ry, slot.rx * 2, slot.ry * 2);
        } else {
          img.onload = () => {
            ctx.drawImage(img, slot.x - slot.rx, slot.y - slot.ry, slot.rx * 2, slot.ry * 2);
          };
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(slot.x - slot.rx, slot.y - slot.ry, slot.rx * 2, slot.ry * 2);
        }
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(slot.x - slot.rx, slot.y - slot.ry, slot.rx * 2, slot.ry * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = `bold 22px "${chosenFont}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(slot.label, slot.x, slot.y - 5);
        ctx.font = `16px "${chosenFont}", sans-serif`;
        ctx.fillStyle = '#64748b';
        ctx.fillText('ছবি যোগ করুন', slot.x, slot.y + 24);
      }
      ctx.restore();

      createLeaderPath(ctx, slot.x, slot.y, slot.rx, slot.ry, frameStyle);
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = slot.isPrimary ? 8 : 6;
      ctx.stroke();

      if (frameStyle !== 'cutout') {
        createLeaderPath(ctx, slot.x, slot.y, slot.rx - 7, slot.ry - 7, frameStyle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // ----------------------------------------------------
    // 4. CENTRAL CONTENT: DYNAMIC TYPOGRAPHY WITH CHOSEN FONT
    // ----------------------------------------------------
    const verticalShift = leaderCount === 0 ? -120 : 0;
    const bannerY = 460 + verticalShift;
    const headlineY = 590 + verticalShift;
    const sloganBaseY = 670 + verticalShift;

    // Party banner ribbon
    if (formData.party) {
      ctx.font = `bold 30px "${chosenFont}", "Hind Siliguri", sans-serif`;
      const textWidth = ctx.measureText(formData.party).width + 64;

      if (isSwiss) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0284c7';
        ctx.fillText(formData.party, 110, bannerY);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.roundRect(width / 2 - textWidth / 2, bannerY - 35, textWidth, 52, 10);
        ctx.fill();

        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(formData.party, width / 2, bannerY + 2);
      }
    }

    // Headline (Impactful text rendered in selected font)
    const headlineText = formData.headline || 'মহান বিজয় দিবস উপলক্ষে শুভেচ্ছা ও অভিনন্দন';
    const headlineFontSize = isPopArt ? 86 : isSwiss ? 74 : 80;
    ctx.font = `800 ${headlineFontSize}px "${chosenFont}", "Hind Siliguri", sans-serif`;

    if (isSwiss) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(headlineText, 110, headlineY);
    } else {
      ctx.textAlign = 'center';
      if (!isLanguageDay) {
        ctx.fillStyle = '#000000';
        ctx.fillText(headlineText, width / 2 + 3, headlineY + 3); // Crisp drop shadow
      }
      ctx.fillStyle = isLanguageDay ? '#1e293b' : isPopArt ? '#fdf0d5' : '#ffffff';
      ctx.fillText(headlineText, width / 2, headlineY);
    }

    // Slogan (Dynamic color and chosen font)
    if (formData.slogan) {
      ctx.font = `600 32px "${chosenFont}", "Hind Siliguri", sans-serif`;
      ctx.fillStyle = sloganColor;

      const words = formData.slogan.split(' ');
      let line = '';
      let lineY = sloganBaseY;
      const maxWidth = isSwiss ? 840 : 960;

      if (isSwiss) {
        ctx.textAlign = 'left';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 110, lineY);
            line = words[n] + ' ';
            lineY += 46;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 110, lineY);
      } else {
        ctx.textAlign = 'center';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, width / 2, lineY);
            line = words[n] + ' ';
            lineY += 46;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, width / 2, lineY);
      }
    }

    // ----------------------------------------------------
    // 5. CUSTOMIZABLE BOTTOM SECTION
    // footerStyle: classic | floating | split | minimal | royal
    // candidatePosition: right | left | center
    // footerColorMode: dark | theme | gold | transparent
    // ----------------------------------------------------
    let footerX = 0;
    let footerY = height - 320;
    let footerW = width;
    let footerH = 320;
    let footerRadius = 0;

    if (footerStyle === 'floating') {
      footerX = 40;
      footerY = height - 305;
      footerW = width - 80;
      footerH = 265;
      footerRadius = 24;
    } else if (footerStyle === 'minimal') {
      footerX = 35;
      footerY = height - 280;
      footerW = width - 70;
      footerH = 240;
      footerRadius = 14;
    } else if (footerStyle === 'royal') {
      footerX = 0;
      footerY = height - 330;
      footerW = width;
      footerH = 330;
      footerRadius = 0;
    }

    // Determine background fill per color mode
    let bgFill: string | CanvasGradient = 'rgba(0, 0, 0, 0.92)';
    if (footerColorMode === 'theme') {
      bgFill = primaryColor;
    } else if (footerColorMode === 'gold') {
      const goldGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
      goldGrad.addColorStop(0, '#78350f');
      goldGrad.addColorStop(0.5, '#451a03');
      goldGrad.addColorStop(1, '#1e0c03');
      bgFill = goldGrad;
    } else if (footerColorMode === 'transparent') {
      bgFill = 'rgba(15, 23, 42, 0.55)';
    }

    // Render footer background panel
    ctx.save();
    ctx.beginPath();
    if (footerRadius > 0) {
      ctx.roundRect(footerX, footerY, footerW, footerH, footerRadius);
    } else {
      ctx.rect(footerX, footerY, footerW, footerH);
    }
    ctx.fillStyle = bgFill;
    ctx.fill();

    // Border and Accent details per footerStyle
    if (footerStyle === 'floating') {
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 4;
      ctx.stroke();
    } else if (footerStyle === 'minimal') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (footerStyle === 'royal') {
      // Double Royal Golden Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(width, footerY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, footerY + 8);
      ctx.lineTo(width, footerY + 8);
      ctx.stroke();
    } else if (footerStyle === 'split') {
      // Split Hero Panel: Contrasting angled polygon behind candidate
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      if (candidatePosition === 'left') {
        ctx.moveTo(0, footerY);
        ctx.lineTo(380, footerY);
        ctx.lineTo(310, height);
        ctx.lineTo(0, height);
      } else {
        ctx.moveTo(width - 380, footerY);
        ctx.lineTo(width, footerY);
        ctx.lineTo(width, height);
        ctx.lineTo(width - 310, height);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(width, footerY);
      ctx.stroke();
    } else {
      // Classic default top border
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(width, footerY);
      ctx.stroke();
    }
    ctx.restore();

    // Candidate Photo Box Placement
    const reqBoxW = 210;
    const reqBoxH = footerStyle === 'minimal' ? 200 : 250;
    let reqBoxX = footerX + footerW - reqBoxW - 40;
    let reqBoxY = footerY + 25;
    let textStartX = footerX + 50;

    if (candidatePosition === 'left') {
      reqBoxX = footerX + 40;
      reqBoxY = footerY + 25;
      textStartX = reqBoxX + reqBoxW + 45;
    } else if (candidatePosition === 'center') {
      reqBoxX = width / 2 - reqBoxW / 2;
      reqBoxY = footerY - 40; // Hero breakout
    }

    // Render Requester Details (Name, Designation, Location)
    ctx.save();
    if (candidatePosition === 'center') {
      // Centered layout around candidate
      ctx.textAlign = 'center';

      // Badge
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 60, footerY + reqBoxH - 15, 120, 32, 6);
      ctx.fill();

      ctx.font = `800 18px "${chosenFont}", sans-serif`;
      ctx.fillStyle = '#000000';
      ctx.fillText('প্রচারে', width / 2, footerY + reqBoxH + 7);

      // Name
      ctx.font = `800 46px "${chosenFont}", "Hind Siliguri", sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(formData.requesterName || 'আপনার নাম', width / 2, footerY + reqBoxH + 55);

      // Designation & District
      if (formData.designation || formData.unionThanaDistrict) {
        ctx.font = `600 24px "${chosenFont}", sans-serif`;
        ctx.fillStyle = '#fef08a';
        const info = [formData.designation, formData.unionThanaDistrict].filter(Boolean).join(' • ');
        ctx.fillText(info, width / 2, footerY + reqBoxH + 90);
      }
    } else {
      // Left or Right aligned layout
      ctx.textAlign = 'left';

      // "প্রচারে" Badge
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.roundRect(textStartX, footerY + 30, 110, 34, 6);
      ctx.fill();

      ctx.font = `800 20px "${chosenFont}", sans-serif`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('প্রচারে', textStartX + 55, footerY + 54);

      // Requester Name
      ctx.textAlign = 'left';
      ctx.font = `800 50px "${chosenFont}", "Hind Siliguri", sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(formData.requesterName || 'আপনার নাম', textStartX, footerY + 120);

      // Requester Designation
      if (formData.designation) {
        ctx.font = `600 28px "${chosenFont}", sans-serif`;
        ctx.fillStyle = '#fef08a';
        ctx.fillText(formData.designation, textStartX, footerY + 165);
      }

      // Requester Location
      if (formData.unionThanaDistrict) {
        ctx.font = `500 24px "${chosenFont}", sans-serif`;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(formData.unionThanaDistrict, textStartX, footerY + 205);
      }
    }

    // Footer Credit Line
    ctx.textAlign = 'center';
    ctx.font = `15px "${chosenFont}", sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      formData.creditLine || 'প্রচারে: এলাকাবাসী ও দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ',
      width / 2,
      height - 18
    );
    ctx.restore();

    // Requester Photo Frame
    const reqPhoto = photos.find((p) => p.slotId === 'requester');

    ctx.save();
    ctx.beginPath();
    if (frameStyle === 'circle') {
      const cr = Math.min(reqBoxW, reqBoxH) / 2;
      ctx.arc(reqBoxX + reqBoxW / 2, reqBoxY + reqBoxH / 2, cr, 0, Math.PI * 2);
    } else if (frameStyle === 'shield') {
      const rx = reqBoxW / 2;
      const ry = reqBoxH / 2;
      const cx = reqBoxX + rx;
      const cy = reqBoxY + ry;
      ctx.moveTo(cx - rx, cy - ry);
      ctx.lineTo(cx + rx, cy - ry);
      ctx.lineTo(cx + rx, cy + ry * 0.25);
      ctx.quadraticCurveTo(cx + rx, cy + ry * 0.85, cx, cy + ry * 1.05);
      ctx.quadraticCurveTo(cx - rx, cy + ry * 0.85, cx - rx, cy + ry * 0.25);
      ctx.closePath();
    } else {
      ctx.roundRect(reqBoxX, reqBoxY, reqBoxW, reqBoxH, 16);
    }
    ctx.clip();

    if (reqPhoto && reqPhoto.originalUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = reqPhoto.originalUrl;
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, reqBoxX, reqBoxY, reqBoxW, reqBoxH);
      } else {
        img.onload = () => {
          ctx.drawImage(img, reqBoxX, reqBoxY, reqBoxW, reqBoxH);
        };
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(reqBoxX, reqBoxY, reqBoxW, reqBoxH);
      }
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(reqBoxX, reqBoxY, reqBoxW, reqBoxH);
      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold 22px "${chosenFont}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('প্রার্থীর ছবি', reqBoxX + reqBoxW / 2, reqBoxY + reqBoxH / 2);
    }
    ctx.restore();

    // Outer photo frame border
    ctx.beginPath();
    if (frameStyle === 'circle') {
      const cr = Math.min(reqBoxW, reqBoxH) / 2;
      ctx.arc(reqBoxX + reqBoxW / 2, reqBoxY + reqBoxH / 2, cr, 0, Math.PI * 2);
    } else if (frameStyle === 'shield') {
      const rx = reqBoxW / 2;
      const ry = reqBoxH / 2;
      const cx = reqBoxX + rx;
      const cy = reqBoxY + ry;
      ctx.moveTo(cx - rx, cy - ry);
      ctx.lineTo(cx + rx, cy - ry);
      ctx.lineTo(cx + rx, cy + ry * 0.25);
      ctx.quadraticCurveTo(cx + rx, cy + ry * 0.85, cx, cy + ry * 1.05);
      ctx.quadraticCurveTo(cx - rx, cy + ry * 0.85, cx - rx, cy + ry * 0.25);
      ctx.closePath();
    } else {
      ctx.roundRect(reqBoxX, reqBoxY, reqBoxW, reqBoxH, 16);
    }
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 5;
    ctx.stroke();
  }, [formData, photos, bgColor, bannerColor, templateSlug]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[480px] aspect-[3/4] bg-surface rounded-2xl overflow-hidden poster-canvas-shadow border border-border">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block select-none"
        />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase border border-white/10">
          রিয়েল-টাইম প্রিভিউ
        </div>
      </div>
      <p className="text-xs text-text-subtle mt-2 font-bangla text-center">
        এখানে দেখা প্রিভিউটি একটি খসড়া। এআই জেনারেশনের পর ৩০০ ডিপিআই প্রিন্ট-রেডি ফরম্যাটে রপ্তানি হবে।
      </p>
    </div>
  );
};

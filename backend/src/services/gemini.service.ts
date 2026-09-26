import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';

let genAI: GoogleGenerativeAI | null = null;
if (ENV.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
}

// Authentic fallback slogans for Bangladeshi political occasions
const DEFAULT_SLOGANS: Record<string, string[]> = {
  victory_day: [
    'লাখো শহীদের রক্তে অর্জিত স্বাধীন বাংলাদেশে বিজয়ের শুভেচ্ছা।',
    'রক্তে রাঙানো ১৬ই ডিসেম্বর—বীর শহীদদের প্রতি বিনম্র শ্রদ্ধা।',
    'বিজয়ের চেতনায় গড়ে তুলি একটি সুখী ও সমৃদ্ধ বাংলাদেশ।',
    'স্বাধীনতার গৌরবময় বিজয় দিবসে দেশবাসীকে আন্তরিক অভিনন্দন।',
  ],
  mourning: [
    'বিনম্র শ্রদ্ধা ও ভালোবাসায় স্মরণ করছি আমাদের প্রিয় নেতাকে।',
    'আপনার আদর্শ ও আত্মত্যাগ চিরকাল আমাদের পথ দেখাবে।',
    'বীর শহীদদের স্মরণে আমরা চির কৃতজ্ঞ ও বিনম্র।',
    'হারানো অভিভাবকের স্মৃতিতে গভীর শোক ও শ্রদ্ধাঞ্জলি।',
  ],
  campaign: [
    'জনগণের অধিকার ও গণতন্ত্রের পুনর্জাগরণে এগিয়ে চলুন।',
    'উন্নয়ন, অগ্রগতি ও জনগণের কল্যাণে আমাদের অঙ্গীকার।',
    'শান্তি, শৃঙ্খলা ও জনগণের সেবায় নিবেদিত প্রাণ।',
    'দেশ ও দশের সেবায় সততা ও সাহসের প্রতীক।',
  ],
  greetings: [
    'সকল স্তরের জনগণকে জানাই আন্তরিক অভিনন্দন ও শুভেচ্ছা।',
    'ঐক্য, সংহতি ও ভ্রাতৃত্বের বন্ধনে এগিয়ে যাক আমাদের প্রিয় মাতৃভূমি।',
    'নতুন দিনের প্রত্যয়ে সবাইকে জানাই আন্তরিক সালাম ও অভিনন্দন।',
  ],
  eid: [
    'পবিত্র ঈদুল ফিতরের আনন্দ ছড়িয়ে পড়ুক প্রতিটি ঘরে—ঈদ মোবারক!',
    'ত্যাগের মহিমায় ভাস্বর পবিত্র ঈদুল আযহার আন্তরিক শুভেচ্ছা।',
    'ঈদ বয়ে আনুক সবার জীবনে অনাবিল শান্তি, সমৃদ্ধি ও সৌহার্দ্য।',
  ],
};

export interface GeminiSuggestionResult {
  slogans: string[];
  colorHarmony?: string;
  themeNotes?: string;
}

export const generateSlogansAndTheme = async (params: {
  occasionType: string;
  headline: string;
  party?: string;
  requesterName?: string;
  designation?: string;
}): Promise<GeminiSuggestionResult> => {
  const fallback = {
    slogans: DEFAULT_SLOGANS[params.occasionType] || DEFAULT_SLOGANS.greetings,
    colorHarmony: 'Bangladesh Green & Red with Gold Accents',
    themeNotes: 'Traditional political banner style with top leader hierarchy and prominent requester footer.',
  };

  if (!genAI || !ENV.GEMINI_API_KEY) {
    return fallback;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are an expert Bangladeshi political campaign designer and copywriter.
Generate authentic, inspiring Bangla slogans and design recommendations for a traditional political poster.

Parameters:
- Occasion: ${params.occasionType}
- Headline: ${params.headline}
- Party / Org: ${params.party || 'Neutral / Patriotic'}
- Candidate / Requester: ${params.requesterName || 'Worker'} (${params.designation || 'Leader'})

Return a valid JSON object matching this schema ONLY:
{
  "slogans": ["3 to 4 punchy, respectful, authentic Bangla slogans suitable for the poster body"],
  "colorHarmony": "A suggested color palette (e.g. Deep Forest Green #006a4e, Ruby Red #f42a41, Gold)",
  "themeNotes": "1-2 sentences on visual layout advice"
}
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return {
      slogans: Array.isArray(parsed.slogans) && parsed.slogans.length > 0 ? parsed.slogans : fallback.slogans,
      colorHarmony: parsed.colorHarmony || fallback.colorHarmony,
      themeNotes: parsed.themeNotes || fallback.themeNotes,
    };
  } catch (error) {
    console.warn('[GeminiService] Error calling Gemini API, falling back to default slogans:', error);
    return fallback;
  }
};

export const moderateContent = async (text: string): Promise<{ isSafe: boolean; reason?: string }> => {
  if (!text || text.trim().length === 0) return { isSafe: true };

  // Quick heuristic regex check for common hate terms or offensive language
  const prohibitedPatterns = [
    /\b(kill|murder|attack|bomb|terror)\b/i,
  ];

  for (const pattern of prohibitedPatterns) {
    if (pattern.test(text)) {
      return { isSafe: false, reason: 'Content flagged by security filter' };
    }
  }

  return { isSafe: true };
};

export interface FullPosterAiResponse {
  occasionType: string;
  recommendedTemplateSlug: string;
  headline: string;
  slogan: string;
  party: string;
  requesterName: string;
  designation: string;
  unionThanaDistrict: string;
  creditLine: string;
  leaderCount: number;
  leaderFrameStyle: 'oval' | 'circle' | 'arch' | 'shield' | 'cutout';
  bgColor: string;
  bannerColor: string;
  fontFamily: string;
  footerStyle: 'classic' | 'floating' | 'split' | 'minimal' | 'royal';
  candidatePosition: 'right' | 'left' | 'center';
  footerColorMode: 'dark' | 'theme' | 'gold' | 'transparent';
  aiExplanation?: string;
}

/**
 * Uses Gemini to generate complete poster copy, style, and layout recommendations from a simple natural language prompt.
 */
export const generateFullPosterWithGemini = async (
  userPrompt: string,
  userProfile?: { name?: string; email?: string }
): Promise<FullPosterAiResponse> => {
  const p = userPrompt.toLowerCase();

  // Intelligent fallback presets if Gemini key is missing or API errors
  let fallback: FullPosterAiResponse = {
    occasionType: 'victory_day',
    recommendedTemplateSlug: 'victory-day-memorial',
    headline: 'মহান বিজয় দিবস উপলক্ষে আন্তরিক শুভেচ্ছা ও অভিনন্দন',
    slogan: 'লাখো শহীদের রক্তে অর্জিত স্বাধীন বাংলাদেশে বিজয়ের আনন্দ চির অম্লান হোক।',
    party: 'বাংলাদেশ জাতীয়তাবাদী দল',
    requesterName: userProfile?.name || 'আপনার নাম',
    designation: 'সভাপতি / কর্মী',
    unionThanaDistrict: 'ঢাকা মহানগর',
    creditLine: 'প্রচারে: এলাকাবাসী ও দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ',
    leaderCount: 3,
    leaderFrameStyle: 'oval',
    bgColor: '#043927',
    bannerColor: '#c9182b',
    fontFamily: 'Anek Bangla',
    footerStyle: 'classic',
    candidatePosition: 'right',
    footerColorMode: 'dark',
    aiExplanation: 'মহান বিজয় দিবসের জন্য স্মৃতিসৌধ ও লাল সূর্য থিমের ক্লাসিক ৩-নেতা লেআউট প্রস্তুত করা হয়েছে।',
  };

  if (p.includes('একুশ') || p.includes('শহীদ মিনার') || p.includes('ভাষা দিবস') || p.includes('ফেব্রুয়ারি')) {
    fallback = {
      occasionType: 'mourning',
      recommendedTemplateSlug: 'shaheed-minar-language-day',
      headline: 'অমর একুশে ফেব্রুয়ারি আন্তর্জাতিক মাতৃভাষা দিবস',
      slogan: 'রক্তে রাঙানো একুশের চেতনায় সকল ভাষা শহীদদের প্রতি বিনম্র শ্রদ্ধাঞ্জলি।',
      party: 'বাংলাদেশ আওয়ামী লীগ',
      requesterName: userProfile?.name || 'আপনার নাম',
      designation: 'যুগ্ম সাধারণ সম্পাদক',
      unionThanaDistrict: 'ঢাকা মহানগর',
      creditLine: 'প্রচারে: দলীয় সর্বস্তরের নেতাকর্মী ও ভাষা প্রেমী জনতা',
      leaderCount: 1,
      leaderFrameStyle: 'oval',
      bgColor: '#f8fafc',
      bannerColor: '#991b1b',
      fontFamily: 'Tiro Bangla',
      footerStyle: 'minimal',
      candidatePosition: 'right',
      footerColorMode: 'theme',
      aiExplanation: 'একুশে ফেব্রুয়ারির জন্য আধুনিক স্মৃতিস্তম্ভ ও শোকস্তব্ধ সাদা-কালো থিম নির্ধারণ করা হয়েছে।',
    };
  } else if (p.includes('নির্বাচন') || p.includes('ভোট') || p.includes('মার্কা') || p.includes('চেয়ারম্যান') || p.includes('প্রার্থী')) {
    fallback = {
      occasionType: 'campaign',
      recommendedTemplateSlug: 'youth-rally-campaign',
      headline: 'আসন্ন নির্বাচনে আপনার মূল্যবান ভোট দিয়ে জয়যুক্ত করুন',
      slogan: 'সততা, সাহসিকতা ও উন্নয়নের প্রত্যয়ে জনগণের কল্যাণে নিবেদিত প্রাণ।',
      party: 'গণঅধিকার পরিষদ / স্বতন্ত্র',
      requesterName: userProfile?.name || 'আপনার নাম',
      designation: 'চেয়ারম্যান / কাউন্সিলর পদপ্রার্থী',
      unionThanaDistrict: 'সাভার, ঢাকা',
      creditLine: 'প্রচারে: ইউনিয়নবাসী ও তরুণ প্রজন্মের সমাজসেবকবৃন্দ',
      leaderCount: 0,
      leaderFrameStyle: 'cutout',
      bgColor: '#065f46',
      bannerColor: '#dc2626',
      fontFamily: 'Anek Bangla',
      footerStyle: 'split',
      candidatePosition: 'left',
      footerColorMode: 'theme',
      aiExplanation: 'নির্বাচনী প্রচারণার জন্য হিরো ক্যান্ডিডেট কাটআউট ও শক্তিশালী স্লোগান যুক্ত করা হয়েছে।',
    };
  } else if (p.includes('প্রতিষ্ঠা বার্ষিকী') || p.includes('সম্মেলন') || p.includes('কাউন্সিল')) {
    fallback = {
      occasionType: 'anniversary',
      recommendedTemplateSlug: 'party-anniversary-celebration',
      headline: 'গৌরব, ঐতিহ্য ও সংগ্রামের প্রতিষ্ঠা বার্ষিকী সফল হোক',
      slogan: 'ঐতিহাসিক পথচলায় গণমানুষের অধিকার আদায়ের অবিচল প্রত্যয়।',
      party: 'জাতীয় পার্টি / দলীয় ফোরাম',
      requesterName: userProfile?.name || 'আপনার নাম',
      designation: 'সাংগঠনিক সম্পাদক',
      unionThanaDistrict: 'চট্টগ্রাম বিভাগ',
      creditLine: 'প্রচারে: দলীয় সর্বস্তরের নেতাকর্মী ও শুভাকাঙ্ক্ষীবৃন্দ',
      leaderCount: 2,
      leaderFrameStyle: 'arch',
      bgColor: '#064e3b',
      bannerColor: '#f59e0b',
      fontFamily: 'Noto Serif Bengali',
      footerStyle: 'royal',
      candidatePosition: 'right',
      footerColorMode: 'gold',
      aiExplanation: 'দলীয় প্রতিষ্ঠা বার্ষিকীর জন্য রয়েল আর্চ ফ্রেম ও সোনালী শিরোনাম নির্ধারণ করা হয়েছে।',
    };
  } else if (p.includes('বজ্রমুষ্টি') || p.includes('১৬ই ডিসেম্বর') || p.includes('বীর মুক্তিযোদ্ধা')) {
    fallback = {
      occasionType: 'victory_day',
      recommendedTemplateSlug: 'victory-day-fist-of-freedom',
      headline: '১৬ই ডিসেম্বর মহান বিজয় দিবসে বীর মুক্তিযোদ্ধাদের লাল সালাম',
      slogan: 'রক্তের দামে কেনা স্বাধীনতা—অন্যায়ের বিরুদ্ধে সদা সোচ্চার জাগ্রত জনতা।',
      party: 'জাতীয় নাগরিক কমিটি / যুবদল',
      requesterName: userProfile?.name || 'আপনার নাম',
      designation: 'সদস্য সচিব',
      unionThanaDistrict: 'ঢাকা মহানগর',
      creditLine: 'প্রচারে: বিপ্লবী ছাত্র-জনতা ও সর্বস্তরের দেশপ্রেমিক নাগরিকবৃন্দ',
      leaderCount: 1,
      leaderFrameStyle: 'shield',
      bgColor: '#022c22',
      bannerColor: '#dc2626',
      fontFamily: 'Mina',
      footerStyle: 'floating',
      candidatePosition: 'right',
      footerColorMode: 'dark',
      aiExplanation: 'সাহসী বজ্রমুষ্টি ও লাল-সবুজ পতাকার থিম নির্বাচন করা হয়েছে।',
    };
  }

  if (!genAI || !ENV.GEMINI_API_KEY) {
    return fallback;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are an expert Bangladeshi political campaign director, visual strategist, and master Bangla copywriter.
A user wants to generate a complete political poster based on their prompt:
"${userPrompt}"

User context: Name: "${userProfile?.name || ''}", Email: "${userProfile?.email || ''}".

Available Template Slugs:
1. "victory-day-memorial" (Classic Victory Day with National Martyrs' Memorial spires & red sun)
2. "victory-day-fist-of-freedom" (Powerful 16 December fist of liberty & red sun)
3. "shaheed-minar-language-day" (21st February Mother Language Day with Shaheed Minar silhouette & doves)
4. "memorial-tribute" (Solemn tribute/mourning with black ribbon)
5. "election-campaign-banner" (Classic election campaign banner with sunburst rays)
6. "youth-rally-campaign" (Grassroots candidate rally with election mark/symbol)
7. "party-anniversary-celebration" (Party foundation anniversary with gold/red embossed lettering)
8. "pop-art-hope-style" (Shepard Fairey 4-tone Pop Art Hope style)
9. "constructivist-agitprop-style" (Soviet Constructivist diagonal wedge)
10. "swiss-minimalist-grid" (Swiss modernist objective grid)
11. "latin-solidarity-mural" (Latin American solidarity sunrise mural)

Occasion Types: "victory_day", "mourning", "campaign", "greetings", "eid", "anniversary", "international".
Leader counts: 0 (candidate only), 1 (single hero), 2 (balanced duo), 3 (classic trio).
Leader frame styles: "oval", "circle", "arch", "shield", "cutout".
Font Families: "Anek Bangla" (Bold/Impact), "Hind Siliguri" (Classic/Press), "Tiro Bangla" (Traditional/Serif), "Noto Serif Bengali" (Royal/Dignified), "Mina" (Dynamic/Calligraphic).
Footer Styles: "classic" (Dark bottom bar), "floating" (Curved floating card), "split" (Hero candidate on side with banner), "minimal" (Clean line divider), "royal" (Gold gradient crest).
Candidate Positions: "right", "left", "center".
Footer Color Modes: "dark", "theme", "gold", "transparent".

Analyze the user's intent and generate a complete, authentic JSON configuration:
{
  "occasionType": "one of the allowed occasion types",
  "recommendedTemplateSlug": "one of the available template slugs above",
  "headline": "Punchy, culturally authentic Bangla headline (10-15 words max)",
  "slogan": "Inspiring, poetic, rhythmic political slogan in Bangla (15-25 words)",
  "party": "Relevant political party/organization name in Bangla (e.g. বাংলাদেশ জাতীয়তাবাদী দল, বাংলাদেশ আওয়ামী লীগ, গণঅধিকার পরিষদ, etc.)",
  "requesterName": "Candidate or user name in Bangla",
  "designation": "Political designation in Bangla (e.g. সভাপতি, সাধারণ সম্পাদক, চেয়ারম্যান পদপ্রার্থী)",
  "unionThanaDistrict": "Location in Bangla (e.g. ঢাকা মহানগর, গুলশান, সাভার)",
  "creditLine": "Publicity attribution in Bangla (e.g. প্রচারে: দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ)",
  "leaderCount": 1 or 2 or 3 or 0,
  "leaderFrameStyle": "oval" or "circle" or "arch" or "shield" or "cutout",
  "bgColor": "Hex color code",
  "bannerColor": "Hex color code",
  "fontFamily": "Anek Bangla" or "Hind Siliguri" or "Tiro Bangla" or "Noto Serif Bengali" or "Mina",
  "footerStyle": "classic" or "floating" or "split" or "minimal" or "royal",
  "candidatePosition": "right" or "left" or "center",
  "footerColorMode": "dark" or "theme" or "gold" or "transparent",
  "aiExplanation": "A short, polite 1-sentence note in Bangla explaining the creative choices made."
}
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(result.response.text());
    return {
      occasionType: parsed.occasionType || fallback.occasionType,
      recommendedTemplateSlug: parsed.recommendedTemplateSlug || fallback.recommendedTemplateSlug,
      headline: parsed.headline || fallback.headline,
      slogan: parsed.slogan || fallback.slogan,
      party: parsed.party || fallback.party,
      requesterName: parsed.requesterName || fallback.requesterName,
      designation: parsed.designation || fallback.designation,
      unionThanaDistrict: parsed.unionThanaDistrict || fallback.unionThanaDistrict,
      creditLine: parsed.creditLine || fallback.creditLine,
      leaderCount: typeof parsed.leaderCount === 'number' ? parsed.leaderCount : fallback.leaderCount,
      leaderFrameStyle: parsed.leaderFrameStyle || fallback.leaderFrameStyle,
      bgColor: parsed.bgColor || fallback.bgColor,
      bannerColor: parsed.bannerColor || fallback.bannerColor,
      fontFamily: parsed.fontFamily || fallback.fontFamily,
      footerStyle: parsed.footerStyle || fallback.footerStyle,
      candidatePosition: parsed.candidatePosition || fallback.candidatePosition,
      footerColorMode: parsed.footerColorMode || fallback.footerColorMode,
      aiExplanation: parsed.aiExplanation || 'জেমিনি এআই সফলভাবে আপনার সম্পূর্ণ পোস্টার ডিজাইন করেছে!',
    };
  } catch (err) {
    console.warn('[GeminiService] Error generating full poster, using fallback:', err);
    return fallback;
  }
};

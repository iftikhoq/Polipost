import { Response } from 'express';
import { z } from 'zod';
import { Poster } from '../models/Poster.js';
import { Template } from '../models/Template.js';
import { GenerationLog } from '../models/GenerationLog.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateSlogansAndTheme, moderateContent, generateFullPosterWithGemini } from '../services/gemini.service.js';
import { renderPosterImage } from '../services/render.service.js';
import { uploadBuffer } from '../services/storage.service.js';

const createPosterSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  formData: z.object({
    occasionType: z.string().min(1, 'Occasion type is required'),
    headline: z.string().min(1, 'Headline is required'),
    slogan: z.string().optional().default(''),
    requesterName: z.string().min(1, 'Requester name is required'),
    designation: z.string().optional().default(''),
    party: z.string().optional().default(''),
    unionThanaDistrict: z.string().optional().default(''),
    creditLine: z.string().optional().default('প্রচারে: এলাকাবাসী ও দলীয় সর্বস্তরের নেতাকর্মীবৃন্দ'),
  }),
  uploadedPhotos: z
    .array(
      z.object({
        slotId: z.string(),
        originalUrl: z.string().url('Invalid photo URL'),
        cutoutUrl: z.string().optional(),
        useCutout: z.boolean().optional().default(false),
        zoom: z.number().optional().default(1),
        offsetX: z.number().optional().default(0),
        offsetY: z.number().optional().default(0),
      })
    )
    .optional()
    .default([]),
});

export const createPoster = async (req: AuthRequest, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const parsed = createPosterSchema.parse(req.body);

    const template = await Template.findById(parsed.templateId);
    if (!template) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    // Moderation check
    const combinedText = `${parsed.formData.headline} ${parsed.formData.slogan} ${parsed.formData.requesterName}`;
    const moderation = await moderateContent(combinedText);
    if (!moderation.isSafe) {
      res.status(400).json({
        success: false,
        message: 'Your poster text violated our content moderation guidelines.',
      });
      return;
    }

    // AI suggestions if slogan is empty or generic
    let aiSuggestions = {};
    if (!parsed.formData.slogan || parsed.formData.slogan.trim() === '') {
      const suggestions = await generateSlogansAndTheme({
        occasionType: parsed.formData.occasionType,
        headline: parsed.formData.headline,
        party: parsed.formData.party,
        requesterName: parsed.formData.requesterName,
        designation: parsed.formData.designation,
      });

      aiSuggestions = {
        suggestedSlogans: suggestions.slogans,
        colorThemeNotes: suggestions.themeNotes,
      };

      if (suggestions.slogans.length > 0) {
        parsed.formData.slogan = suggestions.slogans[0];
      }
    }

    // Create draft poster record
    const poster = await Poster.create({
      userId: req.user._id,
      templateId: template._id,
      formData: parsed.formData,
      uploadedPhotos: parsed.uploadedPhotos,
      aiSuggestions,
      status: 'processing',
    });

    // Render image server-side
    try {
      const imageBuffer = await renderPosterImage(template, poster);
      const uploadRes = await uploadBuffer(imageBuffer, `${poster._id}_render.png`, 'polipost_renders');
      poster.generatedImageUrl = uploadRes.url;
      poster.status = 'completed';
      await poster.save();

      // Log generation metrics
      await GenerationLog.create({
        posterId: poster._id,
        userId: req.user._id,
        promptUsed: parsed.formData.headline,
        tokensUsed: 150,
        renderLatencyMs: Date.now() - startTime,
        success: true,
      });

      res.status(201).json({
        success: true,
        message: 'Poster generated successfully',
        poster,
      });
    } catch (renderError: any) {
      console.error('[RenderError]', renderError);
      poster.status = 'failed';
      poster.error = renderError.message || 'Render failed';
      await poster.save();

      res.status(500).json({
        success: false,
        message: 'Poster rendering failed',
        error: renderError.message,
        poster,
      });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPosterById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poster = await Poster.findById(id).populate('templateId');

    if (!poster) {
      res.status(404).json({ success: false, message: 'Poster not found' });
      return;
    }

    res.status(200).json({
      success: true,
      poster,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPosters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const posters = await Poster.find({ userId: req.user._id })
      .populate('templateId', 'title occasionType thumbnailUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posters.length,
      posters,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const regeneratePoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poster = await Poster.findById(id);

    if (!poster) {
      res.status(404).json({ success: false, message: 'Poster not found' });
      return;
    }

    if (poster.retryCount >= 5) {
      res.status(400).json({ success: false, message: 'Maximum regeneration limit reached' });
      return;
    }

    const template = await Template.findById(poster.templateId);
    if (!template) {
      res.status(404).json({ success: false, message: 'Associated template not found' });
      return;
    }

    // Update fields if provided
    if (req.body.formData) {
      poster.formData = { ...poster.formData, ...req.body.formData };
    }
    if (req.body.uploadedPhotos) {
      poster.uploadedPhotos = req.body.uploadedPhotos;
    }

    poster.status = 'processing';
    poster.retryCount += 1;
    await poster.save();

    const imageBuffer = await renderPosterImage(template, poster);
    const uploadRes = await uploadBuffer(imageBuffer, `${poster._id}_render.png`, 'polipost_renders');
    poster.generatedImageUrl = uploadRes.url;
    poster.status = 'completed';
    await poster.save();

    res.status(200).json({
      success: true,
      message: 'Poster regenerated successfully',
      poster,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poster = await Poster.findById(id);

    if (!poster) {
      res.status(404).json({ success: false, message: 'Poster not found' });
      return;
    }

    await poster.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Poster deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAiSlogans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { occasionType, headline, party, requesterName, designation } = req.body;
    const suggestions = await generateSlogansAndTheme({
      occasionType: occasionType || 'victory_day',
      headline: headline || 'মহান বিজয় দিবস',
      party,
      requesterName,
      designation,
    });

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAiFullPosterDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ success: false, message: 'একটি প্রম্পট বা বিবরণ প্রদান করুন।' });
      return;
    }

    const aiResult = await generateFullPosterWithGemini(prompt, req.user);
    res.status(200).json({
      success: true,
      data: aiResult,
    });
  } catch (error: any) {
    console.error('Error generating full poster with Gemini:', error);
    res.status(500).json({ success: false, message: 'এআই জেনারেশনে সমস্যা হয়েছে।' });
  }
};

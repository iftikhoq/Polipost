import { Request, Response } from 'express';
import { Template } from '../models/Template.js';

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { occasion, party } = req.query;
    const filter: any = { isActive: true };

    if (occasion && typeof occasion === 'string' && occasion !== 'all') {
      filter.occasionType = occasion;
    }
    if (party && typeof party === 'string' && party !== 'all') {
      filter.partyMotif = party;
    }

    const templates = await Template.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = String(req.params.id);
    let template = null;

    if (idStr.match(/^[0-9a-fA-F]{24}$/)) {
      template = await Template.findById(idStr);
    } else {
      template = await Template.findOne({ slug: idStr });
    }

    if (!template) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    res.status(200).json({
      success: true,
      template,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!template) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!template) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Template deactivated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

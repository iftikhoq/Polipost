import { Router } from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/template.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getTemplates);
router.get('/:id', getTemplateById);

// Admin-only management routes
router.post('/', authenticate, requireAdmin, createTemplate);
router.patch('/:id', authenticate, requireAdmin, updateTemplate);
router.delete('/:id', authenticate, requireAdmin, deleteTemplate);

export default router;

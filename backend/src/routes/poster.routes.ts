import { Router } from 'express';
import {
  createPoster,
  getPosterById,
  getUserPosters,
  regeneratePoster,
  deletePoster,
  getAiSlogans,
  getAiFullPosterDraft,
} from '../controllers/poster.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createPoster);
router.post('/slogans', getAiSlogans);
router.post('/generate-full', getAiFullPosterDraft);
router.get('/user/history', authenticate, getUserPosters);
router.get('/:id', authenticate, getPosterById);
router.post('/:id/regenerate', authenticate, regeneratePoster);
router.delete('/:id', authenticate, deletePoster);

export default router;

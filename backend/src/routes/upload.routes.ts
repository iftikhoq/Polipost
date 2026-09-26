import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadFile } from '../services/storage.service.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

router.post('/', upload.single('photo'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided' });
      return;
    }

    const result = await uploadFile(req.file, 'polipost_user_photos');

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Photo upload failed' });
  }
});

export default router;

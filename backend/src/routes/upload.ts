import { Router, Response } from 'express';
import multer from 'multer';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { uploadToCloudinary } from '../services/cloudinary.js';
import { ProjectType } from '../types/index.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const type = (req.query.type as ProjectType) || 'videos';

      const validTypes: ProjectType[] = ['videos', 'leds', 'flyers'];
      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({
            error: 'Invalid type. Must be one of: videos, leds, flyers',
          });
      }

      const maxSizeImage = 10 * 1024 * 1024; // 10MB
      const maxSizeVideo = 100 * 1024 * 1024; // 100MB

      const isVideo = req.file.mimetype.startsWith('video/');
      const maxSize = isVideo ? maxSizeVideo : maxSizeImage;

      if (req.file.size > maxSize) {
        return res
          .status(413)
          .json({
            error: `File too large. Max size: ${isVideo ? '100MB' : '10MB'}`,
          });
      }

      const result = await uploadToCloudinary(req.file, type);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  }
);

export default router;

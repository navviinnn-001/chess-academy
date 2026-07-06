import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticate, requireRole } from '../middleware/auth.js';
import { ApiError } from '../utils/asyncHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) {
      return cb(new ApiError(400, 'Only PNG, JPG, or WEBP images are allowed.') as any);
    }
    cb(null, true);
  },
});

export const uploadsRouter = Router();
uploadsRouter.use(authenticate, requireRole('admin'));

uploadsRouter.post('/', upload.single('file'), (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file received.');
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

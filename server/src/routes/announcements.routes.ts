import { Router } from 'express';
import { z } from 'zod';
import { Announcement } from '../models/Announcement.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const announcementsRouter = Router();
announcementsRouter.use(authenticate);

announcementsRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const filter = req.user!.role === 'admin' ? {} : { status: 'Published' };
    const announcements = await Announcement.find(filter).sort({ publishDate: -1 }).lean();
    res.json({ announcements });
  }),
);

const createSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(2),
  publishDate: z.coerce.date().optional(),
  priority: z.enum(['Normal', 'Important', 'Urgent']).optional(),
});

announcementsRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const announcement = await Announcement.create(data);
    res.status(201).json({ announcement, message: 'Announcement published to all students.' });
  }),
);

announcementsRouter.patch(
  '/:id/toggle-status',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) throw new ApiError(404, 'Announcement not found.');
    announcement.status = announcement.status === 'Published' ? 'Archived' : 'Published';
    await announcement.save();
    res.json({ status: announcement.status });
  }),
);

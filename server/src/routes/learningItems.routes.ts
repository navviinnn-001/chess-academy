import { Router } from 'express';
import { z } from 'zod';
import { LearningItem } from '../models/LearningItem.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const learningItemsRouter = Router();
learningItemsRouter.use(authenticate);

learningItemsRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const filter = req.user!.role === 'admin' ? {} : { status: 'published' };
    const items = await LearningItem.find(filter).sort({ publishedOn: -1 }).lean();
    const mapped = items.map((i) => ({
      ...i,
      completed: req.user!.role === 'student' ? i.completedBy.some((id) => id.toString() === req.user!.id) : undefined,
    }));
    res.json({ items: mapped });
  }),
);

learningItemsRouter.get(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    const item = await LearningItem.findById(req.params.id).lean();
    if (!item) throw new ApiError(404, 'Resource not found.');
    res.json({
      item: {
        ...item,
        completed: req.user!.role === 'student' ? item.completedBy.some((id) => id.toString() === req.user!.id) : undefined,
      },
    });
  }),
);

const createSchema = z.object({
  title: z.string().min(2),
  type: z.enum(['YouTube', 'PDF', 'Note', 'Link']),
  description: z.string().optional(),
  url: z.string().optional(),
  thumbnail: z.string().optional(),
  durationLabel: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

learningItemsRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const item = await LearningItem.create(data);
    res.status(201).json({ item, message: 'Content saved.' });
  }),
);

learningItemsRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.partial().parse(req.body);
    const item = await LearningItem.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) throw new ApiError(404, 'Resource not found.');
    res.json({ item, message: 'Content updated.' });
  }),
);

learningItemsRouter.post(
  '/:id/complete',
  requireRole('student'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const item = await LearningItem.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Resource not found.');
    if (!item.completedBy.some((id) => id.toString() === req.user!.id)) {
      item.completedBy.push(req.user!.id as any);
      await item.save();
    }
    res.json({ message: 'Marked complete.' });
  }),
);

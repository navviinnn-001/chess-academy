import { Router } from 'express';
import { z } from 'zod';
import { LiveClass } from '../models/LiveClass.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const liveClassesRouter = Router();
liveClassesRouter.use(authenticate);

liveClassesRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const filter = req.user!.role === 'admin' ? {} : { published: true };
    const classes = await LiveClass.find(filter).sort({ dateTime: -1 }).lean();
    res.json({ classes });
  }),
);

liveClassesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const cls = await LiveClass.findById(req.params.id).lean();
    if (!cls) throw new ApiError(404, 'Class not found.');
    res.json({ class: cls });
  }),
);

const createSchema = z.object({
  topic: z.string().min(2),
  dateTime: z.coerce.date(),
  instructions: z.string().optional(),
  homework: z.string().optional(),
  meetingLink: z.string().optional(),
});

liveClassesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const cls = await LiveClass.create({ ...data, published: false, status: 'upcoming' });
    res.status(201).json({ class: cls, message: 'Class created as draft.' });
  }),
);

const updateSchema = z.object({
  topic: z.string().min(2).optional(),
  dateTime: z.coerce.date().optional(),
  instructions: z.string().optional(),
  homework: z.string().optional(),
  meetingLink: z.string().optional(),
  recordingLink: z.string().optional(),
  published: z.boolean().optional(),
  status: z.enum(['upcoming', 'completed']).optional(),
});

liveClassesRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = updateSchema.parse(req.body);
    const cls = await LiveClass.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!cls) throw new ApiError(404, 'Class not found.');
    res.json({ class: cls, message: 'Class updated.' });
  }),
);

const attendanceSchema = z.object({
  marks: z.array(z.object({ student: z.string(), mark: z.enum(['Present', 'Absent', 'Late']) })),
});

liveClassesRouter.post(
  '/:id/attendance',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { marks } = attendanceSchema.parse(req.body);
    const cls = await LiveClass.findById(req.params.id);
    if (!cls) throw new ApiError(404, 'Class not found.');
    cls.attendance = marks as any;
    cls.status = 'completed';
    await cls.save();
    res.json({ message: 'Attendance saved.' });
  }),
);

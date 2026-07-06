import { Router } from 'express';
import { z } from 'zod';
import { WeeklyUpdate } from '../models/WeeklyUpdate.js';
import { User } from '../models/User.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const weeklyUpdatesRouter = Router();
weeklyUpdatesRouter.use(authenticate);

weeklyUpdatesRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    if (req.user!.role === 'student') {
      const updates = await WeeklyUpdate.find({ student: req.user!.id }).sort({ createdAt: -1 }).lean();
      return res.json({ updates });
    }
    const studentId = req.query.studentId as string | undefined;
    const filter = studentId ? { student: studentId } : {};
    const updates = await WeeklyUpdate.find(filter).populate('student', 'name').sort({ createdAt: -1 }).lean();
    res.json({ updates });
  }),
);

weeklyUpdatesRouter.get(
  '/missing',
  requireRole('admin'),
  asyncHandler(async (_req, res) => {
    const students = await User.find({ role: 'student', status: 'active' }).lean();
    const withLatest = await Promise.all(
      students.map(async (s) => ({
        id: s._id.toString(),
        name: s.name,
        hasUpdateThisWeek: !!(await WeeklyUpdate.findOne({
          student: s._id,
          createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
        })),
      })),
    );
    res.json({ students: withLatest.filter((s) => !s.hasUpdateThisWeek) });
  }),
);

const createSchema = z.object({
  student: z.string().min(1),
  week: z.string().min(1),
  attendance: z.string().optional(),
  topicsCovered: z.array(z.string()).optional(),
  strengths: z.string().optional(),
  improvementArea: z.string().optional(),
  nextTask: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

weeklyUpdatesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const update = await WeeklyUpdate.create(data);
    res.status(201).json({ update, message: 'Weekly update published to student.' });
  }),
);

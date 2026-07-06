import { Router } from 'express';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { WeeklyUpdate } from '../models/WeeklyUpdate.js';
import { LiveClass } from '../models/LiveClass.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminRouter = Router();
adminRouter.use(authenticate, requireRole('admin'));

adminRouter.get(
  '/summary',
  asyncHandler(async (_req, res) => {
    const [totalActive, totalInactive, students, nextClass] = await Promise.all([
      User.countDocuments({ role: 'student', status: 'active' }),
      User.countDocuments({ role: 'student', status: 'inactive' }),
      User.find({ role: 'student', status: 'active' }).lean(),
      LiveClass.findOne({ status: 'upcoming', dateTime: { $gte: new Date() } }).sort({ dateTime: 1 }).lean(),
    ]);

    const weekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
    const [paymentPending, missingUpdatesCount] = await Promise.all([
      Payment.countDocuments({ status: { $ne: 'Paid' } }),
      (async () => {
        let count = 0;
        for (const s of students) {
          const has = await WeeklyUpdate.findOne({ student: s._id, createdAt: { $gte: weekAgo } });
          if (!has) count++;
        }
        return count;
      })(),
    ]);

    res.json({
      totalActive,
      totalInactive,
      paymentPending,
      missingUpdates: missingUpdatesCount,
      nextClass,
    });
  }),
);

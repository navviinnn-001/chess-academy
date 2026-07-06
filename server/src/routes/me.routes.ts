import { Router } from 'express';
import { User } from '../models/User.js';
import { LiveClass } from '../models/LiveClass.js';
import { LearningItem } from '../models/LearningItem.js';
import { Puzzle } from '../models/Puzzle.js';
import { WeeklyUpdate } from '../models/WeeklyUpdate.js';
import { Announcement } from '../models/Announcement.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { computeStudentStats } from '../utils/computeStudentStats.js';

export const meRouter = Router();
meRouter.use(authenticate, requireRole('student'));

meRouter.get(
  '/dashboard',
  asyncHandler(async (req: AuthedRequest, res) => {
    const studentId = req.user!.id;
    const [nextClass, latestUpdate, learningItems, puzzles, announcement, stats] = await Promise.all([
      LiveClass.findOne({ published: true, status: 'upcoming', dateTime: { $gte: new Date() } }).sort({ dateTime: 1 }).lean(),
      WeeklyUpdate.findOne({ student: studentId }).sort({ createdAt: -1 }).lean(),
      LearningItem.find({ status: 'published' }).sort({ publishedOn: -1 }).lean(),
      Puzzle.find({ status: 'published' }).lean(),
      Announcement.findOne({ status: 'Published' }).sort({ publishDate: -1 }).lean(),
      computeStudentStats(studentId),
    ]);

    const featuredLearning = learningItems.find((l) => !l.completedBy.some((id) => id.toString() === studentId)) ?? learningItems[0] ?? null;
    const featuredPuzzle = puzzles.find((p) => !p.completedBy.some((id) => id.toString() === studentId)) ?? puzzles[0] ?? null;

    res.json({
      nextClass,
      latestUpdate,
      featuredLearning: featuredLearning && { id: featuredLearning._id, title: featuredLearning.title, type: featuredLearning.type },
      featuredPuzzle: featuredPuzzle && { id: featuredPuzzle._id, title: featuredPuzzle.title, topic: featuredPuzzle.topic },
      announcement,
      stats,
    });
  }),
);

meRouter.get(
  '/progress',
  asyncHandler(async (req: AuthedRequest, res) => {
    const stats = await computeStudentStats(req.user!.id);
    const updates = await WeeklyUpdate.find({ student: req.user!.id }).sort({ createdAt: -1 }).lean();
    res.json({ stats, weeklyUpdates: updates });
  }),
);

meRouter.get(
  '/profile',
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await User.findById(req.user!.id).lean();
    if (!user) throw new ApiError(404, 'User not found.');
    res.json({
      profile: {
        name: user.name,
        age: user.age,
        language: user.language,
        joinedOn: user.joinedOn,
        status: user.status,
        contact: user.contact,
        email: user.email,
      },
    });
  }),
);

import { LiveClass } from '../models/LiveClass.js';
import { LearningItem } from '../models/LearningItem.js';
import { Puzzle } from '../models/Puzzle.js';
import { WeeklyUpdate } from '../models/WeeklyUpdate.js';
import { Payment } from '../models/Payment.js';
import type mongoose from 'mongoose';

export async function computeStudentStats(studentId: mongoose.Types.ObjectId | string) {
  const [completedClasses, publishedLearning, publishedPuzzles, latestUpdate, latestPayment] = await Promise.all([
    LiveClass.find({ status: 'completed', 'attendance.student': studentId }).select('attendance').lean(),
    LearningItem.find({ status: 'published' }).select('completedBy').lean(),
    Puzzle.find({ status: 'published' }).select('completedBy').lean(),
    WeeklyUpdate.findOne({ student: studentId }).sort({ createdAt: -1 }).lean(),
    Payment.findOne({ student: studentId }).sort({ createdAt: -1 }).lean(),
  ]);

  const totalCompletedClasses = await LiveClass.countDocuments({ status: 'completed' });
  const presentCount = completedClasses.filter((c) =>
    c.attendance.some((a) => a.student.toString() === studentId.toString() && a.mark !== 'Absent'),
  ).length;

  const attendancePct = totalCompletedClasses > 0 ? Math.round((presentCount / totalCompletedClasses) * 100) : 0;

  const learningDone = publishedLearning.filter((l) => l.completedBy.some((id) => id.toString() === studentId.toString())).length;
  const learningPct = publishedLearning.length > 0 ? Math.round((learningDone / publishedLearning.length) * 100) : 0;

  const puzzlesDone = publishedPuzzles.filter((p) => p.completedBy.some((id) => id.toString() === studentId.toString())).length;
  const puzzlePct = publishedPuzzles.length > 0 ? Math.round((puzzlesDone / publishedPuzzles.length) * 100) : 0;

  return {
    attendancePct,
    learningPct,
    puzzlePct,
    lastUpdateWeek: latestUpdate?.week ?? null,
    paymentStatus: latestPayment?.status ?? 'Pending',
  };
}

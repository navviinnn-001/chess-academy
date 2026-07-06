import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { WeeklyUpdate } from '../models/WeeklyUpdate.js';
import { Payment } from '../models/Payment.js';
import { PrivateNote } from '../models/PrivateNote.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { generateTempPassword } from '../utils/generatePassword.js';
import { computeStudentStats } from '../utils/computeStudentStats.js';

export const studentsRouter = Router();
studentsRouter.use(authenticate, requireRole('admin'));

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

studentsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 }).lean();
    const withStats = await Promise.all(
      students.map(async (s) => ({
        id: s._id.toString(),
        name: s.name,
        avatarInitials: initials(s.name),
        age: s.age,
        language: s.language,
        status: s.status,
        joinedOn: s.joinedOn,
        contact: s.contact,
        email: s.email,
        ...(await computeStudentStats(s._id)),
      })),
    );
    res.json({ students: withStats });
  }),
);

const createSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().positive(),
  language: z.enum(['Malayalam', 'English']),
  contact: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
});

studentsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const tempPassword = generateTempPassword();
    const passwordHash = await (User as any).hashPassword(tempPassword);

    const student = await User.create({
      name: data.name,
      age: data.age,
      language: data.language,
      contact: data.contact,
      email: data.email || undefined,
      role: 'student',
      status: 'active',
      passwordHash,
      mustChangePassword: true,
    });

    res.status(201).json({
      student: { id: student._id.toString(), name: student.name },
      tempPassword,
      message: 'Student created. Share this temporary password with them on WhatsApp.',
    });
  }),
);

studentsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).lean();
    if (!student) throw new ApiError(404, 'Student not found.');

    const [payments, weeklyUpdates, notes, stats] = await Promise.all([
      Payment.find({ student: student._id }).sort({ createdAt: -1 }).lean(),
      WeeklyUpdate.find({ student: student._id }).sort({ createdAt: -1 }).lean(),
      PrivateNote.find({ student: student._id }).sort({ pinned: -1, createdAt: -1 }).lean(),
      computeStudentStats(student._id),
    ]);

    res.json({
      student: {
        id: student._id.toString(),
        name: student.name,
        avatarInitials: initials(student.name),
        age: student.age,
        language: student.language,
        status: student.status,
        joinedOn: student.joinedOn,
        contact: student.contact,
        email: student.email,
        ...stats,
      },
      payments,
      weeklyUpdates,
      notes,
    });
  }),
);

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().int().positive().optional(),
  language: z.enum(['Malayalam', 'English']).optional(),
  contact: z.string().min(6).optional(),
  email: z.string().email().optional().or(z.literal('')),
});

studentsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const data = updateSchema.parse(req.body);
    const student = await User.findOneAndUpdate({ _id: req.params.id, role: 'student' }, data, { new: true });
    if (!student) throw new ApiError(404, 'Student not found.');
    res.json({ message: 'Student updated.' });
  }),
);

studentsRouter.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) throw new ApiError(404, 'Student not found.');
    student.status = student.status === 'active' ? 'inactive' : 'active';
    await student.save();
    res.json({ status: student.status, message: `Student marked ${student.status}.` });
  }),
);

studentsRouter.post(
  '/:id/reset-password',
  asyncHandler(async (req, res) => {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) throw new ApiError(404, 'Student not found.');
    const tempPassword = generateTempPassword();
    student.passwordHash = await (User as any).hashPassword(tempPassword);
    student.mustChangePassword = true;
    await student.save();
    res.json({ tempPassword, message: 'New temporary password generated. Share it with the student on WhatsApp.' });
  }),
);

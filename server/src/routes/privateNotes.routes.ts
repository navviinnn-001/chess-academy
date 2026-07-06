import { Router } from 'express';
import { z } from 'zod';
import { PrivateNote } from '../models/PrivateNote.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const privateNotesRouter = Router();
// Admin-only in every direction — never mounted or exposed under student routes.
privateNotesRouter.use(authenticate, requireRole('admin'));

privateNotesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const studentId = req.query.studentId as string | undefined;
    const filter = studentId && studentId !== 'All' ? { student: studentId } : {};
    const notes = await PrivateNote.find(filter).populate('student', 'name').sort({ pinned: -1, createdAt: -1 }).lean();
    res.json({ notes });
  }),
);

const createSchema = z.object({
  student: z.string().min(1),
  content: z.string().min(1),
});

privateNotesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const note = await PrivateNote.create(data);
    res.status(201).json({ note, message: 'Private note saved.' });
  }),
);

privateNotesRouter.patch(
  '/:id/pin',
  asyncHandler(async (req, res) => {
    const note = await PrivateNote.findById(req.params.id);
    if (!note) throw new ApiError(404, 'Note not found.');
    note.pinned = !note.pinned;
    await note.save();
    res.json({ pinned: note.pinned });
  }),
);

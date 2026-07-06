import { Router } from 'express';
import { z } from 'zod';
import { Puzzle } from '../models/Puzzle.js';
import { authenticate, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const puzzlesRouter = Router();
puzzlesRouter.use(authenticate);

function toStudentView(p: any, studentId: string) {
  const completed = p.completedBy.some((id: any) => id.toString() === studentId);
  return {
    id: p._id,
    title: p.title,
    topic: p.topic,
    difficulty: p.difficulty,
    imageUrl: p.imageUrl,
    instruction: p.instruction,
    hint: p.hint,
    status: p.status,
    completed,
    // Answer/explanation are withheld from the list view and only sent on submit/reveal.
  };
}

puzzlesRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    if (req.user!.role === 'admin') {
      const puzzles = await Puzzle.find().sort({ createdAt: -1 }).lean();
      return res.json({ puzzles });
    }
    const puzzles = await Puzzle.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
    res.json({ puzzles: puzzles.map((p) => toStudentView(p, req.user!.id)) });
  }),
);

puzzlesRouter.get(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    const puzzle = await Puzzle.findById(req.params.id).lean();
    if (!puzzle) throw new ApiError(404, 'Puzzle not found.');
    if (req.user!.role === 'admin') return res.json({ puzzle });
    res.json({ puzzle: toStudentView(puzzle, req.user!.id) });
  }),
);

const createSchema = z.object({
  title: z.string().min(2),
  topic: z.string().min(1),
  difficulty: z.enum(['Beginner', 'Easy', 'Intermediate', 'Advanced']),
  imageUrl: z.string().optional(),
  instruction: z.string().min(1),
  hint: z.string().optional(),
  answer: z.string().min(1),
  explanation: z.string().optional(),
  youtubeLink: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

puzzlesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const puzzle = await Puzzle.create(data);
    res.status(201).json({ puzzle, message: 'Puzzle saved.' });
  }),
);

puzzlesRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = createSchema.partial().parse(req.body);
    const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!puzzle) throw new ApiError(404, 'Puzzle not found.');
    res.json({ puzzle, message: 'Puzzle updated.' });
  }),
);

const submitSchema = z.object({ answer: z.string().min(1) });

puzzlesRouter.post(
  '/:id/submit',
  requireRole('student'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { answer } = submitSchema.parse(req.body);
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) throw new ApiError(404, 'Puzzle not found.');

    const correct = answer.trim().toLowerCase() === puzzle.answer.trim().toLowerCase();
    if (correct && !puzzle.completedBy.some((id) => id.toString() === req.user!.id)) {
      puzzle.completedBy.push(req.user!.id as any);
      await puzzle.save();
    }

    res.json({
      correct,
      ...(correct ? { answer: puzzle.answer, explanation: puzzle.explanation, youtubeLink: puzzle.youtubeLink } : {}),
    });
  }),
);

puzzlesRouter.post(
  '/:id/reveal',
  requireRole('student'),
  asyncHandler(async (req, res) => {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) throw new ApiError(404, 'Puzzle not found.');
    res.json({ answer: puzzle.answer, explanation: puzzle.explanation, youtubeLink: puzzle.youtubeLink });
  }),
);

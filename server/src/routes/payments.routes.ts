import { Router } from 'express';
import { z } from 'zod';
import { Payment } from '../models/Payment.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const paymentsRouter = Router();
paymentsRouter.use(authenticate, requireRole('admin'));

paymentsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { month, status } = req.query as { month?: string; status?: string };
    const filter: Record<string, unknown> = {};
    if (month && month !== 'All') filter.month = month;
    if (status && status !== 'All') filter.status = status;
    const payments = await Payment.find(filter).populate('student', 'name').sort({ createdAt: -1 }).lean();
    res.json({ payments });
  }),
);

const createSchema = z.object({
  student: z.string().min(1),
  month: z.string().min(1),
  fee: z.number().positive(),
  amountReceived: z.number().min(0).optional(),
  status: z.enum(['Paid', 'Pending', 'Partial']),
  paymentDate: z.coerce.date().optional(),
  method: z.enum(['UPI', 'Cash', 'Bank Transfer', '']).optional(),
  note: z.string().optional(),
});

paymentsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const payment = await Payment.create(data);
    res.status(201).json({ payment, message: 'Payment recorded.' });
  }),
);

paymentsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const data = createSchema.partial().parse(req.body);
    const payment = await Payment.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!payment) throw new ApiError(404, 'Payment not found.');
    res.json({ payment, message: 'Payment updated.' });
  }),
);

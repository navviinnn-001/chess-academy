import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/asyncHandler.js';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err?.name === 'CastError') {
    return res.status(400).json({ message: `Invalid identifier: ${err.value}` });
  }
  if (err?.name === 'ZodError') {
    const first = err.issues?.[0];
    return res.status(400).json({ message: first?.message ?? 'Invalid request data.' });
  }
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
}

import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { verifyToken } from '../utils/tokens.js';
import { ApiError } from '../utils/asyncHandler.js';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'student';
    status?: 'active' | 'inactive';
    mustChangePassword?: boolean;
  };
}

export async function authenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authenticated. Please sign in again.');
    }
    const token = header.slice('Bearer '.length);
    const payload = verifyToken(token);

    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'Account no longer exists.');
    if (user.role === 'student' && user.status === 'inactive') {
      throw new ApiError(403, 'ACCOUNT_INACTIVE');
    }

    req.user = {
      id: user._id.toString(),
      role: user.role as 'admin' | 'student',
      status: user.status as 'active' | 'inactive',
      mustChangePassword: user.mustChangePassword,
    };
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Invalid or expired session. Please sign in again.'));
  }
}

export function requireRole(...roles: Array<'admin' | 'student'>) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
}

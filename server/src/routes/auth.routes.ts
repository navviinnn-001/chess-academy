import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { signToken, createResetToken, hashToken } from '../utils/tokens.js';
import { authenticate, type AuthedRequest } from '../middleware/auth.js';
import { env } from '../config/env.js';

export const authRouter = Router();

function publicUser(user: any) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    contact: user.contact,
    role: user.role,
    status: user.status,
    age: user.age,
    language: user.language,
    joinedOn: user.joinedOn,
    mustChangePassword: user.mustChangePassword,
  };
}

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { identifier, password } = loginSchema.parse(req.body);

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { contact: identifier }],
    });

    if (!user || !(await (user as any).comparePassword(password))) {
      throw new ApiError(401, 'Incorrect email/phone or password.');
    }

    if (user.role === 'student' && user.status === 'inactive') {
      throw new ApiError(403, 'ACCOUNT_INACTIVE');
    }

    const token = signToken({ sub: user._id.toString(), role: user.role as 'admin' | 'student' });
    res.json({ token, user: publicUser(user) });
  }),
);

authRouter.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, 'User not found.');
    res.json({ user: publicUser(user) });
  }),
);

const firstLoginSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

authRouter.post(
  '/first-login-password',
  authenticate,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { newPassword } = firstLoginSchema.parse(req.body);
    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, 'User not found.');
    user.passwordHash = await (User as any).hashPassword(newPassword);
    user.mustChangePassword = false;
    await user.save();
    res.json({ message: 'Password set. You can now access your portal.' });
  }),
);

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

authRouter.post(
  '/change-password',
  authenticate,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = await User.findById(req.user!.id);
    if (!user || !(await (user as any).comparePassword(currentPassword))) {
      throw new ApiError(400, 'Current password is incorrect.');
    }
    user.passwordHash = await (User as any).hashPassword(newPassword);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  }),
);

const forgotSchema = z.object({ identifier: z.string().min(1) });

authRouter.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { identifier } = forgotSchema.parse(req.body);
    const user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { contact: identifier }] });

    // Always respond the same way whether or not the account exists, to avoid leaking which
    // identifiers are registered.
    if (!user) {
      return res.json({ message: 'If an account exists for that identifier, a reset link has been generated.' });
    }

    const { rawToken, hashedToken, expiresAt } = createResetToken();
    user.resetTokenHash = hashedToken;
    user.resetTokenExpires = expiresAt;
    await user.save();

    // NOTE: There is no email/SMS/WhatsApp provider wired up in this MVP. In place of sending
    // the link, we log it server-side and return it in the response ONLY in development so the
    // flow can be tested end-to-end. Wire up a real provider (e.g. Resend, Twilio, WhatsApp
    // Cloud API) before going to production, and remove `resetToken` from the response below.
    const resetToken = env.nodeEnv === 'production' ? undefined : rawToken;
    // eslint-disable-next-line no-console
    console.log(`[auth] Password reset token for ${identifier}: ${rawToken}`);

    res.json({ message: 'If an account exists for that identifier, a reset link has been generated.', resetToken });
  }),
);

const resetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

authRouter.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = resetSchema.parse(req.body);
    const hashed = hashToken(token);
    const user = await User.findOne({ resetTokenHash: hashed, resetTokenExpires: { $gt: new Date() } }).select(
      '+resetTokenHash +resetTokenExpires',
    );
    if (!user) throw new ApiError(400, 'This reset link is invalid or has expired.');

    user.passwordHash = await (User as any).hashPassword(newPassword);
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.mustChangePassword = false;
    await user.save();

    res.json({ message: 'Password updated. You can now sign in.' });
  }),
);

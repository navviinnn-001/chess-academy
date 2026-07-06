import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { studentsRouter } from './students.routes.js';
import { meRouter } from './me.routes.js';
import { liveClassesRouter } from './liveClasses.routes.js';
import { learningItemsRouter } from './learningItems.routes.js';
import { puzzlesRouter } from './puzzles.routes.js';
import { weeklyUpdatesRouter } from './weeklyUpdates.routes.js';
import { paymentsRouter } from './payments.routes.js';
import { privateNotesRouter } from './privateNotes.routes.js';
import { announcementsRouter } from './announcements.routes.js';
import { uploadsRouter } from './uploads.routes.js';
import { adminRouter } from './admin.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/students', studentsRouter);
apiRouter.use('/me', meRouter);
apiRouter.use('/live-classes', liveClassesRouter);
apiRouter.use('/learning-items', learningItemsRouter);
apiRouter.use('/puzzles', puzzlesRouter);
apiRouter.use('/weekly-updates', weeklyUpdatesRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/private-notes', privateNotesRouter);
apiRouter.use('/announcements', announcementsRouter);
apiRouter.use('/uploads', uploadsRouter);
apiRouter.use('/admin', adminRouter);

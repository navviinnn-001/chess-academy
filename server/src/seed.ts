import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { LiveClass } from './models/LiveClass.js';
import { LearningItem } from './models/LearningItem.js';
import { Puzzle } from './models/Puzzle.js';
import { WeeklyUpdate } from './models/WeeklyUpdate.js';
import { Payment } from './models/Payment.js';
import { Announcement } from './models/Announcement.js';
import mongoose from 'mongoose';

async function seed() {
  await connectDB();

  // --- Admin account ---
  const existingAdmin = await User.findOne({ email: env.admin.email });
  if (!existingAdmin) {
    const passwordHash = await (User as any).hashPassword(env.admin.password);
    await User.create({
      name: env.admin.name,
      email: env.admin.email,
      role: 'admin',
      passwordHash,
      mustChangePassword: false,
    });
    console.log(`[seed] Admin created: ${env.admin.email} / ${env.admin.password}`);
  } else {
    console.log(`[seed] Admin already exists: ${env.admin.email}`);
  }

  // --- Sample student ---
  let student = await User.findOne({ contact: '+919847000001' });
  if (!student) {
    const passwordHash = await (User as any).hashPassword('ChessDemo123!');
    student = await User.create({
      name: 'Aarav Menon',
      age: 11,
      language: 'English',
      contact: '+919847000001',
      email: '[email protected]',
      role: 'student',
      status: 'active',
      passwordHash,
      mustChangePassword: false,
    });
    console.log('[seed] Sample student created: +919847000001 / ChessDemo123!');
  }

  // --- Sample live classes ---
  const classCount = await LiveClass.countDocuments();
  if (classCount === 0) {
    await LiveClass.create([
      {
        topic: 'Rook Endgames — Cutting Off the King',
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 26),
        instructions: 'Keep your board and pen ready. We will solve 3 endgame positions live.',
        homework: "Review last week's pawn structure notes before class.",
        meetingLink: 'https://meet.google.com/wecare-chess-live',
        published: true,
        status: 'upcoming',
      },
      {
        topic: 'Opening Principles — Controlling the Center',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        instructions: 'Recorded session covering center control and development.',
        homework: 'Play 2 games applying center-control ideas.',
        recordingLink: 'https://drive.google.com/recording-100',
        published: true,
        status: 'completed',
        attendance: [{ student: student._id, mark: 'Present' }],
      },
    ]);
    console.log('[seed] Sample live classes created.');
  }

  // --- Sample learning content ---
  const learningCount = await LearningItem.countDocuments();
  if (learningCount === 0) {
    await LearningItem.create([
      { title: 'The Four Opening Principles', type: 'YouTube', description: 'A gentle introduction to development, center control, king safety and tempo.', thumbnail: 'from-emerald-700 to-navy-800', durationLabel: '9 min', status: 'published', completedBy: [student._id] },
      { title: 'Reading Algebraic Notation', type: 'PDF', description: 'Printable one-page reference for square names and move notation.', thumbnail: 'from-gold-600 to-navy-800', durationLabel: '2 pages', status: 'published' },
      { title: 'Basic Checkmating Patterns', type: 'YouTube', description: 'Ladder mate, back-rank mate and king + queen technique explained.', thumbnail: 'from-emerald-700 to-navy-800', durationLabel: '14 min', status: 'published' },
    ]);
    console.log('[seed] Sample learning content created.');
  }

  // --- Sample puzzles ---
  const puzzleCount = await Puzzle.countDocuments();
  if (puzzleCount === 0) {
    await Puzzle.create([
      { title: 'Weekly Puzzle — Fork Finder', topic: 'Knight Forks', difficulty: 'Beginner', instruction: 'White to move and win material.', hint: 'Look for a knight move that attacks two pieces at once.', answer: 'Nf6+', explanation: 'The knight forks the king and rook, winning the exchange after the king moves.', status: 'published', completedBy: [student._id] },
      { title: 'Back Rank Trouble', topic: 'Back Rank Mate', difficulty: 'Easy', instruction: 'White to move and mate in 1.', hint: 'The black king has no escape squares.', answer: 'Re8#', explanation: 'The rook delivers mate along the open back rank.', status: 'published' },
      { title: 'Pin and Win', topic: 'Pins', difficulty: 'Beginner', instruction: 'Black to move and win a pawn.', hint: 'The bishop is pinning the knight to the queen.', answer: 'Bxc6', explanation: 'Capturing wins a pawn since the knight cannot recapture safely.', status: 'published' },
    ]);
    console.log('[seed] Sample puzzles created.');
  }

  // --- Sample weekly update ---
  const updateCount = await WeeklyUpdate.countDocuments();
  if (updateCount === 0) {
    await WeeklyUpdate.create({
      student: student._id,
      week: 'Week of 22 Jun',
      attendance: '3/3 classes',
      topicsCovered: ['Rook endgames', 'King activity'],
      strengths: 'Aarav is calculating forcing sequences well and finding checks quickly.',
      improvementArea: 'Needs to slow down in quiet positions before deciding a plan.',
      nextTask: 'Solve 10 rook endgame puzzles before next class.',
      rating: 4,
    });
    console.log('[seed] Sample weekly update created.');
  }

  // --- Sample payment ---
  const paymentCount = await Payment.countDocuments();
  if (paymentCount === 0) {
    await Payment.create({
      student: student._id,
      month: 'June 2026',
      fee: 1500,
      amountReceived: 1500,
      status: 'Paid',
      paymentDate: new Date(),
      method: 'UPI',
      note: 'Paid on time',
    });
    console.log('[seed] Sample payment created.');
  }

  // --- Sample announcement ---
  const announcementCount = await Announcement.countDocuments();
  if (announcementCount === 0) {
    await Announcement.create({
      title: 'New puzzle set released',
      body: "This week's puzzle set focuses on knight forks. Try to finish before Friday.",
      priority: 'Normal',
      status: 'Published',
    });
    console.log('[seed] Sample announcement created.');
  }

  console.log('[seed] Done.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});

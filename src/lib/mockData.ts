// NOTE: This file is no longer imported by any page — the app now reads real data from the
// backend API (see src/lib/api.ts and /server). Kept here only as a reference for the shape of
// realistic content, and because /server/src/seed.ts creates equivalent sample data in MongoDB.

import type {
  Student, LiveClass, LearningItem, Puzzle, WeeklyUpdate, Payment, PrivateNote, Announcement,
} from '@/types';

export const currentStudent: Student = {
  id: 'stu_001',
  name: 'Aarav Menon',
  avatarInitials: 'AM',
  age: 11,
  language: 'English',
  status: 'active',
  joinedOn: '2026-02-14',
  contact: '+91 98470 XXXXX',
  attendancePct: 92,
  learningPct: 68,
  puzzlePct: 74,
  paymentStatus: 'Paid',
  lastUpdateWeek: 'Week of 22 Jun',
};

export const students: Student[] = [
  currentStudent,
  { id: 'stu_002', name: 'Diya Nair', avatarInitials: 'DN', age: 9, language: 'Malayalam', status: 'active', joinedOn: '2026-01-08', contact: '+91 94470 XXXXX', attendancePct: 88, learningPct: 54, puzzlePct: 61, paymentStatus: 'Pending', lastUpdateWeek: 'Week of 15 Jun' },
  { id: 'stu_003', name: 'Kabir Suresh', avatarInitials: 'KS', age: 13, language: 'English', status: 'active', joinedOn: '2025-11-20', contact: '+91 90480 XXXXX', attendancePct: 97, learningPct: 81, puzzlePct: 89, paymentStatus: 'Paid', lastUpdateWeek: 'Week of 22 Jun' },
  { id: 'stu_004', name: 'Ananya Pillai', avatarInitials: 'AP', age: 10, language: 'Malayalam', status: 'inactive', joinedOn: '2025-09-02', contact: '+91 96330 XXXXX', attendancePct: 40, learningPct: 22, puzzlePct: 18, paymentStatus: 'Partial', lastUpdateWeek: null },
  { id: 'stu_005', name: 'Rohan Das', avatarInitials: 'RD', age: 12, language: 'English', status: 'active', joinedOn: '2026-03-01', contact: '+91 89430 XXXXX', attendancePct: 76, learningPct: 45, puzzlePct: 40, paymentStatus: 'Paid', lastUpdateWeek: null },
  { id: 'stu_006', name: 'Meera Krishnan', avatarInitials: 'MK', age: 8, language: 'Malayalam', status: 'active', joinedOn: '2026-04-19', contact: '+91 90720 XXXXX', attendancePct: 100, learningPct: 30, puzzlePct: 35, paymentStatus: 'Pending', lastUpdateWeek: 'Week of 8 Jun' },
];

export const liveClasses: LiveClass[] = [
  {
    id: 'cls_101',
    topic: 'Rook Endgames — Cutting Off the King',
    dateTime: new Date(Date.now() + 1000 * 60 * 62).toISOString(),
    status: 'live-soon',
    meetingLink: 'https://meet.google.com/wecare-chess-live',
    instructions: 'Keep your board and pen ready. We will solve 3 endgame positions live.',
    homework: 'Review last week\'s pawn structure notes before class.',
    published: true,
  },
  {
    id: 'cls_100',
    topic: 'Opening Principles — Controlling the Center',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'completed',
    recordingLink: 'https://drive.google.com/recording-100',
    instructions: 'Recorded session covering center control and development.',
    homework: 'Play 2 games applying center-control ideas.',
    published: true,
  },
  {
    id: 'cls_099',
    topic: 'Tactics — Pins and Skewers',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: 'completed',
    recordingLink: 'https://drive.google.com/recording-099',
    instructions: 'Recorded session on pin and skewer patterns.',
    homework: 'Solve puzzle set: Pins Vol. 2',
    published: true,
  },
  {
    id: 'cls_102',
    topic: 'Knight Outposts & Weak Squares',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'upcoming',
    instructions: 'Bring examples of your last 2 games for review.',
    published: true,
  },
];

export const learningItems: LearningItem[] = [
  { id: 'lc_01', title: 'The Four Opening Principles', type: 'YouTube', description: 'A gentle introduction to development, center control, king safety and tempo.', thumbnail: 'from-emerald-700 to-navy-800', completed: true, durationLabel: '9 min', publishedOn: '2026-05-02' },
  { id: 'lc_02', title: 'Reading Algebraic Notation', type: 'PDF', description: 'Printable one-page reference for square names and move notation.', thumbnail: 'from-gold-600 to-navy-800', completed: true, durationLabel: '2 pages', publishedOn: '2026-05-06' },
  { id: 'lc_03', title: 'Coach Notes — Pawn Structures', type: 'Note', description: 'Key ideas on isolated pawns, pawn chains, and majorities.', thumbnail: 'from-navy-600 to-navy-800', completed: false, durationLabel: '5 min read', publishedOn: '2026-05-14' },
  { id: 'lc_04', title: 'Basic Checkmating Patterns', type: 'YouTube', description: 'Ladder mate, back-rank mate and king + queen technique explained.', thumbnail: 'from-emerald-700 to-navy-800', completed: false, durationLabel: '14 min', publishedOn: '2026-05-20' },
  { id: 'lc_05', title: 'Recommended External Practice', type: 'Link', description: 'A curated external site for supervised practice games.', thumbnail: 'from-navy-600 to-navy-800', completed: false, publishedOn: '2026-05-24' },
  { id: 'lc_06', title: 'Endgame Essentials Booklet', type: 'PDF', description: 'King and pawn endgames every beginner should know.', thumbnail: 'from-gold-600 to-navy-800', completed: false, durationLabel: '6 pages', publishedOn: '2026-06-01' },
];

export const puzzles: Puzzle[] = [
  { id: 'pz_01', title: 'Weekly Puzzle — Fork Finder', topic: 'Knight Forks', difficulty: 'Beginner', instruction: 'White to move and win material.', hint: 'Look for a knight move that attacks two pieces at once.', answer: 'Nf6+', explanation: 'The knight forks the king and rook, winning the exchange after the king moves.', youtubeLink: 'https://youtube.com/watch?v=demo1', completed: true, status: 'published' },
  { id: 'pz_02', title: 'Back Rank Trouble', topic: 'Back Rank Mate', difficulty: 'Easy', instruction: 'White to move and mate in 1.', hint: 'The black king has no escape squares.', answer: 'Re8#', explanation: 'The rook delivers mate along the open back rank.', completed: true, status: 'published' },
  { id: 'pz_03', title: 'Pin and Win', topic: 'Pins', difficulty: 'Beginner', instruction: 'Black to move and win a pawn.', hint: 'The bishop is pinning the knight to the queen.', answer: 'Bxc6', explanation: 'Capturing wins a pawn since the knight cannot recapture safely.', completed: false, status: 'published' },
  { id: 'pz_04', title: 'Ladder Mate Practice', topic: 'King & Rook Mate', difficulty: 'Beginner', instruction: 'White to move and mate in 3.', hint: 'Use both rooks to push the king to the edge.', answer: 'Ra7, Rb6, Ra8#', explanation: 'Alternate rook checks drive the king to the back rank for mate.', completed: false, status: 'published' },
  { id: 'pz_05', title: 'Discovered Attack', topic: 'Discovered Attacks', difficulty: 'Intermediate', instruction: 'White to move and win the queen.', hint: 'Move the knight to reveal the bishop\'s attack.', answer: 'Nd5+', explanation: 'The knight move both checks the king and unleashes the bishop on the queen.', completed: false, status: 'draft' },
];

export const weeklyUpdates: WeeklyUpdate[] = [
  { id: 'wu_01', studentId: 'stu_001', week: 'Week of 22 Jun', attendance: '3/3 classes', topicsCovered: ['Rook endgames', 'King activity'], strengths: 'Aarav is calculating forcing sequences well and finding checks quickly.', improvementArea: 'Needs to slow down in quiet positions before deciding a plan.', nextTask: 'Solve 10 rook endgame puzzles before next class.', rating: 4 },
  { id: 'wu_02', studentId: 'stu_001', week: 'Week of 15 Jun', attendance: '2/3 classes', topicsCovered: ['Pawn structure', 'Opening principles'], strengths: 'Good understanding of center control and piece development.', improvementArea: 'Missed one class — please confirm availability in advance.', nextTask: 'Review notation sheet and play 2 practice games.', rating: 4 },
  { id: 'wu_03', studentId: 'stu_001', week: 'Week of 8 Jun', attendance: '3/3 classes', topicsCovered: ['Tactics: pins & skewers'], strengths: 'Spotted pin patterns quickly during live analysis.', improvementArea: 'Board vision on the queenside needs more practice.', nextTask: 'Complete Puzzle Set: Pins Vol. 1', rating: 3 },
];

export const payments: Payment[] = [
  { id: 'pay_01', studentId: 'stu_001', studentName: 'Aarav Menon', month: 'June 2026', fee: 1500, amountReceived: 1500, status: 'Paid', paymentDate: '2026-06-03', method: 'UPI', note: 'Paid on time' },
  { id: 'pay_02', studentId: 'stu_002', studentName: 'Diya Nair', month: 'June 2026', fee: 1500, amountReceived: 0, status: 'Pending' },
  { id: 'pay_03', studentId: 'stu_003', studentName: 'Kabir Suresh', month: 'June 2026', fee: 1800, amountReceived: 1800, status: 'Paid', paymentDate: '2026-06-01', method: 'Bank Transfer' },
  { id: 'pay_04', studentId: 'stu_004', studentName: 'Ananya Pillai', month: 'June 2026', fee: 1500, amountReceived: 700, status: 'Partial', paymentDate: '2026-06-10', method: 'Cash', note: 'Balance ₹800 pending' },
  { id: 'pay_05', studentId: 'stu_006', studentName: 'Meera Krishnan', month: 'June 2026', fee: 1500, amountReceived: 0, status: 'Pending' },
];

export const privateNotes: PrivateNote[] = [
  { id: 'note_01', studentId: 'stu_004', studentName: 'Ananya Pillai', date: '2026-06-18', content: 'Parent requested a temporary pause due to exams. Marked inactive until 1 July.', pinned: true },
  { id: 'note_02', studentId: 'stu_002', studentName: 'Diya Nair', date: '2026-06-20', content: 'Fee reminder sent on WhatsApp. Follow up if unpaid by 25th.', pinned: false },
  { id: 'note_03', studentId: 'stu_003', studentName: 'Kabir Suresh', date: '2026-06-15', content: 'Strong candidate for the advanced batch once curriculum is ready.', pinned: true },
];

export const announcements: Announcement[] = [
  { id: 'an_01', title: 'Class rescheduled — 5 July', body: 'Saturday\'s class moves to 6:30 PM due to a public holiday.', publishDate: '2026-06-28', priority: 'Important', status: 'Published' },
  { id: 'an_02', title: 'New puzzle set released', body: 'This week\'s puzzle set focuses on knight forks. Try to finish before Friday.', publishDate: '2026-06-25', priority: 'Normal', status: 'Published' },
  { id: 'an_03', title: 'Monthly fee reminder', body: 'Please clear June fees by the 5th to avoid access interruption.', publishDate: '2026-06-01', priority: 'Urgent', status: 'Archived' },
];

export const adminSummary = {
  totalActive: students.filter(s => s.status === 'active').length,
  totalInactive: students.filter(s => s.status === 'inactive').length,
  paymentPending: payments.filter(p => p.status !== 'Paid').length,
  missingUpdates: students.filter(s => !s.lastUpdateWeek).length,
  recentUploads: 5,
};

export const attendanceTrend = [
  { week: 'W1', pct: 80 },
  { week: 'W2', pct: 85 },
  { week: 'W3', pct: 78 },
  { week: 'W4', pct: 92 },
  { week: 'W5', pct: 88 },
  { week: 'W6', pct: 92 },
];

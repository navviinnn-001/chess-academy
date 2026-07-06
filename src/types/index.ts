export type AccountStatus = 'active' | 'inactive';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial';
export type ContentType = 'YouTube' | 'PDF' | 'Note' | 'Link';
export type Difficulty = 'Beginner' | 'Easy' | 'Intermediate' | 'Advanced';
export type ClassStatus = 'upcoming' | 'live-soon' | 'completed';
export type AttendanceMark = 'Present' | 'Absent' | 'Late';

export interface Student {
  id: string;
  name: string;
  avatarInitials: string;
  age: number;
  language: 'Malayalam' | 'English';
  status: AccountStatus;
  joinedOn: string;
  contact: string;
  attendancePct: number;
  learningPct: number;
  puzzlePct: number;
  paymentStatus: PaymentStatus;
  lastUpdateWeek: string | null;
}

export interface LiveClass {
  id: string;
  topic: string;
  dateTime: string; // ISO
  status: ClassStatus;
  meetingLink?: string;
  recordingLink?: string;
  instructions: string;
  homework?: string;
  published: boolean;
}

export interface LearningItem {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnail: string; // css gradient key
  completed: boolean;
  durationLabel?: string;
  publishedOn: string;
}

export interface Puzzle {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  instruction: string;
  hint: string;
  answer: string;
  explanation: string;
  youtubeLink?: string;
  completed: boolean;
  status: 'draft' | 'published';
}

export interface WeeklyUpdate {
  id: string;
  studentId: string;
  week: string;
  attendance: string;
  topicsCovered: string[];
  strengths: string;
  improvementArea: string;
  nextTask: string;
  rating: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  fee: number;
  amountReceived: number;
  status: PaymentStatus;
  paymentDate?: string;
  method?: string;
  note?: string;
}

export interface PrivateNote {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  content: string;
  pinned: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  publishDate: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  status: 'Published' | 'Archived';
}

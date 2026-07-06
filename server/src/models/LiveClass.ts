import mongoose, { Schema } from 'mongoose';

const attendanceEntry = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mark: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  },
  { _id: false },
);

const liveClassSchema = new Schema(
  {
    topic: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    instructions: { type: String, default: '' },
    homework: { type: String, default: '' },
    meetingLink: { type: String, default: '' },
    recordingLink: { type: String, default: '' },
    published: { type: Boolean, default: false },
    status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
    attendance: { type: [attendanceEntry], default: [] },
  },
  { timestamps: true },
);

export const LiveClass = mongoose.model('LiveClass', liveClassSchema);

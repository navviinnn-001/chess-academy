import mongoose, { Schema } from 'mongoose';

const weeklyUpdateSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    week: { type: String, required: true },
    attendance: { type: String, default: '' },
    topicsCovered: { type: [String], default: [] },
    strengths: { type: String, default: '' },
    improvementArea: { type: String, default: '' },
    nextTask: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 4 },
  },
  { timestamps: true },
);

export const WeeklyUpdate = mongoose.model('WeeklyUpdate', weeklyUpdateSchema);

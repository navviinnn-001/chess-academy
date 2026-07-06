import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
    priority: { type: String, enum: ['Normal', 'Important', 'Urgent'], default: 'Normal' },
    status: { type: String, enum: ['Published', 'Archived'], default: 'Published' },
  },
  { timestamps: true },
);

export const Announcement = mongoose.model('Announcement', announcementSchema);

import mongoose, { Schema } from 'mongoose';

const learningItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['YouTube', 'PDF', 'Note', 'Link'], required: true },
    description: { type: String, default: '' },
    url: { type: String, default: '' },
    thumbnail: { type: String, default: 'from-navy-600 to-navy-800' },
    durationLabel: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    publishedOn: { type: Date, default: Date.now },
    completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const LearningItem = mongoose.model('LearningItem', learningItemSchema);

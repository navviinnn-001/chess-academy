import mongoose, { Schema } from 'mongoose';

const puzzleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Easy', 'Intermediate', 'Advanced'], required: true },
    imageUrl: { type: String, default: '' },
    instruction: { type: String, required: true },
    hint: { type: String, default: '' },
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
    youtubeLink: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const Puzzle = mongoose.model('Puzzle', puzzleSchema);

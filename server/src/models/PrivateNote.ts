import mongoose, { Schema } from 'mongoose';

const privateNoteSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const PrivateNote = mongoose.model('PrivateNote', privateNoteSchema);

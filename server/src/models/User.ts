import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    contact: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student'], required: true, default: 'student' },

    // Student-only fields
    age: { type: Number },
    language: { type: String, enum: ['Malayalam', 'English'], default: 'English' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    joinedOn: { type: Date, default: Date.now },

    mustChangePassword: { type: Boolean, default: false },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain: string) {
  return bcrypt.hash(plain, 10);
};

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  comparePassword: (candidate: string) => Promise<boolean>;
};

export const User = mongoose.model('User', userSchema);

import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    fee: { type: Number, required: true },
    amountReceived: { type: Number, default: 0 },
    status: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
    paymentDate: { type: Date },
    method: { type: String, enum: ['UPI', 'Cash', 'Bank Transfer', ''], default: '' },
    note: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Payment = mongoose.model('Payment', paymentSchema);

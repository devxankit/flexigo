import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success',
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Transaction', TransactionSchema);

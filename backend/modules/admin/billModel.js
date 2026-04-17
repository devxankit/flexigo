import mongoose from 'mongoose';

const VendorBillSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.VendorBill || mongoose.model('VendorBill', VendorBillSchema);

import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    default: 'Operations'
  },
  shift: {
    type: String,
    default: 'Regular'
  },
  status: {
    type: String,
    enum: ['active', 'on-leave', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.FlexigoStaff || mongoose.model('FlexigoStaff', StaffSchema);

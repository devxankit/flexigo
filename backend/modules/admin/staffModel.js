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
  phone: {
    type: String,
    trim: true
  },
  shift: {
    type: String,
    default: 'Regular'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  workingHours: {
    type: Number,
    default: 8
  },
  attendance: {
    type: Number,
    default: 100
  },
  workDaysCount: {
    type: Number,
    default: 5
  },
  weeklyAttendance: {
    type: [String],
    default: ['present', 'present', 'present', 'present', 'present']
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

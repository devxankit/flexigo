import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
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
    default: 9
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
    enum: ['active', 'on-leave', 'inactive', 'terminated'],
    default: 'active'
  },
  kycDetails: {
    aadhaar: String,
    pan: String,
    aadhaarFront: String,
    aadhaarBack: String,
    isVerified: { type: Boolean, default: false },
    ekycData: Object
  },
  contractUrl: String,
  isContractAccepted: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

if (mongoose.models.FlexigoStaff) {
  delete mongoose.models.FlexigoStaff;
}
export default mongoose.model('FlexigoStaff', StaffSchema);

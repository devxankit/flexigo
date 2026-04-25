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
  phone: {
    type: String
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
  reportingManager: {
    type: String
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  cityZone: {
    type: String
  },
  shift: {
    type: String,
    default: 'Regular'
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

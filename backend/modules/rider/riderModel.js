import mongoose from 'mongoose';

const RiderSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    default: 'rider',
  },
  otp: String,
  otpExpire: Date,
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  kycStatus: {
    type: String,
    enum: ['uninitiated', 'pending', 'approved', 'rejected'],
    default: 'uninitiated',
  },
  kycDetails: {
    selfie: String,
    aadhaarFront: String,
    aadhaarBack: String,
    drivingLicense: String,
    ekycVerified: { type: Boolean, default: false },
    ekycData: Object,
  },
  name: String,
  email: String,
  isRegistered: {
    type: Boolean,
    default: false,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'pending', 'completed'],
    default: 'pending',
  },
  subscriptionPlan: {
    type: String,
    default: null,
  },
  subscriptionStart: Date,
  subscriptionEnd: Date,
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rider', RiderSchema);

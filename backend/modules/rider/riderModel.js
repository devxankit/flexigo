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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rider', RiderSchema);

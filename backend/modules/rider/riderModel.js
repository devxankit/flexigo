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
    panCard: String,
    drivingLicense: String,
    ekycVerified: { type: Boolean, default: false },
    ekycData: Object,
    certificate: String,
    referenceName: { type: String, default: '' },
    referenceNumber: { type: String, default: '' },
    referenceName2: { type: String, default: '' },
    referenceNumber2: { type: String, default: '' },
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
    enum: ['approved', 'active', 'paused', 'pending', 'completed', 'inactive', 'suspended', 'rejected'],
    default: 'pending',
  },
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
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
  fcmToken: {
    type: String,
    default: null
  },
  fcmTokenMobile: {
    type: String,
    default: null
  },
  lastLocation: {
    lat: Number,
    lng: Number,
    address: String,
    updatedAt: Date
  },
  currentSpeed: {
    type: Number,
    default: 0
  },
  totalDistance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rider', RiderSchema);

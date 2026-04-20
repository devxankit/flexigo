import mongoose from 'mongoose';

const FranchiseSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
  aadhaarNumber: String,
  panNumber: String,
  
  // Business Details
  businessDetails: {
    name: { type: String },
    type: { type: String },
    location: { type: String },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },

  // Hub Plan
  hubPlan: {
    id: { type: String },
    name: { type: String },
    price: { type: Number },
  },

  // Bank Details
  bankDetails: {
    beneficiary: { type: String },
    accountNo: { type: String },
    ifsc: { type: String },
  },

  // KYC
  kycDetails: {
    selfie: { type: String },
    aadhaarFront: { type: String },
    aadhaarBack: { type: String },
    panCard: { type: String },
    businessLicense: { type: String },
    ekycVerified: { type: Boolean, default: false },
    ekycData: Object,
  },

  kycStatus: {
    type: String,
    default: 'uninitiated',
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  otp: String,
  otpExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Franchise', FranchiseSchema);

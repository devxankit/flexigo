import Rider from './riderModel.js';
import Transaction from './transactionModel.js';
import generateToken from '../../shared/utils/generateToken.js';
import cloudinary from '../../config/cloudinary.js';

// @desc    Send OTP to Rider (Mock)
// @route   POST /api/v1/rider/auth/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    // Default OTP as requested by user
    const otp = '123456';
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let rider = await Rider.findOne({ phone });

    if (rider) {
      rider.otp = otp;
      rider.otpExpire = otpExpire;
      await rider.save();
    } else {
      rider = await Rider.create({
        phone,
        otp,
        otpExpire,
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (Default: 123456)',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/rider/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide phone and OTP' });
    }

    const rider = await Rider.findOne({ phone });

    if (!rider || rider.otp !== otp || rider.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    rider.otp = undefined;
    rider.otpExpire = undefined;
    rider.isPhoneVerified = true;
    await rider.save();

    res.status(200).json({
      success: true,
      token: generateToken(rider._id),
      rider: {
        id: rider._id,
        phone: rider.phone,
        kycStatus: rider.kycStatus,
        isRegistered: rider.isRegistered,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update KYC Details
// @route   POST /api/v1/rider/kyc/update
export const updateKYC = async (req, res) => {
  try {
    const { selfie, aadhaarFront, aadhaarBack, drivingLicense } = req.body;
    
    // In a real app, req.rider would come from auth middleware
    // For now, we take phone from body or just use a mock approach if auth not ready
    const { phone } = req.body; 

    const rider = await Rider.findOne({ phone });

    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    const uploadToCloudinary = async (base64Data, folder) => {
        if (!base64Data) return null;
        const result = await cloudinary.uploader.upload(base64Data, {
            folder: `flexigo/riders/${rider._id}/${folder}`
        });
        return result.secure_url;
    };

    if (selfie) rider.kycDetails.selfie = await uploadToCloudinary(selfie, 'selfie');
    if (aadhaarFront) rider.kycDetails.aadhaarFront = await uploadToCloudinary(aadhaarFront, 'aadhaar');
    if (aadhaarBack) rider.kycDetails.aadhaarBack = await uploadToCloudinary(aadhaarBack, 'aadhaar');
    if (drivingLicense) rider.kycDetails.drivingLicense = await uploadToCloudinary(drivingLicense, 'license');

    rider.kycStatus = 'pending';
    rider.isRegistered = true;
    await rider.save();

    res.status(200).json({
      success: true,
      message: 'KYC documents updated successfully',
      rider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Rider Profile
// @route   GET /api/v1/rider/profile/:phone
export const getRiderProfile = async (req, res) => {
    try {
        const rider = await Rider.findOne({ phone: req.params.phone });
        if (!rider) {
            return res.status(404).json({ success: false, message: 'Rider not found' });
        }
        res.status(200).json({ success: true, rider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add Money to Wallet
// @route   POST /api/v1/rider/wallet/add
export const addMoney = async (req, res) => {
    try {
        const { phone, amount } = req.body;

        if (!phone || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid data' });
        }

        const rider = await Rider.findOne({ phone });
        if (!rider) {
            return res.status(404).json({ success: false, message: 'Rider not found' });
        }

        // Update balance
        rider.walletBalance += Number(amount);
        await rider.save();

        // Create transaction record
        await Transaction.create({
            riderId: rider._id,
            amount,
            type: 'credit',
            status: 'success',
            description: 'Added to wallet',
        });

        res.status(200).json({
            success: true,
            message: `₹${amount} added successfully`,
            walletBalance: rider.walletBalance,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Wallet Data (Balance + Transactions)
// @route   GET /api/v1/rider/wallet/:phone
export const getWalletData = async (req, res) => {
    try {
        const rider = await Rider.findOne({ phone: req.params.phone });
        if (!rider) {
            return res.status(404).json({ success: false, message: 'Rider not found' });
        }

        const transactions = await Transaction.find({ riderId: rider._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            walletBalance: rider.walletBalance,
            transactions,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get All Subscribers for a Franchise
// @route   GET /api/v1/rider/subscribers
export const getSubscribersByFranchise = async (req, res) => {
  try {
    const franchiseId = req.franchise ? req.franchise._id : req.query.franchiseId;
    if (!franchiseId) {
      return res.status(400).json({ success: false, message: 'Franchise ID required' });
    }
    const subscribers = await Rider.find({ franchise: franchiseId });
    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


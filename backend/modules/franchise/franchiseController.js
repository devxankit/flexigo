import Franchise from './franchiseModel.js';
import FranchiseTransaction from './franchiseTransactionModel.js';
import Vehicle from '../fleet/vehicleModel.js';
import Rider from '../rider/riderModel.js';
import generateToken from '../../shared/utils/generateToken.js';
import cloudinary from '../../config/cloudinary.js';

// @desc    Send OTP to Franchise
// @route   POST /api/v1/franchise/auth/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    const otp = '123456'; // Default for demo
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    let franchise = await Franchise.findOne({ phone });

    if (franchise) {
      franchise.otp = otp;
      franchise.otpExpire = otpExpire;
      await franchise.save();
    } else {
      franchise = await Franchise.create({
        phone,
        otp,
        otpExpire,
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent (Default: 123456)',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/franchise/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const franchise = await Franchise.findOne({ phone });

    if (!franchise || franchise.otp !== otp || franchise.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    franchise.otp = undefined;
    franchise.otpExpire = undefined;
    franchise.isPhoneVerified = true;
    await franchise.save();

    res.status(200).json({
      success: true,
      token: generateToken(franchise._id),
      franchise: {
        id: franchise._id,
        phone: franchise.phone,
        isRegistered: franchise.isRegistered,
        isVerified: franchise.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Franchise Registration Data
// @route   POST /api/v1/franchise/update-registration
export const updateRegistration = async (req, res) => {
  try {
    const { phone, id, ...updateData } = req.body;
    console.log('Update Registration for:', { phone, id });

    let franchise;
    if (id) {
        franchise = await Franchise.findById(id);
    }
    
    if (!franchise && phone) {
        franchise = await Franchise.findOne({ phone });
    }

    // If still not found, CREATE it (Upsert logic)
    if (!franchise) {
      if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number required to create node' });
      }
      console.log('Upserting: Creating new franchise for phone:', phone);
      franchise = new Franchise({ phone });
    }
    
    console.log('Franchise target secured:', franchise._id);

    // Handle KYC image uploads if any
    const uploadToCloudinary = async (base64Data, folder) => {
        if (!base64Data || !base64Data.startsWith('data:image')) return base64Data;
        const result = await cloudinary.uploader.upload(base64Data, {
            folder: `flexigo/franchise/${franchise._id}/${folder}`
        });
        return result.secure_url;
    };

    if (updateData.kycDetails) {
        if (updateData.kycDetails.selfie) updateData.kycDetails.selfie = await uploadToCloudinary(updateData.kycDetails.selfie, 'kyc');
        if (updateData.kycDetails.aadhaarFront) updateData.kycDetails.aadhaarFront = await uploadToCloudinary(updateData.kycDetails.aadhaarFront, 'kyc');
        if (updateData.kycDetails.aadhaarBack) updateData.kycDetails.aadhaarBack = await uploadToCloudinary(updateData.kycDetails.aadhaarBack, 'kyc');
        if (updateData.kycDetails.panCard) updateData.kycDetails.panCard = await uploadToCloudinary(updateData.kycDetails.panCard, 'kyc');
        if (updateData.kycDetails.businessLicense) updateData.kycDetails.businessLicense = await uploadToCloudinary(updateData.kycDetails.businessLicense, 'kyc');
    }

    // Use franchise.set() to correctly merge nested objects
    franchise.set(updateData);
    
    // If it's the final review step or mark as registered
    if (updateData.markAsRegistered) {
        franchise.isRegistered = true;
    }

    await franchise.save();

    res.status(200).json({
      success: true,
      message: 'Registration updated',
      franchise,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Franchise Wallet Data
// @route   GET /api/v1/franchise/wallet
export const getWalletData = async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.franchise._id);
    const transactions = await FranchiseTransaction.find({ franchiseId: req.franchise._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      balance: franchise.walletBalance || 0,
      ledger: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Franchise Dashboard Metrics
// @route   GET /api/v1/franchise/dashboard-metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    const franchiseId = req.franchise._id;
    
    // Use dynamic calculations
    const vehicles = await Vehicle.find({ franchise: franchiseId });
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'available').length;
    const issuesVehicles = vehicles.filter(v => v.status === 'in-service' || v.status === 'quarantined').length;
    
    const subscribers = await Rider.find({ franchise: franchiseId, status: 'active' });
    const activeSubscribers = subscribers.length;
    
    // Utilization: Active Subs / Total Vehicles (if > 0)
    const utilization = totalVehicles > 0 ? ((activeSubscribers / totalVehicles) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalVehicles,
        availableVehicles,
        activeSubscribers,
        issuesVehicles,
        utilization,
        avgPlanValue: 850, // Still placeholder or can calculate from transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record a handover (Dispatch/Intake)
// @route   POST /api/v1/franchise/handover
export const createHandover = async (req, res) => {
  try {
    const { mode, subscriberId, vehicleId, photos, inspection, batteryLevel, returnDate, finalStatus } = req.body;
    
    const handover = await Handover.create({
      franchiseId: req.franchise._id,
      mode,
      subscriberId,
      vehicleId,
      photos,
      inspection,
      batteryLevel,
      returnDate,
      finalStatus
    });

    res.status(201).json({ success: true, handover });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

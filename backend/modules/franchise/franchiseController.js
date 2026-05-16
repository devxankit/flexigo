import mongoose from 'mongoose';
import Franchise from './franchiseModel.js';
import FranchiseTransaction from './franchiseTransactionModel.js';
import Handover from './handoverModel.js';
import Vehicle from '../fleet/vehicleModel.js';
import Rider from '../rider/riderModel.js';
import SubscriptionPlan from '../admin/subscriptionPlanModel.js';
import generateToken from '../../shared/utils/generateToken.js';
import { sendSMS } from '../../shared/utils/smsService.js';
import cloudinary from '../../config/cloudinary.js';
import axios from 'axios';
import FranchiseNotification from './franchiseNotificationModel.js';

// @desc    Send OTP to Franchise
// @route   POST /api/v1/franchise/auth/send-otp
export const sendOTP = async (req, res) => {
  console.log('\n[FRANCHISE AUTH] ----- SEND OTP START -----');
  try {
    const { phone } = req.body;
    console.log('[FRANCHISE AUTH] Phone Number:', phone);

    if (!phone) {
      console.log('[FRANCHISE AUTH] Error: Phone number missing');
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    // Generate OTP (Static for test number, Dynamic otherwise)
    const isTestNumber = phone === '9999999999';
    const otp = isTestNumber ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    console.log('[FRANCHISE AUTH] Generated OTP:', otp);

    let franchise = await Franchise.findOne({ phone });

    if (franchise) {
      console.log('[FRANCHISE AUTH] Existing Franchise found. Updating OTP...');
      franchise.otp = otp;
      franchise.otpExpire = otpExpire;
      await franchise.save();
    } else {
      console.log('[FRANCHISE AUTH] New Franchise. Creating record...');
      franchise = await Franchise.create({
        phone,
        otp,
        otpExpire,
      });
    }

    // Send SMS via SMSIndiaHub
    const message = `Welcome to the Flexigo powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;
    if (!isTestNumber) {
      console.log('[FRANCHISE AUTH] Triggering SMS Service...');
      try {
        await sendSMS(phone, message);
        console.log('[FRANCHISE AUTH] SMS sent successfully');
      } catch (smsError) {
        console.log('[FRANCHISE AUTH] SMS Sending FAILED:', smsError.message);
      }
    } else {
      console.log('[FRANCHISE AUTH] Test Number Detected. Skipping SMS.');
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.log('[FRANCHISE AUTH] CRITICAL ERROR:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
  console.log('[FRANCHISE AUTH] ----- SEND OTP END -----\n');
};

// @desc    Verify OTP
// @route   POST /api/v1/franchise/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    // LOG REQUEST BODY TO SEE IF TOKENS ARE ARRIVING
    console.log('[FRANCHISE AUTH] Verify OTP Request Body:', JSON.stringify(req.body, null, 2));

    const { phone, otp, fcmToken, fcmTokenMobile } = req.body;

    let franchise = await Franchise.findOne({ phone });

    if (!franchise) {
      return res.status(404).json({ success: false, message: 'Franchise not found' });
    }

    if (franchise.otp !== otp || franchise.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    franchise.otp = undefined;
    franchise.otpExpire = undefined;
    franchise.isPhoneVerified = true;

    // Robust Auto-upgrade: Check all possible verification markers (camelCase and snake_case)
    const isEkycDone = franchise.kycDetails?.ekycVerified || 
                       franchise.ekycVerified || 
                       franchise.aadhaarNumber || 
                       franchise.aadhaar_number ||
                       franchise.ownerName ||
                       (franchise.kycDetails?.ekycData && Object.keys(franchise.kycDetails.ekycData).length > 0);
    
    if (isEkycDone) {
      if (franchise.kycStatus !== 'approved' || !franchise.isVerified) {
        franchise.kycStatus = 'pending';
        franchise.isVerified = false;
        console.log(`[FRANCHISE AUTH] Setting ${phone} to pending status (Aadhaar/Owner data found, manual review required)`);
      }
    }

    // Update FCM Tokens
    if (fcmToken) {
      franchise.fcmToken = fcmToken;
      console.log(`[FCM] Updated Web/Generic Token for Franchise ${phone}:`, fcmToken);
    }
    if (fcmTokenMobile) {
      franchise.fcmTokenMobile = fcmTokenMobile;
      console.log(`[FCM] Updated Mobile Token for Franchise ${phone}:`, fcmTokenMobile);
    }

    await franchise.save();
    console.log(`[FRANCHISE AUTH] Saved franchise state for ${phone} (including FCM tokens)`);

    res.status(200).json({
      success: true,
      token: generateToken(franchise._id),
      franchise: {
        id: franchise._id,
        phone: franchise.phone,
        isRegistered: franchise.isRegistered,
        isVerified: franchise.isVerified,
        kycStatus: franchise.kycStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Franchise Login (Email/Password)
// @route   POST /api/v1/franchise/auth/login
export const franchiseLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find franchise by email
    const franchise = await Franchise.findOne({ email }).select('+password');

    if (!franchise || !(await franchise.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(franchise._id),
      franchise: {
        id: franchise._id,
        phone: franchise.phone,
        email: franchise.email,
        hubName: franchise.hubName,
        isRegistered: franchise.isRegistered,
        isVerified: franchise.isVerified,
        kycStatus: franchise.kycStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save FCM Token
// @route   POST /api/v1/franchise/auth/save-fcm-token
export const saveFcmToken = async (req, res) => {
  try {
    const { fcmToken, platform } = req.body;
    const franchiseId = req.franchise._id;

    if (!fcmToken || !platform) {
      return res.status(400).json({ success: false, message: 'Please provide token and platform' });
    }

    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) {
      return res.status(404).json({ success: false, message: 'Franchise not found' });
    }

    if (platform === 'web') {
      franchise.fcmToken = fcmToken;
      console.log(`[FCM] Save API: Updated Web Token for Franchise ${franchise.phone}`);
    } else if (platform === 'app') {
      franchise.fcmTokenMobile = fcmToken;
      console.log(`[FCM] Save API: Updated Mobile Token for Franchise ${franchise.phone}`);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid platform. Use "web" or "app"' });
    }

    await franchise.save();
    res.status(200).json({ success: true, message: 'FCM Token saved successfully' });
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
      const hasAllDocs = franchise.kycDetails?.selfie &&
        franchise.kycDetails?.aadhaarFront &&
        franchise.kycDetails?.aadhaarBack &&
        franchise.kycDetails?.panCard &&
        franchise.kycDetails?.businessLicense;

      // Prioritize eKYC verification for approval status (Check all possible markers)
      const isEkycDone = franchise.kycDetails?.ekycVerified || 
                         franchise.ekycVerified || 
                         franchise.aadhaarNumber || 
                         franchise.aadhaar_number || 
                         franchise.ownerName;

      if (isEkycDone) {
        franchise.kycStatus = 'pending';
        franchise.isVerified = false;
      } else {
        franchise.kycStatus = 'pending';
        franchise.isVerified = false;
      }
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

// @desc    Get active franchise plans
// @route   GET /api/v1/franchise/plans
export const getFranchisePlans = async (req, res) => {
  try {
    console.log('Fetching Franchise Plans from DB...');
    const plans = await SubscriptionPlan.find({
      target: 'Franchise',
      status: 'active'
    }).sort({ price: 1 });

    console.log('Total Franchise Plans found in Registry:', plans.length);
    res.status(200).json({ success: true, plans });
  } catch (error) {
    console.log('Registry Fetch Error:', error.message);
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

// @desc    Generate Aadhaar OTP for Franchise eKYC (QuickeKYC)
export const generateAadhaarOTP = async (req, res) => {
  console.log('--- FRANCHISE QUICKEKYC: GENERATE OTP START ---');
  try {
    const { aadhaarNumber } = req.body;
    console.log('FRANCHISE QUICKEKYC: Aadhaar Number:', aadhaarNumber);

    const config = {
      method: 'post',
      url: 'https://api.quickekyc.com/api/v1/aadhaar-v2/generate-otp',
      headers: { 'Content-Type': 'application/json' },
      data: {
        key: process.env.SUREPASS_API_KEY,
        id_number: aadhaarNumber
      }
    };

    const response = await axios(config);
    console.log('FRANCHISE QUICKEKYC: Response:', JSON.stringify(response.data));

    if (response.data.success || response.data.status === 'success' || response.data.message === 'OTP Sent.') {
      const requestId = response.data.data?.request_id || response.data.request_id || response.data.data?.client_id;
      res.status(200).json({
        success: true,
        client_id: requestId,
        message: response.data.message || 'OTP sent to mobile'
      });
    } else {
      res.status(400).json({ success: false, message: response.data.message || 'Failed to send OTP' });
    }
  } catch (error) {
    console.log('FRANCHISE QUICKEKYC Error:', error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
  console.log('--- FRANCHISE QUICKEKYC: GENERATE OTP END ---');
};

// @desc    Verify Aadhaar OTP for Franchise eKYC
export const verifyAadhaarOTP = async (req, res) => {
  console.log('--- FRANCHISE QUICKEKYC: VERIFY OTP START ---');
  try {
    const { client_id, otp, phone } = req.body;
    console.log('FRANCHISE QUICKEKYC: Verify Params:', { client_id, otp, phone });

    const config = {
      method: 'post',
      url: 'https://api.quickekyc.com/api/v1/aadhaar-v2/submit-otp',
      headers: { 'Content-Type': 'application/json' },
      data: {
        key: process.env.SUREPASS_API_KEY,
        request_id: client_id,
        otp
      }
    };

    const response = await axios(config);
    console.log('FRANCHISE QUICKEKYC: Verification Body:', JSON.stringify(response.data));

    if (response.data.success || response.data.status === 'success') {
      const kycData = response.data.data || response.data;

      const franchise = await Franchise.findOne({ phone });
      if (franchise) {
        console.log('FRANCHISE QUICKEKYC: Updating Franchise DB');
        franchise.kycDetails.ekycVerified = true;
        franchise.kycDetails.ekycData = kycData;
        franchise.kycStatus = 'pending';
        franchise.isVerified = false; // Set isVerified to false initially
        franchise.ownerName = kycData.full_name || kycData.name;
        console.log(`[FRANCHISE KYC] Updating status to approved and verified for phone: ${phone}`);
        await franchise.save();
        console.log(`[FRANCHISE KYC] DB Saved successfully for phone: ${phone}`);
      }

      res.status(200).json({
        success: true,
        message: 'Aadhaar Verified Successfully',
        data: kycData
      });
    } else {
      res.status(400).json({ success: false, message: response.data.message || 'OTP verification failed' });
    }
  } catch (error) {
    console.log('FRANCHISE QUICKEKYC Error:', error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
  console.log('--- FRANCHISE QUICKEKYC: VERIFY OTP END ---');
};

// @desc    Add new vehicle by Franchise
// @route   POST /api/v1/franchise/fleet/add
export const addVehicle = async (req, res) => {
  try {
    const { rcImage, insuranceDocImage, pucDocImage, ...vehicleData } = req.body;
    const franchiseId = req.franchise._id;

    vehicleData.franchise = franchiseId;

    const uploadDoc = async (base64, folder) => {
      if (!base64 || !base64.startsWith('data:image')) return '';
      const result = await cloudinary.uploader.upload(base64, {
        folder: `flexigo/vehicles/${folder}/${franchiseId}`,
      });
      return result.secure_url;
    };

    const [rcUrl, insuranceDocUrl, pucDocUrl] = await Promise.all([
      uploadDoc(rcImage, 'rc'),
      uploadDoc(insuranceDocImage, 'insurance'),
      uploadDoc(pucDocImage, 'puc'),
    ]);

    const vehicle = await Vehicle.create({
      ...vehicleData,
      ...(rcUrl && { rcUrl }),
      ...(insuranceDocUrl && { insuranceDocUrl }),
      ...(pucDocUrl && { pucDocUrl }),
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle provisioned successfully',
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Franchise Notifications
// @route   GET /api/v1/franchise/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await FranchiseNotification.find({ 
      franchiseId: req.franchise._id 
    }).sort('-createdAt').limit(50);

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark Notification as Read
// @route   PATCH /api/v1/franchise/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await FranchiseNotification.findOneAndUpdate(
      { _id: req.params.id, franchiseId: req.franchise._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark All Notifications as Read
// @route   PATCH /api/v1/franchise/notifications/mark-all-read
export const markAllNotificationsRead = async (req, res) => {
  try {
    await FranchiseNotification.updateMany(
      { franchiseId: req.franchise._id, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

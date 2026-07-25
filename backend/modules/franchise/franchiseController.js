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
import { saveImageLocal } from '../../shared/utils/localUpload.js';
import axios from 'axios';
import FranchiseNotification from './franchiseNotificationModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../rider/transactionModel.js';

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
    const message = `Welcome to the Flexigo powered by Appzeto.Your OTP for registration is ${otp}.BGADEC`;
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

// @desc Franchise Login (Email/Password)
// @route POST /api/v1/franchise/auth/login

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

// @desc    Reset Franchise Password
// @route   POST /api/v1/franchise/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide phone, otp, and new password' });
    }

    const franchise = await Franchise.findOne({ phone });

    if (!franchise) {
      return res.status(404).json({ success: false, message: 'Franchise not found' });
    }

    if (franchise.otp !== otp || franchise.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Set new password and clear OTP
    franchise.password = newPassword;
    franchise.otp = undefined;
    franchise.otpExpire = undefined;
    franchise.isPhoneVerified = true;

    await franchise.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      token: generateToken(franchise._id),
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

// @desc    Get All Riders and their Dues for the Franchise
// @route   GET /api/v1/franchise/riders/dues
export const getRiderDues = async (req, res) => {
  try {
    const riders = await Rider.find({ franchise: req.franchise._id }).populate('subscriptionPlan');
    
    const dues = riders.map(rider => {
      let isPlanDue = false;
      let planAmount = 0;
      let depositDue = !rider.depositPaid;

      if (rider.subscriptionPlan) {
        planAmount = rider.subscriptionPlan.price;
        if (!rider.subscriptionEnd || new Date(rider.subscriptionEnd) < new Date()) {
          isPlanDue = true;
        }
      }

      return {
        riderId: rider._id,
        name: rider.name || rider.phone,
        phone: rider.phone,
        status: rider.status,
        subscriptionPlan: rider.subscriptionPlan ? rider.subscriptionPlan.name : 'None',
        planAmount: planAmount,
        isPlanDue: isPlanDue,
        nextDueDate: rider.subscriptionEnd,
        depositPaid: rider.depositPaid,
        depositDue: depositDue
      };
    });

    res.status(200).json({ success: true, dues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Franchise Owner pays a Rider's Plan
// @route   POST /api/v1/franchise/riders/pay-plan
export const payRiderPlan = async (req, res) => {
  try {
    const { riderId, planId } = req.body;
    
    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
    let isOwner = false;
    const franchiseIdStr = req.franchise && req.franchise._id ? String(req.franchise._id) : '';
    if (franchiseIdStr) {
      if (rider.franchise && String(rider.franchise) === franchiseIdStr) {
        isOwner = true;
      } else if (rider.vehicleId) {
        const Vehicle = (await import('../fleet/vehicleModel.js')).default;
        const vehicle = await Vehicle.findById(rider.vehicleId);
        if (vehicle && vehicle.franchise && String(vehicle.franchise) === franchiseIdStr) {
          isOwner = true;
        }
      }
    }
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Rider does not belong to your franchise' });
    }

    const plan = await SubscriptionPlan.findById(planId || rider.subscriptionPlan);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const franchiseToUpdate = await Franchise.findById(req.franchise._id);
    if ((franchiseToUpdate.walletBalance || 0) < plan.price) {
      return res.status(400).json({ success: false, message: 'Insufficient franchise wallet balance' });
    }

    // Deduct from Franchise Wallet
    franchiseToUpdate.walletBalance -= plan.price;
    await franchiseToUpdate.save();

    // Create Transaction
    await FranchiseTransaction.create({
      franchiseId: franchiseToUpdate._id,
      amount: plan.price,
      type: 'Subscription',
      status: 'completed',
      subscriberName: rider.name || rider.phone,
      description: `Subscription paid for rider ${rider.name || rider.phone}`,
      paymentMethod: 'wallet'
    });

    // Update Rider Plan
    const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
    const expiresAt = new Date(Date.now() + durationMs);

    rider.status = 'active';
    rider.subscriptionPlan = plan._id;
    rider.subscriptionStart = new Date();
    rider.subscriptionEnd = expiresAt;
    await rider.save();

    // Notify Rider
    const msg = `Flexigo: Your franchise owner has paid your plan fee of ₹${plan.price}. Subscription is now active.`;
    try { await sendSMS(rider.phone, msg); } catch (e) {}

    res.status(200).json({ success: true, message: 'Rider plan paid successfully', walletBalance: franchiseToUpdate.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Franchise Owner pays a Rider's Deposit
// @route   POST /api/v1/franchise/riders/pay-deposit
export const payRiderDeposit = async (req, res) => {
  try {
    const { riderId, depositAmount } = req.body; // Default could be fetched from settings, but keeping it flexible

    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
    let isOwner = false;
    const franchiseIdStr = req.franchise && req.franchise._id ? String(req.franchise._id) : '';
    if (franchiseIdStr) {
      if (rider.franchise && String(rider.franchise) === franchiseIdStr) {
        isOwner = true;
      } else if (rider.vehicleId) {
        const Vehicle = (await import('../fleet/vehicleModel.js')).default;
        const vehicle = await Vehicle.findById(rider.vehicleId);
        if (vehicle && vehicle.franchise && String(vehicle.franchise) === franchiseIdStr) {
          isOwner = true;
        }
      }
    }
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Rider does not belong to your franchise' });
    }
    
    if (rider.depositPaid) {
      return res.status(400).json({ success: false, message: 'Deposit already paid for this rider' });
    }

    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
    }

    const franchiseToUpdate = await Franchise.findById(req.franchise._id);
    if ((franchiseToUpdate.walletBalance || 0) < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient franchise wallet balance for deposit' });
    }

    // Deduct from Franchise Wallet
    franchiseToUpdate.walletBalance -= amount;
    await franchiseToUpdate.save();

    // Create Transaction
    await FranchiseTransaction.create({
      franchiseId: franchiseToUpdate._id,
      amount: amount,
      type: 'Deposit Paid',
      status: 'completed',
      subscriberName: rider.name || rider.phone,
      description: `Security deposit paid for rider ${rider.name || rider.phone}`,
      paymentMethod: 'wallet'
    });

    rider.depositPaid = true;
    await rider.save();

    res.status(200).json({ success: true, message: 'Rider deposit paid successfully', walletBalance: franchiseToUpdate.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Rider from Franchise
// @route   POST /api/v1/franchise/riders/add
export const addRider = async (req, res) => {
  try {
    const { phone, name, email, aadhaar, pan, licenseNo, address, vehicleId } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    let rider = await Rider.findOne({ phone });
    if (rider) {
      return res.status(400).json({ success: false, message: 'Rider with this phone already exists' });
    }

    rider = await Rider.create({
      phone,
      name,
      email,
      franchise: req.franchise._id,
      isPhoneVerified: true,
      isRegistered: true,
      status: 'pending',
      kycStatus: 'approved',
      subscriptionPlan: null,
      kycDetails: { 
        aadhaarNumber: aadhaar, 
        panCard: pan, 
        drivingLicense: licenseNo, 
        ekycVerified: true, 
        address 
      }
    });

    res.status(201).json({ success: true, rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/*
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

// @desc    Get All Riders and their Dues for the Franchise
// @route   GET /api/v1/franchise/riders/dues
export const getRiderDues = async (req, res) => {
  try {
    const Vehicle = (await import('../fleet/vehicleModel.js')).default;
    const vehicles = await Vehicle.find({ franchise: req.franchise._id });
    const vehicleIds = vehicles.map(v => v._id);

    const riders = await Rider.find({ 
      $or: [
        { franchise: req.franchise._id },
        { vehicleId: { $in: vehicleIds } }
      ]
    }).populate('subscriptionPlan');
    
    const dues = riders.map(rider => {
      let isPlanDue = false;
      let planAmount = 0;
      let depositDue = !rider.depositPaid;

      if (rider.subscriptionPlan) {
        planAmount = rider.subscriptionPlan.price;
        if (!rider.subscriptionEnd || new Date(rider.subscriptionEnd) < new Date()) {
          isPlanDue = true;
        }
      }

      return {
        riderId: rider._id,
        name: rider.name || rider.phone,
        phone: rider.phone,
        status: rider.status,
        subscriptionPlan: rider.subscriptionPlan ? rider.subscriptionPlan.name : 'None',
        planAmount: planAmount,
        isPlanDue: isPlanDue,
        nextDueDate: rider.subscriptionEnd,
        depositPaid: rider.depositPaid,
        depositDue: depositDue
      };
    });

    res.status(200).json({ success: true, dues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Franchise Owner pays a Rider's Plan
// @route   POST /api/v1/franchise/riders/pay-plan
export const payRiderPlan = async (req, res) => {
  try {
    const { riderId, planId } = req.body;
    
    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    let isOwner = false;
    const franchiseIdStr = req.franchise && req.franchise._id ? String(req.franchise._id) : '';
    
    if (franchiseIdStr) {
      if (rider.franchise && String(rider.franchise) === franchiseIdStr) {
        isOwner = true;
      } else if (rider.vehicleId) {
        const Vehicle = (await import('../fleet/vehicleModel.js')).default;
        const vehicle = await Vehicle.findById(rider.vehicleId);
        if (vehicle && vehicle.franchise && String(vehicle.franchise) === franchiseIdStr) {
          isOwner = true;
        }
      }
    }

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Rider does not belong to your franchise' });
    }

    const plan = await SubscriptionPlan.findById(planId || rider.subscriptionPlan);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const franchiseToUpdate = await Franchise.findById(req.franchise._id);
    if ((franchiseToUpdate.walletBalance || 0) < plan.price) {
      return res.status(400).json({ success: false, message: 'Insufficient franchise wallet balance' });
    }

    // Deduct from Franchise Wallet
    franchiseToUpdate.walletBalance -= plan.price;
    await franchiseToUpdate.save();

    // Create Transaction
    await FranchiseTransaction.create({
      franchiseId: franchiseToUpdate._id,
      amount: plan.price,
      type: 'Subscription',
      status: 'completed',
      subscriberName: rider.name || rider.phone,
      description: `Subscription paid for rider ${rider.name || rider.phone}`,
      paymentMethod: 'wallet'
    });

    await Transaction.create({
      riderId: rider._id,
      amount: plan.price,
      type: 'debit',
      status: 'success',
      description: `Plan Subscription (Paid by Franchise Wallet)`,
      method: 'wallet',
      planId: plan._id
    });

    // Update Rider Plan
    const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
    const expiresAt = new Date(Date.now() + durationMs);

    rider.status = 'active';
    rider.subscriptionPlan = plan._id;
    rider.subscriptionStart = new Date();
    rider.subscriptionEnd = expiresAt;
    await rider.save();

    // Notify Rider
    const msg = `Flexigo: Your franchise owner has paid your plan fee of ₹${plan.price}. Subscription is now active.`;
    res.status(200).json({ success: true, message: 'Rider plan paid successfully', walletBalance: franchiseToUpdate.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Franchise Owner pays a Rider's Deposit
// @route   POST /api/v1/franchise/riders/pay-deposit
export const payRiderDeposit = async (req, res) => {
  try {
    const { riderId, depositAmount, planId, paymentMethod } = req.body; 

    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    let isOwner = false;
    const franchiseIdStr = req.franchise && req.franchise._id ? String(req.franchise._id) : '';

    if (franchiseIdStr) {
      if (rider.franchise && String(rider.franchise) === franchiseIdStr) {
        isOwner = true;
      } else if (rider.vehicleId) {
        const Vehicle = (await import('../fleet/vehicleModel.js')).default;
        const vehicle = await Vehicle.findById(rider.vehicleId);
        if (vehicle && vehicle.franchise && String(vehicle.franchise) === franchiseIdStr) {
          isOwner = true;
        }
      }
    }

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Rider does not belong to your franchise' });
    }
    
    if (rider.depositPaid) {
      return res.status(400).json({ success: false, message: 'Deposit already paid for this rider' });
    }

    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
    }

    if (paymentMethod === 'razorpay') {
       return res.status(400).json({ success: false, message: 'Razorpay direct payment is under development. Please add funds to wallet first.' });
    }

    const franchiseToUpdate = await Franchise.findById(req.franchise._id);
    if ((franchiseToUpdate.walletBalance || 0) < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient franchise wallet balance for deposit' });
    }

    // Deduct from Franchise Wallet
    franchiseToUpdate.walletBalance -= amount;
    await franchiseToUpdate.save();

    // Create Transaction
    await FranchiseTransaction.create({
      franchiseId: franchiseToUpdate._id,
      amount: amount,
      type: 'Deposit Paid',
      status: 'completed',
      subscriberName: rider.name || rider.phone,
      description: `Security deposit paid for rider ${rider.name || rider.phone}`,
      paymentMethod: 'wallet'
    });

    await Transaction.create({
      riderId: rider._id,
      amount: amount,
      type: 'debit',
      status: 'success',
      description: `Security Deposit (Paid by Franchise Wallet)`,
      method: 'wallet',
      planId: planId || null
    });

    rider.depositPaid = true;
    if (planId) {
      rider.subscriptionPlan = planId;
    }
    await rider.save();

    res.status(200).json({ success: true, message: 'Rider deposit paid and plan saved successfully', walletBalance: franchiseToUpdate.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Create Razorpay Order for Rider Deposit
// @route   POST /api/v1/franchise/riders/deposit-create-order
export const createDepositOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await instance.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    res.status(200).json({ success: true, order });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Verify Razorpay Payment for Rider Deposit
// @route   POST /api/v1/franchise/riders/deposit-verify
export const verifyDepositPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, riderId, depositAmount, planId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
      const rider = await Rider.findById(riderId);
      if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

      rider.depositPaid = true;
      if (planId) {
        rider.subscriptionPlan = planId;
      }
      await rider.save();

      await FranchiseTransaction.create({
        franchiseId: req.franchise._id,
        amount: depositAmount,
        type: 'Deposit Paid',
        status: 'completed',
        subscriberName: rider.name || rider.phone,
        description: `Security deposit paid via Razorpay for rider ${rider.name || rider.phone}`,
        paymentMethod: 'razorpay'
      });

      res.status(200).json({ success: true, message: 'Payment verified and deposit paid' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Add Rider from Franchise
// @route   POST /api/v1/franchise/riders/add
export const addRider = async (req, res) => {
  try {
    const { phone, name, email, aadhaar, pan, licenseNo, address, vehicleId } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    let rider = await Rider.findOne({ phone });
    if (rider) {
      return res.status(400).json({ success: false, message: 'Rider with this phone already exists' });
    }

    rider = await Rider.create({
      phone,
      name,
      email,
      franchise: req.franchise._id,
      isPhoneVerified: true,
      isRegistered: true,
      status: 'pending',
      kycStatus: 'approved',
      subscriptionPlan: null,
      kycDetails: { 
        aadhaarNumber: aadhaar, 
        panCard: pan, 
        drivingLicense: licenseNo, 
        ekycVerified: true, 
        address 
      },
      lastLocation: {
        lat: req.franchise.businessDetails?.latitude || 22.7196,
        lng: req.franchise.businessDetails?.longitude || 75.8577,
        address: req.franchise.businessDetails?.address || 'Franchise Hub, Indore',
        updatedAt: new Date()
      }
    });

    res.status(201).json({ success: true, rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/

// @desc    Create Razorpay Order for Rider Plan
// @route   POST /api/v1/franchise/riders/plan-create-order
export const createPlanOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await instance.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `plan_receipt_${Date.now()}`
    });

    res.status(200).json({ success: true, order });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Verify Razorpay Payment for Rider Plan
// @route   POST /api/v1/franchise/riders/plan-verify
export const verifyPlanPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, riderId, planId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
      const rider = await Rider.findById(riderId);
      if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
      
      const plan = await SubscriptionPlan.findById(planId);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

      // Create Transaction
      await FranchiseTransaction.create({
        franchiseId: req.franchise._id,
        amount: plan.price,
        type: 'Subscription',
        status: 'completed',
        subscriberName: rider.name || rider.phone,
        description: `Subscription paid via Razorpay for rider ${rider.name || rider.phone}`,
        paymentMethod: 'razorpay'
      });

      await Transaction.create({
        riderId: rider._id,
        amount: plan.price,
        type: 'debit',
        status: 'success',
        description: `Plan Subscription (Paid by Franchise via Razorpay)`,
        method: 'razorpay',
        planId: plan._id
      });

      // Update Rider Plan
      const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
      const expiresAt = new Date(Date.now() + durationMs);

      rider.status = 'active';
      rider.subscriptionPlan = plan._id;
      rider.subscriptionStart = new Date();
      rider.subscriptionEnd = expiresAt;
      await rider.save();

      // Notify Rider
      const msg = `Flexigo: Your franchise owner has paid your plan fee of ₹${plan.price}. Subscription is now active.`;
      try { await sendSMS(rider.phone, msg); } catch (e) {}

      res.status(200).json({ success: true, message: 'Plan payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Razorpay Order for Rider Deposit
// @route   POST /api/v1/franchise/riders/deposit-create-order
export const createDepositOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await instance.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    res.status(200).json({ success: true, order });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Verify Razorpay Payment for Rider Deposit
// @route   POST /api/v1/franchise/riders/deposit-verify
export const verifyDepositPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, riderId, depositAmount, planId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
      const rider = await Rider.findById(riderId);
      if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

      rider.depositPaid = true;
      if (planId) {
        rider.subscriptionPlan = planId;
      }
      await rider.save();

      await FranchiseTransaction.create({
        franchiseId: req.franchise._id,
        amount: depositAmount,
        type: 'Deposit Paid',
        status: 'completed',
        subscriberName: rider.name || rider.phone,
        description: `Security deposit paid via Razorpay for rider ${rider.name || rider.phone}`,
        paymentMethod: 'razorpay'
      });

      await Transaction.create({
        riderId: rider._id,
        amount: depositAmount,
        type: 'debit',
        status: 'success',
        description: `Security Deposit (Paid by Franchise via Razorpay)`,
        method: 'razorpay',
        planId: planId || null
      });

      res.status(200).json({ success: true, message: 'Payment verified and deposit paid' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

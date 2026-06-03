import axios from 'axios';
import Rider from './riderModel.js';
import Transaction from './transactionModel.js';
import Franchise from '../franchise/franchiseModel.js';
import Vehicle from '../fleet/vehicleModel.js';
import SubscriptionPlan from '../admin/subscriptionPlanModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import generateToken from '../../shared/utils/generateToken.js';
import { sendSMS } from '../../shared/utils/smsService.js';
import cloudinary from '../../config/cloudinary.js';
import Geofence from '../admin/geofenceModel.js';
import { sendPushNotification } from '../../shared/utils/firebase.js';
import AuditLog from '../admin/auditLogModel.js';
import Admin from '../admin/adminModel.js';
import FranchiseNotification from '../franchise/franchiseNotificationModel.js';

const lastGeofenceAlertTimes = new Map();

// @desc    Send OTP to Rider
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Please provide a phone number' });

    const isTestNumber = phone === '4315256688';
    const otp = isTestNumber ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    let rider = await Rider.findOne({ phone });
    if (rider) {
      rider.otp = otp;
      rider.otpExpire = otpExpire;
      await rider.save();
    } else {
      rider = await Rider.create({ phone, otp, otpExpire });
    }

    const message = `Welcome to the Flexigo powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;
    if (!isTestNumber) {
      try { await sendSMS(phone, message); } catch (e) {}
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, fcmToken, fcmTokenMobile } = req.body;
    const rider = await Rider.findOne({ phone });

    if (!rider || rider.otp !== otp || rider.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    rider.otp = undefined;
    rider.otpExpire = undefined;
    rider.isPhoneVerified = true;
    if (fcmToken) rider.fcmToken = fcmToken;
    if (fcmTokenMobile) rider.fcmTokenMobile = fcmTokenMobile;
    await rider.save();

    res.status(200).json({
      success: true,
      token: generateToken(rider._id),
      rider: { id: rider._id, phone: rider.phone, kycStatus: rider.kycStatus, isRegistered: rider.isRegistered },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save FCM Token
export const saveFcmToken = async (req, res) => {
  try {
    const { fcmToken, platform } = req.body;
    const rider = await Rider.findById(req.rider._id);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    if (platform === 'web') rider.fcmToken = fcmToken;
    else if (platform === 'app') rider.fcmTokenMobile = fcmToken;
    await rider.save();
    res.status(200).json({ success: true, message: 'FCM Token saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update KYC Details
export const updateKYC = async (req, res) => {
  try {
    const { 
      phone, 
      selfie, 
      aadhaarFront, 
      aadhaarBack, 
      drivingLicense,
      referenceName,
      referenceNumber,
      referenceName2,
      referenceNumber2
    } = req.body;
    const rider = await Rider.findOne({ phone });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    const upload = async (data, folder) => {
      if (!data) return null;
      const res = await cloudinary.uploader.upload(data, { folder: `flexigo/riders/${rider._id}/${folder}` });
      return res.secure_url;
    };

    if (selfie) rider.kycDetails.selfie = await upload(selfie, 'selfie');
    if (aadhaarFront) rider.kycDetails.aadhaarFront = await upload(aadhaarFront, 'aadhaar');
    if (aadhaarBack) rider.kycDetails.aadhaarBack = await upload(aadhaarBack, 'aadhaar');
    if (drivingLicense) rider.kycDetails.drivingLicense = await upload(drivingLicense, 'license');

    // Extract dynamic reference fields (checking flat fields first, then falling back to nested)
    const refName = referenceName !== undefined ? referenceName : req.body.kycDetails?.referenceName;
    const refNum = referenceNumber !== undefined ? referenceNumber : req.body.kycDetails?.referenceNumber;
    const refName2 = referenceName2 !== undefined ? referenceName2 : req.body.kycDetails?.referenceName2;
    const refNum2 = referenceNumber2 !== undefined ? referenceNumber2 : req.body.kycDetails?.referenceNumber2;

    if (refName !== undefined) rider.kycDetails.referenceName = refName;
    if (refNum !== undefined) rider.kycDetails.referenceNumber = refNum;
    if (refName2 !== undefined) rider.kycDetails.referenceName2 = refName2;
    if (refNum2 !== undefined) rider.kycDetails.referenceNumber2 = refNum2;

    rider.kycStatus = 'pending';
    rider.status = rider.kycStatus;
    rider.isRegistered = true;
    await rider.save();

    res.status(200).json({ success: true, message: 'KYC updated', rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Aadhaar OTP
export const generateAadhaarOTP = async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    const response = await axios.post('https://api.quickekyc.com/api/v1/aadhaar-v2/generate-otp', {
      key: process.env.SUREPASS_API_KEY,
      id_number: aadhaarNumber
    });
    
    if (response.data.success || response.data.status === 'success' || response.data.message === 'OTP Sent.') {
      const requestId = response.data.data?.request_id || response.data.request_id || response.data.data?.client_id;
      res.status(200).json({ 
        success: true, 
        client_id: requestId, 
        message: response.data.message || 'OTP sent to mobile' 
      });
    } else {
      res.status(400).json({ success: false, message: response.data.message || 'Failed to send Aadhaar OTP' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
};

export const verifyAadhaarOTP = async (req, res) => {
  try {
    const { client_id, otp, phone } = req.body;
    const response = await axios.post('https://api.quickekyc.com/api/v1/aadhaar-v2/submit-otp', {
      key: process.env.SUREPASS_API_KEY,
      request_id: client_id,
      otp
    });
    
    if (response.data.success || response.data.status === 'success') {
      const rider = await Rider.findOne({ phone });
      if (rider) {
        rider.kycDetails.ekycVerified = true;
        rider.kycStatus = 'approved';
        rider.name = response.data.data?.full_name || response.data.full_name;
        await rider.save();
      }
      res.status(200).json({ success: true, message: 'Aadhaar Verified', data: response.data.data || response.data });
    } else {
      res.status(400).json({ success: false, message: response.data.message || 'OTP verification failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
};

export const getRiderProfile = async (req, res) => {
  try {
    const rider = await Rider.findOne({ phone: req.params.phone }).populate('subscriptionPlan');
    res.status(200).json({ success: true, rider });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const addMoney = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const rider = await Rider.findOne({ phone });
    rider.walletBalance += Number(amount);
    await rider.save();
    await Transaction.create({ 
      riderId: rider._id, 
      amount, 
      type: 'credit', 
      status: 'success', 
      description: 'Added to wallet',
      method: 'razorpay'
    });
    res.status(200).json({ success: true, message: `₹${amount} added`, walletBalance: rider.walletBalance });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const payViaWallet = async (req, res) => {
  try {
    const { planId, phone } = req.body;
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    
    const rider = await Rider.findOne({ phone }).populate('franchise');
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    let isFranchisePaid = false;

    // Check if Rider belongs to a Franchise
    if (rider.franchise) {
      const Franchise = (await import('../franchise/franchiseModel.js')).default;
      const FranchiseTransaction = (await import('../franchise/franchiseTransactionModel.js')).default;
      
      const franchiseToUpdate = await Franchise.findById(rider.franchise._id || rider.franchise);
      
      if (!franchiseToUpdate) {
        return res.status(404).json({ success: false, message: 'Mapped Franchise not found' });
      }

      if ((franchiseToUpdate.walletBalance || 0) < plan.price) {
        return res.status(400).json({ success: false, message: 'Franchise wallet balance insufficient to cover subscription' });
      }

      franchiseToUpdate.walletBalance -= plan.price;
      await franchiseToUpdate.save();

      await FranchiseTransaction.create({
        franchiseId: franchiseToUpdate._id,
        amount: plan.price,
        type: 'Subscription',
        status: 'completed',
        subscriberName: rider.name || rider.phone,
        description: `Subscription paid for rider ${rider.name || rider.phone}`,
        paymentMethod: 'wallet'
      });
      
      isFranchisePaid = true;
    } else {
      // Independent Rider Logic
      if ((rider.walletBalance || 0) < plan.price) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
      rider.walletBalance -= plan.price;
    }

    const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
    const expiresAt = new Date(Date.now() + durationMs);

    rider.status = 'active';
    rider.subscriptionPlan = plan._id;
    rider.subscriptionStart = new Date();
    rider.subscriptionEnd = expiresAt;
    await rider.save();

    await Transaction.create({
      riderId: rider._id,
      amount: plan.price,
      type: 'debit',
      status: 'success',
      description: `Plan Upgrade: ${plan.name} ${isFranchisePaid ? '(Paid by Franchise)' : ''}`,
      method: 'wallet'
    });

    res.status(200).json({ success: true, message: isFranchisePaid ? 'Subscription activated via Franchise Wallet' : 'Subscription activated via wallet' });
  } catch (error) {
    console.error('Wallet Payment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWalletData = async (req, res) => {
  try {
    const rider = await Rider.findOne({ phone: req.params.phone });
    const transactions = await Transaction.find({ riderId: rider._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, walletBalance: rider.walletBalance, transactions });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getSubscribersByFranchise = async (req, res) => {
  try {
    const franchiseId = req.franchise ? req.franchise._id : req.query.franchiseId;
    const subscribers = await Rider.find({ franchise: franchiseId });
    res.status(200).json({ success: true, subscribers });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getActiveHubs = async (req, res) => {
  try {
    const franchises = await Franchise.find();
    const hubs = await Promise.all(franchises.map(async (f) => {
      const fleetCount = await Vehicle.countDocuments({ franchise: f._id });
      const availableBatteries = await Vehicle.countDocuments({ franchise: f._id, status: 'available' });
      return {
        id: f._id,
        name: f.businessDetails?.name || f.hubName,
        address: f.businessDetails?.location,
        latitude: f.businessDetails?.latitude,
        longitude: f.businessDetails?.longitude,
        batteries: availableBatteries,
        availableSlots: Math.max(0, (f.businessDetails?.capacity || 0) - fleetCount),
        totalSlots: f.businessDetails?.capacity || 0
      };
    }));
    res.status(200).json({ success: true, hubs });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getMyVehicle = async (req, res) => {
  try {
    const rider = await Rider.findOne({ phone: req.params.phone });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    // Block access if no active subscription or subscription expired
    const now = new Date();
    const hasActiveSub = rider.subscriptionPlan &&
      rider.subscriptionEnd &&
      new Date(rider.subscriptionEnd) > now;

    if (!hasActiveSub) {
      return res.status(403).json({
        success: false,
        code: 'NO_ACTIVE_SUBSCRIPTION',
        message: 'No active subscription. Please purchase a plan to access your vehicle.'
      });
    }

    const vehicle = await Vehicle.findById(rider.vehicleId);
    if (!vehicle) {
      return res.status(200).json({
        success: true,
        hasVehicle: false,
        vehicle: { id: 'FLX-PENDING', model: 'Assignment Pending', battery: 0, range: 0, location: 'Hub A', plateNumber: 'SEARCHING...' }
      });
    }

    // Calculate active duty minutes from subscription start till now
    const activeDutyMinutes = rider.subscriptionStart
      ? Math.floor((Date.now() - new Date(rider.subscriptionStart).getTime()) / 60000)
      : (rider.activeDutyMinutes || 0);

    res.status(200).json({
      success: true,
      hasVehicle: true,
      vehicle: {
        id: vehicle._id,
        model: vehicle.model || 'Flexigo S1 Pro',
        battery: vehicle.battery || 0,
        range: vehicle.range || 0,
        location: rider.lastLocation?.address || 'In Transit',
        plateNumber: vehicle.plate,
        images: vehicle.images,
        activeDuty: activeDutyMinutes,
        totalDistance: rider.totalDistance || 0
      }
    });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getRiderPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ target: 'Rider', status: 'active' }).sort({ price: 1 });
    const formattedPlans = plans.map(plan => ({
      id: plan._id, label: plan.name, price: plan.price,
      duration: plan.type === 'Daily' ? '1 Day' : plan.type === 'Weekly' ? '7 Days' : '30 Days',
      durationMs: plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000,
      perks: plan.features.length > 0 ? plan.features : ['Unlimited rides', 'Battery swaps', '24/7 Support'],
      color: plan.type === 'Daily' ? '#00D4FF' : plan.type === 'Weekly' ? '#39FF14' : '#BF5AF2',
      popular: plan.type === 'Weekly'
    }));
    res.status(200).json({ success: true, plans: formattedPlans });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await SubscriptionPlan.findById(planId);
    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await instance.orders.create({ amount: plan.price * 100, currency: 'INR', receipt: `receipt_${Date.now()}` });
    res.status(200).json({ success: true, order });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, phone } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
      const plan = await SubscriptionPlan.findById(planId);
      const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
      const expiresAt = new Date(Date.now() + durationMs);

      const rider = await Rider.findOneAndUpdate({ phone }, { status: 'active', subscriptionPlan: plan._id, subscriptionStart: new Date(), subscriptionEnd: expiresAt }, { new: true });

      // Create transaction record
      await Transaction.create({
        riderId: rider._id,
        amount: plan.price,
        type: 'debit',
        status: 'success',
        description: `Plan Upgrade: ${plan.name}`,
        method: 'razorpay'
      });

      const mapUrl = 'https://www.google.com/maps?q=18.566177368164062,73.7693099975586&z=17&hl=en';
      const msg = `Welcome to Flexigo. Registration successful. Pickup: ${mapUrl}`;
      try { await sendSMS(phone, msg); } catch (e) {}
      res.status(200).json({ success: true, message: 'Payment verified' });
    } else res.status(400).json({ success: false, message: 'Invalid signature' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Request QR/UPI Payment (pending until admin approves)
// @route   POST /api/v1/rider/payments/qr-request
export const requestQRPayment = async (req, res) => {
  try {
    const { planId, phone } = req.body;
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const rider = await Rider.findOne({ phone });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    // Create a pending transaction
    const transaction = await Transaction.create({
      riderId: rider._id,
      amount: plan.price,
      type: 'debit',
      status: 'pending',
      description: `QR Payment: ${plan.name} (Awaiting Admin Approval)`,
      method: 'upi_qr',
      planId: plan._id
    });

    // Send real-time push notification to all SuperAdmins
    const admins = await Admin.find({ role: 'SuperAdmin' });
    for (const admin of admins) {
      if (admin.fcmToken) {
        try {
          await sendPushNotification(
            admin.fcmToken,
            '💰 New QR Payment Request',
            `${rider.name || rider.phone} paid ₹${plan.price} for ${plan.name}. Verify & approve.`,
            { type: 'qr_payment_request', transactionId: transaction._id.toString(), riderId: rider._id.toString() }
          );
        } catch (e) {
          console.error("Admin FCM notification failed:", e.message);
        }
      }
    }

    // Also notify franchise if rider has one
    if (rider.franchise) {
      const franchise = await Franchise.findById(rider.franchise);
      const frToken = franchise?.fcmToken || franchise?.fcmTokenMobile;
      if (frToken) {
        try {
          await sendPushNotification(
            frToken,
            '💰 QR Payment Request',
            `Rider ${rider.name || rider.phone} submitted ₹${plan.price} payment. Awaiting verification.`,
            { type: 'qr_payment_request', transactionId: transaction._id.toString() }
          );
        } catch (e) {
          console.error("Franchise FCM notification failed:", e.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment request submitted. Awaiting admin verification.',
      transactionId: transaction._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin approves QR payment → activates subscription
// @route   POST /api/v1/admin/payments/approve-qr
export const approveQRPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.status === 'success') return res.status(400).json({ success: false, message: 'Already approved' });

    const rider = await Rider.findById(transaction.riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    const plan = await SubscriptionPlan.findById(transaction.planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Activate subscription
    const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
    const expiresAt = new Date(Date.now() + durationMs);

    rider.status = 'active';
    rider.subscriptionPlan = plan._id;
    rider.subscriptionStart = new Date();
    rider.subscriptionEnd = expiresAt;
    await rider.save();

    // Update transaction status
    transaction.status = 'success';
    transaction.description = `Plan Upgrade: ${plan.name} (QR Verified)`;
    await transaction.save();

    // Send SMS to rider
    try {
      const msg = `Flexigo: Your payment of ₹${plan.price} has been verified. Subscription activated.`;
      await sendSMS(rider.phone, msg);
    } catch (e) {}

    // Send push notification to rider
    const riderToken = rider.fcmToken || rider.fcmTokenMobile;
    if (riderToken) {
      try {
        await sendPushNotification(riderToken, 'Payment Approved', `Your ₹${plan.price} payment has been verified. Subscription is now active.`, { type: 'payment_approved' });
      } catch (e) {}
    }

    res.status(200).json({ success: true, message: 'Payment approved and subscription activated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin rejects QR payment
// @route   POST /api/v1/admin/payments/reject-qr
export const rejectQRPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    transaction.status = 'failed';
    transaction.description += ' (Rejected by Admin)';
    await transaction.save();

    // Notify rider
    const rider = await Rider.findById(transaction.riderId);
    const riderToken = rider?.fcmToken || rider?.fcmTokenMobile;
    if (riderToken) {
      try {
        await sendPushNotification(riderToken, 'Payment Rejected', 'Your payment could not be verified. Please try again or contact support.', { type: 'payment_rejected' });
      } catch (e) {}
    }

    res.status(200).json({ success: true, message: 'Payment rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRiderLocation = async (req, res) => {
  try {
    const { latitude, longitude, speed, address, locationStatus } = req.body;
    const riderId = req.rider._id;
    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    // Handle Location Disabled Event
    if (locationStatus === 'disabled') {
      const cacheKey = `${riderId.toString()}_location_disabled`;
      const now = Date.now();
      const lastAlertTime = lastGeofenceAlertTimes.get(cacheKey);

      if (!lastAlertTime || (now - lastAlertTime) > 10 * 60 * 1000) {
        lastGeofenceAlertTimes.set(cacheKey, now);

        const msg = `Safety Alert: Location Services Disabled for Rider [${rider.name || rider.phone}]`;

        // Notify Rider
        try {
          if (rider.fcmToken) await sendPushNotification(rider.fcmToken, 'Safety Alert', 'Please enable location services to keep your ride active.', { type: 'location_disabled' });
        } catch (fcmErr) {
          console.error("FCM Web Notification failed:", fcmErr.message);
        }
        try {
          if (rider.fcmTokenMobile) await sendPushNotification(rider.fcmTokenMobile, 'Safety Alert', 'Please enable location services to keep your ride active.', { type: 'location_disabled' });
        } catch (fcmErr) {
          console.error("FCM Mobile Notification failed:", fcmErr.message);
        }

        // Notify Franchise Hub
        if (rider.franchise) {
          const franchise = await Franchise.findById(rider.franchise);
          const frToken = franchise?.fcmToken || franchise?.fcmTokenMobile;
          if (frToken) {
            try {
              await sendPushNotification(frToken, 'Safety Alert', msg, { type: 'location_disabled_admin', riderId: rider._id.toString() });
            } catch (fcmErr) {
              console.error("FCM Franchise Notification failed:", fcmErr.message);
            }
          }
        }

        // Notify SuperAdmins
        const admins = await Admin.find({ role: 'SuperAdmin' });
        for (const admin of admins) {
          if (admin.fcmToken) {
            try {
              await sendPushNotification(admin.fcmToken, 'Safety Alert', msg, { type: 'location_disabled_admin', riderId: rider._id.toString() });
            } catch (fcmErr) {
              console.error("FCM Admin Notification failed:", fcmErr.message);
            }
          }
        }

        // Log Audit Event
        await AuditLog.create({
          identity: rider.phone || 'Unknown Rider',
          actionProfile: 'LOCATION_DISABLED',
          objectTarget: rider._id.toString(),
          status: 'success'
        });
      }

      return res.status(200).json({ success: true, message: 'Location status synced (disabled)' });
    }

    const getDist = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    if (rider.lastLocation && (rider.lastLocation.lat || rider.lastLocation.latitude)) {
      const prev = rider.lastLocation;
      const prevLat = prev.lat || prev.latitude;
      const prevLng = prev.lng || prev.longitude;
      const d = getDist(prevLat, prevLng, latitude, longitude);
      if (d > 0.01 && d < 5) { // Thresholds to avoid GPS noise and teleportation
        rider.totalDistance = (rider.totalDistance || 0) + d;
      }
    }

    rider.lastLocation = {
      lat: latitude,
      lng: longitude,
      address: address || (rider.lastLocation?.address || ''),
      updatedAt: new Date()
    };
    if (speed !== undefined) rider.currentSpeed = speed;
    await rider.save();

    const activeFences = await Geofence.find({ status: 'active', $or: [{ riderId: riderId }, { riderId: null }] });
    for (const fence of activeFences) {
      const dist = getDist(latitude, longitude, fence.center.lat, fence.center.lng);
      const radiusKm = parseFloat(fence.radius) || 1.0;
      let breached = (fence.type === 'inclusion' && dist > radiusKm) || (fence.type === 'exclusion' && dist < radiusKm);
      
      if (breached) {
        const cacheKey = `${riderId.toString()}_${fence._id.toString()}`;
        const now = Date.now();
        const lastAlertTime = lastGeofenceAlertTimes.get(cacheKey);

        if (!lastAlertTime || (now - lastAlertTime) > 10 * 60 * 1000) {
          lastGeofenceAlertTimes.set(cacheKey, now);

          fence.alerts += 1;
          await fence.save();
          const msg = `Safety Alert: Geofence Breach [${fence.name}]`;
          
          try {
            if (rider.fcmToken) await sendPushNotification(rider.fcmToken, 'Safety Alert', msg, { type: 'geofence_breach', fenceId: fence._id.toString() });
          } catch (fcmErr) {
            console.error("FCM Web Notification failed:", fcmErr.message);
          }
          try {
            if (rider.fcmTokenMobile) await sendPushNotification(rider.fcmTokenMobile, 'Safety Alert', msg, { type: 'geofence_breach', fenceId: fence._id.toString() });
          } catch (fcmErr) {
            console.error("FCM Mobile Notification failed:", fcmErr.message);
          }
        }
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Location updated',
      data: {
        location: {
          latitude: latitude,
          longitude: longitude,
          address: rider.lastLocation.address,
          updatedAt: rider.lastLocation.updatedAt
        },
        totalDistance: rider.totalDistance,
        currentSpeed: rider.currentSpeed,
        riderId: rider._id
      }
    });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
// @desc    Request Vehicle Handover
// @route   POST /api/v1/rider/handover/request
export const requestHandover = async (req, res) => {
  try {
    const rider = await Rider.findById(req.rider._id);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    // 1. Send Notification to Rider
    const riderToken = rider.fcmToken || rider.fcmTokenMobile;
    if (riderToken) {
      const title = 'Handover Request Sent';
      const body = 'pls vist the office for flexigo vehicele handover';
      await sendPushNotification(riderToken, title, body, {
        type: 'handover_request_confirmation'
      });
    }

    // 2. Send Notification to Admin/Franchise
    // Find the franchise associated with this rider
    if (rider.franchise) {
      const franchise = await Franchise.findById(rider.franchise);
      const frToken = franchise?.fcmToken || franchise?.fcmTokenMobile;
      if (frToken) {
        await sendPushNotification(frToken, 'New Handover Request', `Rider ${rider.name || rider.phone} has requested a vehicle handover.`, {
          type: 'handover_request_admin',
          riderId: rider._id.toString()
        });
      }
    }

    // 3. Create Database Notification for Franchise App
    if (rider.franchise) {
      await FranchiseNotification.create({
        franchiseId: rider.franchise,
        title: 'Handover Request',
        message: `Rider ${rider.name || rider.phone} has requested vehicle handover. Prepare exit formalities.`,
        severity: 'warning',
        type: 'handover'
      });
    }

    // Also notify SuperAdmins
    const admins = await Admin.find({ role: 'SuperAdmin' });
    for (const admin of admins) {
      if (admin.fcmToken) {
        await sendPushNotification(admin.fcmToken, 'New Handover Request', `Rider ${rider.name || rider.phone} requested handover.`, {
          type: 'handover_request_admin',
          riderId: rider._id.toString()
        });
      }
    }

    // Log the activity
    await AuditLog.create({
      identity: rider.phone || 'Unknown Rider',
      actionProfile: 'HANDOVER_REQUEST',
      objectTarget: rider._id.toString(),
      status: 'success'
    });

    res.status(200).json({ success: true, message: 'Handover request submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

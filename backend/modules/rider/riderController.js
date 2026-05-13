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
    const { phone, selfie, aadhaarFront, aadhaarBack, drivingLicense } = req.body;
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
    
    const rider = await Rider.findOne({ phone });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    if (rider.walletBalance < plan.price) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    rider.walletBalance -= plan.price;
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
      description: `Plan Upgrade: ${plan.name}`,
      method: 'wallet'
    });

    res.status(200).json({ success: true, message: 'Subscription activated via wallet' });
  } catch (error) {
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
    const vehicle = await Vehicle.findById(rider.vehicleId);
    if (!vehicle) {
      return res.status(200).json({
        success: true,
        hasVehicle: false,
        vehicle: { id: 'FLX-PENDING', model: 'Assignment Pending', battery: 0, range: 0, location: 'Hub A', plateNumber: 'SEARCHING...' }
      });
    }
    res.status(200).json({
      success: true,
      hasVehicle: true,
      vehicle: {
        id: vehicle._id,
        model: vehicle.model || 'Flexigo S1 Pro',
        battery: vehicle.battery || 0,
        range: vehicle.range || 0,
        location: 'In Transit',
        plateNumber: vehicle.plate,
        images: vehicle.images,
        activeDuty: 142
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

export const updateRiderLocation = async (req, res) => {
  try {
    const { latitude, longitude, speed } = req.body;
    const riderId = req.rider._id;
    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    const getDist = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    if (rider.lastLocation && rider.lastLocation.latitude) {
      const prev = rider.lastLocation;
      const d = getDist(prev.latitude, prev.longitude, latitude, longitude);
      if (d > 0.01 && d < 5) { // Thresholds to avoid GPS noise and teleportation
        rider.totalDistance = (rider.totalDistance || 0) + d;
      }
    }

    rider.lastLocation = { latitude, longitude, timestamp: new Date() };
    if (speed !== undefined) rider.currentSpeed = speed;
    await rider.save();

    const activeFences = await Geofence.find({ status: 'active', $or: [{ riderId: riderId }, { riderId: null }] });
    for (const fence of activeFences) {
      const dist = getDist(latitude, longitude, fence.center.lat, fence.center.lng);
      const radiusKm = parseFloat(fence.radius) || 1.0;
      let breached = (fence.type === 'inclusion' && dist > radiusKm) || (fence.type === 'exclusion' && dist < radiusKm);
      if (breached) {
        fence.alerts += 1;
        await fence.save();
        const msg = `Safety Alert: Geofence Breach [${fence.name}]`;
        if (rider.fcmToken) await sendPushNotification(rider.fcmToken, 'Safety Alert', msg, { type: 'geofence_breach', fenceId: fence._id.toString() });
        if (rider.fcmTokenMobile) await sendPushNotification(rider.fcmTokenMobile, 'Safety Alert', msg, { type: 'geofence_breach', fenceId: fence._id.toString() });
      }
    }
    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

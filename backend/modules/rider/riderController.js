import Rider from './riderModel.js';
import Transaction from './transactionModel.js';
import Franchise from '../franchise/franchiseModel.js';
import Vehicle from '../fleet/vehicleModel.js';
import SubscriptionPlan from '../admin/subscriptionPlanModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
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

// @desc    Get All Active Hubs for Riders
// @route   GET /api/v1/rider/hubs
export const getActiveHubs = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const hasLocation = !isNaN(userLat) && !isNaN(userLng);

    const getDistanceKm = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) return null;
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const franchises = await Franchise.find().select('businessDetails hubName status walletBalance');
    
    const hubs = await Promise.all(franchises.map(async (f) => {
      const fleetCount = await Vehicle.countDocuments({ franchise: f._id });
      const availableBatteries = await Vehicle.countDocuments({ franchise: f._id, status: 'available' });
      
      const hubLat = f.businessDetails?.latitude;
      const hubLng = f.businessDetails?.longitude;
      const distanceKm = hasLocation ? getDistanceKm(userLat, userLng, hubLat, hubLng) : null;

      return {
        id: f._id,
        name: f.businessDetails?.name || f.hubName || 'Flexigo Hub',
        address: f.businessDetails?.address || f.businessDetails?.location || 'Location Pending',
        latitude: hubLat || 0,
        longitude: hubLng || 0,
        distanceKm,
        batteries: availableBatteries || 0,
        status: availableBatteries > 10 ? 'Open' : availableBatteries > 0 ? 'Limited' : 'Open',
        color: availableBatteries > 10 ? '#39FF14' : availableBatteries > 0 ? '#EAB308' : '#39FF14'
      };
    }));

    // Sort by proximity if coordinates provided
    if (hasLocation) {
      hubs.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    res.status(200).json({ success: true, hubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Assigned Vehicle Details for Rider
// @route   GET /api/v1/rider/my-vehicle/:phone
export const getMyVehicle = async (req, res) => {
  try {
    const rider = await Rider.findOne({ phone: req.params.phone });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    // Find vehicle assigned to this rider
    const vehicle = await Vehicle.findOne({ currentRider: rider._id });
    
    if (!vehicle) {
      return res.status(200).json({ 
        success: true, 
        hasVehicle: false,
        vehicle: {
          id: 'FLX-PENDING',
          model: 'Assignment Pending',
          battery: 0,
          range: 0,
          location: 'Hub A - Koramangala',
          plateNumber: 'SEARCHING...'
        }
      });
    }

    res.status(200).json({ 
      success: true, 
      hasVehicle: true,
      vehicle: {
        id: vehicle.vehicleId || `FLX-${vehicle._id.toString().slice(-4)}`,
        model: vehicle.model || 'Flexigo S1 Pro',
        battery: vehicle.batteryLevel || 0,
        range: Math.round((vehicle.batteryLevel || 0) * 1.08),
        location: vehicle.locationName || 'In Transit',
        plateNumber: vehicle.plateNumber,
        activeDuty: 142 // Static for now, can be dynamic from sessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Subscription Plans for Riders
// @route   GET /api/v1/rider/plans
export const getRiderPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ target: 'Rider', status: 'active' }).sort({ price: 1 });
    
    // Map DB model to Frontend UI format
    const formattedPlans = plans.map(plan => ({
      id: plan._id,
      label: plan.name,
      price: plan.price,
      duration: plan.type === 'Daily' ? '1 Day' : plan.type === 'Weekly' ? '7 Days' : '30 Days',
      durationMs: plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000,
      perks: plan.features.length > 0 ? plan.features : ['Unlimited rides', 'Battery swaps', '24/7 Support'],
      color: plan.type === 'Daily' ? '#00D4FF' : plan.type === 'Weekly' ? '#39FF14' : '#BF5AF2',
      popular: plan.type === 'Weekly'
    }));

    res.status(200).json({ success: true, plans: formattedPlans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Razorpay Order for Subscription
// @route   POST /api/v1/rider/payments/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { planId, phone } = req.body;
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/rider/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, phone } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment verified - Update Rider's subscription in DB
      const plan = await SubscriptionPlan.findById(planId);
      
      // Calculate expiry
      const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
      const expiresAt = new Date(Date.now() + durationMs);

      await Rider.findOneAndUpdate(
        { phone },
        { 
          status: 'active',
          subscriptionPlan: plan.name,
          subscriptionStart: new Date(),
          subscriptionEnd: expiresAt
        }
      );

      res.status(200).json({ success: true, message: 'Payment verified and plan activated' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


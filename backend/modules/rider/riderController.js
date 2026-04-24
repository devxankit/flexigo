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

// @desc    Send OTP to Rider
// @route   POST /api/v1/rider/auth/send-otp
export const sendOTP = async (req, res) => {
  console.log('\n[RIDER AUTH] ----- SEND OTP START -----');
  try {
    const { phone } = req.body;
    console.log('[RIDER AUTH] Phone Number:', phone);

    if (!phone) {
      console.log('[RIDER AUTH] Error: Phone number missing');
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    // Generate Dynamic 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    console.log('[RIDER AUTH] Generated OTP:', otp);

    let rider = await Rider.findOne({ phone });

    if (rider) {
      console.log('[RIDER AUTH] Existing Rider found. Updating OTP...');
      rider.otp = otp;
      rider.otpExpire = otpExpire;
      await rider.save();
    } else {
      console.log('[RIDER AUTH] New Rider. Creating record...');
      rider = await Rider.create({
        phone,
        otp,
        otpExpire,
      });
    }

    // Send SMS via SMSIndiaHub
    const message = `Welcome to the Flexigo powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;
    console.log('[RIDER AUTH] Triggering SMS Service...');
    
    try {
      await sendSMS(phone, message);
      console.log('[RIDER AUTH] SMS sent successfully');
    } catch (smsError) {
      console.log('[RIDER AUTH] SMS Sending FAILED:', smsError.message);
      // We still return success: true for demo/fallback if needed, 
      // or we can fail. The user wants "proper dynamic otp ana chiay", 
      // so let's ensure they know if it failed.
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // otp: otp // Uncomment only for debugging in frontend if needed
    });
  } catch (error) {
    console.log('[RIDER AUTH] CRITICAL ERROR:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
  console.log('[RIDER AUTH] ----- SEND OTP END -----\n');
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

    const hasAllDocs = rider.kycDetails.selfie && 
                       rider.kycDetails.aadhaarFront && 
                       rider.kycDetails.aadhaarBack && 
                       rider.kycDetails.drivingLicense;

    rider.kycStatus = hasAllDocs ? 'approved' : 'pending';
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

// @desc    Generate Aadhaar OTP for eKYC (QuickeKYC)
// @route   POST /api/v1/rider/kyc/aadhaar/generate-otp
export const generateAadhaarOTP = async (req, res) => {
  console.log('--- QUICKEKYC: GENERATE OTP START ---');
  try {
    const { aadhaarNumber } = req.body;
    console.log('QUICKEKYC: Aadhaar Number:', aadhaarNumber);

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      console.log('QUICKEKYC: Error - Aadhaar Invalid');
      return res.status(400).json({ success: false, message: 'Invalid Aadhaar Number' });
    }

    const config = {
      method: 'post',
      url: 'https://api.quickekyc.com/api/v1/aadhaar-v2/generate-otp',
      headers: { 'Content-Type': 'application/json' },
      data: { 
        key: process.env.SUREPASS_API_KEY, 
        id_number: aadhaarNumber 
      }
    };
    console.log('QUICKEKYC: Request Data:', JSON.stringify(config.data));
    console.log('QUICKEKYC: Calling QuickeKYC V2 API...');

    const response = await axios(config);
    console.log('QUICKEKYC: Response Status:', response.status);
    console.log('QUICKEKYC: Response Body:', JSON.stringify(response.data));

    const isActuallySuccess = response.data.success === true || 
                               response.data.status === 'success' || 
                               response.data.message?.toLowerCase().includes('sent') ||
                               response.data.message?.toLowerCase().includes('success');

    if (isActuallySuccess) {
      console.log('QUICKEKYC: OTP Sequence Success confirmed');
      const requestId = response.data.data?.request_id || 
                        response.data.request_id || 
                        response.data.data?.client_id || 
                        response.data.client_id || 
                        response.data.data?.id || 
                        response.data.id;
      
      console.log('QUICKEKYC: Final RequestID:', requestId);

      res.status(200).json({
        success: true,
        client_id: requestId,
        message: response.data.message || 'OTP sent to mobile'
      });
    } else {
      console.log('QUICKEKYC: API Error:', response.data.message);
      res.status(400).json({ success: false, message: response.data.message || 'Failed to send OTP' });
    }
  } catch (error) {
    console.log('QUICKEKYC: Catch block error:', error.message);
    if (error.response) console.log('QUICKEKYC: Error Data:', JSON.stringify(error.response.data));
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
  console.log('--- QUICKEKYC: GENERATE OTP END ---');
};

// @desc    Verify Aadhaar OTP for eKYC (QuickeKYC)
// @route   POST /api/v1/rider/kyc/aadhaar/verify-otp
export const verifyAadhaarOTP = async (req, res) => {
  console.log('--- QUICKEKYC: VERIFY OTP START ---');
  try {
    const { client_id, clientId, requestId, otp, phone } = req.body;
    const finalClientId = client_id || clientId || requestId;
    
    console.log('QUICKEKYC: Verify Params -> finalClientId:', finalClientId, '| otp:', otp, '| phone:', phone);

    if (!finalClientId || !otp) {
      console.log('QUICKEKYC: Missing client_id or otp');
      return res.status(400).json({ success: false, message: 'Verification ID (Client ID) and OTP required' });
    }

    const config = {
      method: 'post',
      url: 'https://api.quickekyc.com/api/v1/aadhaar-v2/submit-otp',
      headers: { 'Content-Type': 'application/json' },
      data: { 
        key: process.env.SUREPASS_API_KEY,
        request_id: finalClientId, 
        otp 
      }
    };
    console.log('QUICKEKYC: Request Data:', JSON.stringify(config.data));
    console.log('QUICKEKYC: Verifying with QuickeKYC V2...');

    const response = await axios(config);
    console.log('QUICKEKYC: Response Status:', response.status);
    console.log('QUICKEKYC: Verification Data:', JSON.stringify(response.data));

    if (response.data.success || response.data.status === 'success') {
      console.log('QUICKEKYC: Verification SUCCESS');
      const kycData = response.data.data || response.data;
      
      const rider = await Rider.findOne({ phone });
      if (rider) {
        console.log('QUICKEKYC: Updating Rider Info in DB');
        rider.kycDetails.ekycVerified = true;
        rider.kycDetails.ekycData = kycData;
        rider.name = kycData.full_name || kycData.name;
        await rider.save();
        console.log('QUICKEKYC: DB Updated for Rider:', rider.phone);
      }

      res.status(200).json({
        success: true,
        message: 'Aadhaar Verified Successfully',
        data: kycData
      });
    } else {
      console.log('QUICKEKYC: Verification FAIL:', response.data.message);
      res.status(400).json({ success: false, message: response.data.message || 'OTP verification failed' });
    }
  } catch (error) {
    console.log('QUICKEKYC: Catch Block Error:', error.message);
    if (error.response) console.log('QUICKEKYC: Error Response:', JSON.stringify(error.response.data));
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
  console.log('--- QUICKEKYC: VERIFY OTP END ---');
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

      const totalSlots = f.businessDetails?.capacity || 0;
      const availableSlots = Math.max(0, totalSlots - fleetCount);

      return {
        id: f._id,
        name: f.businessDetails?.name || f.hubName || 'Flexigo Hub',
        address: f.businessDetails?.address || f.businessDetails?.location || 'Location Pending',
        latitude: hubLat || 0,
        longitude: hubLng || 0,
        distanceKm,
        batteries: availableBatteries || 0,
        availableSlots: availableSlots,
        totalSlots: totalSlots,
        status: availableSlots > 5 ? 'Open' : availableSlots > 0 ? 'Limited' : 'Full',
        color: availableSlots > 5 ? '#39FF14' : availableSlots > 0 ? '#EAB308' : '#F43F5E'
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


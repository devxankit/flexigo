import express from 'express';
import {
  sendOTP,
  verifyOTP,
  updateKYC,
  getRiderProfile,
  addMoney,
  getWalletData,
  getSubscribersByFranchise,
  getActiveHubs,
  getMyVehicle,
  getRiderPlans,
  createPaymentOrder,
  verifyPayment,
  generateAadhaarOTP,
  verifyAadhaarOTP
} from './riderController.js';
import { protectFranchise } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/kyc/update', updateKYC);
router.post('/kyc/aadhaar/generate-otp', generateAadhaarOTP);
router.post('/kyc/aadhaar/verify-otp', verifyAadhaarOTP);
router.get('/profile/:phone', getRiderProfile);
router.post('/wallet/add', addMoney);
router.get('/wallet/:phone', getWalletData);
router.get('/subscribers', protectFranchise, getSubscribersByFranchise);
router.get('/hubs', getActiveHubs);
router.get('/my-vehicle/:phone', getMyVehicle);
router.get('/plans', getRiderPlans);
router.post('/payments/create-order', createPaymentOrder);
router.post('/payments/verify', verifyPayment);

export default router;

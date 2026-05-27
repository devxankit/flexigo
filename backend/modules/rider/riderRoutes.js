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
  payViaWallet,
  requestQRPayment,
  generateAadhaarOTP,
  verifyAadhaarOTP,
  saveFcmToken,
  updateRiderLocation,
  requestHandover
} from './riderController.js';
import { protectFranchise, protectRider } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/kyc/update', updateKYC);
router.post('/kyc/aadhaar/generate-otp', generateAadhaarOTP);
router.post('/kyc/aadhaar/verify-otp', verifyAadhaarOTP);
router.post('/auth/save-fcm-token', protectRider, saveFcmToken);
router.get('/profile/:phone', getRiderProfile);
router.post('/wallet/add', addMoney);
router.get('/wallet/:phone', getWalletData);
router.get('/subscribers', protectFranchise, getSubscribersByFranchise);
router.get('/hubs', getActiveHubs);
router.get('/my-vehicle/:phone', getMyVehicle);
router.get('/plans', getRiderPlans);
router.post('/payments/create-order', createPaymentOrder);
router.post('/payments/verify', verifyPayment);
router.post('/payments/wallet', payViaWallet);
router.post('/payments/qr-request', requestQRPayment);
router.patch('/location', protectRider, updateRiderLocation);
router.post('/handover/request', protectRider, requestHandover);

export default router;

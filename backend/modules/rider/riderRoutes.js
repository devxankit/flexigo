import express from 'express';
import {
  sendOTP,
  verifyOTP,
  updateKYC,
  getRiderProfile,
  addMoney,
  getWalletData,
} from './riderController.js';

const router = express.Router();

router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/kyc/update', updateKYC);
router.get('/profile/:phone', getRiderProfile);
router.post('/wallet/add', addMoney);
router.get('/wallet/:phone', getWalletData);

export default router;

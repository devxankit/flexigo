import express from 'express';
import {
  sendOTP,
  verifyOTP,
  updateRegistration,
  getWalletData,
  getDashboardMetrics,
  createHandover,
  generateAadhaarOTP,
  verifyAadhaarOTP,
  getFranchisePlans
} from './franchiseController.js';
import { protectFranchise } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);
router.get('/plans', getFranchisePlans);
router.post('/update-registration', protectFranchise, updateRegistration);
router.get('/wallet', protectFranchise, getWalletData);
router.get('/dashboard-metrics', protectFranchise, getDashboardMetrics);
router.post('/handover', protectFranchise, createHandover);
router.post('/kyc/aadhaar/generate-otp', generateAadhaarOTP);
router.post('/kyc/aadhaar/verify-otp', verifyAadhaarOTP);

export default router;

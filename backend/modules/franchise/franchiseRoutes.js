import express from 'express';
import {
  sendOTP,
  verifyOTP,
  updateRegistration,
} from './franchiseController.js';
import { protectFranchise } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/update-registration', protectFranchise, updateRegistration);

export default router;

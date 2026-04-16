import express from 'express';
import { 
  getAdminStats, 
  getAllHubs, 
  getFleetDistribution,
  getKycRecords,
  updateKycStatus,
  createHub,
  getSubscribers
} from './adminController.js';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan
} from './subscriptionPlanController.js';

const router = express.Router();

router.get('/dashboard-stats', getAdminStats);
router.get('/hubs', getAllHubs);
router.post('/hubs', createHub);
router.get('/distribution', getFleetDistribution);
router.get('/subscribers', getSubscribers);

// KYC Routes
router.get('/kyc', getKycRecords);
router.patch('/kyc/:id', updateKycStatus);

// Plan Routes
router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.patch('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

export default router;

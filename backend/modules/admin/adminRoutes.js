import express from 'express';
import { 
  getAdminStats, 
  getAllHubs, 
  getFleetDistribution,
  getKycRecords,
  updateKycStatus,
  createHub,
  getSubscribers,
  getGeofences,
  createGeofence,
  deleteGeofence,
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getFinanceData,
  getInventoryData,
  getFranchiseOpsData,
  getComplianceData,
  getEngagementData,
  getSecurityData,
  getSubscriberData,
  getVehicleStats,
  getRiderBehaviour,
  getRoles,
  createRole,
  getCampaigns,
  createCampaign
} from './adminController.js';
import {
  getAssignments,
  createAssignment
} from '../fleet/vehicleController.js';
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

// Geofencing
router.get('/geofencing', getGeofences);
router.post('/geofencing', createGeofence);
router.delete('/geofencing/:id', deleteGeofence);

// Vehicle Assignments
router.get('/assignments', getAssignments);
router.post('/assignments', createAssignment);

// Staff Management
router.get('/staff', getAllStaff);
router.post('/staff', createStaff);
router.patch('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

// KYC Routes
router.get('/kyc', getKycRecords);
router.patch('/kyc/:id', updateKycStatus);

// Finance Management
router.get('/finance', getFinanceData);
router.get('/inventory', getInventoryData);
router.get('/franchise-ops', getFranchiseOpsData);
router.get('/compliance', getComplianceData);
router.get('/engagement', getEngagementData);
router.get('/security', getSecurityData);
router.get('/subscribers', getSubscriberData);
router.get('/vehicle-stats', getVehicleStats);
router.get('/rider-behaviour', getRiderBehaviour);

// Plan Routes
router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.patch('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

// Role Management
router.get('/roles', getRoles);
router.post('/roles', createRole);

// Campaign Management
router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);

export default router;

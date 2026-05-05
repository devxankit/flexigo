import express from 'express';
import {
  getAdminStats,
  getAllHubs,
  getFleetDistribution,
  getKycRecords,
  updateKycStatus,
  createHub,
  getFranchiseById,
  getHubVehicles,
  updateHub,
  deleteHub,
  getGeofences,
  createGeofence,
  updateGeofence,
  deleteGeofence,
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffAttendance,
  updateStaffAttendance,
  getMonthlyAttendanceReport,
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
  createCampaign,
  generateStaffAadhaarOTP,
  verifyStaffAadhaarOTP,
  getAllRiders,
  createRider,
  updateRider,
  deleteRider,
  getNotificationsFeed,
  getAdminProfile,
  updateAdminPassword
} from './adminController.js';
import {
  getAssignments,
  createAssignment,
  addVehicle
} from '../fleet/vehicleController.js';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan
} from './subscriptionPlanController.js';

const router = express.Router();
console.log('DEBUG: Admin Routes initialized at /api/v1/admin');

router.get('/dashboard-stats', getAdminStats);
router.get('/notifications-feed', getNotificationsFeed);
router.get('/profile', getAdminProfile);
router.put('/update-password', updateAdminPassword);

// Hub / Franchise Management (full CRUD)
router.get('/hubs', getAllHubs);
router.post('/hubs', createHub);
router.get('/hubs/:id', getFranchiseById);
router.get('/hubs/:id/vehicles', getHubVehicles);
router.put('/hubs/:id', updateHub);
router.delete('/hubs/:id', deleteHub);

router.get('/distribution', getFleetDistribution);
router.get('/subscribers', getSubscriberData);

// Geofencing
router.get('/geofencing', getGeofences);
router.post('/geofencing', createGeofence);
router.patch('/geofencing/:id', updateGeofence);
router.delete('/geofencing/:id', deleteGeofence);

// Vehicle Management
router.get('/assignments', getAssignments);
router.post('/assignments', createAssignment);
router.post('/fleet/add', addVehicle);

// Staff Management
router.get('/staff', getAllStaff);
router.post('/staff', createStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);
router.get('/staff/:id/attendance', getStaffAttendance);
router.post('/staff/:id/attendance', updateStaffAttendance);
router.get('/staff/attendance/report', getMonthlyAttendanceReport);
router.post('/staff/generate-aadhaar-otp', generateStaffAadhaarOTP);
router.post('/staff/verify-aadhaar-otp', verifyStaffAadhaarOTP);

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

// Rider Management
router.get('/riders', getAllRiders);
router.post('/riders', createRider);
router.put('/riders/:id', updateRider);
router.delete('/riders/:id', deleteRider);

export default router;

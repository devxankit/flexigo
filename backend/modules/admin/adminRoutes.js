import express from 'express';
import {
  getAdminStats,
  adminLogin,
  getAllHubs,
  getFleetDistribution,
  getKycRecords,
  updateKycStatus,
  updateKycReferences,
  createHub,
  getFranchiseById,
  getHubVehicles,
  updateHub,
  deleteHub,
  creditFranchiseWallet,
  updateFranchisePayoutStatus,
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
  createBill,
  updateBill,
  deleteBill,
  getFranchiseOpsData,
  getComplianceData,
  getEngagementData,
  getSecurityData,
  getSubscriberData,
  getVehicleStats,
  getRiderBehaviour,
  getRoles,
  createRole,
  updateRole,
  getCampaigns,
  createCampaign,
  generateStaffAadhaarOTP,
  verifyStaffAadhaarOTP,
  getAllRiders,
  createRider,
  updateRider,
  deleteRider,
  getRiderDetailedReport,
  getNotificationsFeed,
  getAdminProfile,
  updateAdminPassword,
  uploadKycCertificate,
  deleteSecurityLog
} from './adminController.js';
import {
  getWebsitePlans,
  createWebsitePlan,
  updateWebsitePlan,
  deleteWebsitePlan,
  getWebsiteInquiries,
  submitWebsiteInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getWebsiteContactInfo,
  updateWebsiteContactInfo,
  getWebsiteAbout,
  updateWebsiteAbout,
  getWebsitePressReleases,
  createWebsitePressRelease,
  updateWebsitePressRelease,
  deleteWebsitePressRelease
} from './websiteController.js';
import {
  getAssignments,
  createAssignment,
  addVehicle,
  bulkAddVehicles
} from '../fleet/vehicleController.js';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan
} from './subscriptionPlanController.js';
import { protectAdmin, authorize } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();
console.log('DEBUG: Admin Routes initialized at /api/v1/admin');

router.get('/dashboard-stats', getAdminStats);
router.post('/login', adminLogin);
router.get('/notifications-feed', getNotificationsFeed);
router.get('/profile', getAdminProfile);
router.put('/update-password', updateAdminPassword);

// Hub / Franchise Management (full CRUD)
router.get('/hubs', protectAdmin, authorize('Hubs', 'read'), getAllHubs);
router.post('/hubs', protectAdmin, authorize('Hubs', 'create'), createHub);
router.get('/hubs/:id', protectAdmin, authorize('Hubs', 'read'), getFranchiseById);
router.get('/hubs/:id/vehicles', protectAdmin, authorize('Hubs', 'read'), getHubVehicles);
router.put('/hubs/:id', protectAdmin, authorize('Hubs', 'update'), updateHub);
router.delete('/hubs/:id', protectAdmin, authorize('Hubs', 'delete'), deleteHub);

router.get('/distribution', getFleetDistribution);
router.get('/subscribers', getSubscriberData);

// Geofencing
router.get('/geofencing', getGeofences);
router.post('/geofencing', createGeofence);
router.patch('/geofencing/:id', updateGeofence);
router.delete('/geofencing/:id', deleteGeofence);

// Vehicle Management
router.get('/assignments', protectAdmin, authorize('Fleet', 'read'), getAssignments);
router.post('/assignments', protectAdmin, authorize('Fleet', 'create'), createAssignment);
router.post('/fleet/add', protectAdmin, authorize('Fleet', 'create'), addVehicle);
router.post('/fleet/bulk-add', protectAdmin, authorize('Fleet', 'create'), bulkAddVehicles);

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
router.get('/kyc', protectAdmin, authorize('KYC', 'read'), getKycRecords);
router.patch('/kyc/:id', protectAdmin, authorize('KYC', 'update'), updateKycStatus);
router.patch('/kyc/:id/references', protectAdmin, authorize('KYC', 'update'), updateKycReferences);
router.post('/kyc/:id/certificate', protectAdmin, authorize('KYC', 'update'), uploadKycCertificate);

// Finance Management
router.get('/finance', getFinanceData);
router.get('/inventory', getInventoryData);
router.post('/billing', createBill);
router.put('/billing/:id', updateBill);
router.delete('/billing/:id', deleteBill);
router.get('/franchise-ops', getFranchiseOpsData);
router.post('/franchise/:id/credit', creditFranchiseWallet);
router.patch('/franchise/payout/:id', updateFranchisePayoutStatus);
router.get('/compliance', getComplianceData);
router.get('/engagement', getEngagementData);
router.get('/security', getSecurityData);
router.delete('/security/:id', deleteSecurityLog);
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
router.put('/roles/:id', updateRole);

// Campaign Management
router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);

// Rider Management
router.get('/riders', getAllRiders);
router.post('/riders', createRider);
router.put('/riders/:id', updateRider);
router.delete('/riders/:id', deleteRider);
router.get('/rider-report', getRiderDetailedReport);

// Website Management
router.get('/web/plans', getWebsitePlans);
router.post('/web/plans', createWebsitePlan);
router.patch('/web/plans/:id', updateWebsitePlan);
router.delete('/web/plans/:id', deleteWebsitePlan);

router.get('/web/contact', getWebsiteInquiries);
router.post('/web/contact/submit', submitWebsiteInquiry);
router.patch('/web/contact/:id', updateInquiryStatus);
router.delete('/web/contact/:id', deleteInquiry);

router.get('/web/contact-info', getWebsiteContactInfo);
router.put('/web/contact-info', updateWebsiteContactInfo);

router.get('/web/about', getWebsiteAbout);
router.put('/web/about', updateWebsiteAbout);

router.get('/web/press', getWebsitePressReleases);
router.post('/web/press', createWebsitePressRelease);
router.patch('/web/press/:id', updateWebsitePressRelease);
router.delete('/web/press/:id', deleteWebsitePressRelease);

export default router;

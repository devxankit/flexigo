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
  getParts,
  createPart,
  updatePart,
  deletePart,
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
  uploadKycAttachment,
  deleteSecurityLog,
  toggleBlockKycRecord,
  deleteKycRecord,
  getSettings,
  updateSettings
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
  bulkAddVehicles,
  updateVehicleAttachment
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
router.post('/assignments', protectAdmin, authorize('Fleet', 'create'), getAssignments);
router.post('/fleet/add', protectAdmin, authorize('Fleet', 'create'), addVehicle);
router.post('/fleet/bulk-add', protectAdmin, authorize('Fleet', 'create'), bulkAddVehicles);
router.patch('/fleet/:id/attachment', protectAdmin, authorize('Fleet', 'update'), updateVehicleAttachment);

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
router.post('/kyc/:id/attachment', protectAdmin, authorize('KYC', 'update'), uploadKycAttachment);
router.delete('/kyc/:id/attachment/:index', protectAdmin, authorize('KYC', 'update'), async (req, res) => {
  try {
    const { id, index } = req.params;
    const Rider = (await import('../rider/riderModel.js')).default;
    const Franchise = (await import('../franchise/franchiseModel.js')).default;

    let record = await Rider.findById(id);
    if (!record) record = await Franchise.findById(id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });

    if (record.kycDetails?.attachments?.length > 0) {
      record.kycDetails.attachments.splice(parseInt(index), 1);
      record.markModified('kycDetails');
      await record.save();
    }

    res.status(200).json({ success: true, message: 'Attachment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.patch('/kyc/:id/toggle-block', protectAdmin, authorize('KYC', 'update'), toggleBlockKycRecord);
router.delete('/kyc/:id', protectAdmin, authorize('KYC', 'delete'), deleteKycRecord);

// Finance Management
router.get('/finance', getFinanceData);
router.get('/inventory', getInventoryData);
router.post('/billing', createBill);
router.put('/billing/:id', updateBill);
router.delete('/billing/:id', deleteBill);
router.get('/parts', getParts);
router.post('/parts', createPart);
router.put('/parts/:id', updatePart);

// QR Payment Approval
import { approveQRPayment, rejectQRPayment } from '../rider/riderController.js';
import Transaction from '../rider/transactionModel.js';
import AppVersion from './appVersionModel.js';

// App Version Management (Admin)
router.get('/app-versions', protectAdmin, async (req, res) => {
  try {
    let versions = await AppVersion.find();
    // Auto-seed if empty
    if (versions.length === 0) {
      await AppVersion.create({ platform: 'rider', version: '1.0.0', playStoreUrl: 'https://play.google.com/store/apps/details?id=com.flexigo.rider' });
      await AppVersion.create({ platform: 'franchise', version: '1.0.0', playStoreUrl: 'https://play.google.com/store/apps/details?id=com.flexigo.franchise' });
      versions = await AppVersion.find();
    }
    res.json({ success: true, versions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/app-versions/:platform', protectAdmin, async (req, res) => {
  try {
    const { version, playStoreUrl, forceUpdate } = req.body;
    const record = await AppVersion.findOneAndUpdate(
      { platform: req.params.platform },
      { version, playStoreUrl, forceUpdate, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, version: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/payments/pending-qr', protectAdmin, async (req, res) => {
  try {
    const payments = await Transaction.find({ method: 'upi_qr', status: 'pending' })
      .populate('riderId', 'name phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// One-time fix: Auto-approve all pending UPI_QR transactions
router.post('/payments/fix-pending-qr', protectAdmin, async (req, res) => {
  try {
    const SubscriptionPlan = (await import('./subscriptionPlanModel.js')).default;
    const Rider = (await import('../rider/riderModel.js')).default;

    const pendingTxns = await Transaction.find({ method: 'upi_qr', status: 'pending' }).populate('riderId');

    let fixed = 0;
    for (const txn of pendingTxns) {
      // Mark transaction as success
      txn.status = 'success';
      txn.description = txn.description?.replace('Awaiting Admin Approval', 'Auto-Approved') || 'UPI/QR Payment';
      await txn.save();

      // Activate rider subscription if planId exists
      if (txn.planId && txn.riderId) {
        const plan = await SubscriptionPlan.findById(txn.planId);
        if (plan) {
          const durationMs = plan.type === 'Daily' ? 86400000 : plan.type === 'Weekly' ? 604800000 : 2592000000;
          const rider = await Rider.findById(txn.riderId._id || txn.riderId);
          if (rider) {
            rider.status = 'active';
            rider.subscriptionPlan = plan._id;
            rider.subscriptionStart = txn.createdAt || new Date();
            rider.subscriptionEnd = new Date((txn.createdAt || Date.now()) + durationMs);
            await rider.save();
          }
        }
      }
      fixed++;
    }

    res.status(200).json({ success: true, message: `${fixed} pending transactions fixed to success` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/payments/due-alerts', protectAdmin, async (req, res) => {
  try {
    const now = new Date();
    const Rider = (await import('../rider/riderModel.js')).default;
    const SubscriptionPlan = (await import('./subscriptionPlanModel.js')).default;

    // Find riders with expired subscriptions that were Weekly plans
    const expiredRiders = await Rider.find({
      subscriptionEnd: { $lt: now },
      subscriptionPlan: { $ne: null },
      status: { $in: ['active', 'approved'] }
    }).populate('subscriptionPlan');

    const dueRiders = expiredRiders
      .filter(r => r.subscriptionPlan && r.subscriptionPlan.type === 'Weekly')
      .map(r => ({
        _id: r._id,
        name: r.name,
        phone: r.phone,
        planName: r.subscriptionPlan.name,
        amount: r.subscriptionPlan.price,
        expiredAt: r.subscriptionEnd
      }));

    res.status(200).json({ success: true, riders: dueRiders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post('/payments/approve-qr', protectAdmin, approveQRPayment);
router.post('/payments/reject-qr', protectAdmin, rejectQRPayment);
router.delete('/parts/:id', deletePart);
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

// --- Settings Routes ---
router.get('/settings', protectAdmin, getSettings);
router.put('/settings', protectAdmin, updateSettings);

export default router;

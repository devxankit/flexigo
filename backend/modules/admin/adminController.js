import Franchise from '../franchise/franchiseModel.js';
import Vehicle from '../fleet/vehicleModel.js';
import Transaction from '../franchise/franchiseTransactionModel.js';
import Rider from '../rider/riderModel.js';

// @desc    Get dashboard metrics for admin
// @route   GET /api/v1/admin/dashboard-stats
export const getAdminStats = async (req, res) => {
  try {
    const totalHubs = await Franchise.countDocuments();
    const activeFleet = await Vehicle.countDocuments({ status: { $ne: 'offline' } });
    
    // Calculate total subscribers (riders assigned to vehicles)
    const activeSubscribers = await Vehicle.countDocuments({ status: 'assigned' });

    // Total Revenue (Sum of all franchise transactions)
    const transactions = await Transaction.find({ type: 'Subscription' });
    const grossRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

    // Maintenance Alerts
    const maintenanceAlerts = await Vehicle.countDocuments({ status: 'in-service' });

    res.status(200).json({
      success: true,
      stats: {
        totalHubs,
        activeFleet,
        totalSubscribers: activeSubscribers,
        grossRevenue,
        maintenanceAlerts,
        hubUtilization: "94.2%",
        avgUptime: "99.8%",
        churnRate: "1.4%",
        growthTier: "28%"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all hubs (franchises) with stats
// @route   GET /api/v1/admin/hubs
export const getAllHubs = async (req, res) => {
  try {
    const franchises = await Franchise.find().sort('-createdAt');
    
    const hubs = await Promise.all(franchises.map(async (f) => {
      const fleetCount = await Vehicle.countDocuments({ franchise: f._id });
      const revenueData = await Transaction.find({ franchise: f._id, type: 'Subscription' });
      const totalRevenue = revenueData.reduce((acc, t) => acc + t.amount, 0);
      
      return {
        id: f._id,
        name: f.hubName,
        city: f.city || 'Bangalore',
        fleet: fleetCount,
        subs: fleetCount, // Simplified
        revenue: totalRevenue,
        status: f.status || 'active',
        health: '95%' // Mock
      };
    }));

    res.status(200).json({ success: true, hubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get distribution data
// @route   GET /api/v1/admin/distribution
export const getFleetDistribution = async (req, res) => {
  try {
    const inTransit = await Vehicle.countDocuments({ status: 'assigned' });
    const atHub = await Vehicle.countDocuments({ status: 'available' });
    const maintenance = await Vehicle.countDocuments({ status: 'in-service' });
    const offline = await Vehicle.countDocuments({ status: 'quarantined' });

    res.status(200).json({
      success: true,
      distribution: [
        { name: 'On Road', value: inTransit },
        { name: 'At-Hub', value: atHub },
        { name: 'Maintenance', value: maintenance },
        { name: 'Offline', value: offline },
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get KYC Records
// @route   GET /api/v1/admin/kyc
export const getKycRecords = async (req, res) => {
  try {
    // Both Riders and potentially Franchises need KYC
    const riders = await Rider.find({ kycStatus: { $ne: 'uninitiated' } }).sort('-createdAt');
    
    const records = riders.map(r => ({
      id: r._id,
      name: r.name || r.phone,
      role: r.role || 'Rider',
      status: r.kycStatus,
      date: r.createdAt,
      details: r.kycDetails
    }));

    res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update KYC Status
// @route   PATCH /api/v1/admin/kyc/:id
export const updateKycStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rider = await Rider.findByIdAndUpdate(req.params.id, { kycStatus: status }, { new: true });
    
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    res.status(200).json({
      success: true,
      status: rider.kycStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Hub (Franchise)
// @route   POST /api/v1/admin/hubs
export const createHub = async (req, res) => {
  try {
    const { name, city, email, phone, password } = req.body;
    
    // Register as franchise
    const franchise = await Franchise.create({
      hubName: name,
      city,
      email,
      phone,
      password // Note: Should be hashed in actual production model pre-save hook
    });

    res.status(201).json({
      success: true,
      hub: {
        id: franchise._id,
        name: franchise.hubName,
        city: franchise.city,
        status: franchise.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all subscribers (riders)
// @route   GET /api/v1/admin/subscribers
export const getSubscribers = async (req, res) => {
  try {
    const riders = await Rider.find().sort('-createdAt');
    const subscribers = riders.map(r => ({
      id: r._id,
      name: r.name || r.phone,
      email: r.email || 'N/A',
      phone: r.phone,
      persona: r.role || 'Rider',
      location: 'N/A',
      status: r.kycStatus === 'approved' ? 'verified' : 'pending'
    }));

    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

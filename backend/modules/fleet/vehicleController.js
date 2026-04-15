import Vehicle from './vehicleModel.js';
import cloudinary from '../../config/cloudinary.js';

// @desc    Add new vehicle
// @route   POST /api/v1/fleet/add
export const addVehicle = async (req, res) => {
  try {
    const { rcImage, ...vehicleData } = req.body;

    // Handle RC Image upload if provided
    let rcUrl = '';
    if (rcImage && rcImage.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(rcImage, {
        folder: 'flexigo/vehicles/rc',
      });
      rcUrl = result.secure_url;
    }

    const vehicle = await Vehicle.create({
      ...vehicleData,
      rcUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle provisioned successfully',
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all vehicles
// @route   GET /api/v1/fleet
export const getVehicles = async (req, res) => {
  try {
    const { franchiseId } = req.query;
    const query = franchiseId ? { franchise: franchiseId } : {};
    
    const vehicles = await Vehicle.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vehicle status
// @route   PATCH /api/v1/fleet/:id/status
export const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Add maintenance log
// @route   POST /api/v1/fleet/:id/maintenance
export const addMaintenanceLog = async (req, res) => {
  try {
    const { date, type, staff, description } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    vehicle.maintenanceLogs.unshift({
      date: date || Date.now(),
      type,
      staff,
      description,
    });

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance log added',
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

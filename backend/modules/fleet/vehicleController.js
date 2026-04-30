import mongoose from 'mongoose';
import Vehicle from './vehicleModel.js';
import Rider from '../rider/riderModel.js';
import Assignment from './assignmentModel.js';
import Franchise from '../franchise/franchiseModel.js';
import cloudinary from '../../config/cloudinary.js';

// @desc    Add new vehicle
// @route   POST /api/v1/fleet/add
export const addVehicle = async (req, res) => {
  try {
    const { rcImage, ...vehicleData } = req.body;

    // Robust franchise resolution
    if (vehicleData.franchise) {
      let fId = vehicleData.franchise;
      if (typeof fId === 'string') {
        fId = fId.trim().replace(/^\(|\)$/g, ''); // Strip leading/trailing parentheses
      }

      if (mongoose.Types.ObjectId.isValid(fId)) {
        vehicleData.franchise = fId;
      } else {
        // Try searching by hubName or ownerName as fallback if name was passed
        const hub = await Franchise.findOne({ 
          $or: [
            { hubName: fId }, 
            { "businessDetails.name": fId },
            { ownerName: fId }
          ] 
        });
        if (hub) {
          vehicleData.franchise = hub._id;
        } else {
          console.warn(`Could not resolve franchise for: ${fId}. Removing.`);
          delete vehicleData.franchise;
        }
      }
    }

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
    let fId = franchiseId;
    if (fId && typeof fId === 'string') {
      fId = fId.trim().replace(/^\(|\)$/g, '');
    }

    let resolvedFranchiseId = null;
    if (fId) {
      if (mongoose.Types.ObjectId.isValid(fId)) {
        resolvedFranchiseId = fId;
      } else {
        const hub = await Franchise.findOne({ 
          $or: [
            { hubName: fId }, 
            { "businessDetails.name": fId },
            { ownerName: fId }
          ] 
        });
        if (hub) resolvedFranchiseId = hub._id;
      }
    }

    const query = resolvedFranchiseId ? { franchise: resolvedFranchiseId } : (fId ? { franchise: null } : {});
    
    let vehicles = await Vehicle.find(query).sort('-createdAt').lean();

    // Attach live location and rider name from assignments
    for (let vehicle of vehicles) {
       try {
          // Look for any assignment (active preferred)
          let assignment = await Assignment.findOne({ vehicle: vehicle._id, status: 'active' }).sort('-startTime').lean();
          if (!assignment) {
             assignment = await Assignment.findOne({ vehicle: vehicle._id }).sort('-startTime').lean();
          }

          if (assignment) {
             const rider = await Rider.findById(assignment.rider).select('name phone lastLocation currentSpeed').lean();
             if (rider) {
                vehicle.rider = rider.name || rider.phone || 'Assigned';
                vehicle.lastLocation = rider.lastLocation;
                vehicle.currentSpeed = rider.currentSpeed;
             }
          }
       } catch (err) {
          console.error("Rider lookup error for vehicle:", vehicle.plate, err);
       }
    }

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

// @desc    Assign vehicle to rider
// @route   POST /api/v1/fleet/assignments
export const createAssignment = async (req, res) => {
  try {
    const { vehiclePlate, riderPhone, type, hubName } = req.body;

    const vPlate = vehiclePlate.trim();
    const rPhone = riderPhone.trim();

    const vehicle = await Vehicle.findOne({ plate: vPlate });
    const rider = await Rider.findOne({ phone: rPhone });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: `Vehicle with plate ${vPlate} not found` });
    }
    if (!rider) {
      return res.status(404).json({ success: false, message: `Rider with phone ${rPhone} not found` });
    }

    if (vehicle.status !== 'available') {
      return res.status(400).json({ success: false, message: `Vehicle ${vPlate} is currently ${vehicle.status}` });
    }

    const assignment = await Assignment.create({
      vehicle: vehicle._id,
      rider: rider._id,
      type,
      hubName
    });

    // Update statuses
    vehicle.status = 'assigned';
    await vehicle.save();

    rider.vehicleId = vehicle._id;
    await rider.save();

    res.status(201).json({ success: true, assignment: {
      ...assignment._doc,
      vehicle: { _id: vehicle._id, plate: vehicle.plate, model: vehicle.model },
      rider: { _id: rider._id, name: rider.name, phone: rider.phone }
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all assignments
// @route   GET /api/v1/fleet/assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('vehicle', 'plate model')
      .populate('rider', 'name phone')
      .sort('-startTime');

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

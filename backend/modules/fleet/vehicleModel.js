import mongoose from 'mongoose';

const MaintenanceLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: String,
  staff: String,
  description: String,
});

const VehicleSchema = new mongoose.Schema({
  plate: {
    type: String,
    required: true,
    unique: true,
  },
  vin: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
    default: 'Flexigo Pro v2',
  },
  manufactureDate: Date,
  insurancePolicy: String,
  insuranceExpiry: Date,
  pUCNumber: String,
  pUCExpiry: Date,
  status: {
    type: String,
    enum: ['available', 'assigned', 'in-transit', 'in-service', 'quarantined'],
    default: 'available',
  },
  battery: {
    type: Number,
    default: 100,
  },
  range: {
    type: Number,
    default: 100,
  },
  rcUrl: String,
<<<<<<< HEAD
  insuranceDocUrl: String,
  pucDocUrl: String,
=======
  images: [String],
>>>>>>> b8587a0b9246a36325c120634da153e6ec18fa8f
  maintenanceLogs: [MaintenanceLogSchema],
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Vehicle', VehicleSchema);

import mongoose from 'mongoose';

const GeofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['inclusion', 'exclusion', 'speed-cap'],
    default: 'inclusion'
  },
  radius: {
    type: String,
    default: '1.0km'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  alerts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Geofence || mongoose.model('Geofence', GeofenceSchema);

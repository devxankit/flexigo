import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const RiderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  lastLocation: {
    lat: Number,
    lng: Number
  },
  currentSpeed: Number
});
const Rider = mongoose.model('Rider', RiderSchema);

const GeofenceSchema = new mongoose.Schema({
  name: String,
  type: String,
  radius: String,
  center: {
    lat: Number,
    lng: Number
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider'
  },
  status: String
});
const Geofence = mongoose.model('Geofence', GeofenceSchema);

const run = async () => {
  await connectDB();
  const geofences = await Geofence.find().populate('riderId');
  console.log('\n=== GEOFENCES ===');
  console.log(JSON.stringify(geofences, null, 2));

  const riders = await Rider.find();
  console.log('\n=== RIDERS ===');
  console.log(JSON.stringify(riders, null, 2));

  process.exit();
};

run();

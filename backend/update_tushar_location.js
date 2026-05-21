import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

// Force DNS servers to resolve MongoDB Atlas SRV records reliably
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ Database Connection Error:', err.message);
    process.exit(1);
  }
};

const RiderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  lastLocation: {
    lat: Number,
    lng: Number,
    latitude: Number,
    longitude: Number,
    address: String,
    updatedAt: Date
  }
}, { strict: false });

const Rider = mongoose.models.Rider || mongoose.model('Rider', RiderSchema);

const run = async () => {
  await connectDB();
  
  // exact coordinates for Prima Domus building-B, Patil Nagar, Balewadi, Pune
  const targetLat = 18.58082;
  const targetLng = 73.76704;
  const targetAddress = "Prima Domus building-B, Prima Domus, Patil Nagar, Balewadi, Pune, Maharashtra 411045";

  console.log(`📡 Updating Tushar's location to Prima Domus (${targetLat}, ${targetLng})...`);

  // Update both riders named Tushar to ensure correct test rider is updated
  const updateResult = await Rider.updateMany(
    { name: /Tushar/i },
    {
      $set: {
        lastLocation: {
          lat: targetLat,
          lng: targetLng,
          latitude: targetLat,
          longitude: targetLng,
          address: targetAddress,
          updatedAt: new Date()
        },
        currentSpeed: 0
      }
    }
  );

  console.log('✅ Update Result:', updateResult);

  // Fetch and confirm current state in MongoDB
  const updatedRiders = await Rider.find({ name: /Tushar/i });
  console.log('\n=== CURRENT DATABASE STATE ===');
  updatedRiders.forEach(r => {
    console.log({
      _id: r._id,
      name: r.name,
      phone: r.phone,
      lastLocation: r.lastLocation
    });
  });

  process.exit(0);
};

run();

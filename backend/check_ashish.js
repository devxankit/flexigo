import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ DB Connected');

const Rider = mongoose.model('Rider', new mongoose.Schema({}, { strict: false }));
const Assignment = mongoose.model('Assignment', new mongoose.Schema({}, { strict: false }));

// 1. Find Ashish
const ashish = await Rider.findOne({ name: /Ashish/i }).lean();
console.log('\n=== ASHISH RIDER ===');
console.log({
  _id: ashish?._id,
  name: ashish?.name,
  phone: ashish?.phone,
  lastLocation: ashish?.lastLocation,
  vehicleId: ashish?.vehicleId,
  currentSpeed: ashish?.currentSpeed
});

// 2. Check assignments for Ashish
const assignments = await Assignment.find({ rider: ashish?._id }).lean();
console.log('\n=== ASHISH ASSIGNMENTS ===');
console.log(JSON.stringify(assignments, null, 2));

process.exit(0);

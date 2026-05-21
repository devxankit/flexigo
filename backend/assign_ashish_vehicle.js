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

const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({}, { strict: false }));
const Rider = mongoose.model('Rider', new mongoose.Schema({}, { strict: false }));
const Assignment = mongoose.model('Assignment', new mongoose.Schema({
  vehicle: mongoose.Schema.Types.ObjectId,
  rider: mongoose.Schema.Types.ObjectId,
  type: String,
  hubName: String,
  status: String,
  startTime: Date,
}, { strict: false }));

const ashish = await Rider.findOne({ name: /Ashish/i });
const vehicle = await Vehicle.findOne({ plate: 'MH45TG4567' }); // JS200 - clean plate

if (!ashish || !vehicle) {
  console.error('❌ Could not find Ashish or Vehicle!');
  process.exit(1);
}

console.log(`\n✅ Found Ashish: ${ashish.name} (${ashish._id})`);
console.log(`✅ Found Vehicle: ${vehicle.plate} - ${vehicle.model} (${vehicle._id})`);

// Create assignment
const assignment = await Assignment.create({
  vehicle: vehicle._id,
  rider: ashish._id,
  type: 'fleet',
  hubName: 'Pune Hub',
  status: 'active',
  startTime: new Date(),
});

console.log('\n✅ Assignment Created:', assignment._id);

// Update vehicle status to assigned
await Vehicle.findByIdAndUpdate(vehicle._id, { status: 'assigned' });
console.log('✅ Vehicle status set to: assigned');

// Update rider's vehicleId
await Rider.findByIdAndUpdate(ashish._id, { vehicleId: vehicle._id });
console.log('✅ Rider vehicleId updated');

console.log('\n🎉 Ashish is now FULLY ASSIGNED to vehicle', vehicle.plate);
console.log('Now his live GPS location will show on the admin map automatically!');

process.exit(0);

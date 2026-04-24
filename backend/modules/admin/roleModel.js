import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: { type: String, required: true },
  users: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Master Administrator'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: 'admin@flexigo.com'
  },
  password: {
    type: String,
    required: true,
    default: 'flexigo_root' // Default will be hashed on first save if I add middleware
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'Manager'],
    default: 'SuperAdmin'
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;

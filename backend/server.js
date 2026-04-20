import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import dns from 'dns';
import connectDB from './config/database.js';
import './config/cloudinary.js';
import riderRoutes from './modules/rider/riderRoutes.js';
import franchiseRoutes from './modules/franchise/franchiseRoutes.js';
import fleetRoutes from './modules/fleet/vehicleRoutes.js';
import staffRoutes from './modules/staff/staffRoutes.js';
import adminRoutes from './modules/admin/adminRoutes.js';

// Load env vars
dotenv.config();

// DNS Servers setup (Commented out to fix ENOTFOUND issues)
// dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Check Surepass Config
if (process.env.SUREPASS_API_KEY) {
  console.log('✅ Surepass eKYC Configured');
} else {
  console.log('❌ Surepass eKYC Not Configured');
}

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Flexigo API',
    status: 'Running'
  });
});

// API Routes
app.use('/api/v1/rider', riderRoutes);
app.use('/api/v1/franchise', franchiseRoutes);
app.use('/api/v1/fleet', fleetRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

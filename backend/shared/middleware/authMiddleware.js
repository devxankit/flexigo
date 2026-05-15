import jwt from 'jsonwebtoken';
import Franchise from '../../modules/franchise/franchiseModel.js';
import Rider from '../../modules/rider/riderModel.js';
import Admin from '../../modules/admin/adminModel.js';
import Role from '../../modules/admin/roleModel.js';

export const protectFranchise = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.franchise = await Franchise.findById(decoded.id).select('-otp -otpExpire');
      if (!req.franchise) return res.status(401).json({ success: false, message: 'Authorized user not found' });
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid Token' });
    }
  }
  if (!token) res.status(401).json({ success: false, message: 'No Token' });
};

export const protectRider = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.rider = await Rider.findById(decoded.id).select('-otp -otpExpire');
      if (!req.rider) return res.status(401).json({ success: false, message: 'Authorized rider not found' });
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid Token' });
    }
  }
  if (!token) res.status(401).json({ success: false, message: 'No Token' });
};

// @desc    Protect Admin Routes
export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("DEBUG: Received Admin Token:", token);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        console.log("DEBUG: Admin not found for ID:", decoded.id);
        return res.status(401).json({ success: false, message: 'Admin not found' });
      }
      next();
    } catch (error) {
      console.error("DEBUG: JWT Verification Error:", error.message);
      res.status(401).json({ success: false, message: 'Invalid Admin Token' });
    }
  }
  if (!token) res.status(401).json({ success: false, message: 'Authorization Required' });
};

// @desc    Authorize Admin Permissions
export const authorize = (module, action) => {
  return async (req, res, next) => {
    try {
      // 1. Better SuperAdmin Check (Case-insensitive)
      const userRole = req.admin.role || '';
      const lowerRole = userRole.toLowerCase();
      if (lowerRole === 'superadmin' || lowerRole === 'admin' || lowerRole === 'administrator') {
        return next();
      }

      // 2. Fetch the role's permissions from DB
      const role = await Role.findOne({ 
        name: { $regex: new RegExp(`^${userRole}$`, 'i') } 
      });
      
      if (!role) {
        return res.status(403).json({ 
          success: false, 
          message: `Role '${userRole}' not defined in Matrix. Access Denied.` 
        });
      }

      // 3. Verify permission
      const hasPermission = role.permissions && role.permissions[module] && role.permissions[module][action];

      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          message: `Access Denied: No '${action}' permission for '${module}'.` 
        });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(500).json({ success: false, message: 'Internal Security Error' });
    }
  };
};

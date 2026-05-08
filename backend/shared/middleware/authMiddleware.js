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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) return res.status(401).json({ success: false, message: 'Admin not found' });
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid Admin Token' });
    }
  }
  if (!token) res.status(401).json({ success: false, message: 'Authorization Required' });
};

// @desc    Authorize Admin Permissions
// @params  module: String (e.g. 'Fleet'), action: String (e.g. 'delete')
export const authorize = (module, action) => {
  return async (req, res, next) => {
    try {
      // 1. Check if user is SuperAdmin (SuperAdmin has all access)
      if (req.admin.role === 'SuperAdmin') return next();

      // 2. Fetch the role's permissions from DB
      const role = await Role.findOne({ name: req.admin.role });
      
      if (!role) {
        return res.status(403).json({ success: false, message: 'Role not defined. Access Denied.' });
      }

      // 3. Verify permission for specific module and action
      const hasPermission = role.permissions && role.permissions[module] && role.permissions[module][action];

      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          message: `Access Denied: You do not have '${action}' permission for '${module}' module.` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Security Error' });
    }
  };
};

import jwt from 'jsonwebtoken';
import Franchise from '../../modules/franchise/franchiseModel.js';
import Rider from '../../modules/rider/riderModel.js';

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

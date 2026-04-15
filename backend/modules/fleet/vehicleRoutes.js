import express from 'express';
import {
  addVehicle,
  getVehicles,
  updateVehicleStatus,
  addMaintenanceLog,
} from './vehicleController.js';
import { protectFranchise } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectFranchise, getVehicles);
router.post('/add', protectFranchise, addVehicle);
router.post('/:id/maintenance', protectFranchise, addMaintenanceLog);
router.patch('/:id/status', protectFranchise, updateVehicleStatus);

export default router;

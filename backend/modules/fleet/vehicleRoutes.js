import express from 'express';
import {
  addVehicle,
  getVehicles,
  updateVehicleStatus,
  addMaintenanceLog,
  getAssignments,
  createAssignment
} from './vehicleController.js';
import { protectFranchise, protectFranchiseOrAdmin } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectFranchiseOrAdmin, getVehicles);
router.get('/assignments', getAssignments);
router.post('/assignments', createAssignment);
router.post('/:id/maintenance', protectFranchise, addMaintenanceLog);
router.patch('/:id/status', protectFranchise, updateVehicleStatus);

export default router;

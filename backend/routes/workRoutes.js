import express from 'express';
import {
  saveWorkLog,
  getUserTimesheet,
  getUserPayroll,
  getAllPayrolls,
} from '../controllers/workController.js';

const router = express.Router();

// Route to save a work log when an employee stops work
router.post('/log', saveWorkLog);

// Route to get the timesheet for a specific user
router.get('/timesheet/:id', getUserTimesheet);

// Route to get the payroll for a specific user
router.get('/payroll/:id', getUserPayroll);

// Route to get all payrolls (Admin access)
router.get('/admin/payroll', getAllPayrolls);

export default router;

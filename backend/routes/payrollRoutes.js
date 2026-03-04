const express = require('express');
const router = express.Router();
const {
  runPayroll, approvePayroll, getPayrolls, getEmployeePayroll, getPayrollDetail, markPayrollPaid
} = require('../controllers/payrollController');
const { protect } = require('../middleware/authMiddleware');
const { isPayrollAdmin, isAnyAdmin } = require('../middleware/roleMiddleware');

router.post('/run', protect, isPayrollAdmin, runPayroll);
router.get('/', protect, isAnyAdmin, getPayrolls);
router.get('/detail/:id', protect, isAnyAdmin, getPayrollDetail);
router.get('/:employeeId', protect, getEmployeePayroll);
router.put('/:id/approve', protect, isPayrollAdmin, approvePayroll);
router.put('/:id/pay', protect, isPayrollAdmin, markPayrollPaid);

module.exports = router;

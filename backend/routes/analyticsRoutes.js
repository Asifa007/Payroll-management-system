const express = require('express');
const router = express.Router();
const { getPayrollSummary, getDepartmentCost, getHeadcount } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { isAnyAdmin } = require('../middleware/roleMiddleware');

router.get('/payroll-summary', protect, isAnyAdmin, getPayrollSummary);
router.get('/department-cost', protect, isAnyAdmin, getDepartmentCost);
router.get('/headcount', protect, isAnyAdmin, getHeadcount);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getMyPayslips, getMySalaryBreakup, getMyProfile } = require('../controllers/essController');
const { protect } = require('../middleware/authMiddleware');

router.get('/payslips', protect, getMyPayslips);
router.get('/salary-breakup', protect, getMySalaryBreakup);
router.get('/profile', protect, getMyProfile);

module.exports = router;

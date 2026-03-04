const express = require('express');
const router = express.Router();
const { getPFReport, getESIReport, getTaxReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { isAnyAdmin } = require('../middleware/roleMiddleware');

router.get('/pf', protect, isAnyAdmin, getPFReport);
router.get('/esi', protect, isAnyAdmin, getESIReport);
router.get('/tax', protect, isAnyAdmin, getTaxReport);

module.exports = router;

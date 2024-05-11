const express = require('express');
const accessibilityController = require('../controllers/accessibilityController');
const reportService = require('../controllers/reportService');

const router = express.Router();

router.patch('/api/evaluate', accessibilityController.evaluateWebsiteAccessibility);
router.get('/api/statistics/:websiteId', accessibilityController.getStatistics);

module.exports = router;
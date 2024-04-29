const express = require('express');
const accessibilityController = require('../controllers/accessibilityController');

const router = express.Router();

router.post('/api/evaluate/:websiteId', accessibilityController.evaluateWebsiteAccessibility);

module.exports = router;
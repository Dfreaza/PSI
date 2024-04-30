const express = require('express');
const accessibilityController = require('../controllers/accessibilityController');

const router = express.Router();

router.patch('/evaluate', accessibilityController.evaluateWebsiteAccessibility);

module.exports = router;
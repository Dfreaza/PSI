const express = require('express');
const websiteController = require('../controllers/websitecontroller');

const router = express.Router();

router.post('/api/websites', websiteController.createWebsite);
router.get('/api/websites/:websiteId', websiteController.getWebsite);
router.put('/api/websites/:WebsiteId', websiteController.updateWebsite);
router.get('/api/websites', websiteController.getAllWebsites);

module.exports = router;
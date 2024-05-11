const express = require('express');
const websiteController = require('../controllers/websitecontroller');

const router = express.Router();

router.post('/api/websites', websiteController.createWebsite);
router.get('/api/websites', websiteController.getAllWebsites);
router.get('/api/websites/:websiteId', websiteController.getWebsite);
router.put('/api/websites/:WebsiteId', websiteController.updateWebsite);
router.delete('/api/websites',websiteController.deleteWebsite);
router.delete('/api/websites/pages', websiteController.deletePage);

module.exports = router;
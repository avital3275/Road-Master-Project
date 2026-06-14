const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/report', authMiddleware, roleMiddleware(['teacher']), pdfController.sendReport);

module.exports = router;
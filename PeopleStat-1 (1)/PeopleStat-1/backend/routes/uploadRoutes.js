const express = require('express');
const { uploadJD, uploadCV, uploadActivity, uploadEmployeeData, getUploadStats, uploadMiddleware } = require('../controllers/uploadController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Get upload statistics
router.get('/', getUploadStats);

// Upload job description
router.post('/jd', uploadMiddleware, uploadJD);

// Upload CV
router.post('/cv', uploadMiddleware, uploadCV);

// Upload activity data
router.post('/activity', uploadMiddleware, uploadActivity);

// Upload employee data
router.post('/employee', uploadMiddleware, uploadEmployeeData);

module.exports = router;

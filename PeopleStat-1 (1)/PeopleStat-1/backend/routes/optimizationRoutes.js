const express = require('express');
const { getRecommendations } = require('../controllers/optimizationController.js');

const router = express.Router();

// GET /api/optimization/recommendations
router.get('/recommendations', getRecommendations);

module.exports = router;

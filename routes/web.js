const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController.js');
const segmentController = require('../controllers/segmentController.js');

// Render the main page
const weatherModel = require('../models/weatherModel');

router.get('/', async (req, res) => {
  try {
    const segments = await weatherModel.getAllSegment();
    res.render('index', { segments });
  } catch (err) {
    console.error('❌ Failed to load segments:', err);
    res.status(500).send('Error loading page');
  }
});



// API endpoints
router.get('/api/segments', weatherController.getAllSegment);
router.get('/api/segments/:segmentId/weather', weatherController.getWeatherData);
router.get('/api/segments/:segmentId/soil-grass', weatherController.getSoilAndGrassData);
router.post('/api/weather', weatherController.addWeather);
router.post('/api/segment/height', segmentController.updateSegmentHeight);




module.exports = router;
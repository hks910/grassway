// controllers/weatherController.js
const weatherModel = require('../models/weatherModel');
const db = require('../models/db');



const getAllSegment = async (req, res) => {
  try {
    const segments = await weatherModel.getAllSegment();  // fixed call
    res.status(200).json(segments);
  } catch (err) {
    console.error('❌ Failed to get segments:', err);
    res.status(500).json({ message: 'Error fetching segments' });
  }
};


// Controller function to get weather data for a specific segment
const getWeatherData = async (req, res) => {
  const { segmentId } = req.params;
  try {
    const weatherData = await weatherModel.getSegmentWeatherData(segmentId);
    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving weather data", error: err });
  }
};


// Controller function to get soil and grass data for a segment
const getSoilAndGrassData = async (req, res) => {
    const { segmentId } = req.params;
    try {
        const soilAndGrassData = await weatherModel.getSegmentSoilAndGrassData(segmentId);
        res.json(soilAndGrassData);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving soil and grass data", error: err });
    }
};

// Function to insert weather data
const axios = require('axios');


const addWeather = async (req, res) => {
  try {
    // Step 1: Get all segment IDs and adm4Codes
    const [segments] = await db.query('SELECT id, adm4Code FROM segment');

    if (segments.length === 0) {
      return res.status(404).json({ message: 'No segments found' });
    }

    const insertedWeather = [];

    for (const segment of segments) {
      const { segment_id, adm4Code } = segment;

      try {
        // Step 2: Fetch weather data from BMKG using adm4Code
        const response = await axios.get(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4Code}`);
        const weatherData = response.data;

        // Step 3: Insert weather data into the database
        const newWeatherId = await weatherModel.addWeatherData(segment_id, weatherData);

        insertedWeather.push({ segmentId: segment_id, id: newWeatherId });
      } catch (err) {
        console.error(`Error fetching/inserting for segment ${segment_id}:`, err.message);
        insertedWeather.push({ segmentId: segment_id, error: err.message });
      }
    }

    res.status(201).json({ message: 'Weather data processed', result: insertedWeather });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// src/controllers/segmentController.js

const segmentService = require('../services/segmentService');

const updateSegmentHeight = async (req, res) => {
  const { segmentId } = req.body;
  try {
    const rows = await segmentService.updateSegmentHeightById(segmentId);
    if (rows > 0) {
      return res.status(200).json({ message: "Segment height updated successfully" });
    }
    return res.status(404).json({ message: "Segment not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating segment height", error: err.message });
  }
};




module.exports = {
    getAllSegment,
    getWeatherData,
    getSoilAndGrassData,
    addWeather,
    updateSegmentHeight
};

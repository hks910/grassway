// controllers/weatherController.js
const weatherModel = require('../models/weatherModel');
const db = require('../models/db');
const axios = require('axios');



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


const getSoilAndGrassData = async (req, res) => {
  const { segmentId } = req.params;
  try {
    const data = await weatherModel.getSegmentSoilAndGrassData(segmentId);
    res.json({
      segmentId,
      soils: data.soils,
      grasses: data.grasses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving soil and grass data",
      error: err.message
    });
  }
};


// Function to insert weather data


  const addWeather = async (req, res) => {
  try {
    const [segments] = await db.query('SELECT id, adm4Code FROM segment');
    if (segments.length === 0) {
      return res.status(404).json({ message: 'No segments found' });
    }

    const insertedWeather = [];

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    for (const segment of segments) {
      const segmentId = segment.id;
      const adm4Code = segment.adm4Code;

      // Cek apakah sudah ada data hari ini
      const [existing] = await db.query(`
        SELECT id FROM weathers
        WHERE segment_id = ? AND DATE(insert_time) = ?
        LIMIT 1
      `, [segmentId, today]);

      if (existing.length > 0) {
        insertedWeather.push({
          segmentId,
          skipped: true,
          reason: 'Already updated today'
        });
        continue;
      }

      try {
        const response = await axios.get(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4Code}`);
        const weatherData = response.data;

        const newWeatherId = await weatherModel.addWeatherData(segmentId, weatherData);
        insertedWeather.push({ segmentId, inserted: true, id: newWeatherId });

      } catch (err) {
        insertedWeather.push({ segmentId, error: err.message });
      }
    }

    res.status(201).json({ message: 'Weather update attempted', result: insertedWeather });
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

async function getSegment(req, res) {
  const segmentId = req.params.segmentId;

  if (!segmentId) {
    return res.status(400).json({ message: 'segmentId is required' });
  }

  try {
    const segment = await weatherModel.getSegmentById(segmentId);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json(segment);
  } catch (error) {
    console.error('Error fetching segment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = {
    getAllSegment,
    getWeatherData,
    getSoilAndGrassData,
    addWeather,
    updateSegmentHeight,
    getSegment
};

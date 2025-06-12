const db = require('./db');
const axios = require('axios');


// Get all segments
const getAllSegment = async () => {
  try {
    const [results] = await db.query(`
      SELECT * from segment;
    `);
    console.log('✅ Segments fetched:', results);
    return results;
  } catch (err) {
    console.error('❌ Error fetching segments:', err);
    throw err;
  }
};

// Get weather data for a segment
const getSegmentWeatherData = async (segmentId) => {
  try {
    const [results] = await db.query(
      `SELECT w.id, w.insert_time, w.jsons
       FROM weathers w
       WHERE w.segment_id = ?
       ORDER BY w.insert_time DESC
       LIMIT 1;`,
      [segmentId]
    );
    return results[0]; // Return the latest record only
  } catch (err) {
    throw err;
  }
};


// Get soil and grass data for a segment
const getSegmentSoilAndGrassData = async (segmentId) => {
  try {
    // Get soil data
    const [soilResults] = await db.query(`
      SELECT ss.soil_id, ss.percentage, s.soil_name
      FROM soil_segment ss
      JOIN soil s ON ss.soil_id = s.id
      WHERE ss.segment_id = ?;
    `, [segmentId]);

    // Get grass data
    const [grassResults] = await db.query(`
      SELECT sg.grass_id, sg.percentage, g.grass_name
      FROM segment_grass sg
      JOIN grass g ON sg.grass_id = g.id
      WHERE sg.segment_id = ?;
    `, [segmentId]);

    return {
      soils: soilResults,
      grasses: grassResults
    };
  } catch (err) {
    throw err;
  }
};


// Update estimated height of a segment
const updateSegmentHeight = async (segmentId, estimatedHeightNow, estimatedHeightIn3Days) => {
  try {
    const [result] = await db.query(`
      UPDATE segment 
      SET estimated_height_now = ?, 
          estimated_height_in_3_days = ?
      WHERE id = ?;
    `, [estimatedHeightNow, estimatedHeightIn3Days, segmentId]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

// Add weather data for a segment
const addWeatherData = async (segmentId, jsonData) => {
  try {
    const [result] = await db.query(`
      INSERT INTO weathers (segment_id, jsons)
      VALUES (?, ?);
    `, [segmentId, JSON.stringify(jsonData)]);
    return result.insertId;
  } catch (err) {
    throw err;
  }
};

async function getSegmentById(segmentId) {
  const [rows] = await db.query(
    `SELECT id, adm4Code, avg_elevation, max_elevation, min_elevation, estimated_height_now, estimated_height_in_3_days
     FROM segment
     WHERE id = ?`,
    [segmentId]
  );
  if (rows.length === 0) return null;
  return rows[0];
}

module.exports = {
  getAllSegment,
  getSegmentWeatherData,
  getSegmentSoilAndGrassData,
  addWeatherData,
  updateSegmentHeight,
  getSegmentById
};

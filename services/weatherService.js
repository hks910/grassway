const db = require('../models/db');
const axios = require('axios');

async function getForecastsByAdm4(adm4Code) {
  // Step 1: Get the segment ID for the given adm4Code
  const [segments] = await db.query(
    `SELECT id FROM segment WHERE adm4Code = ? LIMIT 1`,
    [adm4Code]
  );
  if (segments.length === 0) return [];

  const segmentId = segments[0].id;

  // Step 2: Get latest weather jsons for that segment
const [results] = await db.query(
    `SELECT w.jsons
     FROM weathers w
     WHERE w.segment_id = ?
     ORDER BY w.insert_time DESC
     LIMIT 1`,
    [segmentId]
  );

  if (results.length === 0) return [];

  const row = results[0];
  let parsedJson;
  try {
    // If `jsons` is a string in the DB, parse it:
    parsedJson = typeof row.jsons === 'string' ? JSON.parse(row.jsons) : row.jsons;
  } catch (err) {
    throw new Error("Invalid JSON format in weather jsons column");
  }

  return parsedJson.data;
}


module.exports = { getForecastsByAdm4 };

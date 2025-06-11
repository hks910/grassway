const db = require('../models/db');
const weatherService = require('./weatherService');
const calculateHeights = require('./calculateHeights');

async function updateSegmentHeightById(segmentId) {
  const [segments] = await db.query(`
    SELECT avg_elevation, max_elevation, min_elevation, adm4Code
    FROM segment
    WHERE id = ?
  `, [segmentId]);

  if (segments.length === 0) return 0;
  const segment = segments[0];

  const [soilSegments] = await db.query(`
    SELECT ss.soil_id, ss.percentage, s.soil_name
    FROM soil_segment ss
    JOIN soil s ON ss.soil_id = s.id
    WHERE ss.segment_id = ?
  `, [segmentId]);

  const [grassSegments] = await db.query(`
    SELECT gs.grass_id, gs.percentage, g.grass_name
    FROM segment_grass gs
    JOIN grass g ON gs.grass_id = g.id
    WHERE gs.segment_id = ?
  `, [segmentId]);

  const forecasts = await weatherService.getForecastsByAdm4(segment.adm4Code);

  const { nowHeight, in3DaysHeight } = calculateHeights({
    soilSegments,
    grassSegments,
    forecasts,
    elevation: {
      avg: Number(segment.avg_elevation) || 0,
      max: Number(segment.max_elevation) || 0,
      min: Number(segment.min_elevation) || 0
    }
  });

  const [result] = await db.query(`
    UPDATE segment
    SET estimated_height_now = ?, 
        estimated_height_in_3_days = ?,
        last_updated_calculation_date = ?
    WHERE id = ?
  `, [nowHeight, in3DaysHeight, new Date(), segmentId]);

  return result.affectedRows;
}

module.exports = { updateSegmentHeightById };

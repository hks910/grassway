const db = require('../models/db');
const weatherModel = require('../models/weatherModel');
const { calculateHeights } = require('../services/calculateHeights');


async function updateSegmentHeightById(segmentId) {
  const [segments] = await db.query(`
    SELECT avg_elevation, max_elevation, min_elevation, adm4Code, estimated_height_now
    FROM segment
    WHERE id = ?
  `, [segmentId]);

  

  if (segments.length === 0) return 0;
  const segment = segments[0];



  // Mengambil segmen tanah
  const [soilSegments] = await db.query(`
    SELECT ss.soil_id, ss.percentage, s.soil_name
    FROM soil_segment ss
    JOIN soil s ON ss.soil_id = s.id
    WHERE ss.segment_id = ?
  `, [segmentId]);

  // Mengambil segmen rumput
  const [grassSegments] = await db.query(`
    SELECT gs.grass_id, gs.percentage, g.grass_name
    FROM segment_grass gs
    JOIN grass g ON gs.grass_id = g.id
    WHERE gs.segment_id = ?
  `, [segmentId]);

  // Mengambil data cuaca untuk segmen
const weatherRecord = await weatherModel.getSegmentWeatherData(segmentId);
const forecasts = weatherRecord
  ? (typeof weatherRecord.jsons === 'string'
      ? JSON.parse(weatherRecord.jsons)
      : weatherRecord.jsons
    ).data || []
  : [];


  console.log("weatherRecord:", weatherRecord);


  // Menghitung tinggi berdasarkan faktor-faktor yang ada
const { nowHeight, in3DaysHeight } = calculateHeights({
  soilSegments,
  grassSegments,
  forecasts,
  elevation: {
    avg: Number(segment.avg_elevation) || 0,
    max: Number(segment.max_elevation) || 0,
    min: Number(segment.min_elevation) || 0
  },
  initialHeight: Number(segment.estimated_height_now) || 0
});


  // Debug: Periksa nilai yang dihitung
  if (isNaN(in3DaysHeight) || in3DaysHeight === null || in3DaysHeight === undefined) {
    console.error(`Invalid height calculated for segment ${segmentId}: ${in3DaysHeight}`);
    return 0; // Tidak melakukan update jika tinggi tidak valid
  }

  // Memperbarui tinggi segmen di database
await db.query(`
  UPDATE segment
  SET estimated_height_now = ?, estimated_height_in_3_days = ?
  WHERE id = ?
`, [nowHeight, in3DaysHeight, segmentId]);


  return 1; // Mengembalikan 1 jika segmen berhasil diperbarui
}

module.exports = { updateSegmentHeightById };
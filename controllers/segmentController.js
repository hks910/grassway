const segmentService = require('../services/segmentService');
const db = require('../models/db');


// Controller untuk update tinggi segment
let lastUpdateTime = null;

const updateAllSegmentHeights = async (req, res) => {
  const now = new Date();
if (lastUpdateTime && now - lastUpdateTime < 24 * 60 * 60 * 1000) {
  const nextAllowed = new Date(lastUpdateTime.getTime() + 24 * 60 * 60 * 1000);
  return res.status(429).json({ message: 'Update allowed only once per day', nextAllowed });
}


  try {
    const [segments] = await db.query(`SELECT id FROM segment`);
    const result = [];

    for (const seg of segments) {
      try {
        const rows = await segmentService.updateSegmentHeightById(seg.id);
        result.push({ segmentId: seg.id, status: rows > 0 ? 'updated' : 'not found' });
      } catch (err) {
        result.push({ segmentId: seg.id, error: err.message });
      }
    }

    lastUpdateTime = now;
    res.status(200).json({ message: 'Height updated', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
};


module.exports = {
  updateAllSegmentHeights
};

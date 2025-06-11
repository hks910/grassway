const segmentService = require('../services/segmentService');

// Controller untuk update tinggi segment
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
  updateSegmentHeight
};

const cron = require('node-cron');
const weatherController = require('./controllers/weatherController');

cron.schedule('0 0 */2 * *', async () => {
  console.log(`[CRON] Running weather auto-update: ${new Date().toISOString()}`);
  try {
    await weatherController.addWeatherAuto();
    console.log(`[CRON] Success update`);
  } catch (err) {
    console.error(`[CRON] Failed to update weather`, err);
  }
});


cron.schedule('0 0 */2 * *', async () => {
  console.log('Running height update scheduler every 2 days...');
  try {
    const [segments] = await db.query(`SELECT id FROM segment`);
    for (const seg of segments) {
      try {
        await segmentService.updateSegmentHeightById(seg.id);
      } catch (err) {
        console.error(`Error updating segment ${seg.id}:`, err.message);
      }
    }
    console.log('Scheduled height update done.');
  } catch (err) {
    console.error('Scheduled task failed:', err);
  }
});
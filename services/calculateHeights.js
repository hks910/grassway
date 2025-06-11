function calculateHeights({ soilSegments, grassSegments, forecasts, elevation }) {
  const soilRetentionFactor = soilSegments.reduce((sum, ss) => {
    const base = {
      Latosol: 1.1,
      Podsolik: 1.05,
      Grumosol: 1.0,
      Aluvial: 0.9,
      Andosol: 1.2,
      Regosol: 0.8,
      Litosol: 0.7,
      Mediteran: 0.85
    }[ss.soil_name.split(' ')[0]] || 1.0;
    return sum + base * (ss.percentage / 100);
  }, 0);

  const grassGrowthRate = grassSegments.reduce((sum, gs) => {
    const rate = {
      Zoysia: 0.5,
      Axonopus: 0.4,
      Vetiveria: 0.6,
      Imperata: 0.7,
      Cynodon: 0.8,
      Paspalum: 0.45
    }[gs.grass_name.split(' ')[0]] || 0.5;
    return sum + rate * (gs.percentage / 100);
  }, 0);

  const tempDrop = (elevation.avg / 100) * 0.65;
  const elevationFactor = 1 - Math.min(tempDrop / 10, 0.3);

  let tSum = 0, huSum = 0, count = 0;
  forecasts.forEach(fc => {
    fc.cuaca.forEach(c => {
      tSum += c.t;
      huSum += c.hu;
      count++;
    });
  });

  const avgT = count ? tSum / count : 25;
  const avgHu = count ? huSum / count : 70;

  const tempFactor = 1 - Math.abs(avgT - 25) * 0.02;
  const huFactor = 1 - Math.abs(avgHu - 70) * 0.01;

  const nowHeight = Number(elevation.avg) || 0;
  const dailyGrowth = grassGrowthRate * soilRetentionFactor * elevationFactor * tempFactor * huFactor;
  const in3DaysHeight = nowHeight + dailyGrowth * 3;

  return {
    nowHeight: parseFloat(nowHeight.toFixed(2)),
    in3DaysHeight: parseFloat(in3DaysHeight.toFixed(2))
  };
}

module.exports = calculateHeights;

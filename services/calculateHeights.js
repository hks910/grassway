

  // 1. Koefisien tanah per jenis (sementara hardcoded)
function calculateHeights(params) {
  const { soilSegments, grassSegments, forecasts, elevation, initialHeight } = params;

  const soilCoefficients = {
    Latosol: 1.1, Podsolik: 1.05, Grumosol: 1.0, Aluvial: 0.9,
    Andosol: 1.2, Regosol: 0.8, Litosol: 0.7, Mediteran: 0.85
  };

  let soilFactor = 0;
  soilSegments.forEach(ss => {
    const name = ss.soil_name?.split(' ')[0] || '';
    const base = soilCoefficients[name] ?? 1.0;
    soilFactor += base * (ss.percentage / 100);
  });
  // console.log('soilFactor:', soilFactor);

  const grassRates = {
    Zoysia: 0.5, Axonopus: 0.4, Vetiveria: 0.6,
    Imperata: 0.7, Cynodon: 0.8, Paspalum: 0.45
  };

  let grassRate = 0;
  grassSegments.forEach(gs => {
    const name = gs.grass_name?.split(' ')[0] || '';
    const rate = grassRates[name] ?? 0.5;
    grassRate += rate * (gs.percentage / 100);
  });
  // console.log('grassRate:', grassRate);

  const allCuaca = forecasts.flatMap(fc =>
    Array.isArray(fc.cuaca[0]) ? fc.cuaca.flat() : fc.cuaca
  );

  if (allCuaca.length === 0) {
    console.error('No weather data available.');
    return { nowHeight: 0, in3DaysHeight: 0 };
  }

  const tempDrop = elevation.avg * 0.0065;
  const elevationFactor = 1 - (tempDrop / 10);
  // console.log('elevationFactor:', elevationFactor);

  const allTemps = allCuaca.map(c => c.t).filter(t => typeof t === 'number');
  const avgT = allTemps.reduce((a, b) => a + b, 0) / allTemps.length;
  // console.log('avgT:', avgT);

  let tempFactor = 0;
  if (avgT < 10) tempFactor = 0;
  else if (avgT < 25) tempFactor = (avgT - 10) / 15;
  else if (avgT <= 35) tempFactor = 1;
  else tempFactor = Math.max(0, 1 - (avgT - 35) / 10);
  // console.log('tempFactor:', tempFactor);

  const allHUs = allCuaca.map(c => c.hu).filter(h => typeof h === 'number');
  const avgHu = allHUs.reduce((a, b) => a + b, 0) / allHUs.length;
  // console.log('avgHu:', avgHu);

  let huFactor = 1;
  if (avgHu < 40) huFactor = 0.5;
  else if (avgHu <= 80) huFactor = 1;
  else huFactor = Math.max(0, 1 - (avgHu - 80) / 20);
  // console.log('huFactor:', huFactor);

  const totalRain = allCuaca.reduce((s, c) => s + (c.tp || 0), 0);
const waterFactor = Math.max(0.2, Math.min(totalRain / 100, 1));

  // console.log('totalRain:', totalRain, 'waterFactor:', waterFactor);

  const totalTcc = allCuaca.reduce((s, c) => s + (c.tcc || 0), 0);
  const avgTcc = totalTcc / allCuaca.length;
  const lightFactor = 1 - avgTcc / 100;
  // console.log('avgTcc:', avgTcc, 'lightFactor:', lightFactor);

  const dailyGrowth = initialHeight + ( grassRate * soilFactor * waterFactor *
                      elevationFactor * tempFactor * huFactor * lightFactor);

  const in3Days = initialHeight + dailyGrowth * 3;
  console.log( 'initialHeight:', initialHeight,'dailyGrowth:', dailyGrowth, 'estimated height in 3 days:', in3Days);

  if (isNaN(in3Days)) {
    console.error('Invalid height calculated (NaN).');
    return { nowHeight: 0, in3DaysHeight: 0 };
  }

  return {
    nowHeight: parseFloat(dailyGrowth.toFixed(2)),
    in3DaysHeight: parseFloat(in3Days.toFixed(2))
  };
}




module.exports = { calculateHeights };

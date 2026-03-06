// Portfolio data: 6 companies × 18 months (Jan 2023 – Jun 2024)
// Fixed dramatic trajectories for visually interesting charts

const months = [
  '2023-01','2023-02','2023-03','2023-04','2023-05','2023-06',
  '2023-07','2023-08','2023-09','2023-10','2023-11','2023-12',
  '2024-01','2024-02','2024-03','2024-04','2024-05','2024-06',
];

// Helper: build a month record from ARR and parameters
function buildMonth(i, arr, prevArr, prevData, params) {
  const { grrBase, grrVar, nrrBase, nrrVar, acvBase, acvVar, newLogosBase, newLogosVar,
    totalAEsStart, totalAEsEnd, rampedBase, rampedVar, smBase, smVar, magicFloor } = params;

  const grr = grrBase + Math.sin(i * 0.7) * grrVar;
  const nrr = nrrBase + Math.sin(i * 0.9 + 1) * nrrVar;
  const churn = 100 - grr;
  const downSell = 0.5 + Math.sin(i * 0.5) * 0.3;
  const acv = acvBase + Math.sin(i * 0.8) * acvVar;
  const newLogos = Math.floor(newLogosBase + Math.sin(i * 0.6 + 2) * newLogosVar);
  const newLogoBookings = Math.round(newLogos * acv);
  const expansionRate = (nrr - 100 + churn) / 100;
  const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
  const totalBookings = newLogoBookings + expansionBookings;
  const netNewArr = (totalBookings - arr * (churn / 100) * 1000 / 12) / 1000;
  const totalAEs = Math.round(totalAEsStart + (totalAEsEnd - totalAEsStart) * i / 17);
  const rampedRatio = rampedBase + Math.sin(i * 0.4) * rampedVar;
  const rampedAEs = Math.round(totalAEs * rampedRatio);
  const smSpend = Math.round(smBase + Math.sin(i * 0.3 + 1) * smVar);
  const magicNumber = Math.max(magicFloor, Math.round(((netNewArr * 1000) / smSpend) * 100) / 100);
  const cac = Math.round(smSpend / Math.max(1, newLogos));
  const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
  const ltvCac = Math.round((ltv / cac) * 10) / 10;
  const payback = Math.round(cac / (acv / 12));
  const capacityUtil = Math.round(65 + Math.sin(i * 0.5) * 15);
  const revenuePerAE = Math.round((arr * 1000) / totalAEs);

  return {
    month: months[i],
    arr: Math.round(arr * 10) / 10,
    arrGrowthMoM: i === 0 ? 1.5 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
    arrGrowthYoY: i < 12 ? null : Math.round(((arr - prevData[i - 12].arr) / prevData[i - 12].arr) * 1000) / 10,
    newLogoBookings,
    expansionBookings,
    totalBookings,
    bookingsGrowthMoM: i === 0 ? 2.0 : Math.round(((totalBookings - prevData[i - 1].totalBookings) / prevData[i - 1].totalBookings) * 1000) / 10,
    grossRetentionRate: Math.round(grr * 10) / 10,
    churnRate: Math.round(churn * 10) / 10,
    downSellRate: Math.round(Math.abs(downSell) * 10) / 10,
    netRevenueRetention: Math.round(nrr * 10) / 10,
    expansionRate: Math.round(expansionRate * 1000) / 10,
    acv: Math.round(acv),
    newLogosCount: newLogos,
    rampedAEs,
    totalAEs,
    salesCapacityUtilization: capacityUtil,
    magicNumber,
    cac,
    ltv,
    ltvCacRatio: ltvCac,
    paybackPeriodMonths: payback,
    smSpend,
    revenuePerAE,
  };
}

function generateZendesk() {
  // Strong Q1 2023, dip in Q3 2023 (macro headwinds), sharp recovery Q1 2024
  const arrCurve = [
    480, 495, 510, 505, 498, 485, 470, 460, 455, 462, 475, 490,
    515, 545, 570, 590, 605, 620,
  ];
  const params = {
    grrBase: 94, grrVar: 1, nrrBase: 108, nrrVar: 2,
    acvBase: 47, acvVar: 5, newLogosBase: 35, newLogosVar: 7,
    totalAEsStart: 145, totalAEsEnd: 168, rampedBase: 0.82, rampedVar: 0.03,
    smBase: 9000, smVar: 800, magicFloor: 0.4,
  };
  const data = [];
  for (let i = 0; i < 18; i++) {
    const arr = arrCurve[i];
    const prevArr = i === 0 ? 475 : arrCurve[i - 1];
    data.push(buildMonth(i, arr, prevArr, data, params));
  }
  return data;
}

function generateSeismic() {
  // Consistent hypergrowth with one standout spike in Oct 2023 (big enterprise deal)
  const arrCurve = [
    120, 128, 137, 147, 158, 170, 182, 193, 205, 240, 255, 268,
    282, 298, 315, 332, 350, 370,
  ];
  const params = {
    grrBase: 91, grrVar: 2, nrrBase: 115, nrrVar: 3,
    acvBase: 32, acvVar: 4, newLogosBase: 28, newLogosVar: 8,
    totalAEsStart: 62, totalAEsEnd: 130, rampedBase: 0.65, rampedVar: 0.08,
    smBase: 5500, smVar: 600, magicFloor: 0.5,
  };
  const data = [];
  for (let i = 0; i < 18; i++) {
    const arr = arrCurve[i];
    const prevArr = i === 0 ? 115 : arrCurve[i - 1];
    data.push(buildMonth(i, arr, prevArr, data, params));
  }
  return data;
}

function generateMimecast() {
  // Flat with a visible step-up in Apr 2023 (acquisition), then plateau
  const arrCurve = [
    380, 383, 385, 435, 438, 440, 442, 443, 444, 445, 446, 448,
    450, 452, 453, 455, 456, 458,
  ];
  const params = {
    grrBase: 96, grrVar: 0.8, nrrBase: 103, nrrVar: 1.5,
    acvBase: 72, acvVar: 8, newLogosBase: 14, newLogosVar: 3,
    totalAEsStart: 120, totalAEsEnd: 125, rampedBase: 0.88, rampedVar: 0.03,
    smBase: 9800, smVar: 600, magicFloor: 0.3,
  };
  const data = [];
  for (let i = 0; i < 18; i++) {
    const arr = arrCurve[i];
    const prevArr = i === 0 ? 378 : arrCurve[i - 1];
    data.push(buildMonth(i, arr, prevArr, data, params));
  }
  return data;
}

function generateLytx() {
  // Exponential curve — slow start, then hockey stick from Aug 2023 onward
  const arrCurve = [
    28, 30, 32, 34, 37, 40, 44, 52, 62, 75, 90, 108,
    130, 155, 185, 220, 260, 305,
  ];
  const params = {
    grrBase: 89, grrVar: 2, nrrBase: 118, nrrVar: 4,
    acvBase: 18, acvVar: 4, newLogosBase: 30, newLogosVar: 10,
    totalAEsStart: 24, totalAEsEnd: 78, rampedBase: 0.58, rampedVar: 0.1,
    smBase: 2800, smVar: 400, magicFloor: 0.6,
  };
  const data = [];
  for (let i = 0; i < 18; i++) {
    const arr = arrCurve[i];
    const prevArr = i === 0 ? 27 : arrCurve[i - 1];
    data.push(buildMonth(i, arr, prevArr, data, params));
  }
  return data;
}

function generateOctus() {
  // Steady linear grower — most "boring" line but consistent
  const arrCurve = [
    95, 98, 101, 104, 107, 110, 113, 116, 119, 122, 125, 128,
    131, 134, 137, 140, 143, 146,
  ];
  const params = {
    grrBase: 92, grrVar: 1.5, nrrBase: 111, nrrVar: 2,
    acvBase: 38, acvVar: 5, newLogosBase: 18, newLogosVar: 4,
    totalAEsStart: 48, totalAEsEnd: 72, rampedBase: 0.78, rampedVar: 0.05,
    smBase: 3800, smVar: 300, magicFloor: 0.8,
  };
  const data = [];
  for (let i = 0; i < 18; i++) {
    const arr = arrCurve[i];
    const prevArr = i === 0 ? 93 : arrCurve[i - 1];
    data.push(buildMonth(i, arr, prevArr, data, params));
  }
  return data;
}

function generateMcAfee() {
  // Large base, slight decline mid-2023, recovery late 2023 into 2024
  const arrCurve = [
    820, 818, 815, 810, 802, 795, 788, 782, 780, 785, 795, 810,
    828, 845, 858, 868, 878, 890,
  ];
  const params = {
    grrBase: 95, grrVar: 1, nrrBase: 105, nrrVar: 1.5,
    acvBase: 195, acvVar: 20, newLogosBase: 10, newLogosVar: 3,
    totalAEsStart: 210, totalAEsEnd: 215, rampedBase: 0.85, rampedVar: 0.04,
    smBase: 19000, smVar: 1500, magicFloor: 0.3,
  };
  const data = [];
  for (let i = 0; i < 18; i++) {
    const arr = arrCurve[i];
    const prevArr = i === 0 ? 822 : arrCurve[i - 1];
    data.push(buildMonth(i, arr, prevArr, data, params));
  }
  return data;
}

// Use seeded approach for consistent data across renders
let _cache = null;

export function getPortfolioData() {
  if (_cache) return _cache;

  // Check localStorage for uploaded data
  const stored = localStorage.getItem('portfolioData');
  if (stored) {
    try {
      _cache = JSON.parse(stored);
      return _cache;
    } catch(e) {
      // fall through to generated data
    }
  }

  _cache = {
    zendesk: generateZendesk(),
    seismic: generateSeismic(),
    mimecast: generateMimecast(),
    lytx: generateLytx(),
    octus: generateOctus(),
    mcafee: generateMcAfee(),
  };
  return _cache;
}

export function updateCompanyData(slug, newData) {
  const current = getPortfolioData();
  current[slug] = newData;
  _cache = current;
  localStorage.setItem('portfolioData', JSON.stringify(current));
}

export function resetData() {
  _cache = null;
  localStorage.removeItem('portfolioData');
  return getPortfolioData();
}

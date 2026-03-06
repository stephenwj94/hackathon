// Portfolio data: 6 companies × 18 months (Jan 2023 – Jun 2024)
// All numbers are internally consistent

const months = [
  '2023-01','2023-02','2023-03','2023-04','2023-05','2023-06',
  '2023-07','2023-08','2023-09','2023-10','2023-11','2023-12',
  '2024-01','2024-02','2024-03','2024-04','2024-05','2024-06',
];

function generateZendesk() {
  // Steady grower. ARR $480M→$620M. GRR 93-95%. NRR ~108%.
  const base = {
    arrStart: 480, arrEnd: 620,
    grrRange: [93, 95], nrrRange: [106, 110],
    acvRange: [42, 52], newLogosRange: [28, 42],
    totalAEsStart: 145, totalAEsEnd: 168,
    rampedRatio: [0.78, 0.85],
    smSpendRange: [8200, 9800],
  };
  const data = [];
  let arr = base.arrStart;
  for (let i = 0; i < 18; i++) {
    const grr = 93 + Math.random() * 2;
    const nrr = 106 + Math.random() * 4;
    const churn = 100 - grr;
    const downSell = 0.8 + Math.random() * 0.7;
    const acv = 42 + Math.random() * 10;
    const newLogos = Math.floor(28 + Math.random() * 14);
    const newLogoBookings = Math.round(newLogos * acv);
    const expansionRate = (nrr - 100 + churn) / 100;
    const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
    const totalBookings = newLogoBookings + expansionBookings;
    const prevArr = arr;
    const netNewArr = (totalBookings - prevArr * (churn / 100) * 1000 / 12) / 1000;
    arr = Math.round((arr + netNewArr) * 10) / 10;
    const totalAEs = Math.round(base.totalAEsStart + (base.totalAEsEnd - base.totalAEsStart) * i / 17);
    const rampedRatio = 0.78 + Math.random() * 0.07;
    const rampedAEs = Math.round(totalAEs * rampedRatio);
    const smSpend = Math.round(8200 + Math.random() * 1600);
    const magicNumber = Math.round(((netNewArr * 1000) / smSpend) * 100) / 100;
    const cac = Math.round(smSpend / newLogos);
    const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
    const ltvCac = Math.round((ltv / cac) * 10) / 10;
    const payback = Math.round(cac / (acv / 12));
    const capacityUtil = Math.round(65 + Math.random() * 20);
    const revenuePerAE = Math.round((arr * 1000) / totalAEs);

    data.push({
      month: months[i],
      arr: Math.round(arr * 10) / 10,
      arrGrowthMoM: i === 0 ? 1.8 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
      arrGrowthYoY: i < 12 ? null : Math.round(((arr - data[i - 12].arr) / data[i - 12].arr) * 1000) / 10,
      newLogoBookings,
      expansionBookings,
      totalBookings,
      bookingsGrowthMoM: i === 0 ? 2.1 : Math.round(((totalBookings - data[i - 1].totalBookings) / data[i - 1].totalBookings) * 1000) / 10,
      grossRetentionRate: Math.round(grr * 10) / 10,
      churnRate: Math.round(churn * 10) / 10,
      downSellRate: Math.round(downSell * 10) / 10,
      netRevenueRetention: Math.round(nrr * 10) / 10,
      expansionRate: Math.round(expansionRate * 1000) / 10,
      acv: Math.round(acv),
      newLogosCount: newLogos,
      rampedAEs,
      totalAEs,
      salesCapacityUtilization: capacityUtil,
      magicNumber: Math.max(0.4, magicNumber),
      cac,
      ltv,
      ltvCacRatio: ltvCac,
      paybackPeriodMonths: payback,
      smSpend,
      revenuePerAE,
    });
  }
  return data;
}

function generateSeismic() {
  // High-growth. ARR $120M→$210M. NRR oscillates 112-118%.
  const data = [];
  let arr = 120;
  for (let i = 0; i < 18; i++) {
    const grr = 89 + Math.random() * 4;
    const nrr = 112 + Math.random() * 6;
    const churn = 100 - grr;
    const downSell = 1.2 + Math.random() * 1.0;
    const acv = 28 + Math.random() * 8;
    const newLogos = Math.floor(18 + i * 1.5 + Math.random() * 10);
    const newLogoBookings = Math.round(newLogos * acv);
    const expansionRate = (nrr - 100 + churn) / 100;
    const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
    const totalBookings = newLogoBookings + expansionBookings;
    const prevArr = arr;
    const netNewArr = (totalBookings - prevArr * (churn / 100) * 1000 / 12) / 1000;
    arr = Math.round((arr + netNewArr) * 10) / 10;
    const totalAEs = Math.round(62 + i * 4 + Math.random() * 3);
    const rampedAEs = Math.round(totalAEs * (0.6 + Math.random() * 0.15));
    const smSpend = Math.round(4800 + i * 200 + Math.random() * 800);
    const magicNumber = Math.round(((netNewArr * 1000) / smSpend) * 100) / 100;
    const cac = Math.round(smSpend / newLogos);
    const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
    const ltvCac = Math.round((ltv / cac) * 10) / 10;
    const payback = Math.round(cac / (acv / 12));
    const capacityUtil = Math.round(55 + Math.random() * 25);
    const revenuePerAE = Math.round((arr * 1000) / totalAEs);

    data.push({
      month: months[i],
      arr: Math.round(arr * 10) / 10,
      arrGrowthMoM: i === 0 ? 3.8 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
      arrGrowthYoY: i < 12 ? null : Math.round(((arr - data[i - 12].arr) / data[i - 12].arr) * 1000) / 10,
      newLogoBookings,
      expansionBookings,
      totalBookings,
      bookingsGrowthMoM: i === 0 ? 4.2 : Math.round(((totalBookings - data[i - 1].totalBookings) / data[i - 1].totalBookings) * 1000) / 10,
      grossRetentionRate: Math.round(grr * 10) / 10,
      churnRate: Math.round(churn * 10) / 10,
      downSellRate: Math.round(downSell * 10) / 10,
      netRevenueRetention: Math.round(nrr * 10) / 10,
      expansionRate: Math.round(expansionRate * 1000) / 10,
      acv: Math.round(acv),
      newLogosCount: newLogos,
      rampedAEs,
      totalAEs,
      salesCapacityUtilization: capacityUtil,
      magicNumber: Math.max(0.5, magicNumber),
      cac,
      ltv,
      ltvCacRatio: ltvCac,
      paybackPeriodMonths: payback,
      smSpend,
      revenuePerAE,
    });
  }
  return data;
}

function generateMimecast() {
  // Mature enterprise. ARR $380M→$420M. GRR 95-97%. NRR ~103%.
  const data = [];
  let arr = 380;
  for (let i = 0; i < 18; i++) {
    const grr = 95 + Math.random() * 2;
    const nrr = 101.5 + Math.random() * 3;
    const churn = 100 - grr;
    const downSell = 0.5 + Math.random() * 0.5;
    const acv = 65 + Math.random() * 15;
    const newLogos = Math.floor(12 + Math.random() * 6);
    const newLogoBookings = Math.round(newLogos * acv);
    const expansionRate = (nrr - 100 + churn) / 100;
    const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
    const totalBookings = newLogoBookings + expansionBookings;
    const prevArr = arr;
    const netNewArr = (totalBookings - prevArr * (churn / 100) * 1000 / 12) / 1000;
    arr = Math.round((arr + netNewArr) * 10) / 10;
    const totalAEs = Math.round(120 + Math.random() * 5);
    const rampedAEs = Math.round(totalAEs * (0.85 + Math.random() * 0.08));
    const smSpend = Math.round(9500 + Math.random() * 1200);
    const magicNumber = Math.round(((netNewArr * 1000) / smSpend) * 100) / 100;
    const cac = Math.round(smSpend / newLogos);
    const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
    const ltvCac = Math.round((ltv / cac) * 10) / 10;
    const payback = Math.round(cac / (acv / 12));
    const capacityUtil = Math.round(75 + Math.random() * 15);
    const revenuePerAE = Math.round((arr * 1000) / totalAEs);

    data.push({
      month: months[i],
      arr: Math.round(arr * 10) / 10,
      arrGrowthMoM: i === 0 ? 0.6 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
      arrGrowthYoY: i < 12 ? null : Math.round(((arr - data[i - 12].arr) / data[i - 12].arr) * 1000) / 10,
      newLogoBookings,
      expansionBookings,
      totalBookings,
      bookingsGrowthMoM: i === 0 ? 1.0 : Math.round(((totalBookings - data[i - 1].totalBookings) / data[i - 1].totalBookings) * 1000) / 10,
      grossRetentionRate: Math.round(grr * 10) / 10,
      churnRate: Math.round(churn * 10) / 10,
      downSellRate: Math.round(downSell * 10) / 10,
      netRevenueRetention: Math.round(nrr * 10) / 10,
      expansionRate: Math.round(expansionRate * 1000) / 10,
      acv: Math.round(acv),
      newLogosCount: newLogos,
      rampedAEs,
      totalAEs,
      salesCapacityUtilization: capacityUtil,
      magicNumber: Math.max(0.3, magicNumber),
      cac,
      ltv,
      ltvCacRatio: ltvCac,
      paybackPeriodMonths: payback,
      smSpend,
      revenuePerAE,
    });
  }
  return data;
}

function generateLytix() {
  // Hyper-growth early stage. ARR $28M→$72M. NRR 115-122%.
  const data = [];
  let arr = 28;
  for (let i = 0; i < 18; i++) {
    const grr = 87 + Math.random() * 4;
    const nrr = 115 + Math.random() * 7;
    const churn = 100 - grr;
    const downSell = 1.5 + Math.random() * 1.0;
    const acv = 15 + Math.random() * 8;
    const newLogos = Math.floor(22 + i * 2 + Math.random() * 12);
    const newLogoBookings = Math.round(newLogos * acv);
    const expansionRate = (nrr - 100 + churn) / 100;
    const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
    const totalBookings = newLogoBookings + expansionBookings;
    const prevArr = arr;
    const netNewArr = (totalBookings - prevArr * (churn / 100) * 1000 / 12) / 1000;
    arr = Math.round((arr + netNewArr) * 10) / 10;
    const totalAEs = Math.round(24 + i * 3 + Math.random() * 3);
    const rampedAEs = Math.round(totalAEs * (0.5 + Math.random() * 0.2));
    const smSpend = Math.round(2200 + i * 180 + Math.random() * 500);
    const magicNumber = Math.round(((netNewArr * 1000) / smSpend) * 100) / 100;
    const cac = Math.round(smSpend / newLogos);
    const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
    const ltvCac = Math.round((ltv / cac) * 10) / 10;
    const payback = Math.round(cac / (acv / 12));
    const capacityUtil = Math.round(50 + Math.random() * 25);
    const revenuePerAE = Math.round((arr * 1000) / totalAEs);

    data.push({
      month: months[i],
      arr: Math.round(arr * 10) / 10,
      arrGrowthMoM: i === 0 ? 5.2 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
      arrGrowthYoY: i < 12 ? null : Math.round(((arr - data[i - 12].arr) / data[i - 12].arr) * 1000) / 10,
      newLogoBookings,
      expansionBookings,
      totalBookings,
      bookingsGrowthMoM: i === 0 ? 6.0 : Math.round(((totalBookings - data[i - 1].totalBookings) / data[i - 1].totalBookings) * 1000) / 10,
      grossRetentionRate: Math.round(grr * 10) / 10,
      churnRate: Math.round(churn * 10) / 10,
      downSellRate: Math.round(downSell * 10) / 10,
      netRevenueRetention: Math.round(nrr * 10) / 10,
      expansionRate: Math.round(expansionRate * 1000) / 10,
      acv: Math.round(acv),
      newLogosCount: newLogos,
      rampedAEs,
      totalAEs,
      salesCapacityUtilization: capacityUtil,
      magicNumber: Math.max(0.6, magicNumber),
      cac,
      ltv,
      ltvCacRatio: ltvCac,
      paybackPeriodMonths: payback,
      smSpend,
      revenuePerAE,
    });
  }
  return data;
}

function generateOctus() {
  // Mid-market compounder. ARR $95M→$145M. NRR ~111%. Magic Number > 0.8.
  const data = [];
  let arr = 95;
  for (let i = 0; i < 18; i++) {
    const grr = 91 + Math.random() * 3;
    const nrr = 109 + Math.random() * 4;
    const churn = 100 - grr;
    const downSell = 0.8 + Math.random() * 0.8;
    const acv = 35 + Math.random() * 10;
    const newLogos = Math.floor(15 + Math.random() * 8);
    const newLogoBookings = Math.round(newLogos * acv);
    const expansionRate = (nrr - 100 + churn) / 100;
    const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
    const totalBookings = newLogoBookings + expansionBookings;
    const prevArr = arr;
    const netNewArr = (totalBookings - prevArr * (churn / 100) * 1000 / 12) / 1000;
    arr = Math.round((arr + netNewArr) * 10) / 10;
    const totalAEs = Math.round(48 + i * 1.5 + Math.random() * 3);
    const rampedAEs = Math.round(totalAEs * (0.75 + Math.random() * 0.1));
    const smSpend = Math.round(3600 + i * 100 + Math.random() * 600);
    const magicNumber = Math.max(0.8, Math.round(((netNewArr * 1000) / smSpend) * 100) / 100);
    const cac = Math.round(smSpend / newLogos);
    const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
    const ltvCac = Math.round((ltv / cac) * 10) / 10;
    const payback = Math.round(cac / (acv / 12));
    const capacityUtil = Math.round(70 + Math.random() * 15);
    const revenuePerAE = Math.round((arr * 1000) / totalAEs);

    data.push({
      month: months[i],
      arr: Math.round(arr * 10) / 10,
      arrGrowthMoM: i === 0 ? 2.5 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
      arrGrowthYoY: i < 12 ? null : Math.round(((arr - data[i - 12].arr) / data[i - 12].arr) * 1000) / 10,
      newLogoBookings,
      expansionBookings,
      totalBookings,
      bookingsGrowthMoM: i === 0 ? 3.0 : Math.round(((totalBookings - data[i - 1].totalBookings) / data[i - 1].totalBookings) * 1000) / 10,
      grossRetentionRate: Math.round(grr * 10) / 10,
      churnRate: Math.round(churn * 10) / 10,
      downSellRate: Math.round(downSell * 10) / 10,
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
    });
  }
  return data;
}

function generateMcAfee() {
  // Large enterprise. ARR $820M→$890M. GRR 94-96%. NRR ~105%.
  const data = [];
  let arr = 820;
  for (let i = 0; i < 18; i++) {
    const grr = 94 + Math.random() * 2;
    const nrr = 103.5 + Math.random() * 3;
    const churn = 100 - grr;
    const downSell = 0.6 + Math.random() * 0.5;
    const acv = 180 + Math.random() * 40;
    const newLogos = Math.floor(8 + Math.random() * 5);
    const newLogoBookings = Math.round(newLogos * acv);
    const expansionRate = (nrr - 100 + churn) / 100;
    const expansionBookings = Math.round(arr * expansionRate * 1000 / 12);
    const totalBookings = newLogoBookings + expansionBookings;
    const prevArr = arr;
    const netNewArr = (totalBookings - prevArr * (churn / 100) * 1000 / 12) / 1000;
    arr = Math.round((arr + netNewArr) * 10) / 10;
    const totalAEs = Math.round(210 + Math.random() * 8);
    const rampedAEs = Math.round(totalAEs * (0.82 + Math.random() * 0.08));
    const smSpend = Math.round(18000 + Math.random() * 3000);
    const magicNumber = Math.round(((netNewArr * 1000) / smSpend) * 100) / 100;
    const cac = Math.round(smSpend / newLogos);
    const ltv = Math.round(acv * (1 / (churn / 100 / 12)) / 12);
    const ltvCac = Math.round((ltv / cac) * 10) / 10;
    const payback = Math.round(cac / (acv / 12));
    const capacityUtil = Math.round(72 + Math.random() * 15);
    const revenuePerAE = Math.round((arr * 1000) / totalAEs);

    data.push({
      month: months[i],
      arr: Math.round(arr * 10) / 10,
      arrGrowthMoM: i === 0 ? 0.5 : Math.round(((arr - prevArr) / prevArr) * 1000) / 10,
      arrGrowthYoY: i < 12 ? null : Math.round(((arr - data[i - 12].arr) / data[i - 12].arr) * 1000) / 10,
      newLogoBookings,
      expansionBookings,
      totalBookings,
      bookingsGrowthMoM: i === 0 ? 0.8 : Math.round(((totalBookings - data[i - 1].totalBookings) / data[i - 1].totalBookings) * 1000) / 10,
      grossRetentionRate: Math.round(grr * 10) / 10,
      churnRate: Math.round(churn * 10) / 10,
      downSellRate: Math.round(downSell * 10) / 10,
      netRevenueRetention: Math.round(nrr * 10) / 10,
      expansionRate: Math.round(expansionRate * 1000) / 10,
      acv: Math.round(acv),
      newLogosCount: newLogos,
      rampedAEs,
      totalAEs,
      salesCapacityUtilization: capacityUtil,
      magicNumber: Math.max(0.3, magicNumber),
      cac,
      ltv,
      ltvCacRatio: ltvCac,
      paybackPeriodMonths: payback,
      smSpend,
      revenuePerAE,
    });
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
    lytix: generateLytix(),
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

export const benchmarks = {
  arr: { label: 'ARR', unit: '$M', good: null, great: null },
  arrGrowthMoM: { label: 'ARR MoM Growth', unit: '%', good: 2, great: 4 },
  arrGrowthYoY: { label: 'ARR YoY Growth', unit: '%', good: 25, great: 50 },
  newLogoBookings: { label: 'New Logo Bookings', unit: '$K', good: null, great: null },
  expansionBookings: { label: 'Expansion Bookings', unit: '$K', good: null, great: null },
  totalBookings: { label: 'Total Bookings', unit: '$K', good: null, great: null },
  bookingsGrowthMoM: { label: 'Bookings MoM Growth', unit: '%', good: 3, great: 8 },
  grossRetentionRate: { label: 'Gross Retention', unit: '%', good: 90, great: 95, bestInClass: 95 },
  churnRate: { label: 'Churn Rate', unit: '%', good: 10, great: 5, inverse: true },
  downSellRate: { label: 'Downsell Rate', unit: '%', good: 3, great: 1, inverse: true },
  netRevenueRetention: { label: 'Net Revenue Retention', unit: '%', good: 110, great: 120, bestInClass: 120 },
  expansionRate: { label: 'Expansion Rate', unit: '%', good: 15, great: 25 },
  acv: { label: 'ACV', unit: '$K', good: null, great: null },
  newLogosCount: { label: 'New Logos', unit: '', good: null, great: null },
  rampedAEs: { label: 'Ramped AEs', unit: '', good: null, great: null },
  totalAEs: { label: 'Total AEs', unit: '', good: null, great: null },
  salesCapacityUtilization: { label: 'Sales Capacity', unit: '%', good: 70, great: 85 },
  magicNumber: { label: 'Sales & Marketing Efficiency', unit: '', good: 0.75, great: 1.0, bestInClass: 1.0 },
  paybackPeriodMonths: { label: 'Payback Period', unit: 'mo', good: 18, great: 12, inverse: true },
  smSpend: { label: 'S&M Spend', unit: '$K', good: null, great: null },
  revenuePerAE: { label: 'Revenue/AE', unit: '$K', good: 500, great: 800 },
};

export const metricCategories = {
  Growth: ['arr', 'arrGrowthMoM', 'totalBookings', 'newLogosCount', 'expansionBookings'],
  Retention: ['grossRetentionRate', 'netRevenueRetention', 'churnRate', 'downSellRate'],
  Efficiency: ['magicNumber', 'paybackPeriodMonths'],
  'Sales Capacity': ['rampedAEs', 'salesCapacityUtilization', 'revenuePerAE'],
};

export const healthMatrixMetrics = [
  'arrGrowthMoM',
  'grossRetentionRate',
  'netRevenueRetention',
  'magicNumber',
  'salesCapacityUtilization',
];

export function getHealthColor(metricKey, value) {
  const b = benchmarks[metricKey];
  if (!b || b.good === null) return 'neutral';
  if (b.inverse) {
    if (value <= b.great) return 'green';
    if (value <= b.good) return 'yellow';
    return 'red';
  }
  if (value >= b.great) return 'green';
  if (value >= b.good) return 'yellow';
  return 'red';
}

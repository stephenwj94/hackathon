import { useState, useCallback, useMemo } from 'react';
import { getPortfolioData, updateCompanyData, resetData } from '../data/portfolioData';
import { companies } from '../data/companies';

export function usePortfolioData() {
  const [version, setVersion] = useState(0);

  const data = useMemo(() => getPortfolioData(), [version]);

  const getCompanyData = useCallback((slug) => {
    return data[slug] || [];
  }, [data]);

  const getLatestMetrics = useCallback((slug) => {
    const companyData = data[slug];
    if (!companyData || companyData.length === 0) return null;
    return companyData[companyData.length - 1];
  }, [data]);

  const getAllLatest = useCallback(() => {
    return companies.map(c => ({
      ...c,
      metrics: getLatestMetrics(c.slug),
    }));
  }, [getLatestMetrics]);

  const getMetricTimeSeries = useCallback((metricKey) => {
    const months = data.zendesk?.map(d => d.month) || [];
    return months.map((month, i) => {
      const point = { month };
      companies.forEach(c => {
        const cd = data[c.slug];
        if (cd && cd[i]) {
          point[c.slug] = cd[i][metricKey];
        }
      });
      return point;
    });
  }, [data]);

  const updateData = useCallback((slug, newData) => {
    updateCompanyData(slug, newData);
    setVersion(v => v + 1);
  }, []);

  const reset = useCallback(() => {
    resetData();
    setVersion(v => v + 1);
  }, []);

  return {
    data,
    getCompanyData,
    getLatestMetrics,
    getAllLatest,
    getMetricTimeSeries,
    updateData,
    reset,
  };
}

export const companies = [
  {
    name: 'Zendesk',
    slug: 'zendesk',
    color: '#6366F1',
    sector: 'Customer Experience',
    vintage: '2022',
    description: 'Customer service and engagement platform',
  },
  {
    name: 'Seismic',
    slug: 'seismic',
    color: '#F5620F',
    sector: 'Sales Enablement',
    vintage: '2020',
    description: 'Sales enablement and marketing orchestration',
  },
  {
    name: 'Mimecast',
    slug: 'mimecast',
    color: '#10B981',
    sector: 'Cybersecurity',
    vintage: '2021',
    description: 'Email security and cyber resilience',
  },
  {
    name: 'Lytix',
    slug: 'lytix',
    color: '#F59E0B',
    sector: 'Data Analytics',
    vintage: '2023',
    description: 'AI-powered data analytics platform',
  },
  {
    name: 'Octus',
    slug: 'octus',
    color: '#3B82F6',
    sector: 'Financial Intelligence',
    vintage: '2021',
    description: 'Credit intelligence and analytics',
  },
  {
    name: 'McAfee',
    slug: 'mcafee',
    color: '#EC4899',
    sector: 'Cybersecurity',
    vintage: '2021',
    description: 'Consumer and enterprise cybersecurity',
  },
];

export const companyColorMap = Object.fromEntries(
  companies.map(c => [c.slug, c.color])
);

export const getCompany = (slug) => companies.find(c => c.slug === slug);

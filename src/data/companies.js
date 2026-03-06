export const companies = [
  {
    name: 'Zendesk',
    slug: 'zendesk',
    color: '#03363D',
    sector: 'Customer Experience',
    vintage: '2022',
    description: 'Customer service and engagement platform',
  },
  {
    name: 'Seismic',
    slug: 'seismic',
    color: '#132843',
    sector: 'Sales Enablement',
    vintage: '2020',
    description: 'Sales enablement and marketing orchestration',
  },
  {
    name: 'Mimecast',
    slug: 'mimecast',
    color: '#B4065A',
    sector: 'Cybersecurity',
    vintage: '2021',
    description: 'Email security and cyber resilience',
  },
  {
    name: 'Lytx',
    slug: 'lytx',
    color: '#0057B8',
    sector: 'Data Analytics',
    vintage: '2023',
    description: 'AI-powered data analytics platform',
  },
  {
    name: 'Octus',
    slug: 'octus',
    color: '#00A86B',
    sector: 'Financial Intelligence',
    vintage: '2021',
    description: 'Credit intelligence and analytics',
  },
  {
    name: 'McAfee',
    slug: 'mcafee',
    color: '#C01818',
    sector: 'Cybersecurity',
    vintage: '2021',
    description: 'Consumer and enterprise cybersecurity',
  },
];

export const companyColorMap = Object.fromEntries(
  companies.map(c => [c.slug, c.color])
);

export const getCompany = (slug) => companies.find(c => c.slug === slug);

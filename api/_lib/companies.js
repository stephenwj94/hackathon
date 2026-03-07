export const companies = [
  { name: 'Zendesk', slug: 'zendesk' },
  { name: 'Seismic', slug: 'seismic' },
  { name: 'Mimecast', slug: 'mimecast' },
  { name: 'Lytx', slug: 'lytx' },
  { name: 'Octus', slug: 'octus' },
  { name: 'McAfee', slug: 'mcafee' },
];

export const getCompanyBySlug = (slug) => companies.find((c) => c.slug === slug);

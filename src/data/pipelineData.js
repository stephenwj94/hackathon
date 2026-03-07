export const pipelineData = {
  zendesk: {
    coverage: { ratio: 3.4, yoyGrowth: 12 },
    stages: {
      newLogo: {
        earlyStage: { deals: 48, value: 4200 },
        lateStage: { deals: 22, value: 2800 },
        commit: { deals: 11, value: 1650 },
        closedWon: { deals: 8, value: 1200 },
      },
      expansion: {
        earlyStage: { deals: 35, value: 3100 },
        lateStage: { deals: 18, value: 2200 },
        commit: { deals: 9, value: 1400 },
        closedWon: { deals: 6, value: 950 },
      },
    },
    wins: [
      { customer: 'Delta Air Lines', type: 'New Logo', value: '$420K', description: 'Enterprise CX platform for 12,000 agents across all support channels' },
      { customer: 'JPMorgan Chase', type: 'Expansion', value: '$380K', description: 'Added AI-powered routing and analytics for wealth management division' },
      { customer: 'Nordstrom', type: 'New Logo', value: '$290K', description: 'Omnichannel customer service suite for 200+ retail locations' },
      { customer: 'Marriott International', type: 'Expansion', value: '$245K', description: 'Extended platform to Asia-Pacific hospitality operations' },
    ],
    losses: [
      { customer: 'Southwest Airlines', type: 'New Logo', value: '$310K', reason: 'Lost to Salesforce Service Cloud on pricing and existing CRM integration' },
      { customer: 'Capital One', type: 'Expansion', value: '$185K', reason: 'Budget reallocation to internal tooling after Q3 cost review' },
    ],
  },
  seismic: {
    coverage: { ratio: 2.8, yoyGrowth: 24 },
    stages: {
      newLogo: {
        earlyStage: { deals: 52, value: 3800 },
        lateStage: { deals: 25, value: 2400 },
        commit: { deals: 12, value: 1500 },
        closedWon: { deals: 9, value: 1100 },
      },
      expansion: {
        earlyStage: { deals: 28, value: 2200 },
        lateStage: { deals: 14, value: 1500 },
        commit: { deals: 7, value: 900 },
        closedWon: { deals: 5, value: 680 },
      },
    },
    wins: [
      { customer: 'Goldman Sachs', type: 'New Logo', value: '$520K', description: 'Sales enablement platform for 3,000+ advisors across private wealth' },
      { customer: 'Pfizer', type: 'Expansion', value: '$340K', description: 'Extended content automation to global medical affairs team' },
      { customer: 'Morgan Stanley', type: 'New Logo', value: '$460K', description: 'Enterprise content management for institutional securities division' },
      { customer: 'Roche', type: 'New Logo', value: '$280K', description: 'Regulatory-compliant sales content platform for EMEA operations' },
    ],
    losses: [
      { customer: 'Barclays', type: 'New Logo', value: '$390K', reason: 'Selected Highspot due to stronger Salesforce integration and UK data residency' },
      { customer: 'AstraZeneca', type: 'Expansion', value: '$210K', reason: 'Consolidated vendor stack — moved to Veeva Vault for life sciences compliance' },
    ],
  },
  mimecast: {
    coverage: { ratio: 3.8, yoyGrowth: 8 },
    stages: {
      newLogo: {
        earlyStage: { deals: 32, value: 5200 },
        lateStage: { deals: 16, value: 3400 },
        commit: { deals: 8, value: 2100 },
        closedWon: { deals: 5, value: 1350 },
      },
      expansion: {
        earlyStage: { deals: 45, value: 4800 },
        lateStage: { deals: 22, value: 3200 },
        commit: { deals: 12, value: 2400 },
        closedWon: { deals: 9, value: 1800 },
      },
    },
    wins: [
      { customer: 'Mayo Clinic', type: 'New Logo', value: '$480K', description: 'HIPAA-compliant email security and archiving for 65,000 employees' },
      { customer: 'Baker McKenzie', type: 'Expansion', value: '$320K', description: 'Added threat intelligence and awareness training for global law practice' },
      { customer: 'Cigna Healthcare', type: 'New Logo', value: '$410K', description: 'Enterprise email security suite with advanced threat protection' },
      { customer: 'Deutsche Bank', type: 'Expansion', value: '$380K', description: 'Extended data loss prevention to investment banking communications' },
    ],
    losses: [
      { customer: 'Cleveland Clinic', type: 'New Logo', value: '$350K', reason: 'Chose Proofpoint — existing relationship with parent health system' },
      { customer: 'Hogan Lovells', type: 'Expansion', value: '$165K', reason: 'Deferred expansion due to firm-wide technology spend freeze in Q4' },
    ],
  },
  lytx: {
    coverage: { ratio: 2.4, yoyGrowth: 45 },
    stages: {
      newLogo: {
        earlyStage: { deals: 65, value: 2800 },
        lateStage: { deals: 30, value: 1800 },
        commit: { deals: 15, value: 1100 },
        closedWon: { deals: 12, value: 850 },
      },
      expansion: {
        earlyStage: { deals: 40, value: 1600 },
        lateStage: { deals: 20, value: 1100 },
        commit: { deals: 10, value: 700 },
        closedWon: { deals: 7, value: 480 },
      },
    },
    wins: [
      { customer: 'Werner Enterprises', type: 'New Logo', value: '$340K', description: 'Fleet video telematics for 8,000 trucks across North American routes' },
      { customer: 'Amazon Logistics', type: 'Expansion', value: '$520K', description: 'Expanded AI dash cam program to 15,000 last-mile delivery vehicles' },
      { customer: 'Duke Energy', type: 'New Logo', value: '$280K', description: 'Vehicle safety analytics for utility field service fleet of 4,200 vehicles' },
      { customer: 'FedEx Ground', type: 'Expansion', value: '$390K', description: 'Added predictive risk scoring to independent contractor fleet program' },
    ],
    losses: [
      { customer: 'J.B. Hunt', type: 'New Logo', value: '$410K', reason: 'Selected Samsara due to broader IoT platform and existing telematics investment' },
      { customer: 'Pacific Gas & Electric', type: 'New Logo', value: '$220K', reason: 'Procurement delayed — utility regulatory approval process extended to 2025' },
    ],
  },
  octus: {
    coverage: { ratio: 3.2, yoyGrowth: 15 },
    stages: {
      newLogo: {
        earlyStage: { deals: 38, value: 3200 },
        lateStage: { deals: 18, value: 2100 },
        commit: { deals: 9, value: 1300 },
        closedWon: { deals: 7, value: 980 },
      },
      expansion: {
        earlyStage: { deals: 30, value: 2600 },
        lateStage: { deals: 15, value: 1800 },
        commit: { deals: 8, value: 1100 },
        closedWon: { deals: 6, value: 820 },
      },
    },
    wins: [
      { customer: 'Citadel', type: 'New Logo', value: '$380K', description: 'Credit intelligence terminal for distressed debt and restructuring team' },
      { customer: 'Bank of America', type: 'Expansion', value: '$450K', description: 'Added leveraged finance and CLO analytics for capital markets division' },
      { customer: 'Apollo Global', type: 'New Logo', value: '$320K', description: 'Real-time credit monitoring for $400B+ credit portfolio' },
      { customer: 'Barings', type: 'Expansion', value: '$210K', description: 'Extended platform to European high yield and private credit teams' },
    ],
    losses: [
      { customer: 'Bridgewater Associates', type: 'New Logo', value: '$290K', reason: 'Built proprietary credit analytics in-house — preference for internal systems' },
      { customer: 'Standard Chartered', type: 'Expansion', value: '$175K', reason: 'Budget allocated to Bloomberg Terminal expansion — vendor consolidation' },
    ],
  },
  mcafee: {
    coverage: { ratio: 3.6, yoyGrowth: 6 },
    stages: {
      newLogo: {
        earlyStage: { deals: 28, value: 8200 },
        lateStage: { deals: 14, value: 5600 },
        commit: { deals: 7, value: 3200 },
        closedWon: { deals: 4, value: 2100 },
      },
      expansion: {
        earlyStage: { deals: 55, value: 9800 },
        lateStage: { deals: 28, value: 6400 },
        commit: { deals: 14, value: 4200 },
        closedWon: { deals: 10, value: 3100 },
      },
    },
    wins: [
      { customer: 'U.S. Department of Defense', type: 'New Logo', value: '$1.2M', description: 'Endpoint protection and XDR for 250,000 classified and unclassified endpoints' },
      { customer: 'Lockheed Martin', type: 'Expansion', value: '$680K', description: 'Added cloud workload security and CASB for hybrid cloud infrastructure' },
      { customer: 'Caterpillar', type: 'New Logo', value: '$520K', description: 'Enterprise security platform for global manufacturing operations and OT networks' },
      { customer: 'Raytheon Technologies', type: 'Expansion', value: '$440K', description: 'Extended zero-trust network access to classified R&D environments' },
    ],
    losses: [
      { customer: 'General Dynamics', type: 'New Logo', value: '$780K', reason: 'Awarded to CrowdStrike — FedRAMP High authorization and superior EDR detection rates' },
      { customer: 'Siemens Energy', type: 'Expansion', value: '$340K', reason: 'Moved to Palo Alto Networks Cortex XDR as part of platform consolidation' },
    ],
  },
};

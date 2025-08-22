export const APP_CONFIG = {
  name: 'LAVA',
  fullName: 'LAVA (Local AI Evaluator)',
  version: '1.0.0'
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MODEL_ANALYSIS: '/model-analysis',
  GLOSSARY: '/glossary'
};

export const PAGES = {
  DASHBOARD: 'Dashboard',
  MODEL_ANALYSIS: 'ModelAnalysis',
  GLOSSARY: 'Glossary'
};

export const VENDORS = {
  VENDOR1: {
    id: 'Vendor1',
    name: 'Cerner',
    topics: ['CardioVascularPrediction']
  },
  VENDOR2: {
    id: 'Vendor2',
    name: 'DSI Vendor2',
    topics: ['CKD', 'ProstateCancerPrediction']
  }
};

export const TOPICS = {
  CARDIOVASCULAR: {
    id: 'CardioVascularPrediction',
    name: 'Cardiovascular Predictor Evaluation',
    vendor: 'Vendor1'
  },
  CKD: {
    id: 'CKD',
    name: 'Chronic Kidney Disease Estimator',
    vendor: 'Vendor2'
  },
  PROSTATE_CANCER: {
    id: 'ProstateCancerPrediction',
    name: 'Prostate Cancer Predictor Evaluation',
    vendor: 'Vendor2'
  },
  HOSPITALIZATION: {
    id: 'HospitalizationRisk',
    name: 'Hospitalization Risk Prediction',
    vendor: 'Vendor2'
  }
};

export const CLIENT_ID_MAPPING = {
  'https://bfee16.devhcp.com/fhir': '98da0d36-207d-11f0-9d81-0a2d94f3c43f',
  'https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d': '4a80ce69-5e36-4a99-adc7-5ea3c6b46399'
};

export const AUTH_CONFIG = {
  defaultClientId: '4a80ce69-5e36-4a99-adc7-5ea3c6b46399',
  scope: 'launch/patient openid fhirUser patient/*.read',
  redirectUri: 'http://localhost:3000/index'
};

export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  SCATTER: 'scatter',
  DISTRIBUTION: 'distribution'
};

export const METRICS_TYPES = {
  CALIBRATION: 'calibration',
  DISCRIMINATION: 'discrimination',
  SUBGROUP: 'subgroup',
  PERFORMANCE: 'performance'
};
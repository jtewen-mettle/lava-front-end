export const cardiovascular = {
  // 1. BASIC INFORMATION
  interventionName: "Cerner ASCVD Risk Calculator v2.1.3",
  modelName: "Cerner Atherosclerotic Cardiovascular Disease Prediction Risk Calculator",
  version: "v2.1.3",
  developerName: "Oracle Cerner Corporation",
  developerContact: "Oracle Cerner Corporation\n2800 Rockcreek Parkway, North Kansas City, MO 64117\nEmail: clinical.ai@cerner.com\nPhone: 1-800-237-6371",
  releaseDate: "March 15, 2024",
  fundingSource: "Oracle Corporation internal R&D funding in collaboration with American Heart Association Scientific Statements",
  valueOutput: "10-year atherosclerotic cardiovascular disease risk percentage (0-100%) with risk stratification categories (Low <5%, Borderline 5-7.4%, Intermediate 7.5-19.9%, High ≥20%)",
  outputType: "Prediction & Risk Classification",
  
  // 2. PURPOSE OF INTERVENTION
  intendedUse: "Primary prevention cardiovascular risk assessment to inform statin therapy decision-making and lifestyle modification counseling in adults without existing cardiovascular disease",
  intendedPatientPopulation: "Adults aged 40-79 years without clinical atherosclerotic cardiovascular disease, diabetes, or LDL-C ≥190 mg/dL presenting for primary care evaluation",
  intendedUsers: "Licensed physicians, nurse practitioners, and physician assistants in primary care, internal medicine, family medicine, and cardiology practices",
  decisionMakingRole: "Informs & Augments",
  decisionMakingDesc: "Provides clinical decision support to inform and augment clinician judgment; does not replace clinical decision-making",
  
  // 3. CAUTIONED OUT-OF-SCOPE USE
  criticalAvoidances: [
    "Emergency/Acute Settings: Not for use in emergency departments or acute care settings",
    "Pediatric Populations: Not validated for patients under 40 years of age",
    "Existing CVD: Not appropriate for patients with established coronary heart disease, stroke, or peripheral arterial disease",
    "Specific Conditions: Not for patients with familial hypercholesterolemia, Type 1 diabetes, or severe CKD",
    "Pregnancy: Not validated during pregnancy or lactation",
    "Non-US Populations: Derived from US cohorts; use caution in other populations"
  ],
  knownRisks: [
    "Algorithmic Bias: May underestimate risk in South Asian and Hispanic populations",
    "Data Currency: Based on cohorts from 1970s-2000s; modern treatment effects may differ",
    "Missing Variables: Does not include family history, coronary calcium scores, or inflammatory markers",
    "Population Shift: Performance may degrade as population demographics change",
    "Sole Decision-Making: Never use as the sole basis for treatment decisions",
    "Local Adaptation: May require local calibration for specific populations"
  ],
  
  // 4. DEVELOPMENT DETAILS AND INPUT FEATURES
  trainingInclusion: "Adults 40-79 years; Complete risk factor data; Minimum 10-year follow-up; US-based cohorts",
  trainingExclusion: "Existing CVD at baseline; Missing critical variables; Non-fasting lipid measurements; Pregnancy during study",
  deifElements: [
    { element: "Race", used: true, usedText: "Yes", description: "White, Black/African American, Other" },
    { element: "Ethnicity", used: true, usedText: "Yes", description: "Hispanic/Latino, Not Hispanic/Latino" },
    { element: "Sex", used: true, usedText: "Yes", description: "Male, Female (biological sex at birth)" },
    { element: "Date of Birth", used: true, usedText: "Yes", description: "For age calculation (40-79 years)" },
    { element: "Language", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Sexual Orientation", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Gender Identity", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Social Determinants", used: false, usedText: "No", description: "Not included in current model version" },
    { element: "Health Assessments", used: true, usedText: "Yes", description: "Smoking status, diabetes status" }
  ],
  demographicRepresentativeness: [
    { variable: "White Race", trainingData: "73.2%", usPopulation: "76.3%", representativeness: "Good" },
    { variable: "Black/African American", trainingData: "21.8%", usPopulation: "13.4%", representativeness: "Over-represented" },
    { variable: "Hispanic/Latino", trainingData: "8.4%", usPopulation: "18.5%", representativeness: "Under-represented" },
    { variable: "Female Sex", trainingData: "54.1%", usPopulation: "50.8%", representativeness: "Good" },
    { variable: "Age 40-59", trainingData: "67.2%", usPopulation: "62.1%", representativeness: "Good" }
  ],
  relevanceToDeployedSetting: "Training data derived from community-based cohorts representative of US primary care populations. Geographic diversity includes North, South, East, West regions. Socioeconomic diversity adequate for primary care settings.",
  fairnessApproach: "Race/ethnicity-specific calibration performed. Separate coefficients developed for demographic subgroups to ensure equitable performance across populations.",
  biasManagement: "Regular fairness audits across demographic subgroups. Stratified analysis by race, ethnicity, sex, and age. Continuous monitoring for performance disparities in deployment.",
  
  // 5. EXTERNAL VALIDATION PROCESS
  externalDataSources: "Multi-Ethnic Study of Atherosclerosis (MESA), Women's Health Initiative (WHI), REasons for Geographic And Racial Differences in Stroke (REGARDS)",
  clinicalSettings: "Community-based primary care practices, academic medical centers, integrated health systems across 15 US states",
  externalTestingParty: "Independent validation by Duke Clinical Research Institute and American Heart Association Cardiovascular Disease in Women Committee",
  externalValidationProcess: "Prospective cohort validation with 10-year follow-up. Discrimination and calibration assessment across demographic subgroups. Real-world implementation studies in 6 health systems.",
  externalValidationDemographics: [
    { variable: "White Race", mesa: "41.2%", whi: "84.1%", regards: "58.3%" },
    { variable: "Black Race", mesa: "25.8%", whi: "9.2%", regards: "41.7%" },
    { variable: "Hispanic", mesa: "21.9%", whi: "4.1%", regards: "0.6%" },
    { variable: "Female", mesa: "52.8%", whi: "100%", regards: "55.1%" },
    { variable: "Age 40-65", mesa: "58.9%", whi: "55.2%", regards: "55.2%" }
  ],
  externalValidationSampleSizes: {
    mesa: "6,814",
    whi: "8,090", 
    regards: "16,025"
  },
  
  // 6. QUANTITATIVE PERFORMANCE MEASURES
  internalValidationMetrics: {
    aurocValidity: "0.76",
    fairnessScore: "0.81",
    fairnessScoreDesc: "Min subgroup AUROC",
    calibration: "Good",
    calibrationDesc: "Hosmer-Lemeshow p=0.12",
    sensitivity: "72.4%",
    specificity: "68.9%",
    ppv: "8.2%"
  },
  externalValidationMetrics: {
    aurocValidity: "0.71",
    aurocValidityDesc: "External Cohorts",
    fairnessScore: "0.68",
    fairnessScoreDesc: "Min External AUROC",
    calibration: "Fair",
    calibrationDesc: "Some overestimation",
    publishedStudies: "3",
    publishedStudiesDesc: "Published Studies on Clinical Outcomes"
  },
  outcomeEvaluationReferences: [
    "Muntner P, et al. 'Validation of the 2013 ACC/AHA pooled cohort risk equations.' JAMA. 2014;311(14):1406-1415.",
    "DeFilippis AP, et al. 'An analysis of calibration and discrimination among multiple cardiovascular risk scores.' Ann Intern Med. 2015;162(4):266-275.",
    "Yadlowsky S, et al. 'Clinical implications of revised pooled cohort equations for estimating atherosclerotic cardiovascular disease risk.' Ann Intern Med. 2018;169(1):20-29."
  ],
  realWorldImpact: "Implementation studies show 23% improvement in statin initiation appropriateness and 15% reduction in unnecessary statin prescribing when used as clinical decision support.",
  
  // 7. ONGOING MAINTENANCE & MONITORING
  monitoringProcess: "Quarterly performance monitoring using real-world EHR data. Automated alerts when AUROC drops below 0.70 or calibration slope deviates >15% from expected.",
  localDataValidity: "Currently Monitored",
  localDataValidityDesc: "Real-time monitoring across 127 health systems. Average local AUROC: 0.73 (range: 0.68-0.79)",
  fairnessMonitoringProcess: "Monthly stratified analysis by race, ethnicity, sex, and age groups. Automated bias detection using equalized odds and demographic parity metrics.",
  localFairnessData: "Under Review",
  localFairnessDataDesc: "Hispanic population showing 8% lower sensitivity compared to White population. Investigation ongoing.",
  updateProcess: "Annual model updates incorporating new population data. Emergency updates triggered if validity drops below threshold. Next major update: Q2 2025 incorporating 2020-2024 cohort data.",
  performanceCorrection: "Immediate deployment halt if AUROC <0.65 or fairness metrics show >20% disparities. Rollback to previous version within 24 hours. Root cause analysis within 72 hours.",
  currentMonitoringStatus: [
    "Last Performance Review: June 15, 2025 - Overall performance stable",
    "Known Issues: Calibration drift in Hispanic males age 60-79 under investigation",
    "Pending Updates: Integration of coronary artery calcium scoring planned for v3.0",
    "Alert Status: No critical alerts; 2 minor performance warnings under review"
  ],
  
  // 8. EVIDENCE BASE & CLINICAL GUIDELINES
  primaryCitation: "Goff DC Jr, Lloyd-Jones DM, Bennett G, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk: a report of the American College of Cardiology/American Heart Association Task Force on Practice Guidelines. Circulation. 2014;129(25 Suppl 2):S49-73.",
  supportingGuidelines: [
    "2019 AHA/ACC Primary Prevention Guidelines",
    "2018 AHA/ACC Cholesterol Management Guidelines",
    "2017 ACC/AHA Hypertension Guidelines"
  ],
  clinicalEvidenceLevel: "Class I, Level A",
  clinicalEvidenceLevelDesc: "Strong recommendation based on high-quality evidence",
  
  // 9. TECHNICAL IMPLEMENTATION DETAILS
  algorithmType: "Cox Proportional Hazards Model with race/sex-specific coefficients (Pooled Cohort Equations)",
  integrationMethod: "FHIR R4 Clinical Decision Support Service, HL7 CDS Hooks v1.0, SMART on FHIR v1.0",
  responseTime: "Mean: 847ms, 95th percentile: 1.2s",
  
  // FOOTER INFORMATION
  clinicalSupport: "clinical.ai@cerner.com\n1-800-237-6371",
  technicalSupport: "integration.support@cerner.com\nDeveloper Portal: developer.cerner.com",
  regulatoryAffairs: "regulatory@cerner.com",
  lastUpdated: "July 30, 2025",
  modelCardVersion: "2.1.3",
  documentClassification: "For Healthcare Professional Use Only | HIPAA Compliant"
};
export const ckd = {
  // 1. BASIC INFORMATION
  interventionName: "Cerner CKD Risk Assessment v1.8.2",
  modelName: "Cerner Chronic Kidney Disease Risk Assessment",
  version: "v1.8.2",
  developerName: "Oracle Cerner Corporation",
  developerContact: "Oracle Cerner Corporation\n2800 Rockcreek Parkway, North Kansas City, MO 64117\nEmail: clinical.ai@cerner.com\nPhone: 1-800-237-6371",
  releaseDate: "January 20, 2024",
  fundingSource: "Oracle Corporation internal R&D funding in collaboration with National Kidney Foundation",
  valueOutput: "5-year chronic kidney disease progression risk percentage with stage classification (Stage 1-5)",
  outputType: "Prediction & Risk Classification",
  
  // 2. PURPOSE OF INTERVENTION
  intendedUse: "Early detection and monitoring of chronic kidney disease progression to inform treatment decisions and lifestyle modifications",
  intendedPatientPopulation: "Adults aged 18+ years at risk for or with early-stage chronic kidney disease presenting for primary care or nephrology evaluation",
  intendedUsers: "Licensed physicians, nurse practitioners, and physician assistants in primary care, nephrology, and endocrinology practices",
  decisionMakingRole: "Informs & Augments",
  decisionMakingDesc: "Provides clinical decision support to inform and augment clinician judgment; does not replace clinical decision-making",
  
  // 3. CAUTIONED OUT-OF-SCOPE USE
  criticalAvoidances: [
    "Pediatric Populations: Not validated for patients under 18 years of age",
    "End-Stage Renal Disease: Not appropriate for patients already on dialysis",
    "Kidney Transplants: Not for kidney transplant recipients",
    "Acute Conditions: Not for use during acute kidney injury episodes",
    "Pregnancy: Not validated during pregnancy",
    "Emergency Settings: Not for use in emergency departments"
  ],
  knownRisks: [
    "Ethnic Variability: Performance may vary across ethnic subgroups",
    "Laboratory Dependency: Requires regular laboratory monitoring for accuracy",
    "Genetic Causes: May not capture rare genetic causes of CKD",
    "Fluctuating Function: Performance decreases with fluctuating kidney function",
    "Sole Decision-Making: Never use as the sole basis for treatment decisions",
    "Local Adaptation: May require local calibration for specific populations"
  ],
  
  // 4. DEVELOPMENT DETAILS AND INPUT FEATURES
  trainingInclusion: "Adults 18+ years; Complete laboratory data; Minimum 5-year follow-up; US-based cohorts with diverse CKD stages",
  trainingExclusion: "End-stage renal disease at baseline; Missing critical lab values; Acute kidney injury episodes; Kidney transplant recipients",
  deifElements: [
    { element: "Race", used: false, usedText: "No", description: "White, Black/African American, Other, Native American" },
    { element: "Ethnicity", used: true, usedText: "Yes", description: "Hispanic/Latino, Not Hispanic/Latino" },
    { element: "Sex", used: true, usedText: "Yes", description: "Male, Female (biological sex at birth)" },
    { element: "Date of Birth", used: true, usedText: "Yes", description: "For age calculation (18+ years)" },
    { element: "Language", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Sexual Orientation", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Gender Identity", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Social Determinants", used: true, usedText: "Yes", description: "Socioeconomic status, insurance type" },
    { element: "Health Assessments", used: true, usedText: "Yes", description: "Diabetes status, hypertension status, cardiovascular history" }
  ],
  demographicRepresentativeness: [
    { variable: "White Race", trainingData: "68.5%", usPopulation: "76.3%", representativeness: "Under-represented" },
    { variable: "Black/African American", trainingData: "28.2%", usPopulation: "13.4%", representativeness: "Over-represented" },
    { variable: "Hispanic/Latino", trainingData: "12.1%", usPopulation: "18.5%", representativeness: "Under-represented" },
    { variable: "Female Sex", trainingData: "52.3%", usPopulation: "50.8%", representativeness: "Good" },
    { variable: "Age 40-65", trainingData: "58.9%", usPopulation: "55.2%", representativeness: "Good" }
  ],
  relevanceToDeployedSetting: "Training data derived from nephrology clinics and primary care settings representative of US CKD patient populations. Geographic diversity includes urban and rural settings. Socioeconomic diversity adequate for healthcare settings.",
  fairnessApproach: "Race/ethnicity-specific thresholds developed. Enhanced focus on populations at higher CKD risk including African Americans and Native Americans with separate model calibration.",
  biasManagement: "Monthly fairness audits across demographic subgroups. Stratified analysis by race, ethnicity, sex, age, and diabetes status. Continuous monitoring for performance disparities in deployment.",
  
  // 5. EXTERNAL VALIDATION PROCESS
  externalDataSources: "US Renal Data System (USRDS), Chronic Kidney Disease Epidemiology Collaboration (CKD-EPI), National Health and Nutrition Examination Survey (NHANES)",
  clinicalSettings: "Nephrology clinics, primary care practices, endocrinology centers, integrated health systems across 18 US states",
  externalTestingParty: "Independent validation by National Kidney Foundation and American Society of Nephrology Clinical Research Committee",
  externalValidationProcess: "Prospective cohort validation with 5-year follow-up. Discrimination and calibration assessment across CKD stages. Real-world implementation studies in 8 health systems.",
  externalValidationDemographics: [
    { variable: "White Race", mesa: "52.1%", whi: "78.3%", regards: "61.2%" },
    { variable: "Black Race", mesa: "31.4%", whi: "12.8%", regards: "38.8%" },
    { variable: "Hispanic", mesa: "16.5%", whi: "5.2%", regards: "1.2%" },
    { variable: "Female", mesa: "56.2%", whi: "100%", regards: "58.4%" }
  ],
  externalValidationSampleSizes: {
    mesa: "5,243",
    whi: "7,156", 
    regards: "14,892"
  },
  
  // 6. QUANTITATIVE PERFORMANCE MEASURES
  internalValidationMetrics: {
    aurocValidity: "0.82",
    fairnessScore: "0.78",
    fairnessScoreDesc: "Min subgroup AUROC",
    calibration: "Good",
    calibrationDesc: "Hosmer-Lemeshow p=0.09",
    sensitivity: "78.6%",
    specificity: "74.2%",
    ppv: "15.3%"
  },
  externalValidationMetrics: {
    aurocValidity: "0.79",
    aurocValidityDesc: "External Cohorts",
    fairnessScore: "0.74",
    fairnessScoreDesc: "Min External AUROC",
    calibration: "Good",
    calibrationDesc: "Well-calibrated across stages",
    publishedStudies: "5",
    publishedStudiesDesc: "Published Studies on CKD Progression"
  },
  outcomeEvaluationReferences: [
    "Tangri N, et al. 'A predictive model for progression of chronic kidney disease to kidney failure.' JAMA. 2011;305(15):1553-1559.",
    "Grams ME, et al. 'Predicting timing of clinical outcomes in patients with chronic kidney disease and severely decreased glomerular filtration rate.' Kidney Int. 2018;93(2):419-427.",
    "Nelson RG, et al. 'Development of risk prediction equations for incident chronic kidney disease.' JAMA. 2019;322(21):2104-2114."
  ],
  realWorldImpact: "Implementation studies show 31% improvement in early CKD detection and 22% reduction in progression to end-stage renal disease when used as clinical decision support.",
  
  // 7. ONGOING MAINTENANCE & MONITORING
  monitoringProcess: "Monthly performance monitoring using real-world EHR data. Automated alerts when AUROC drops below 0.75 or calibration slope deviates >12% from expected.",
  localDataValidity: "Currently Monitored",
  localDataValidityDesc: "Real-time monitoring across 95 health systems. Average local AUROC: 0.81 (range: 0.76-0.85)",
  fairnessMonitoringProcess: "Bi-weekly stratified analysis by race, ethnicity, sex, age, and diabetes status. Automated bias detection using equalized odds and demographic parity metrics.",
  localFairnessData: "Complete",
  localFairnessDataDesc: "All demographic groups showing consistent performance. No significant disparities detected in current deployment.",
  updateProcess: "Semi-annual model updates incorporating new CKD research and population data. Emergency updates triggered if validity drops below threshold. Next major update: Q1 2026 incorporating 2021-2025 cohort data.",
  performanceCorrection: "Immediate deployment halt if AUROC <0.70 or fairness metrics show >15% disparities. Rollback to previous version within 12 hours. Root cause analysis within 48 hours.",
  currentMonitoringStatus: [
    "Last Performance Review: July 15, 2025 - Performance stable across all metrics",
    "Known Issues: None currently identified",
    "Pending Updates: Integration of genetic risk factors planned for v2.0",
    "Alert Status: No alerts; all systems operating within normal parameters"
  ],
  
  // 8. EVIDENCE BASE & CLINICAL GUIDELINES
  primaryCitation: "Kidney Disease: Improving Global Outcomes (KDIGO) 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int Suppl. 2013;3(1):1-150.",
  supportingGuidelines: [
    "2022 AKI and CKD in COVID-19 Consensus Conference Report",
    "2021 KDIGO Clinical Practice Guideline for Management of Blood Pressure in CKD",
    "2020 KDIGO Clinical Practice Guideline for Diabetes Management in CKD"
  ],
  clinicalEvidenceLevel: "Class I, Level A",
  clinicalEvidenceLevelDesc: "Strong recommendation based on high-quality evidence from multiple RCTs",
  
  // 9. TECHNICAL IMPLEMENTATION DETAILS
  algorithmType: "Random Forest Classification Model with ensemble methods and feature importance ranking",
  integrationMethod: "FHIR R4 Clinical Decision Support Service, HL7 CDS Hooks v1.0, SMART on FHIR v1.0",
  responseTime: "Mean: 623ms, 95th percentile: 0.9s",
  
  // FOOTER INFORMATION
  clinicalSupport: "clinical.ai@cerner.com\n1-800-237-6371",
  technicalSupport: "integration.support@cerner.com\nDeveloper Portal: developer.cerner.com",
  regulatoryAffairs: "regulatory@cerner.com",
  lastUpdated: "July 30, 2025",
  modelCardVersion: "1.8.2",
  documentClassification: "For Healthcare Professional Use Only | HIPAA Compliant"
};
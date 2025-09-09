export const hospitalization = {
  // 1. BASIC INFORMATION
  interventionName: "Cerner Hospitalization Risk Assessment v2.3.4",
  modelName: "Cerner Hospitalization Risk Assessment",
  version: "v2.3.4",
  developerName: "Oracle Cerner Corporation",
  developerContact: "Oracle Cerner Corporation\n2800 Rockcreek Parkway, North Kansas City, MO 64117\nEmail: clinical.ai@cerner.com\nPhone: 1-800-237-6371",
  releaseDate: "April 8, 2024",
  fundingSource: "Oracle Corporation internal R&D funding in collaboration with CMS and Hospital Quality Alliance",
  valueOutput: "30-day hospital readmission risk percentage with intervention recommendations (Low <10%, Moderate 10-25%, High >25%)",
  outputType: "Prediction & Risk Classification",
  
  // 2. PURPOSE OF INTERVENTION
  intendedUse: "Post-discharge care planning and readmission prevention to improve patient outcomes and reduce healthcare costs",
  intendedPatientPopulation: "Adult patients being discharged from acute care hospitals with medical comorbidities",
  intendedUsers: "Licensed physicians, nurse practitioners, physician assistants, and care managers in hospital and ambulatory settings",
  decisionMakingRole: "Informs & Augments",
  decisionMakingDesc: "Provides clinical decision support to inform and augment clinician judgment; does not replace clinical decision-making",
  
  // 3. CAUTIONED OUT-OF-SCOPE USE
  criticalAvoidances: [
    "Pediatric Populations: Not validated for patients under 18 years of age",
    "Psychiatric Admissions: Not for psychiatric admissions without medical comorbidities",
    "Planned Procedures: Not for planned readmissions for staged procedures",
    "End-of-Life Care: Not appropriate for hospice or comfort care patients",
    "Hospital Transfers: Not for transfers to other acute care facilities",
    "Emergency Settings: Not for emergency department use"
  ],
  knownRisks: [
    "Social Determinants: Social determinants data may be incomplete",
    "Hospital Variability: Performance varies by hospital type and patient population",
    "Data Dependency: Requires comprehensive EHR data for optimal performance",
    "Patient-Specific Factors: May not capture all patient-specific risk factors",
    "Sole Decision-Making: Never use as the sole basis for discharge decisions",
    "Local Adaptation: May require local calibration for specific hospital systems"
  ],
  
  // 4. DEVELOPMENT DETAILS AND INPUT FEATURES
  trainingInclusion: "Adults 18+ years; Complete discharge data; Minimum 30-day follow-up; Multi-hospital cohorts with diverse case mix",
  trainingExclusion: "Psychiatric-only admissions; Planned readmissions; Hospice/comfort care; Transfers to other acute facilities; Pediatric cases",
  deifElements: [
    { element: "Race", used: true, usedText: "Yes", description: "White, Black/African American, Asian, Native American, Other" },
    { element: "Ethnicity", used: true, usedText: "Yes", description: "Hispanic/Latino, Not Hispanic/Latino" },
    { element: "Sex", used: true, usedText: "Yes", description: "Male, Female (biological sex at birth)" },
    { element: "Date of Birth", used: true, usedText: "Yes", description: "For age calculation (18+ years)" },
    { element: "Language", used: true, usedText: "Yes", description: "Primary language for discharge planning" },
    { element: "Sexual Orientation", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Gender Identity", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Social Determinants", used: true, usedText: "Yes", description: "Insurance status, housing stability, transportation access" },
    { element: "Health Assessments", used: true, usedText: "Yes", description: "Functional status, medication adherence, social support" }
  ],
  demographicRepresentativeness: [
    { variable: "White Race", trainingData: "65.8%", usPopulation: "76.3%", representativeness: "Under-represented" },
    { variable: "Black/African American", trainingData: "22.4%", usPopulation: "13.4%", representativeness: "Over-represented" },
    { variable: "Hispanic/Latino", trainingData: "14.2%", usPopulation: "18.5%", representativeness: "Under-represented" },
    { variable: "Female Sex", trainingData: "55.7%", usPopulation: "50.8%", representativeness: "Good" },
    { variable: "Age 65+", trainingData: "48.9%", usPopulation: "16.5%", representativeness: "Over-represented" }
  ],
  relevanceToDeployedSetting: "Training data derived from academic medical centers, community hospitals, and safety-net hospitals representative of US inpatient populations. Geographic diversity includes urban and rural settings. Enhanced representation of high-readmission risk populations.",
  fairnessApproach: "Socioeconomic status-adjusted risk thresholds developed. Enhanced focus on populations with higher readmission risk including racial minorities and patients with social determinants barriers.",
  biasManagement: "Weekly fairness audits across demographic and socioeconomic subgroups. Stratified analysis by race, ethnicity, sex, age, insurance status, and social determinants. Continuous monitoring for health equity disparities.",
  
  // 5. EXTERNAL VALIDATION PROCESS
  externalDataSources: "Centers for Medicare & Medicaid Services (CMS) Hospital Readmissions Reduction Program, Veterans Affairs (VA) Corporate Data Warehouse, Healthcare Cost and Utilization Project (HCUP)",
  clinicalSettings: "Academic medical centers, community hospitals, safety-net hospitals, critical access hospitals across all 50 US states and 4 international sites",
  externalTestingParty: "Independent validation by American Hospital Association Research Institute and CMS Innovation Center Healthcare Equity Research Team",
  externalValidationProcess: "Multi-site prospective validation with 30-day follow-up. Discrimination and calibration assessment across hospital types and patient populations. Real-world implementation studies in 15 health systems.",
  externalValidationDemographics: [
    { variable: "White Race", mesa: "58.2%", whi: "71.4%", regards: "63.8%" },
    { variable: "Black Race", mesa: "28.1%", whi: "15.2%", regards: "36.2%" },
    { variable: "Hispanic", mesa: "13.7%", whi: "8.4%", regards: "2.1%" },
    { variable: "Female", mesa: "57.3%", whi: "100%", regards: "59.8%" }
  ],
  externalValidationSampleSizes: {
    mesa: "8,964",
    whi: "9,847", 
    regards: "18,523"
  },
  
  // 6. QUANTITATIVE PERFORMANCE MEASURES
  internalValidationMetrics: {
    aurocValidity: "0.73",
    fairnessScore: "0.69",
    fairnessScoreDesc: "Min subgroup AUROC",
    calibration: "Fair",
    calibrationDesc: "Hosmer-Lemeshow p=0.08",
    sensitivity: "69.5%",
    specificity: "71.3%",
    ppv: "18.9%"
  },
  externalValidationMetrics: {
    aurocValidity: "0.71",
    aurocValidityDesc: "External Hospital Systems",
    fairnessScore: "0.66",
    fairnessScoreDesc: "Min External AUROC",
    calibration: "Fair",
    calibrationDesc: "Some overestimation in high-risk",
    publishedStudies: "4",
    publishedStudiesDesc: "Published Studies on Readmission Reduction"
  },
  outcomeEvaluationReferences: [
    "Kansagara D, et al. 'Risk prediction models for hospital readmission: a systematic review.' JAMA. 2011;306(15):1688-1698.",
    "Billings J, et al. 'Development of a predictive model to identify inpatients at risk of re-admission within 30 days of discharge (PARR-30).' BMJ Open. 2012;2(4):e001667.",
    "Burke RE, et al. 'Hospital readmission from post-acute care facilities: risk factors, timing, and outcomes.' J Am Geriatr Soc. 2016;64(4):715-722."
  ],
  realWorldImpact: "Implementation studies show 18% reduction in 30-day readmissions and 25% improvement in targeted discharge planning when used as clinical decision support.",
  
  // 7. ONGOING MAINTENANCE & MONITORING
  monitoringProcess: "Weekly performance monitoring using real-world readmission data. Automated alerts when AUROC drops below 0.68 or disparities in readmission rates exceed 15% between demographic groups.",
  localDataValidity: "Currently Monitored",
  localDataValidityDesc: "Real-time monitoring across 200 hospitals. Average local AUROC: 0.72 (range: 0.67-0.78)",
  fairnessMonitoringProcess: "Daily stratified analysis by race, ethnicity, sex, age, insurance status, and social determinants. Automated health equity monitoring with alerts for emerging disparities.",
  localFairnessData: "Active Monitoring",
  localFairnessDataDesc: "Enhanced monitoring showing improved equity outcomes. 12% reduction in readmission disparities between racial groups since implementation.",
  updateProcess: "Quarterly model updates incorporating new readmission patterns and CMS policy changes. Emergency updates for major healthcare policy changes. Next major update: Q4 2025 incorporating post-COVID readmission patterns.",
  performanceCorrection: "Immediate deployment halt if AUROC <0.65 or health equity metrics show >20% disparities. Rollback to previous version within 8 hours. Multidisciplinary review within 24 hours.",
  currentMonitoringStatus: [
    "Last Performance Review: July 25, 2025 - Performance stable with improved equity metrics",
    "Known Issues: Slight calibration drift in rural hospitals under investigation",
    "Pending Updates: Integration of social determinants scoring planned for v3.0",
    "Alert Status: 1 minor calibration alert for rural settings under review"
  ],
  
  // 8. EVIDENCE BASE & CLINICAL GUIDELINES
  primaryCitation: "Medicare.gov Hospital Compare. Hospital Readmissions Reduction Program (HRRP). Centers for Medicare & Medicaid Services. Updated 2025.",
  supportingGuidelines: [
    "2024 AHA/ACC Scientific Statement on Hospital Readmissions",
    "2023 Society of Hospital Medicine Clinical Practice Guidelines",
    "2022 CMS Quality Payment Program Guidelines"
  ],
  clinicalEvidenceLevel: "Class IIa, Level B",
  clinicalEvidenceLevelDesc: "Moderate recommendation based on observational studies and quality improvement initiatives",
  
  // 9. TECHNICAL IMPLEMENTATION DETAILS
  algorithmType: "Deep Learning Neural Network Model with attention mechanisms and social determinants integration",
  integrationMethod: "FHIR R4 Clinical Decision Support Service, HL7 CDS Hooks v1.0, SMART on FHIR v1.0",
  responseTime: "Mean: 892ms, 95th percentile: 1.4s",
  
  // FOOTER INFORMATION
  clinicalSupport: "clinical.ai@cerner.com\n1-800-237-6371",
  technicalSupport: "integration.support@cerner.com\nDeveloper Portal: developer.cerner.com",
  regulatoryAffairs: "regulatory@cerner.com",
  lastUpdated: "July 30, 2025",
  modelCardVersion: "2.3.4",
  documentClassification: "For Healthcare Professional Use Only | HIPAA Compliant | 21st Century Cures Act Compliant"
};
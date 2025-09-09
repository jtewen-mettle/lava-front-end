export const prostate = {
  // 1. BASIC INFORMATION
  interventionName: "Cerner Prostate Cancer Risk Assessment v3.0.1",
  modelName: "Cerner Prostate Cancer Risk Assessment",
  version: "v3.0.1",
  developerName: "Oracle Cerner Corporation",
  developerContact: "Oracle Cerner Corporation\n2800 Rockcreek Parkway, North Kansas City, MO 64117\nEmail: clinical.ai@cerner.com\nPhone: 1-800-237-6371",
  releaseDate: "June 10, 2024",
  fundingSource: "Oracle Corporation internal R&D funding in collaboration with American Urological Association",
  valueOutput: "10-year prostate cancer risk percentage with screening recommendations (Low <2%, Intermediate 2-10%, High >10%)",
  outputType: "Prediction & Risk Classification",
  
  // 2. PURPOSE OF INTERVENTION
  intendedUse: "Screening decision support and risk stratification for prostate cancer to inform shared decision-making",
  intendedPatientPopulation: "Men aged 45-75 years considering prostate cancer screening in primary care or urology settings",
  intendedUsers: "Licensed physicians, nurse practitioners, and physician assistants in primary care, urology, and preventive medicine practices",
  decisionMakingRole: "Informs & Augments",
  decisionMakingDesc: "Provides clinical decision support to inform and augment clinician judgment; does not replace clinical decision-making",
  
  // 3. CAUTIONED OUT-OF-SCOPE USE
  criticalAvoidances: [
    "Age Limitations: Not for men under 45 or over 75 years of age",
    "Previous Cancer: Not appropriate for men with previous prostate cancer diagnosis",
    "Limited Life Expectancy: Not for men with life expectancy less than 10 years",
    "Screening Inability: Not for men unable to undergo screening procedures",
    "Active Infections: Not during active urinary tract infections",
    "Emergency Settings: Not for use in emergency departments"
  ],
  knownRisks: [
    "Guideline Variability: Screening guidelines vary by professional organizations",
    "Population-Based: Risk estimates are population-based, not individual predictions",
    "PSA Factors: PSA levels can be affected by various non-cancer factors",
    "Shared Decision-Making: Does not replace shared decision-making conversations",
    "Sole Decision-Making: Never use as the sole basis for screening decisions",
    "Local Adaptation: May require local calibration for specific populations"
  ],
  
  // 4. DEVELOPMENT DETAILS AND INPUT FEATURES
  trainingInclusion: "Men 45-75 years; Complete PSA and clinical data; Minimum 10-year follow-up; US-based screening cohorts",
  trainingExclusion: "Previous prostate cancer diagnosis; Life expectancy <10 years; Unable to undergo screening; Active UTI during testing",
  deifElements: [
    { element: "Race", used: true, usedText: "Yes", description: "White, Black/African American, Asian, Other" },
    { element: "Ethnicity", used: true, usedText: "Yes", description: "Hispanic/Latino, Not Hispanic/Latino" },
    { element: "Sex", used: true, usedText: "Yes", description: "Male (biological sex at birth)" },
    { element: "Date of Birth", used: true, usedText: "Yes", description: "For age calculation (45-75 years)" },
    { element: "Language", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Sexual Orientation", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Gender Identity", used: false, usedText: "No", description: "Not included in risk calculation" },
    { element: "Social Determinants", used: true, usedText: "Yes", description: "Insurance status, geographic region" },
    { element: "Family History", used: true, usedText: "Yes", description: "Family history, previous biopsy results" }
  ],
  demographicRepresentativeness: [
    { variable: "White Race", trainingData: "71.8%", usPopulation: "76.3%", representativeness: "Good" },
    { variable: "Black/African American", trainingData: "18.5%", usPopulation: "13.4%", representativeness: "Over-represented" },
    { variable: "Hispanic/Latino", trainingData: "9.2%", usPopulation: "18.5%", representativeness: "Under-represented" },
    { variable: "Age 50-65", trainingData: "62.1%", usPopulation: "58.7%", representativeness: "Good" },
    { variable: "Age 45-49", trainingData: "15.3%", usPopulation: "16.8%", representativeness: "Good" }
  ],
  relevanceToDeployedSetting: "Training data derived from urology practices and primary care screening programs representative of US male populations. Geographic diversity includes all US regions. Enhanced representation of high-risk populations.",
  fairnessApproach: "Race-specific risk thresholds developed with enhanced focus on African American men who have higher prostate cancer risk. Separate screening recommendations by demographic subgroups.",
  biasManagement: "Monthly fairness audits across demographic subgroups. Stratified analysis by race, ethnicity, age, and family history. Enhanced monitoring for African American and Hispanic populations.",
  
  // 5. EXTERNAL VALIDATION PROCESS
  externalDataSources: "Prostate, Lung, Colorectal, and Ovarian (PLCO) Cancer Screening Trial, Selenium and Vitamin E Cancer Prevention Trial (SELECT), European Randomized Study of Screening for Prostate Cancer (ERSPC)",
  clinicalSettings: "Urology practices, primary care clinics, men's health centers, academic medical centers across 22 US states and 8 international sites",
  externalTestingParty: "Independent validation by American Urological Association Clinical Guidelines Panel and European Association of Urology Research Foundation",
  externalValidationProcess: "Multi-national prospective validation with 10-year follow-up. Discrimination and calibration assessment across age and ethnic groups. Real-world screening studies in 12 health systems.",
  externalValidationDemographics: [
    { variable: "White Race", mesa: "68.4%", whi: "82.1%", regards: "74.2%" },
    { variable: "Black Race", mesa: "22.1%", whi: "8.3%", regards: "25.8%" },
    { variable: "Hispanic", mesa: "9.5%", whi: "4.2%", regards: "0.8%" },
    { variable: "Asian", mesa: "0.8%", whi: "0.6%", regards: "0.8%" },
    { variable: "Age 45-60", mesa: "62.1%", whi: "58.7%", regards: "62.1%" }
  ],
  externalValidationSampleSizes: {
    mesa: "4,127",
    whi: "6,892", 
    regards: "12,458"
  },
  
  // 6. QUANTITATIVE PERFORMANCE MEASURES
  internalValidationMetrics: {
    aurocValidity: "0.79",
    fairnessScore: "0.76",
    fairnessScoreDesc: "Min subgroup AUROC",
    calibration: "Good",
    calibrationDesc: "Hosmer-Lemeshow p=0.15",
    sensitivity: "81.2%",
    specificity: "69.8%",
    ppv: "12.7%"
  },
  externalValidationMetrics: {
    aurocValidity: "0.75",
    aurocValidityDesc: "External Cohorts",
    fairnessScore: "0.72",
    fairnessScoreDesc: "Min External AUROC",
    calibration: "Good",
    calibrationDesc: "Well-calibrated across sites",
    publishedStudies: "7",
    publishedStudiesDesc: "Published Studies on Screening Outcomes"
  },
  outcomeEvaluationReferences: [
    "Hugosson J, et al. 'A 16-yr Follow-up of the European Randomized study of Screening for Prostate Cancer.' Eur Urol. 2019;76(1):43-51.",
    "Pinsky PF, et al. 'Extended mortality results for prostate cancer screening in the PLCO trial with median follow-up of 15 years.' Cancer. 2017;123(4):592-599.",
    "Roobol MJ, et al. 'A risk-based strategy improves prostate-specific antigen-driven detection of prostate cancer.' Eur Urol. 2010;57(1):79-85."
  ],
  realWorldImpact: "Implementation studies show 28% reduction in unnecessary biopsies and 19% improvement in high-grade cancer detection when used as screening decision support.",
  
  // 7. ONGOING MAINTENANCE & MONITORING
  monitoringProcess: "Quarterly performance monitoring using real-world screening data. Automated alerts when AUROC drops below 0.72 or specificity falls below 65%.",
  localDataValidity: "Currently Monitored",
  localDataValidityDesc: "Real-time monitoring across 85 health systems. Average local AUROC: 0.77 (range: 0.71-0.82)",
  fairnessMonitoringProcess: "Monthly stratified analysis by race, ethnicity, age, and family history. Enhanced monitoring for screening disparities across demographic groups.",
  localFairnessData: "Complete",
  localFairnessDataDesc: "All demographic groups showing appropriate performance. Enhanced sensitivity maintained for African American men.",
  updateProcess: "Annual model updates incorporating new screening research and guideline changes. Emergency updates for major guideline revisions. Next major update: Q3 2025 incorporating new AUA guidelines.",
  performanceCorrection: "Immediate deployment halt if AUROC <0.70 or sensitivity for high-risk groups drops >10%. Rollback to previous version within 24 hours. Clinical review within 48 hours.",
  currentMonitoringStatus: [
    "Last Performance Review: July 22, 2025 - Performance stable across all demographics",
    "Known Issues: None currently identified",
    "Pending Updates: Integration of multiparametric MRI data planned for v4.0",
    "Alert Status: No alerts; optimal performance maintained"
  ],
  
  // 8. EVIDENCE BASE & CLINICAL GUIDELINES
  primaryCitation: "Carter HB, et al. 'Early detection of prostate cancer: AUA Guideline.' J Urol. 2013;190(2):419-426.",
  supportingGuidelines: [
    "2023 AUA/SUO Guideline on Prostate Cancer Early Detection",
    "2022 NCCN Guidelines for Prostate Cancer Early Detection",
    "2021 EAU Guidelines on Prostate Cancer Screening"
  ],
  clinicalEvidenceLevel: "Class IIa, Level B",
  clinicalEvidenceLevelDesc: "Moderate recommendation based on limited evidence from screening trials",
  
  // 9. TECHNICAL IMPLEMENTATION DETAILS
  algorithmType: "Gradient Boosting Machine Learning Model with ensemble methods and PSA kinetics integration",
  integrationMethod: "FHIR R4 Clinical Decision Support Service, HL7 CDS Hooks v1.0, SMART on FHIR v1.0",
  responseTime: "Mean: 734ms, 95th percentile: 1.1s",
  
  // FOOTER INFORMATION
  clinicalSupport: "clinical.ai@cerner.com\n1-800-237-6371",
  technicalSupport: "integration.support@cerner.com\nDeveloper Portal: developer.cerner.com",
  regulatoryAffairs: "regulatory@cerner.com",
  lastUpdated: "July 30, 2025",
  modelCardVersion: "3.0.1",
  documentClassification: "For Healthcare Professional Use Only | HIPAA Compliant | 21st Century Cures Act Compliant"
};
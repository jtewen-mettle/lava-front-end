/**
 * Disease Categories and DSI Tools Configuration
 *
 * This file contains the centralized configuration for all disease categories
 * and their associated DSI tools. Use the 'enabled' flag to control which
 * tools appear in the dropdown menus.
 */

export const diseaseCategories = {
  'Heart & Cardiovascular': [
    {
      id: 'CardioVascularPrediction',
      toolName: 'Atherosclerotic Cardiovascular Disease Predictor Evaluation',
      vendor: 'Cerner',
      modelDataKey: 'cardiovascular',
      enabled: true  // VISIBLE
    },
    {
      id: 'HeartFailurePrediction',
      toolName: 'Heart Failure Predictor Evaluation',
      vendor: 'Cerner',
      modelDataKey: 'heartfailure',
      enabled: false  // HIDDEN - Not fully implemented
    }
  ],
  'Kidney & Renal': [
    {
      id: 'CKD',
      toolName: 'Chronic Kidney Disease Predictor Evaluation',
      vendor: 'Cerner',
      modelDataKey: 'ckd',
      enabled: true  // VISIBLE
    }
  ],
  'Cancer': [
    {
      id: 'ProstateCancerPrediction',
      toolName: 'Prostate Cancer Predictor Evaluation',
      vendor: 'DSI Vendor2',
      modelDataKey: 'prostate',
      enabled: true  // VISIBLE
    }
  ],
  'General Risk Assessment': [
    {
      id: 'HospitalizationRisk',
      toolName: 'Hospitalization Risk Predictor Evaluation',
      vendor: 'Cerner',
      modelDataKey: 'hospitalization',
      enabled: false  // HIDDEN - Not fully implemented
    }
  ]
};

/**
 * Get all enabled tools for a specific disease category
 * @param {string} category - The disease category name
 * @returns {Array} Array of enabled tools with formatted labels
 */
export const getEnabledToolsForCategory = (category) => {
  const tools = diseaseCategories[category] || [];
  return tools
    .filter(tool => tool.enabled)
    .map(tool => ({
      value: tool.id,
      label: `${tool.vendor} ${tool.toolName}`
    }));
};

/**
 * Get all disease categories that have at least one enabled tool
 * @returns {Array} Array of category names with enabled tools
 */
export const getActiveDiseaseCategories = () => {
  return Object.keys(diseaseCategories).filter(category => {
    const tools = diseaseCategories[category];
    return tools.some(tool => tool.enabled);
  });
};

import { CalculateMetrics } from './CalculateMetrics';
import { calculateCalibrationData } from '../charts/CalibrationCurve';

export async function CalculateSubgroupMetrics(data, selectedFeature, score, threshold) {
  const latestData = data;

  const cleanedData = latestData.map(row => ({
    ...row,
    [selectedFeature]: String(row[selectedFeature])?.trim() || "Other"
  }));

  const subgroups = [...new Set(cleanedData.map(row => row[selectedFeature]))];

  const subgroupMetrics = [];

  for (const value of subgroups) {
    const filteredRows = cleanedData.filter(row => row[selectedFeature] === value);
    console.log(filteredRows)

    if (filteredRows.length >= 2) {
      console.log(score)
      let metrics;
     
      const yTrue = filteredRows.map(row => row.Actual);
      const yPred = filteredRows.map(row => row.Prediction);

      // Calculate calibration data for this subgroup
      // For calibration, we need probability predictions, not binary predictions
      const yPredProb = filteredRows.map(row => {
        // If we have a score column, use that as probability
        if (score && row[score] !== undefined) {
          let prob = parseFloat(row[score]);
          // Convert to 0-1 range if needed
          if (prob > 1) prob = prob / 100;
          return prob;
        }
        // Otherwise use the prediction as probability
        return parseFloat(row.Prediction);
      });

      // Calculate calibration curve data for this subgroup
      const calibrationData = calculateCalibrationData(yPredProb, yTrue, 10);

      metrics = await CalculateMetrics(yTrue, yPred);

      subgroupMetrics.push({
        Subgroup: value || 'Other',
        predictions: yPredProb, // Add probability predictions for calibration
        actual: yTrue, // Add actual outcomes for calibration
        ...metrics
      });
    }
  }

  return subgroupMetrics;
}

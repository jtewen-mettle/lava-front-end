export class MetricsCalculator {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      threshold: 0.5,
      confidenceLevel: 0.95,
      bootstrapSamples: 1000,
      ...options
    };
  }

  // Core performance metrics
  calculateConfusionMatrix(threshold = this.options.threshold) {
    let tp = 0, tn = 0, fp = 0, fn = 0;

    this.data.forEach(row => {
      if (row.Actual_Outcome !== null && row.Predicted_Outcome !== null) {
        const actual = row.Actual_Outcome;
        const predicted = row.Predicted_Outcome >= threshold ? 1 : 0;

        if (actual === 1 && predicted === 1) tp++;
        else if (actual === 0 && predicted === 0) tn++;
        else if (actual === 0 && predicted === 1) fp++;
        else if (actual === 1 && predicted === 0) fn++;
      }
    });

    return { tp, tn, fp, fn };
  }

  calculateBasicMetrics(threshold = this.options.threshold) {
    const { tp, tn, fp, fn } = this.calculateConfusionMatrix(threshold);
    const total = tp + tn + fp + fn;

    if (total === 0) {
      return {
        sensitivity: null,
        specificity: null,
        precision: null,
        npv: null,
        accuracy: null,
        f1Score: null,
        mcc: null,
        confusionMatrix: { tp: 0, tn: 0, fp: 0, fn: 0 }
      };
    }

    const sensitivity = tp + fn > 0 ? tp / (tp + fn) : 0;
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const npv = tn + fn > 0 ? tn / (tn + fn) : 0; // Negative Predictive Value
    const accuracy = (tp + tn) / total;
    const f1Score = precision + sensitivity > 0 ? 2 * (precision * sensitivity) / (precision + sensitivity) : 0;
    
    // Matthews Correlation Coefficient
    const mccDenominator = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
    const mcc = mccDenominator > 0 ? (tp * tn - fp * fn) / mccDenominator : 0;

    return {
      sensitivity,
      specificity,
      precision,
      npv,
      accuracy,
      f1Score,
      mcc,
      confusionMatrix: { tp, tn, fp, fn }
    };
  }

  calculateROCCurve() {
    // Get all unique thresholds from predicted outcomes
    const thresholds = [...new Set(this.data.map(row => row.Predicted_Outcome))]
      .filter(val => val !== null)
      .sort((a, b) => b - a); // Sort descending

    // Add 0 and 1 as boundary thresholds
    const allThresholds = [1, ...thresholds, 0];

    const rocPoints = allThresholds.map(threshold => {
      const { tp, tn, fp, fn } = this.calculateConfusionMatrix(threshold);
      
      const tpr = tp + fn > 0 ? tp / (tp + fn) : 0; // True Positive Rate (Sensitivity)
      const fpr = tn + fp > 0 ? fp / (tn + fp) : 0; // False Positive Rate (1 - Specificity)
      
      return { threshold, tpr, fpr, tp, tn, fp, fn };
    });

    // Calculate AUC using trapezoidal rule
    let auc = 0;
    for (let i = 1; i < rocPoints.length; i++) {
      const prev = rocPoints[i - 1];
      const curr = rocPoints[i];
      auc += (curr.fpr - prev.fpr) * (prev.tpr + curr.tpr) / 2;
    }

    return {
      points: rocPoints,
      auc: Math.abs(auc) // Ensure positive AUC
    };
  }

  calculatePrecisionRecallCurve() {
    const thresholds = [...new Set(this.data.map(row => row.Predicted_Outcome))]
      .filter(val => val !== null)
      .sort((a, b) => b - a);

    const prPoints = thresholds.map(threshold => {
      const { tp, fp, fn } = this.calculateConfusionMatrix(threshold);
      
      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      
      return { threshold, precision, recall, tp, fp, fn };
    });

    // Calculate average precision (AP) - area under PR curve
    let ap = 0;
    for (let i = 1; i < prPoints.length; i++) {
      const prev = prPoints[i - 1];
      const curr = prPoints[i];
      ap += (prev.recall - curr.recall) * curr.precision;
    }

    return {
      points: prPoints,
      averagePrecision: ap
    };
  }

  calculateCalibrationCurve(nBins = 10) {
    // Sort data by predicted probability
    const sortedData = [...this.data]
      .filter(row => row.Predicted_Outcome !== null && row.Actual_Outcome !== null)
      .sort((a, b) => a.Predicted_Outcome - b.Predicted_Outcome);

    if (sortedData.length === 0) {
      return { points: [], hosmerLemeshow: null, brier: null };
    }

    const binSize = Math.ceil(sortedData.length / nBins);
    const calibrationPoints = [];

    for (let i = 0; i < nBins; i++) {
      const start = i * binSize;
      const end = Math.min(start + binSize, sortedData.length);
      const binData = sortedData.slice(start, end);

      if (binData.length === 0) continue;

      const meanPredicted = binData.reduce((sum, row) => sum + row.Predicted_Outcome, 0) / binData.length;
      const meanActual = binData.reduce((sum, row) => sum + row.Actual_Outcome, 0) / binData.length;
      const count = binData.length;

      calibrationPoints.push({
        meanPredicted,
        meanActual,
        count,
        binIndex: i
      });
    }

    // Calculate Hosmer-Lemeshow test statistic
    let hosmerLemeshow = 0;
    calibrationPoints.forEach(point => {
      const expected = point.count * point.meanPredicted;
      const observed = point.count * point.meanActual;
      if (expected > 0) {
        hosmerLemeshow += Math.pow(observed - expected, 2) / (expected * (1 - point.meanPredicted));
      }
    });

    // Calculate Brier Score
    const brierScore = sortedData.reduce((sum, row) => {
      return sum + Math.pow(row.Predicted_Outcome - row.Actual_Outcome, 2);
    }, 0) / sortedData.length;

    return {
      points: calibrationPoints,
      hosmerLemeshow,
      brier: brierScore
    };
  }

  // Subgroup analysis
  calculateSubgroupMetrics(groupField, threshold = this.options.threshold) {
    const groups = {};
    
    this.data.forEach(row => {
      const group = row[groupField];
      if (group !== null && group !== undefined) {
        if (!groups[group]) groups[group] = [];
        groups[group].push(row);
      }
    });

    const subgroupResults = {};
    
    Object.keys(groups).forEach(group => {
      const calculator = new MetricsCalculator(groups[group], this.options);
      subgroupResults[group] = calculator.calculateBasicMetrics(threshold);
      subgroupResults[group].count = groups[group].length;
      subgroupResults[group].prevalence = groups[group]
        .filter(row => row.Actual_Outcome === 1).length / groups[group].length;
    });

    return subgroupResults;
  }

  calculateAgeGroupMetrics(threshold = this.options.threshold, groupSize = 10) {
    const ageGroups = {};
    
    this.data.forEach(row => {
      if (row.Age !== null && !isNaN(row.Age)) {
        const groupStart = Math.floor(row.Age / groupSize) * groupSize;
        const groupKey = `${groupStart}-${groupStart + groupSize - 1}`;
        
        if (!ageGroups[groupKey]) ageGroups[groupKey] = [];
        ageGroups[groupKey].push(row);
      }
    });

    const ageGroupResults = {};
    
    Object.keys(ageGroups).sort().forEach(ageGroup => {
      const calculator = new MetricsCalculator(ageGroups[ageGroup], this.options);
      ageGroupResults[ageGroup] = calculator.calculateBasicMetrics(threshold);
      ageGroupResults[ageGroup].count = ageGroups[ageGroup].length;
      ageGroupResults[ageGroup].meanAge = ageGroups[ageGroup]
        .reduce((sum, row) => sum + row.Age, 0) / ageGroups[ageGroup].length;
      ageGroupResults[ageGroup].prevalence = ageGroups[ageGroup]
        .filter(row => row.Actual_Outcome === 1).length / ageGroups[ageGroup].length;
    });

    return ageGroupResults;
  }

  // Bootstrap confidence intervals
  calculateBootstrapCI(metric = 'accuracy', threshold = this.options.threshold) {
    const bootstrapResults = [];
    
    for (let i = 0; i < this.options.bootstrapSamples; i++) {
      // Bootstrap sample with replacement
      const sample = [];
      for (let j = 0; j < this.data.length; j++) {
        const randomIndex = Math.floor(Math.random() * this.data.length);
        sample.push(this.data[randomIndex]);
      }
      
      const calculator = new MetricsCalculator(sample, this.options);
      const metrics = calculator.calculateBasicMetrics(threshold);
      
      if (metrics[metric] !== null) {
        bootstrapResults.push(metrics[metric]);
      }
    }
    
    if (bootstrapResults.length === 0) {
      return { lower: null, upper: null, mean: null };
    }
    
    bootstrapResults.sort((a, b) => a - b);
    
    const alpha = 1 - this.options.confidenceLevel;
    const lowerIndex = Math.floor(alpha / 2 * bootstrapResults.length);
    const upperIndex = Math.floor((1 - alpha / 2) * bootstrapResults.length);
    
    return {
      lower: bootstrapResults[lowerIndex],
      upper: bootstrapResults[Math.min(upperIndex, bootstrapResults.length - 1)],
      mean: bootstrapResults.reduce((sum, val) => sum + val, 0) / bootstrapResults.length
    };
  }

  // Feature importance analysis
  calculateFeatureCorrelations() {
    const numericalFields = [
      'Age', 'eGFR', 'uACR_log', 'SerumAlbumin', 'SerumPhosphorous',
      'SerumCalcium', 'SerumBicarbonate', 'BloodCreatinine', 'UrineProtein'
    ];

    const correlations = {};
    
    numericalFields.forEach(field => {
      correlations[field] = this.calculatePearsonCorrelation(field, 'Actual_Outcome');
    });

    return correlations;
  }

  calculatePearsonCorrelation(field1, field2) {
    const validPairs = this.data
      .map(row => [parseFloat(row[field1]), parseFloat(row[field2])])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    if (validPairs.length < 2) return null;

    const n = validPairs.length;
    const sumX = validPairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = validPairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = validPairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = validPairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Comprehensive performance report
  generatePerformanceReport(threshold = this.options.threshold) {
    const basicMetrics = this.calculateBasicMetrics(threshold);
    const rocData = this.calculateROCCurve();
    const prData = this.calculatePrecisionRecallCurve();
    const calibration = this.calculateCalibrationCurve();
    const subgroupGender = this.calculateSubgroupMetrics('Gender', threshold);
    const subgroupRace = this.calculateSubgroupMetrics('Race', threshold);
    const ageGroups = this.calculateAgeGroupMetrics(threshold);
    const correlations = this.calculateFeatureCorrelations();

    return {
      overview: {
        totalSamples: this.data.length,
        threshold,
        ...basicMetrics
      },
      discrimination: {
        roc: rocData,
        precisionRecall: prData
      },
      calibration,
      subgroupAnalysis: {
        gender: subgroupGender,
        race: subgroupRace,
        age: ageGroups
      },
      featureAnalysis: {
        correlations
      },
      generatedAt: new Date().toISOString()
    };
  }
}
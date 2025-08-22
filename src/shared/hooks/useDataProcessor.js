import { useState, useMemo, useCallback } from 'react';
import { CSVProcessor } from '../../core/data';
import { MetricsCalculator } from '../../core/services';

export const useDataProcessor = (csvData, options = {}) => {
  const [filters, setFilters] = useState({
    ageRange: [null, null],
    genders: [],
    races: [],
    outcome: null
  });

  const [threshold, setThreshold] = useState(options.defaultThreshold || 0.5);

  // Initialize data processor
  const processor = useMemo(() => {
    if (!csvData || csvData.length === 0) return null;
    return new CSVProcessor(csvData);
  }, [csvData]);

  // Apply filters to get filtered data
  const filteredData = useMemo(() => {
    if (!processor) return [];

    let data = processor.getProcessedData();

    // Apply age filter
    if (filters.ageRange[0] !== null || filters.ageRange[1] !== null) {
      data = processor.filterByAge(filters.ageRange[0], filters.ageRange[1]);
    }

    // Apply gender filter
    if (filters.genders.length > 0) {
      data = data.filter(row => filters.genders.includes(row.Gender));
    }

    // Apply race filter
    if (filters.races.length > 0) {
      data = data.filter(row => filters.races.includes(row.Race));
    }

    // Apply outcome filter
    if (filters.outcome !== null) {
      data = data.filter(row => row.Actual_Outcome === filters.outcome);
    }

    return data;
  }, [processor, filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null;

    const calculator = new MetricsCalculator(filteredData, {
      threshold,
      ...options
    });

    return calculator.generatePerformanceReport(threshold);
  }, [filteredData, threshold, options]);

  // Data transformation utilities
  const transformForChart = useCallback((type, config = {}) => {
    if (!filteredData || filteredData.length === 0) return { labels: [], datasets: [] };

    switch (type) {
      case 'age-distribution':
        return createAgeDistribution(filteredData, config);
      
      case 'gender-distribution':
        return createCategoricalDistribution(filteredData, 'Gender', config);
      
      case 'race-distribution':
        return createCategoricalDistribution(filteredData, 'Race', config);
      
      case 'outcome-distribution':
        return createOutcomeDistribution(filteredData, config);
      
      case 'feature-correlation':
        return createCorrelationData(filteredData, config);
      
      case 'prediction-histogram':
        return createPredictionHistogram(filteredData, config);
      
      default:
        return { labels: [], datasets: [] };
    }
  }, [filteredData]);

  // Filter management
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ageRange: [null, null],
      genders: [],
      races: [],
      outcome: null
    });
  }, []);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!processor) return { genders: [], races: [], ageRange: [0, 100] };

    const data = processor.getProcessedData();
    
    return {
      genders: processor.getUniqueValues('Gender').filter(Boolean),
      races: processor.getUniqueValues('Race').filter(Boolean),
      ageRange: [
        Math.min(...data.map(row => row.Age).filter(age => age !== null)),
        Math.max(...data.map(row => row.Age).filter(age => age !== null))
      ]
    };
  }, [processor]);

  // Data summary
  const summary = useMemo(() => {
    if (!processor) return null;

    const allData = processor.getProcessedData();
    const filteredCount = filteredData.length;
    
    return {
      totalSamples: allData.length,
      filteredSamples: filteredCount,
      filterApplied: filteredCount < allData.length,
      positiveOutcomes: filteredData.filter(row => row.Actual_Outcome === 1).length,
      negativeOutcomes: filteredData.filter(row => row.Actual_Outcome === 0).length,
      averageAge: filteredData.reduce((sum, row) => sum + (row.Age || 0), 0) / filteredCount || 0,
      genderDistribution: Object.entries(
        filteredData.reduce((acc, row) => {
          acc[row.Gender] = (acc[row.Gender] || 0) + 1;
          return acc;
        }, {})
      ),
      raceDistribution: Object.entries(
        filteredData.reduce((acc, row) => {
          acc[row.Race] = (acc[row.Race] || 0) + 1;
          return acc;
        }, {})
      )
    };
  }, [processor, filteredData]);

  return {
    // Data
    originalData: processor?.getProcessedData() || [],
    filteredData,
    metrics,
    summary,
    
    // Filters
    filters,
    updateFilters,
    clearFilters,
    filterOptions,
    
    // Threshold
    threshold,
    setThreshold,
    
    // Transformations
    transformForChart,
    
    // Status
    isLoading: !processor,
    hasData: !!processor && filteredData.length > 0
  };
};

// Helper functions for chart data transformation
const createAgeDistribution = (data, config) => {
  const { bins = 10 } = config;
  const ages = data.map(row => row.Age).filter(age => age !== null && !isNaN(age));
  
  if (ages.length === 0) return { labels: [], datasets: [] };
  
  const min = Math.min(...ages);
  const max = Math.max(...ages);
  const binSize = (max - min) / bins;
  
  const binCounts = new Array(bins).fill(0);
  const binLabels = [];
  
  for (let i = 0; i < bins; i++) {
    const start = min + i * binSize;
    const end = start + binSize;
    binLabels.push(`${Math.round(start)}-${Math.round(end)}`);
  }
  
  ages.forEach(age => {
    let binIndex = Math.floor((age - min) / binSize);
    if (binIndex >= bins) binIndex = bins - 1;
    binCounts[binIndex]++;
  });
  
  return {
    labels: binLabels,
    datasets: [{
      label: 'Count',
      data: binCounts,
      backgroundColor: 'rgba(39, 87, 134, 0.6)',
      borderColor: 'rgba(39, 87, 134, 1)',
      borderWidth: 1
    }]
  };
};

const createCategoricalDistribution = (data, field, config) => {
  const distribution = data.reduce((acc, row) => {
    const value = row[field];
    if (value) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
  
  const labels = Object.keys(distribution);
  const counts = Object.values(distribution);
  
  return {
    labels,
    datasets: [{
      label: 'Count',
      data: counts,
      backgroundColor: labels.map((_, index) => 
        `hsl(${(index * 137.5) % 360}, 70%, 60%)`
      )
    }]
  };
};

const createOutcomeDistribution = (data, config) => {
  const outcomes = data.reduce((acc, row) => {
    const outcome = row.Actual_Outcome;
    if (outcome !== null) {
      acc[outcome] = (acc[outcome] || 0) + 1;
    }
    return acc;
  }, {});
  
  return {
    labels: Object.keys(outcomes).map(key => key === '1' ? 'Positive' : 'Negative'),
    datasets: [{
      label: 'Count',
      data: Object.values(outcomes),
      backgroundColor: ['rgba(76, 175, 80, 0.8)', 'rgba(244, 67, 54, 0.8)']
    }]
  };
};

const createCorrelationData = (data, config) => {
  const { fields = ['Age', 'eGFR', 'SerumAlbumin'] } = config;
  
  const correlations = fields.map(field => {
    const pairs = data.map(row => [row[field], row.Actual_Outcome])
      .filter(([x, y]) => x !== null && y !== null && !isNaN(x) && !isNaN(y));
    
    if (pairs.length < 2) return 0;
    
    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  });
  
  return {
    labels: fields,
    datasets: [{
      label: 'Correlation with Outcome',
      data: correlations,
      backgroundColor: correlations.map(corr => 
        corr > 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'
      )
    }]
  };
};

const createPredictionHistogram = (data, config) => {
  const { bins = 20 } = config;
  const predictions = data.map(row => row.Predicted_Outcome)
    .filter(pred => pred !== null && !isNaN(pred));
  
  if (predictions.length === 0) return { labels: [], datasets: [] };
  
  const binCounts = new Array(bins).fill(0);
  const binLabels = [];
  const binSize = 1 / bins;
  
  for (let i = 0; i < bins; i++) {
    const start = i * binSize;
    const end = start + binSize;
    binLabels.push(`${(start * 100).toFixed(0)}-${(end * 100).toFixed(0)}%`);
  }
  
  predictions.forEach(pred => {
    let binIndex = Math.floor(pred / binSize);
    if (binIndex >= bins) binIndex = bins - 1;
    binCounts[binIndex]++;
  });
  
  return {
    labels: binLabels,
    datasets: [{
      label: 'Count',
      data: binCounts,
      backgroundColor: 'rgba(33, 150, 243, 0.6)',
      borderColor: 'rgba(33, 150, 243, 1)',
      borderWidth: 1
    }]
  };
};
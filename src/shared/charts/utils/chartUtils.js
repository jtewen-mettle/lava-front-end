import { tokens } from '../../../core/theme';

// Color palette utilities
export const getChartColorPalette = (count = 10) => {
  const baseColors = [
    tokens.colors.primary[600],
    tokens.colors.primary[500],
    tokens.colors.primary[400],
    tokens.colors.secondary[500],
    tokens.colors.semantic.success,
    tokens.colors.semantic.warning,
    tokens.colors.semantic.info,
    tokens.colors.neutral[500],
    tokens.colors.neutral[400],
    tokens.colors.neutral[300]
  ];

  // If we need more colors than available, generate variations
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  const colors = [...baseColors];
  const additionalNeeded = count - baseColors.length;
  
  for (let i = 0; i < additionalNeeded; i++) {
    const baseIndex = i % baseColors.length;
    const opacity = 0.7 - (Math.floor(i / baseColors.length) * 0.2);
    colors.push(baseColors[baseIndex] + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
  }

  return colors;
};

export const getGradientColor = (color, opacity = 1) => {
  return `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Data transformation utilities
export const transformDataForChart = (data, xKey, yKey, groupKey = null) => {
  if (!Array.isArray(data)) return { labels: [], datasets: [] };

  if (groupKey) {
    // Group data by groupKey
    const groups = {};
    data.forEach(item => {
      const group = item[groupKey];
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });

    const labels = [...new Set(data.map(item => item[xKey]))].sort();
    const colors = getChartColorPalette(Object.keys(groups).length);

    const datasets = Object.keys(groups).map((group, index) => {
      const groupData = groups[group];
      const dataPoints = labels.map(label => {
        const item = groupData.find(d => d[xKey] === label);
        return item ? item[yKey] : 0;
      });

      return {
        label: group,
        data: dataPoints,
        backgroundColor: colors[index],
        borderColor: colors[index],
        fill: false
      };
    });

    return { labels, datasets };
  } else {
    // Simple x-y mapping
    const labels = data.map(item => item[xKey]);
    const values = data.map(item => item[yKey]);

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: getChartColorPalette(values.length),
        borderColor: tokens.colors.primary[600]
      }]
    };
  }
};

export const createHistogramData = (data, field, bins = 10) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] };
  }

  const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val));
  
  if (values.length === 0) {
    return { labels: [], datasets: [] };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;

  const binCounts = new Array(bins).fill(0);
  const binLabels = [];

  for (let i = 0; i < bins; i++) {
    const start = min + i * binSize;
    const end = start + binSize;
    binLabels.push(`${start.toFixed(1)}-${end.toFixed(1)}`);
  }

  values.forEach(value => {
    let binIndex = Math.floor((value - min) / binSize);
    if (binIndex >= bins) binIndex = bins - 1; // Handle edge case for max value
    binCounts[binIndex]++;
  });

  return {
    labels: binLabels,
    datasets: [{
      data: binCounts,
      backgroundColor: getGradientColor(tokens.colors.primary[600], 0.6),
      borderColor: tokens.colors.primary[600],
      borderWidth: 1
    }]
  };
};

// Chart configuration utilities
export const getDefaultChartOptions = (type) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 12
          },
          color: tokens.colors.neutral[700]
        }
      },
      tooltip: {
        backgroundColor: tokens.colors.neutral[800],
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: tokens.colors.neutral[600],
        borderWidth: 1,
        cornerRadius: parseInt(tokens.borderRadius.md),
        titleFont: {
          family: tokens.typography.fontFamily.primary,
          size: 14,
          weight: tokens.typography.fontWeight.semibold
        },
        bodyFont: {
          family: tokens.typography.fontFamily.primary,
          size: 13
        },
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          color: tokens.colors.neutral[200]
        },
        ticks: {
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 11
          },
          color: tokens.colors.neutral[600]
        }
      },
      y: {
        grid: {
          color: tokens.colors.neutral[200]
        },
        ticks: {
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 11
          },
          color: tokens.colors.neutral[600]
        }
      }
    }
  };

  // Type-specific customizations
  switch (type) {
    case 'line':
      return {
        ...baseOptions,
        elements: {
          line: {
            tension: 0.3
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      };
    
    case 'bar':
      return {
        ...baseOptions,
        elements: {
          bar: {
            borderRadius: parseInt(tokens.borderRadius.sm)
          }
        }
      };
    
    case 'pie':
    case 'doughnut':
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              font: {
                family: tokens.typography.fontFamily.primary,
                size: 12
              },
              color: tokens.colors.neutral[700]
            }
          },
          tooltip: baseOptions.plugins.tooltip
        }
      };
    
    default:
      return baseOptions;
  }
};

// Statistical utilities for charts
export const calculateTrendLine = (data, xKey, yKey) => {
  const points = data.map(item => ({
    x: parseFloat(item[xKey]),
    y: parseFloat(item[yKey])
  })).filter(point => !isNaN(point.x) && !isNaN(point.y));

  if (points.length < 2) return null;

  const n = points.length;
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumX2 = points.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));

  return {
    slope,
    intercept,
    points: [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ]
  };
};

export const formatChartValue = (value, type = 'number', decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  switch (type) {
    case 'percentage':
      return `${(value * 100).toFixed(decimals)}%`;
    case 'currency':
      return `$${value.toFixed(2)}`;
    case 'integer':
      return Math.round(value).toString();
    case 'number':
    default:
      return value.toFixed(decimals);
  }
};

// Accessibility utilities
export const generateChartAriaLabel = (title, type, dataLength) => {
  return `${title || 'Chart'} - ${type} chart with ${dataLength} data points`;
};

export const generateDataTableFromChart = (chartData) => {
  const { labels, datasets } = chartData;
  
  if (!labels || !datasets) return null;

  const headers = ['Label', ...datasets.map(dataset => dataset.label || 'Data')];
  const rows = labels.map((label, index) => [
    label,
    ...datasets.map(dataset => dataset.data[index] || 'N/A')
  ]);

  return { headers, rows };
};
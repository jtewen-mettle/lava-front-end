import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import BaseChart from './BaseChart';
import { tokens } from '../../../core/theme';

const ROCChart = ({
  rocData,
  title = 'ROC Curve',
  subtitle,
  height = '400px',
  showDiagonal = true,
  showOptimalThreshold = true,
  onDownload,
  ...props
}) => {
  const chartData = useMemo(() => {
    if (!rocData || !rocData.points) {
      return { datasets: [] };
    }

    const datasets = [];

    // Random classifier line (diagonal)
    if (showDiagonal) {
      datasets.push({
        label: 'Random Classifier',
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 1 }
        ],
        borderColor: tokens.colors.neutral[400],
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        showLine: true
      });
    }

    // ROC curve
    const rocPoints = rocData.points.map(point => ({
      x: point.fpr,
      y: point.tpr,
      threshold: point.threshold
    }));

    datasets.push({
      label: `ROC Curve (AUC = ${rocData.auc.toFixed(3)})`,
      data: rocPoints,
      borderColor: tokens.colors.primary[600],
      backgroundColor: tokens.colors.primary[100] + '40',
      borderWidth: 3,
      pointRadius: 2,
      pointHoverRadius: 6,
      pointBackgroundColor: tokens.colors.primary[600],
      pointBorderColor: tokens.colors.background.primary,
      pointBorderWidth: 2,
      fill: 'origin',
      tension: 0
    });

    // Optimal threshold point (closest to top-left corner)
    if (showOptimalThreshold && rocData.points.length > 0) {
      const optimalPoint = rocData.points.reduce((best, point) => {
        const distance = Math.sqrt(Math.pow(point.fpr, 2) + Math.pow(1 - point.tpr, 2));
        const bestDistance = Math.sqrt(Math.pow(best.fpr, 2) + Math.pow(1 - best.tpr, 2));
        return distance < bestDistance ? point : best;
      });

      datasets.push({
        label: `Optimal Threshold (${optimalPoint.threshold.toFixed(3)})`,
        data: [{ x: optimalPoint.fpr, y: optimalPoint.tpr }],
        backgroundColor: tokens.colors.semantic.warning,
        borderColor: tokens.colors.background.primary,
        borderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false
      });
    }

    return { datasets };
  }, [rocData, showDiagonal, showOptimalThreshold]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'False Positive Rate (1 - Specificity)',
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 14,
            weight: tokens.typography.fontWeight.semibold
          },
          color: tokens.colors.neutral[700]
        },
        grid: {
          color: tokens.colors.neutral[200]
        },
        ticks: {
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 11
          },
          color: tokens.colors.neutral[600],
          callback: function(value) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'True Positive Rate (Sensitivity)',
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 14,
            weight: tokens.typography.fontWeight.semibold
          },
          color: tokens.colors.neutral[700]
        },
        grid: {
          color: tokens.colors.neutral[200]
        },
        ticks: {
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 11
          },
          color: tokens.colors.neutral[600],
          callback: function(value) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
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
        padding: 12,
        callbacks: {
          title: function(context) {
            const dataPoint = context[0].dataset.data[context[0].dataIndex];
            if (dataPoint.threshold !== undefined) {
              return `Threshold: ${dataPoint.threshold.toFixed(3)}`;
            }
            return 'ROC Point';
          },
          label: function(context) {
            const point = context.parsed;
            return [
              `TPR (Sensitivity): ${(point.y * 100).toFixed(1)}%`,
              `FPR (1-Specificity): ${(point.x * 100).toFixed(1)}%`,
              `Specificity: ${((1 - point.x) * 100).toFixed(1)}%`
            ];
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'point'
    },
    elements: {
      point: {
        hoverRadius: 6
      }
    }
  }), []);

  const enhancedSubtitle = useMemo(() => {
    if (!rocData) return subtitle;

    const aucText = `AUC = ${rocData.auc.toFixed(3)}`;
    const interpretation = rocData.auc >= 0.9 ? 'Excellent' :
                          rocData.auc >= 0.8 ? 'Good' :
                          rocData.auc >= 0.7 ? 'Fair' :
                          rocData.auc >= 0.6 ? 'Poor' : 'Fail';

    const parts = [aucText, `(${interpretation})`];
    
    if (subtitle) {
      parts.unshift(subtitle);
    }

    return parts.join(' ');
  }, [rocData, subtitle]);

  const downloadOptions = [
    { format: 'png', label: 'Download as PNG' },
    { format: 'jpg', label: 'Download as JPG' },
    { format: 'svg', label: 'Download as SVG' },
    { format: 'pdf', label: 'Download as PDF' }
  ];

  return (
    <BaseChart
      title={title}
      subtitle={enhancedSubtitle}
      height={height}
      downloadOptions={downloadOptions}
      onDownload={onDownload}
      {...props}
    >
      <Line data={chartData} options={chartOptions} />
    </BaseChart>
  );
};

export default ROCChart;
import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import BaseChart from './BaseChart';
import { tokens } from '../../../core/theme';

const CalibrationChart = ({
  calibrationData,
  title = 'Calibration Plot',
  subtitle = 'Perfect calibration is represented by the diagonal line',
  height = '400px',
  showPerfectCalibration = true,
  showConfidenceInterval = false,
  onDownload,
  ...props
}) => {
  const chartData = useMemo(() => {
    if (!calibrationData || !calibrationData.points) {
      return { datasets: [] };
    }

    const datasets = [];

    // Perfect calibration line (diagonal)
    if (showPerfectCalibration) {
      datasets.push({
        label: 'Perfect Calibration',
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 1 }
        ],
        borderColor: tokens.colors.neutral[400],
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
        fill: false,
        type: 'line'
      });
    }

    // Calibration points
    const calibrationPoints = calibrationData.points.map(point => ({
      x: point.meanPredicted,
      y: point.meanActual,
      count: point.count
    }));

    datasets.push({
      label: 'Model Calibration',
      data: calibrationPoints,
      backgroundColor: tokens.colors.primary[600],
      borderColor: tokens.colors.primary[700],
      borderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBorderWidth: 2,
      pointBorderColor: tokens.colors.background.primary
    });

    return { datasets };
  }, [calibrationData, showPerfectCalibration]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Mean Predicted Probability',
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
          text: 'Observed Frequency',
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
        position: 'top',
        align: 'end',
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
            const point = context[0];
            return `Bin ${point.dataIndex + 1}`;
          },
          label: function(context) {
            const point = context.parsed;
            const dataPoint = context.dataset.data[context.dataIndex];
            const lines = [
              `Predicted: ${(point.x * 100).toFixed(1)}%`,
              `Observed: ${(point.y * 100).toFixed(1)}%`
            ];
            
            if (dataPoint.count) {
              lines.push(`Sample size: ${dataPoint.count}`);
            }
            
            return lines;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'point'
    }
  }), []);

  const downloadOptions = [
    { format: 'png', label: 'Download as PNG' },
    { format: 'jpg', label: 'Download as JPG' },
    { format: 'svg', label: 'Download as SVG' },
    { format: 'pdf', label: 'Download as PDF' }
  ];

  // Add calibration metrics to subtitle if available
  const enhancedSubtitle = useMemo(() => {
    if (!calibrationData) return subtitle;

    const parts = [subtitle];
    
    if (calibrationData.brier !== null && calibrationData.brier !== undefined) {
      parts.push(`Brier Score: ${calibrationData.brier.toFixed(4)}`);
    }
    
    if (calibrationData.hosmerLemeshow !== null && calibrationData.hosmerLemeshow !== undefined) {
      parts.push(`Hosmer-Lemeshow: ${calibrationData.hosmerLemeshow.toFixed(2)}`);
    }

    return parts.join(' | ');
  }, [calibrationData, subtitle]);

  return (
    <BaseChart
      title={title}
      subtitle={enhancedSubtitle}
      height={height}
      downloadOptions={downloadOptions}
      onDownload={onDownload}
      {...props}
    >
      <Scatter data={chartData} options={chartOptions} />
    </BaseChart>
  );
};

export default CalibrationChart;
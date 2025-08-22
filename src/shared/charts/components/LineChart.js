import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import BaseChart from './BaseChart';
import { tokens } from '../../../core/theme';

const LineChart = ({
  data,
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  color = tokens.colors.primary[600],
  backgroundColor = tokens.colors.primary[100],
  tension = 0.3,
  showPoints = true,
  pointRadius = 4,
  height = '400px',
  responsive = true,
  maintainAspectRatio = false,
  onDownload,
  ...props
}) => {
  const chartOptions = useMemo(() => ({
    responsive,
    maintainAspectRatio,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
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
        display: true,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 12,
            weight: tokens.typography.fontWeight.medium
          },
          color: tokens.colors.neutral[600]
        },
        grid: {
          color: tokens.colors.neutral[200],
          lineWidth: 1
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
        display: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 12,
            weight: tokens.typography.fontWeight.medium
          },
          color: tokens.colors.neutral[600]
        },
        grid: {
          color: tokens.colors.neutral[200],
          lineWidth: 1
        },
        ticks: {
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 11
          },
          color: tokens.colors.neutral[600]
        }
      }
    },
    elements: {
      line: {
        tension,
        borderWidth: 2
      },
      point: {
        radius: showPoints ? pointRadius : 0,
        hoverRadius: pointRadius + 2,
        borderWidth: 2
      }
    }
  }), [xAxisLabel, yAxisLabel, tension, showPoints, pointRadius, responsive, maintainAspectRatio]);

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data.datasets)) {
      return {
        labels: [],
        datasets: []
      };
    }

    return {
      labels: data.labels || [],
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: dataset.borderColor || color,
        backgroundColor: dataset.backgroundColor || backgroundColor,
        fill: dataset.fill !== undefined ? dataset.fill : false,
        tension: dataset.tension !== undefined ? dataset.tension : tension,
        pointRadius: dataset.pointRadius !== undefined ? dataset.pointRadius : (showPoints ? pointRadius : 0),
        pointBackgroundColor: dataset.pointBackgroundColor || color,
        pointBorderColor: dataset.pointBorderColor || '#ffffff',
        pointBorderWidth: dataset.pointBorderWidth || 2,
        pointHoverRadius: dataset.pointHoverRadius || pointRadius + 2,
        pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || color,
        pointHoverBorderColor: dataset.pointHoverBorderColor || '#ffffff'
      }))
    };
  }, [data, color, backgroundColor, tension, showPoints, pointRadius]);

  const downloadOptions = [
    { format: 'png', label: 'Download as PNG' },
    { format: 'jpg', label: 'Download as JPG' },
    { format: 'svg', label: 'Download as SVG' },
    { format: 'pdf', label: 'Download as PDF' }
  ];

  return (
    <BaseChart
      title={title}
      subtitle={subtitle}
      height={height}
      downloadOptions={downloadOptions}
      onDownload={onDownload}
      {...props}
    >
      <Line data={chartData} options={chartOptions} />
    </BaseChart>
  );
};

export default LineChart;
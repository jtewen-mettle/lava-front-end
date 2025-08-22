import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import BaseChart from './BaseChart';
import { tokens } from '../../../core/theme';

const BarChart = ({
  data,
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  color = tokens.colors.primary[600],
  backgroundColor = tokens.colors.primary[100],
  horizontal = false,
  stacked = false,
  height = '400px',
  responsive = true,
  maintainAspectRatio = false,
  onDownload,
  ...props
}) => {
  const chartOptions = useMemo(() => ({
    responsive,
    maintainAspectRatio,
    indexAxis: horizontal ? 'y' : 'x',
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        display: true,
        stacked,
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
        stacked,
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
    plugins: {
      legend: {
        display: data?.datasets?.length > 1,
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
        padding: 12
      }
    }
  }), [horizontal, stacked, xAxisLabel, yAxisLabel, responsive, maintainAspectRatio, data?.datasets?.length]);

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data.datasets)) {
      return {
        labels: [],
        datasets: []
      };
    }

    const colorPalette = [
      tokens.colors.primary[600],
      tokens.colors.primary[500],
      tokens.colors.primary[700],
      tokens.colors.secondary[500],
      tokens.colors.neutral[500]
    ];

    return {
      labels: data.labels || [],
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || colorPalette[index % colorPalette.length],
        borderColor: dataset.borderColor || colorPalette[index % colorPalette.length],
        borderWidth: dataset.borderWidth || 0,
        borderRadius: dataset.borderRadius || parseInt(tokens.borderRadius.sm),
        borderSkipped: false
      }))
    };
  }, [data]);

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
      <Bar data={chartData} options={chartOptions} />
    </BaseChart>
  );
};

export default BarChart;
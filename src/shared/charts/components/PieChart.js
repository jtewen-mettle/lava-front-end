import React, { useMemo } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import BaseChart from './BaseChart';
import { tokens } from '../../../core/theme';

const PieChart = ({
  data,
  title,
  subtitle,
  variant = 'doughnut', // 'doughnut' or 'pie'
  centerText,
  showLegend = true,
  legendPosition = 'right',
  height = '400px',
  responsive = true,
  maintainAspectRatio = false,
  onDownload,
  ...props
}) => {
  const ChartComponent = variant === 'doughnut' ? Doughnut : Pie;

  const chartOptions = useMemo(() => ({
    responsive,
    maintainAspectRatio,
    cutout: variant === 'doughnut' ? '60%' : '0%',
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: tokens.typography.fontFamily.primary,
            size: 12
          },
          color: tokens.colors.neutral[700],
          generateLabels: (chart) => {
            const original = Chart.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            // Add percentage to labels
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            
            return labels.map((label, index) => {
              const value = dataset.data[index];
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return {
                ...label,
                text: `${label.text} (${percentage}%)`
              };
            });
          }
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
          label: (context) => {
            const dataset = context.dataset;
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            const value = dataset.data[context.dataIndex];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: tokens.colors.background.primary,
        hoverBorderWidth: 3
      }
    }
  }), [variant, showLegend, legendPosition, responsive, maintainAspectRatio]);

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
      tokens.colors.primary[400],
      tokens.colors.primary[700],
      tokens.colors.secondary[500],
      tokens.colors.semantic.success,
      tokens.colors.semantic.warning,
      tokens.colors.semantic.info,
      tokens.colors.neutral[500],
      tokens.colors.neutral[400]
    ];

    return {
      labels: data.labels || [],
      datasets: data.datasets.map((dataset, datasetIndex) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || data.labels.map((_, index) => 
          colorPalette[index % colorPalette.length]
        ),
        borderColor: dataset.borderColor || tokens.colors.background.primary,
        borderWidth: dataset.borderWidth || 2,
        hoverBackgroundColor: dataset.hoverBackgroundColor || data.labels.map((_, index) => {
          const baseColor = colorPalette[index % colorPalette.length];
          return baseColor + 'dd'; // Add transparency
        }),
        hoverBorderWidth: dataset.hoverBorderWidth || 3
      }))
    };
  }, [data]);

  // Center text plugin for doughnut charts
  const centerTextPlugin = useMemo(() => {
    if (variant !== 'doughnut' || !centerText) return null;

    return {
      id: 'centerText',
      beforeDraw: (chart) => {
        if (!centerText) return;
        
        const { ctx, chartArea: { width, height } } = chart;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (typeof centerText === 'string') {
          ctx.font = `${tokens.typography.fontWeight.bold} 24px ${tokens.typography.fontFamily.primary}`;
          ctx.fillStyle = tokens.colors.neutral[800];
          ctx.fillText(centerText, centerX, centerY);
        } else {
          const { primary, secondary } = centerText;
          
          if (primary) {
            ctx.font = `${tokens.typography.fontWeight.bold} 24px ${tokens.typography.fontFamily.primary}`;
            ctx.fillStyle = tokens.colors.neutral[800];
            ctx.fillText(primary, centerX, centerY - 12);
          }
          
          if (secondary) {
            ctx.font = `${tokens.typography.fontWeight.medium} 14px ${tokens.typography.fontFamily.primary}`;
            ctx.fillStyle = tokens.colors.neutral[600];
            ctx.fillText(secondary, centerX, centerY + 12);
          }
        }
        
        ctx.restore();
      }
    };
  }, [variant, centerText]);

  const plugins = useMemo(() => {
    const pluginsList = [];
    if (centerTextPlugin) {
      pluginsList.push(centerTextPlugin);
    }
    return pluginsList;
  }, [centerTextPlugin]);

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
      <ChartComponent 
        data={chartData} 
        options={chartOptions}
        plugins={plugins}
      />
    </BaseChart>
  );
};

export default PieChart;
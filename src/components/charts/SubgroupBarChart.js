import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer
} from 'recharts';

function transformSubgroupMetricsData(rawData) {
  console.log(rawData);
  const excludeMetrics = ['True Positive', 'True Negative', 'False Positive', 'False Negative', 'ROC_CURVE', 'Confusion Matrix'];
  const metrics = Object.keys(rawData[0]).filter(key => key !== 'Subgroup' && !excludeMetrics.includes(key));

  const groupedMetrics = [
    { group: 'Performance Metrics', metrics: ['Accuracy', 'Recall', 'Precision', 'F1 Score','AUROC'] },
    { group: 'Rate Metrics', metrics: ['True Positive Rate', 'False Positive Rate', 'True Negative Rate', 'False Negative Rate'] },
  ];

  const chartData = [];

  groupedMetrics.forEach(({ group, metrics }) => {
    metrics.forEach(metric => {
      const row = { Metric: metric };
      rawData.forEach(item => {
        row[item.Subgroup] = item[metric];
      });
      chartData.push(row);
    });

    chartData.push({ Metric: `${group} Separator`, isSeparator: true });
  });

  return chartData;
}

const SubgroupBarChart = ({ rawData, selectedFeature }) => {
  if (!rawData || rawData.length === 0) return null;

  const chartData = transformSubgroupMetricsData(rawData);
  const subgroups = [...new Set(rawData.map(d => d.Subgroup))];

  // Define color schemes for different selectedFeatures
  const colorSchemes = {
    Gender: ["#FF5733", "#33C1FF"], 
    Race: ["#8E44AD", "#27AE60", "#F1C40F", "#E74C3C"],
    Default: ["#8884d8", "#82ca9d", "#ffc658"], 
  };

  // Get the appropriate color scheme or fallback to Default
  const colors = colorSchemes[selectedFeature] || colorSchemes.Default;

  return (
    <div style={{ width: '100%' }}>
      <h3 align="left">Subgroup Analysis across {selectedFeature}</h3>
      <ResponsiveContainer width="90%" height={500}>
        <BarChart
          data={chartData.map(d => {
            const updated = { ...d };
            subgroups.forEach(sg => {
              if (!d.isSeparator && !isNaN(d[sg])) {
                updated[sg] = d[sg] * 100;
              }
            });
            return updated;
          })}
          margin={{ top: 60, right: 30, left: 20, bottom: 100 }}
          style={{ fontSize: '12px' }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Metric"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            tickFormatter={(value) => (value.includes('Separator') ? '' : value)} 
          />
          <YAxis domain={[0, 120]} ticks={[0, 20, 40, 60, 80, 100, 120]} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Legend
            verticalAlign="top"
            layout="horizontal"
            align="right"
            wrapperStyle={{ marginTop: '-30px' }}
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
          {subgroups.map((subgroup, i) => (
            <Bar
              key={subgroup}
              dataKey={subgroup}
              fill={colors[i % colors.length]}
              isAnimationActive={!chartData.some((d) => d.isSeparator)} 
            >
              <LabelList
                dataKey={subgroup}
                position="top"
                style={{ fontSize: '10px' }}
                formatter={(value) =>
                  value && !isNaN(value) ? `${value.toFixed(0)}%` : 'N/A'
                }
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default SubgroupBarChart;


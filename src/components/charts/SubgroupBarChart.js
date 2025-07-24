import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer
} from 'recharts';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';
import { downloadChart as downloadChartUtil } from './ChartDownloadUtils';

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

const SubgroupBarChart = ({ rawData, selectedFeature, title }) => {
  const [openModal, setOpenModal] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const chartRef = useRef(null);

  if (!rawData || rawData.length === 0) return null;

  const chartData = transformSubgroupMetricsData(rawData);
  const subgroups = [...new Set(rawData.map(d => d.Subgroup))];

  const handleEnlargeChart = () => {
    setOpenModal(true);
  };

  const handleDownloadClick = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadMenuAnchor(null);
  };

  const downloadChart = (format) => {
    if (chartRef.current) {
      const chartContainer = chartRef.current.container;
      
      // Create tooltip data with subgroup analysis summary
      const tooltipData = {
        label: `${selectedFeature} Subgroup Analysis`,
        value: `Groups: ${subgroups.join(', ')} | Metrics: Accuracy, Recall, Precision, F1 Score, AUROC`
      };

      // Create legend data using stable color mapping
      const legendData = subgroups.map((group) => ({
        label: group,
        color: colorMap[group]
      }));
      
      downloadChartUtil({
        chartElement: chartContainer,
        format,
        fileName: `subgroup_${selectedFeature}_chart`,
        title: `Subgroup Analysis across ${selectedFeature}`,
        chartType: 'svg',
        tooltipData,
        legendData
      });
    }
    handleDownloadClose();
  };

  // Define color schemes for different selectedFeatures
  const colorSchemes = {
    Gender: ["rgb(136, 132, 216)", "rgb(130, 202, 157)"], // Male: purple-blue, Female: green
    Race: [
      "rgb(255, 120, 150)", // Vibrant pink
      "rgb(100, 180, 255)", // Vibrant blue
      "rgb(200, 100, 200)", // Vibrant orchid
      "rgb(255, 180, 120)", // Vibrant peach
      "rgb(100, 220, 100)", // Vibrant green
      "rgb(255, 240, 120)", // Vibrant yellow
      "rgb(255, 140, 140)", // Vibrant coral
      "rgb(120, 160, 255)", // Vibrant steel blue
      "rgb(180, 150, 255)", // Vibrant lavender
      "rgb(150, 220, 255)"  // Vibrant azure
    ],
    Default: ["#8884d8", "#82ca9d", "#ffc658"], 
  };

  // Create stable color mapping based on subgroup names instead of array index
  const createStableColorMapping = (subgroups, selectedFeature) => {
    const colorPalette = colorSchemes[selectedFeature] || colorSchemes.Default;
    const colorMap = {};

    if (selectedFeature === 'Gender') {
      // Stable mapping for gender subgroups
      const genderOrder = ['Male', 'Female'];
      subgroups.forEach(subgroup => {
        const index = genderOrder.indexOf(subgroup);
        colorMap[subgroup] = colorPalette[index !== -1 ? index : 0];
      });
    } else if (selectedFeature === 'Race') {
      // Stable mapping for race subgroups - use alphabetical order for consistency
      // This ensures each race gets the same color as in Race/Ethnicity Distribution
      const allRaces = [...new Set(subgroups)].sort();
      subgroups.forEach(subgroup => {
        const index = allRaces.indexOf(subgroup);
        colorMap[subgroup] = colorPalette[index % colorPalette.length];
      });
    } else {
      // Default mapping for other features
      subgroups.forEach((subgroup, index) => {
        colorMap[subgroup] = colorPalette[index % colorPalette.length];
      });
    }

    return colorMap;
  };

  // Get stable color mapping
  const colorMap = createStableColorMapping(subgroups, selectedFeature);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <h3 style={{ margin: 0, textAlign: 'left', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Subgroup Analysis across {selectedFeature}</h3>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleEnlargeChart}
              title="Enlarge Chart"
              sx={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e3f2fd',
                borderRadius: '4px',
                marginRight: '6px',
                minWidth: '28px',
                minHeight: '28px',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                }
              }}
            >
              <ZoomIn sx={{ fontSize: 16, color: '#1976d2' }} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleDownloadClick}
              title="Download Chart"
              sx={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e3f2fd',
                borderRadius: '4px',
                minWidth: '28px',
                minHeight: '28px',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                }
              }}
            >
              <Download sx={{ fontSize: 16, color: '#1976d2' }} />
            </IconButton>
          </Box>
        </Box>
      )}
      
      {!title && (
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleEnlargeChart}
              title="Enlarge Chart"
              sx={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e3f2fd',
                borderRadius: '4px',
                marginRight: '6px',
                minWidth: '28px',
                minHeight: '28px',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                }
              }}
            >
              <ZoomIn sx={{ fontSize: 16, color: '#1976d2' }} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleDownloadClick}
              title="Download Chart"
              sx={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e3f2fd',
                borderRadius: '4px',
                minWidth: '28px',
                minHeight: '28px',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                }
              }}
            >
              <Download sx={{ fontSize: 16, color: '#1976d2' }} />
            </IconButton>
          </Box>
        </Box>
      )}
      
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            ref={chartRef}
            data={chartData.map(d => {
              const updated = { ...d };
              subgroups.forEach(sg => {
                if (!d.isSeparator && !isNaN(d[sg])) {
                  updated[sg] = d[sg] * 100;
                }
              });
              return updated;
            })}
            margin={{ top: 30, right: 20, left: 10, bottom: 20 }}
            style={{ fontSize: '10px' }}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Metric"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
            tickFormatter={(value) => (value.includes('Separator') ? '' : value)} 
          />
          <YAxis domain={[0, 120]} ticks={[0, 20, 40, 60, 80, 100, 120]} />
          <Tooltip 
            formatter={(value) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              borderColor: '#333',
              borderWidth: 1,
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend
            verticalAlign="top"
            layout="horizontal"
            align="right"
            wrapperStyle={{ marginTop: '-20px', fontSize: '9px' }}
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
          {subgroups.map((subgroup) => (
            <Bar
              key={subgroup}
              dataKey={subgroup}
              fill={colorMap[subgroup]}
              isAnimationActive={!chartData.some((d) => d.isSeparator)} 
            >
              <LabelList
                dataKey={subgroup}
                position="top"
                angle={selectedFeature === 'Gender' ? 0 : -90}
                offset={selectedFeature === 'Gender' ? 6 : 12}
                style={{ 
                  fontSize: selectedFeature === 'Gender' ? '10px' : '8px', 
                  fontWeight: 'bold',
                  fill: '#333'
                }}
                formatter={(value) =>
                  value && !isNaN(value) ? `${value.toFixed(0)}%` : 'N/A'
                }
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      </div>

      {/* Modal for enlarged chart */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span>Subgroup Analysis across {selectedFeature}</span>
            <Box>
              <IconButton 
                size="small" 
                onClick={handleDownloadClick}
                title="Download Chart"
                sx={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e3f2fd',
                  borderRadius: '4px',
                  marginRight: '6px',
                  minWidth: '28px',
                  minHeight: '28px',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #bbdefb',
                    boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                  }
                }}
              >
                <Download sx={{ fontSize: 16, color: '#1976d2' }} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setOpenModal(false)}
                title="Close"
                sx={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ffebee',
                  borderRadius: '4px',
                  minWidth: '28px',
                  minHeight: '28px',
                  '&:hover': {
                    backgroundColor: '#ffebee',
                    border: '1px solid #ffcdd2',
                    boxShadow: '0 2px 4px rgba(244,67,54,0.15)'
                  }
                }}
              >
                <span style={{ fontSize: '16px', color: '#f44336', fontWeight: 'normal' }}>✕</span>
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box style={{ height: '500px', width: '100%', padding: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
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
                margin={{ top: 40, right: 40, left: 40, bottom: 80 }}
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
                <Tooltip 
                  formatter={(value) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend
                  verticalAlign="top"
                  layout="horizontal"
                  align="right"
                  wrapperStyle={{ marginTop: '-30px' }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                {subgroups.map((subgroup) => (
                  <Bar
                    key={subgroup}
                    dataKey={subgroup}
                    fill={colorMap[subgroup]}
                  >
                    <LabelList
                      dataKey={subgroup}
                      position="top"
                      angle={selectedFeature === 'Gender' ? 0 : -90}
                      offset={selectedFeature === 'Gender' ? 8 : 15}
                      style={{ 
                        fontSize: selectedFeature === 'Gender' ? '12px' : '9px', 
                        fontWeight: 'bold',
                        fill: '#333'
                      }}
                      formatter={(value) =>
                        value && !isNaN(value) ? `${value.toFixed(0)}%` : 'N/A'
                      }
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadMenuAnchor}
        open={Boolean(downloadMenuAnchor)}
        onClose={handleDownloadClose}
      >
        <MenuItem onClick={() => downloadChart('png')}>Download as PNG</MenuItem>
        <MenuItem onClick={() => downloadChart('jpg')}>Download as JPG</MenuItem>
        <MenuItem onClick={() => downloadChart('pdf')}>Download as PDF</MenuItem>
        <MenuItem onClick={() => downloadChart('svg')}>Download as SVG</MenuItem>
      </Menu>
    </div>
  );
};

export default SubgroupBarChart;


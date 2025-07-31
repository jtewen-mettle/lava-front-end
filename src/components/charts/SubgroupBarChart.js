import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer
} from 'recharts';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';
import { downloadChart as downloadChartUtil } from './ChartDownloadUtils';
import HelpIcon from '../HelpIcon';

function transformSubgroupMetricsData(rawData) {
  console.log(rawData);
  const excludeMetrics = ['True Positive', 'True Negative', 'False Positive', 'False Negative', 'ROC_CURVE', 'Confusion Matrix'];
  const metrics = Object.keys(rawData[0]).filter(key => key !== 'Subgroup' && !excludeMetrics.includes(key));

  const groupedMetrics = [
    { group: 'Performance Metrics', metrics: ['Accuracy', 'Sensitivity', 'Postive Predictive Value', 'F1 Score','AUROC'] },
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

const SubgroupBarChart = ({ rawData, selectedFeature, title, allSubgroupsData, selectedValue, onValueChange, options }) => {
  const [openModal, setOpenModal] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const [enlargedViewFilter, setEnlargedViewFilter] = useState('');
  const chartRef = useRef(null);

  if (!rawData || rawData.length === 0) return null;

  const chartData = transformSubgroupMetricsData(rawData);
  const subgroups = [...new Set(rawData.map(d => d.Subgroup))];
  
  // Use allSubgroupsData to get all possible subgroups for stable color mapping
  const allSubgroups = allSubgroupsData ? [...new Set(allSubgroupsData.map(d => d.Subgroup))] : subgroups;

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
  const createStableColorMapping = (allSubgroups, selectedFeature) => {
    const colorPalette = colorSchemes[selectedFeature] || colorSchemes.Default;
    const colorMap = {};

    if (selectedFeature === 'Gender') {
      // Stable mapping for gender subgroups
      const genderOrder = ['Male', 'Female'];
      allSubgroups.forEach(subgroup => {
        const index = genderOrder.indexOf(subgroup);
        colorMap[subgroup] = colorPalette[index !== -1 ? index : 0];
      });
    } else if (selectedFeature === 'Race') {
      // Stable mapping for race subgroups - use alphabetical order for consistency
      // This ensures each race gets the same color as in Race/Ethnicity Distribution
      const allRaces = [...new Set(allSubgroups)].sort();
      allSubgroups.forEach(subgroup => {
        const index = allRaces.indexOf(subgroup);
        colorMap[subgroup] = colorPalette[index % colorPalette.length];
      });
    } else {
      // Default mapping for other features
      allSubgroups.forEach((subgroup, index) => {
        colorMap[subgroup] = colorPalette[index % colorPalette.length];
      });
    }

    return colorMap;
  };

  // Get stable color mapping using all possible subgroups, not just filtered ones
  const colorMap = createStableColorMapping(allSubgroups, selectedFeature);
  
  // Create options for the enlarged view dropdown
  const getFilterOptions = () => {
    if (selectedFeature === 'Gender') {
      return ['Male', 'Female'];
    } else if (selectedFeature === 'Race') {
      return allSubgroups.sort();
    }
    return allSubgroups;
  };
  
  // Filter data for enlarged view based on selected filter
  const getEnlargedViewData = () => {
    if (!enlargedViewFilter || !allSubgroupsData) return allSubgroupsData;
    
    if (selectedFeature === 'Gender') {
      return allSubgroupsData.filter(item => 
        item.Subgroup.toLowerCase() === enlargedViewFilter.toLowerCase()
      );
    } else if (selectedFeature === 'Race') {
      return allSubgroupsData.filter(item => item.Subgroup === enlargedViewFilter);
    }
    
    return allSubgroupsData.filter(item => item.Subgroup === enlargedViewFilter);
  };
  
  const enlargedViewData = getEnlargedViewData();
  const enlargedChartData = enlargedViewData ? transformSubgroupMetricsData(enlargedViewData) : chartData;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
            {title}
          </Typography>
          <Box>
            <HelpIcon 
              tooltip="Learn more about subgroup analysis in the Glossary" 
              section={
                title && title.toLowerCase().includes('gender') ? 'gender-performance' :
                title && title.toLowerCase().includes('race') ? 'race-performance' :
                title && title.toLowerCase().includes('age') ? 'age-group-performance' :
                'subgroup-analysis'
              } 
            />
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
      
      {title && selectedValue !== undefined && onValueChange && options && (
        <FormControl sx={{ marginBottom: 2, width:"80%" }}>
          <InputLabel>{selectedFeature}</InputLabel>
          <Select
            value={selectedValue}
            label={selectedFeature}
            onChange={e => onValueChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {options.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
      {title && (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          {subgroups.map((subgroup) => (
            <Box key={subgroup} display="flex" alignItems="center" gap={0.5}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: colorMap[subgroup],
                  borderRadius: '2px'
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', color: '#333' }}>
                {subgroup.charAt(0).toUpperCase() + subgroup.slice(1)}
              </span>
            </Box>
          ))}
        </Box>
      )}
      
      {!title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          {/* Custom Legend */}
          <Box display="flex" alignItems="center" gap={1}>
            {subgroups.map((subgroup) => (
              <Box key={subgroup} display="flex" alignItems="center" gap={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: colorMap[subgroup],
                    borderRadius: '2px'
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', color: '#333' }}>
                  {subgroup.charAt(0).toUpperCase() + subgroup.slice(1)}
                </span>
              </Box>
            ))}
          </Box>
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
            margin={{ top: 20, right: 20, left: 10, bottom: 80 }}
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
            tick={{ 
              fontSize: 12, 
              fontWeight: 'bold', 
              fontFamily: 'Arial, sans-serif',
              fill: '#333'
            }}
            label={{ 
              value: 'Performance Metrics', 
              position: 'insideBottom', 
              offset: -50,
              style: { 
                textAnchor: 'middle', 
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                fill: '#333'
              } 
            }}
          />
          <YAxis 
            domain={[0, 120]} 
            ticks={[0, 20, 40, 60, 80, 100, 120]}
            tick={{ 
              fontSize: 12, 
              fontWeight: 'bold', 
              fontFamily: 'Arial, sans-serif',
              fill: '#333'
            }}
            label={{ 
              value: 'Percentage (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { 
                textAnchor: 'middle', 
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                fill: '#333'
              } 
            }}
          />
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span>Subgroup Analysis across {selectedFeature}</span>
            <Box display="flex" alignItems="center" gap={2}>
              {/* Custom Legend for Modal */}
              <Box display="flex" alignItems="center" gap={1}>
                {(enlargedViewData ? [...new Set(enlargedViewData.map(item => item.Subgroup))] : subgroups).map((subgroup) => (
                  <Box key={subgroup} display="flex" alignItems="center" gap={0.5}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: colorMap[subgroup],
                        borderRadius: '2px'
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', color: '#333' }}>
                      {subgroup.charAt(0).toUpperCase() + subgroup.slice(1)}
                    </span>
                  </Box>
                ))}
              </Box>
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
          </Box>
        </DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Box sx={{ mb: 2, p: 1 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>{selectedFeature}</InputLabel>
              <Select
                value={enlargedViewFilter}
                label={selectedFeature}
                onChange={(e) => setEnlargedViewFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {getFilterOptions().map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box style={{ height: '600px', width: '100%', padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enlargedChartData.map(d => {
                  const updated = { ...d };
                  const enlargedSubgroups = enlargedViewData ? [...new Set(enlargedViewData.map(item => item.Subgroup))] : subgroups;
                  enlargedSubgroups.forEach(sg => {
                    if (!d.isSeparator && !isNaN(d[sg])) {
                      updated[sg] = d[sg] * 100;
                    }
                  });
                  return updated;
                })}
                margin={{ top: 20, right: 40, left: 40, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Metric"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                  tickFormatter={(value) => (value.includes('Separator') ? '' : value)}
                  tick={{ 
                    fontSize: 12, 
                    fontWeight: 'bold', 
                    fontFamily: 'Arial, sans-serif',
                    fill: '#333'
                  }}
                  label={{ 
                    value: 'Performance Metrics', 
                    position: 'insideBottom', 
                    offset: -50,
                    style: { 
                      textAnchor: 'middle', 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      fill: '#333'
                    } 
                  }}
                />
                <YAxis 
                  domain={[0, 120]} 
                  ticks={[0, 20, 40, 60, 80, 100, 120]}
                  tick={{ 
                    fontSize: 12, 
                    fontWeight: 'bold', 
                    fontFamily: 'Arial, sans-serif',
                    fill: '#333'
                  }}
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { 
                      textAnchor: 'middle', 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      fill: '#333'
                    } 
                  }}
                />
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
                {(enlargedViewData ? [...new Set(enlargedViewData.map(item => item.Subgroup))] : subgroups).map((subgroup) => (
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


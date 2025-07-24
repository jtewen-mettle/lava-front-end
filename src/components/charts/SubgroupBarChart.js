import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer
} from 'recharts';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';

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
      const svgElement = chartRef.current.container.querySelector('svg');
      if (svgElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Convert SVG to canvas and download
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          canvas.width = svgElement.clientWidth || 800;
          canvas.height = svgElement.clientHeight || 600;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          let mimeType = 'image/png';
          if (format === 'jpg' || format === 'jpeg') {
            mimeType = 'image/jpeg';
          }
          
          const downloadUrl = canvas.toDataURL(mimeType);
          const link = document.createElement('a');
          link.download = `subgroup_${selectedFeature}_chart.${format === 'pdf' ? 'png' : format}`;
          link.href = downloadUrl;
          link.click();
          
          URL.revokeObjectURL(url);
        };
        
        img.src = url;
      }
    }
    handleDownloadClose();
  };

  // Define color schemes for different selectedFeatures
  const colorSchemes = {
    Gender: ["#FF5733", "#33C1FF"], 
    Race: ["#8E44AD", "#27AE60", "#F1C40F", "#E74C3C"],
    Default: ["#8884d8", "#82ca9d", "#ffc658"], 
  };

  // Get the appropriate color scheme or fallback to Default
  const colors = colorSchemes[selectedFeature] || colorSchemes.Default;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <h3 style={{ margin: 0, textAlign: 'left', fontSize: '16px' }}>Subgroup Analysis across {selectedFeature}</h3>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleEnlargeChart}
              title="Enlarge Chart"
            >
              <ZoomIn />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleDownloadClick}
              title="Download Chart"
            >
              <Download />
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
            >
              <ZoomIn />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleDownloadClick}
              title="Download Chart"
            >
              <Download />
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
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Legend
            verticalAlign="top"
            layout="horizontal"
            align="right"
            wrapperStyle={{ marginTop: '-20px', fontSize: '9px' }}
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

      {/* Modal for enlarged chart */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span>Subgroup Analysis across {selectedFeature}</span>
            <Box>
              <IconButton 
                size="small" 
                onClick={handleDownloadClick}
                title="Download Chart"
              >
                <Download />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setOpenModal(false)}
                title="Close"
              >
                ✕
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box style={{ height: '600px', width: '100%' }}>
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
                margin={{ top: 60, right: 30, left: 20, bottom: 100 }}
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
      </Menu>
    </div>
  );
};

export default SubgroupBarChart;


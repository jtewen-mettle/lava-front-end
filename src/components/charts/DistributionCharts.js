import React, { useState, useRef } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Grid, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';
import DistributionPieChart from './DistributionPieChart';
import { downloadCanvasChart } from './ChartDownloadUtils';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const DistributionCharts = ({ ageGroups, genderCounts, raceCounts }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalChart, setModalChart] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const [lastTooltipData, setLastTooltipData] = useState(null);
  
  const ageChartRef = useRef(null);
  const raceChartRef = useRef(null);

  const ageData = {
    labels: Object.keys(ageGroups),
    datasets: [{
      label: 'Patients',
      data: Object.values(ageGroups),
      backgroundColor: '#42a5f5'
    }]
  };

  const genderData = {
    labels: Object.keys(genderCounts),
    datasets: [{
      label: 'Gender Distribution',
      data: Object.values(genderCounts),
      backgroundColor: ['#66bb6a', '#ef5350']
    }]
  };

  // Create light, appealing race color palette for distribution charts
  const raceDistributionColors = [
    "rgba(255, 182, 193, 0.95)", // Light pink
    "rgba(173, 216, 230, 0.95)", // Light blue
    "rgba(221, 160, 221, 0.95)", // Light orchid
    "rgba(255, 218, 185, 0.95)", // Light peach
    "rgba(144, 238, 144, 0.95)", // Light green
    "rgba(255, 255, 224, 0.95)", // Light yellow
    "rgba(255, 192, 203, 0.95)", // Light coral
    "rgba(176, 196, 222, 0.95)", // Light steel blue
    "rgba(230, 230, 250, 0.95)", // Light lavender
    "rgba(240, 248, 255, 0.95)"  // Light azure
  ];
  
  const raceLabels = Object.keys(raceCounts).sort(); // Sort for consistency in display
  const raceColors = raceLabels.map((race, index) => {
    return raceDistributionColors[index % raceDistributionColors.length];
  });

  const raceData = {
    labels: raceLabels,
    datasets: [{
      label: 'Patients',
      data: raceLabels.map(label => raceCounts[label]),
      backgroundColor: raceColors,
      borderColor: raceColors.map(color => color.replace('0.95', '1')), // Solid border
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    }]
  };

  const handleEnlargeChart = (chartData, title, chartType) => {
    setModalChart({ data: chartData, type: chartType });
    setModalTitle(title);
    setOpenModal(true);
  };

  const handleDownloadClick = (event, chartType) => {
    setDownloadMenuAnchor(event.currentTarget);
    setActiveChart(chartType);
  };

  const handleDownloadClose = () => {
    setDownloadMenuAnchor(null);
    setActiveChart(null);
  };

  const getTooltipDataForChart = (chartType) => {
    switch(chartType) {
      case 'age':
        return {
          label: 'Age Groups',
          value: `Total patients: ${Object.values(ageGroups).reduce((sum, val) => sum + val, 0)}`
        };
      case 'race':
        return {
          label: 'Race/Ethnicity',
          value: `Total patients: ${Object.values(raceCounts).reduce((sum, val) => sum + val, 0)}`
        };
      default:
        return null;
    }
  };

  const getLegendDataForChart = (chartType) => {
    switch(chartType) {
      case 'age':
        return Object.keys(ageGroups).map(ageGroup => ({
          label: ageGroup,
          color: '#42a5f5'
        }));
      case 'race':
        return raceLabels.map((race, index) => ({
          label: race,
          color: raceColors[index]
        }));
      default:
        return null;
    }
  };

  const downloadChart = (format) => {
    let canvas;
    let fileName = `${activeChart}_distribution`;
    let title = '';
    
    switch(activeChart) {
      case 'age':
        canvas = ageChartRef.current?.canvas;
        fileName = 'age_distribution';
        title = 'Age Distribution';
        break;
      case 'race':
        canvas = raceChartRef.current?.canvas;
        fileName = 'race_distribution';
        title = 'Race/Ethnicity Distribution';
        break;
      default:
        return;
    }

    if (canvas) {
      // Get tooltip and legend data for the active chart
      const tooltipData = getTooltipDataForChart(activeChart);
      const legendData = getLegendDataForChart(activeChart);
      downloadCanvasChart(canvas, format, fileName, title, tooltipData, legendData);
    }
    handleDownloadClose();
  };

  return (
    <Box mt={4}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px',
        width: '100%',
        gridAutoRows: 'minmax(400px, auto)'
      }}>
        {/* Age Distribution */}
        <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" gutterBottom align="left" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
              Age Distribution
            </Typography>
            <Box>
              <IconButton 
                size="small" 
                onClick={() => handleEnlargeChart(ageData, 'Age Distribution', 'bar')}
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
                onClick={(e) => handleDownloadClick(e, 'age')}
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
          <div style={{ flex: 1, height: '300px' }}>
            <Bar 
              ref={ageChartRef}
              data={ageData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Age Group',
                      font: { size: 14 }
                    }
                  }
                }
              }} />
          </div>
        </Paper>

        {/* Gender Distribution */}
        <div style={{ height: '400px' }}>
          <DistributionPieChart title="Gender Distribution" data={genderCounts}/>
        </div>

        {/* Race/Ethnicity Distribution - starts new row */}
        <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column', gridColumn: '1 / 2' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" gutterBottom align="left" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
              Race/Ethnicity Distribution
            </Typography>
            <Box>
              <IconButton 
                size="small" 
                onClick={() => handleEnlargeChart(raceData, 'Race/Ethnicity Distribution', 'bar')}
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
                onClick={(e) => handleDownloadClick(e, 'race')}
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
          <div style={{ flex: 1, height: '300px' }}>
            <Bar 
              ref={raceChartRef}
              data={raceData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Race/Ethnicity Group',
                      font: { size: 14 }
                    },
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  }
                },
                elements: {
                  bar: {
                    borderWidth: 2,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#333'
                  }
                }
              }} />
          </div>
        </Paper>
      </div>

    {/* Modal for enlarged charts */}
    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>{modalTitle}</span>
          <Box>
            <IconButton 
              size="small" 
              onClick={(e) => {
                setActiveChart(modalTitle.includes('Age') ? 'age' : 'race');
                handleDownloadClick(e);
              }}
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
        <Box style={{ height: '500px', width: '100%' }}>
          {modalChart && modalChart.type === 'bar' && (
            <Bar data={modalChart.data} options={{ responsive: true, maintainAspectRatio: false }} />
          )}
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
  </Box>
  );
};

export default DistributionCharts;

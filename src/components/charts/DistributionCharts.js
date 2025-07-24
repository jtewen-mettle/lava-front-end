import React, { useState, useRef } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Grid, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';
import DistributionPieChart from './DistributionPieChart';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const DistributionCharts = ({ ageGroups, genderCounts, raceCounts }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalChart, setModalChart] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  
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

  const raceData = {
    labels: Object.keys(raceCounts),
    datasets: [{
      label: 'Patients',
      data: Object.values(raceCounts),
      backgroundColor: '#ab47bc'
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

  const downloadChart = (format) => {
    let canvas;
    let fileName = `${activeChart}_distribution`;
    
    switch(activeChart) {
      case 'age':
        canvas = ageChartRef.current?.canvas;
        fileName = 'age_distribution';
        break;
      case 'race':
        canvas = raceChartRef.current?.canvas;
        fileName = 'race_distribution';
        break;
      default:
        return;
    }

    if (canvas) {
      let mimeType = 'image/png';
      if (format === 'jpg' || format === 'jpeg') {
        mimeType = 'image/jpeg';
      }
      
      const url = canvas.toDataURL(mimeType);
      const link = document.createElement('a');
      link.download = `${fileName}.${format === 'pdf' ? 'png' : format}`;
      link.href = url;
      link.click();
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
            <Typography variant="h6" gutterBottom align="left">
              Age Distribution
            </Typography>
            <Box>
              <IconButton 
                size="small" 
                onClick={() => handleEnlargeChart(ageData, 'Age Distribution', 'bar')}
                title="Enlarge Chart"
              >
                <ZoomIn />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={(e) => handleDownloadClick(e, 'age')}
                title="Download Chart"
              >
                <Download />
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
            <Typography variant="h6" gutterBottom align="left">
              Race/Ethnicity Distribution
            </Typography>
            <Box>
              <IconButton 
                size="small" 
                onClick={() => handleEnlargeChart(raceData, 'Race/Ethnicity Distribution', 'bar')}
                title="Enlarge Chart"
              >
                <ZoomIn />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={(e) => handleDownloadClick(e, 'race')}
                title="Download Chart"
              >
                <Download />
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
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Race/Ethnicity Group',
                      font: { size: 14 }
                    }
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

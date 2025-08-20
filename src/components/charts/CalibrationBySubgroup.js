import React, { useMemo, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Box, Typography, Tooltip as MUITooltip, IconButton, Dialog, DialogTitle, DialogContent, Menu, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';
import { downloadCanvasChart } from './ChartDownloadUtils';
import { calculateCalibrationData, calculateExpectedCalibrationError, calculateCalibrationMetrics } from './CalibrationCurve';
import HelpIcon from '../HelpIcon';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/**
 * CalibrationBySubgroup Component
 * 
 * Displays model calibration across demographic groups using multi-line calibration plots.
 * Shows if the model is equally trustworthy across all groups - critical for clinical decision-making.
 * 
 * @param {Array} genderMetrics - Array of gender subgroup metrics including calibration data
 * @param {Array} raceMetrics - Array of race subgroup metrics including calibration data
 * @param {string} title - Chart title
 */
const CalibrationBySubgroup = ({ genderMetrics, raceMetrics, title = "Model Calibration by Demographics" }) => {
  const [selectedDemographic, setSelectedDemographic] = useState('Gender');
  const [openModal, setOpenModal] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const chartRef = useRef(null);

  const handleEnlargeChart = () => {
    setOpenModal(true);
  };

  const handleDownloadClick = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleDemographicChange = (event) => {
    setSelectedDemographic(event.target.value);
  };

  const downloadChart = (format) => {
    const downloadWithMetrics = () => {
      // Create a comprehensive download that includes both chart and metrics
      const element = document.createElement('div');
      element.style.cssText = `
        display: flex;
        width: 1200px;
        height: 800px;
        padding: 20px;
        background: white;
        font-family: Arial, sans-serif;
        gap: 20px;
      `;
      
      // Create chart container
      const chartContainer = document.createElement('div');
      chartContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
      `;
      
      // Add title
      const titleElement = document.createElement('div');
      titleElement.style.cssText = `
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        color: #000;
      `;
      titleElement.textContent = `${title} - ${selectedDemographic}`;
      chartContainer.appendChild(titleElement);
      
      // Copy chart canvas
      if (chartRef.current) {
        const chartCanvas = chartRef.current.canvas.cloneNode();
        const ctx = chartCanvas.getContext('2d');
        ctx.drawImage(chartRef.current.canvas, 0, 0);
        chartCanvas.style.cssText = `
          width: 100%;
          height: 600px;
          object-fit: contain;
        `;
        chartContainer.appendChild(chartCanvas);
      }
      
      // Create metrics panel
      const metricsPanel = document.createElement('div');
      metricsPanel.style.cssText = `
        width: 280px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      `;
      
      // Add metrics panel title
      const metricsTitleElement = document.createElement('div');
      metricsTitleElement.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        color: #000;
      `;
      metricsTitleElement.textContent = 'Calibration Metrics';
      metricsPanel.appendChild(metricsTitleElement);
      
      // Add metrics for each subgroup
      Object.entries(subgroupCalibrationMetrics).forEach(([subgroup, metrics]) => {
        const subgroupContainer = document.createElement('div');
        subgroupContainer.style.cssText = `
          margin-bottom: 20px;
          padding: 10px;
          border-radius: 6px;
          background: white;
          border-left: 4px solid ${colorMap[subgroup]};
        `;
        
        // Subgroup name
        const subgroupName = document.createElement('div');
        subgroupName.style.cssText = `
          font-size: 14px;
          font-weight: bold;
          color: ${colorMap[subgroup]};
          margin-bottom: 8px;
        `;
        subgroupName.textContent = subgroup;
        subgroupContainer.appendChild(subgroupName);
        
        // ECE
        if (metrics.ece !== null) {
          const eceElement = document.createElement('div');
          eceElement.style.cssText = `
            margin-bottom: 6px;
            font-size: 12px;
          `;
          eceElement.innerHTML = `<strong>ECE:</strong> ${metrics.ece.toFixed(3)}`;
          subgroupContainer.appendChild(eceElement);
        }
        
        // Brier Score
        if (metrics.brierScore !== null) {
          const brierElement = document.createElement('div');
          brierElement.style.cssText = `
            margin-bottom: 6px;
            font-size: 12px;
          `;
          brierElement.innerHTML = `<strong>Brier Score:</strong> ${metrics.brierScore.toFixed(3)}`;
          subgroupContainer.appendChild(brierElement);
        }
        
        // Quality Assessment
        if (metrics.assessment) {
          const qualityElement = document.createElement('div');
          qualityElement.style.cssText = `
            padding: 6px;
            border-radius: 4px;
            background: ${metrics.assessment.bgColor};
            border: 1px solid ${metrics.assessment.color};
            text-align: center;
            margin-top: 6px;
          `;
          qualityElement.innerHTML = `
            <div style="font-size: 10px; color: #000;">Quality</div>
            <div style="font-size: 13px; font-weight: bold; color: ${metrics.assessment.color};">
              ${metrics.assessment.level}
            </div>
          `;
          subgroupContainer.appendChild(qualityElement);
        }
        
        metricsPanel.appendChild(subgroupContainer);
      });
      
      element.appendChild(chartContainer);
      element.appendChild(metricsPanel);
      
      // Temporarily add to DOM for rendering
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      document.body.appendChild(element);
      
      // Use html2canvas to capture the complete element
      import('html2canvas').then(html2canvas => {
        html2canvas.default(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: element.offsetWidth || 1200,
          height: element.offsetHeight || 800
        }).then(canvas => {
          // Clean up temporary element
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
          
          // Download the captured canvas
          downloadCanvasChart(canvas, format, `calibration_by_subgroup_${selectedDemographic.toLowerCase()}`, 
            `${title} - ${selectedDemographic}`, 
            {
              label: 'Subgroup Calibration Analysis',
              value: `Groups: ${Object.keys(subgroupCalibrationMetrics).join(', ')} | Feature: ${selectedDemographic}`
            }, 
            Object.keys(subgroupCalibrationMetrics).map(subgroup => ({
              label: subgroup,
              color: colorMap[subgroup]
            }))
          );
        }).catch(error => {
          // Clean up on error and fallback to basic chart download
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
          console.error('Error capturing chart with metrics:', error);
          
          // Fallback to basic chart download
          if (chartRef.current) {
            const canvas = chartRef.current.canvas;
            downloadCanvasChart(canvas, format, 'calibration_by_subgroup', title, 
              {
                label: 'Subgroup Calibration Analysis',
                value: `Feature: ${selectedDemographic}`
              }, 
              []
            );
          }
        });
      });
    };
    
    downloadWithMetrics();
    handleDownloadClose();
  };

  // Define color schemes for different demographics
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
    Default: ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"], 
  };

  // Get current subgroup data based on selection
  const getCurrentSubgroupData = () => {
    if (selectedDemographic === 'Gender') {
      return genderMetrics || [];
    } else if (selectedDemographic === 'Race') {
      return raceMetrics || [];
    }
    return [];
  };

  // Create stable color mapping based on subgroup names
  const createStableColorMapping = (subgroups, demographicType) => {
    const colorPalette = colorSchemes[demographicType] || colorSchemes.Default;
    const colorMap = {};

    if (demographicType === 'Gender') {
      const genderOrder = ['Male', 'Female'];
      subgroups.forEach(subgroup => {
        const index = genderOrder.indexOf(subgroup);
        colorMap[subgroup] = colorPalette[index !== -1 ? index : 0];
      });
    } else if (demographicType === 'Race') {
      const allRaces = [...new Set(subgroups)].sort();
      subgroups.forEach(subgroup => {
        const index = allRaces.indexOf(subgroup);
        colorMap[subgroup] = colorPalette[index % colorPalette.length];
      });
    } else {
      subgroups.forEach((subgroup, index) => {
        colorMap[subgroup] = colorPalette[index % colorPalette.length];
      });
    }

    return colorMap;
  };

  const currentSubgroupData = getCurrentSubgroupData();
  const subgroups = currentSubgroupData ? currentSubgroupData.map(d => d.Subgroup) : [];
  const colorMap = createStableColorMapping(subgroups, selectedDemographic);

  // Function to determine calibration quality assessment based on ECE
  const getCalibrationAssessment = (ece) => {
    if (ece === null) return null;
    
    if (ece <= 0.05) {
      return {
        level: "Excellent",
        message: "Model is very well-calibrated. Predicted probabilities closely match actual outcomes.",
        color: "#4caf50",
        bgColor: "#e8f5e8"
      };
    } else if (ece <= 0.10) {
      return {
        level: "Good", 
        message: "Model shows good calibration with minor deviations from perfect calibration.",
        color: "#8bc34a",
        bgColor: "#f1f8e9"
      };
    } else {
      return {
        level: "Poor",
        message: "Model has significant calibration problems. Recalibration is strongly recommended.",
        color: "#f44336",
        bgColor: "#ffebee"
      };
    }
  };

  // Calculate subgroup calibration metrics
  const subgroupCalibrationMetrics = useMemo(() => {
    if (!currentSubgroupData || currentSubgroupData.length === 0) {
      return {};
    }

    const metrics = {};
    currentSubgroupData.forEach(group => {
      if (group.CALIBRATION_CURVE && group.predictions && group.actual) {
        const ece = calculateExpectedCalibrationError(
          group.CALIBRATION_CURVE.meanPredicted, 
          group.CALIBRATION_CURVE.fractionPositive, 
          group.CALIBRATION_CURVE.counts, 
          group.predictions.length
        );
        
        const calibMetrics = calculateCalibrationMetrics(
          group.predictions, 
          group.actual, 
          group.CALIBRATION_CURVE
        );

        const assessment = getCalibrationAssessment(ece);

        metrics[group.Subgroup] = {
          ece: ece,
          brierScore: calibMetrics.brierScore,
          reliability: calibMetrics.reliability,
          resolution: calibMetrics.resolution,
          assessment: assessment
        };
      }
    });

    return metrics;
  }, [currentSubgroupData]);

  const chartData = useMemo(() => {
    if (!currentSubgroupData || currentSubgroupData.length === 0) {
      return { datasets: [] };
    }

    const datasets = [];

    // Add calibration curves for each subgroup
    currentSubgroupData.forEach((group) => {
      if (group.CALIBRATION_CURVE && group.CALIBRATION_CURVE.meanPredicted) {
        const calibData = group.CALIBRATION_CURVE;
        datasets.push({
          label: `${group.Subgroup}`,
          data: calibData.meanPredicted.map((x, i) => ({ 
            x, 
            y: calibData.fractionPositive[i] 
          })),
          borderColor: colorMap[group.Subgroup] || '#8884d8',
          backgroundColor: colorMap[group.Subgroup] || '#8884d8',
          pointRadius: 4,
          pointHoverRadius: 6,
          showLine: true,
          tension: 0.1,
          borderWidth: 3
        });
      }
    });

    // Add perfect calibration reference line
    datasets.push({
      label: 'Perfect Calibration',
      data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      borderColor: 'red',
      borderDash: [5, 5],
      pointRadius: 0,
      showLine: true,
      borderWidth: 2
    });

    return { datasets };
  }, [currentSubgroupData, colorMap]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 10,
            weight: 'bold',
            family: 'Arial, sans-serif'
          },
          color: '#000',
          usePointStyle: true,
          padding: 8,
          generateLabels: function(chart) {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            labels.forEach((label, index) => {
              const dataset = chart.data.datasets[index];
              label.pointStyle = 'line';
              label.pointStyleWidth = 30;
              label.strokeStyle = dataset.borderColor || label.fillStyle;
              label.fillStyle = dataset.borderColor || label.fillStyle;
              label.lineWidth = 3;
              
              // Make red dotted line for Perfect Calibration
              if (dataset.label === 'Perfect Calibration' || dataset.borderColor === 'red') {
                label.lineDash = [6, 3];
              }
            });
            
            return labels;
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const subgroup = context.dataset.label;
            if (context.dataset.label.includes('Perfect')) {
              return `Perfect Calibration: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
            }
            
            const metrics = subgroupCalibrationMetrics[subgroup];
            const lines = [
              `${subgroup}: (${context.parsed.x.toFixed(3)}, ${context.parsed.y.toFixed(3)})`
            ];
            
            if (metrics) {
              if (metrics.ece !== null) lines.push(`ECE: ${metrics.ece.toFixed(3)}`);
            }
            
            return lines;
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Mean Predicted Probability',
          font: { 
            size: 11, 
            weight: 'bold', 
            family: 'Arial, sans-serif' 
          },
          color: '#000'
        },
        ticks: {
          stepSize: 0.2,
          font: { 
            size: 10, 
            weight: 'bold', 
            family: 'Arial, sans-serif' 
          },
          color: '#000'
        },
        min: 0,
        max: 1
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Observed Positive Rate',
          font: { 
            size: 11, 
            weight: 'bold', 
            family: 'Arial, sans-serif' 
          },
          color: '#000'
        },
        ticks: {
          stepSize: 0.2,
          font: { 
            size: 10, 
            weight: 'bold', 
            family: 'Arial, sans-serif' 
          },
          color: '#000'
        },
        min: 0,
        max: 1
      }
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
          {title}
        </Typography>
        <Box>
          <HelpIcon tooltip="Learn more about calibration curves in the Glossary" section="calibration-curve" />
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

      {/* Dropdown Selector */}
      <FormControl sx={{ marginBottom: 2, width: "80%" }}>
        <InputLabel sx={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 'bold', color: '#000' }}>Demographics</InputLabel>
        <Select
          value={selectedDemographic}
          label="Demographics"
          onChange={handleDemographicChange}
          size="small"
          sx={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '14px'
          }}
        >
          <MenuItem value="Gender" sx={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>Gender</MenuItem>
          <MenuItem value="Race" sx={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>Race</MenuItem>
        </Select>
      </FormControl>

      {/* Main Content Area */}
      <Box flex={1} display="flex" gap={1} minHeight={0}>
        {/* Left Side: Chart */}
        <Box flex={1} minHeight={0} minWidth={0}>
          {currentSubgroupData && currentSubgroupData.length > 0 ? (
            <Line ref={chartRef} data={chartData} options={options} />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="body2" sx={{ color: '#000', 
                fontSize: '14px', 
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center'
              }}>
                No calibration data available for {selectedDemographic.toLowerCase()} analysis
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Right Side: Compact Metrics Panel */}
        <Box width="160px" display="flex" flexDirection="column" gap={1} sx={{ overflowY: 'auto' }}>
          {Object.entries(subgroupCalibrationMetrics).map(([subgroup, metrics]) => (
            <Box key={subgroup}>
              <Typography variant="caption" sx={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                fontFamily: 'Arial, sans-serif',
                color: colorMap[subgroup], 
                display: 'block', 
                marginBottom: '4px' 
              }}>
                {subgroup}
              </Typography>
              
              {metrics.ece !== null && (
                <MUITooltip 
                  title={
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      Expected Calibration Error for {subgroup}: {metrics.ece.toFixed(3)}. Lower values (≤0.05) indicate excellent calibration
                    </Typography>
                  }
                  arrow
                  placement="left"
                >
                  <Box 
                    px={0.5} 
                    py={0.5}
                    bgcolor="#f8f9fa" 
                    borderRadius={1} 
                    textAlign="center"
                    minHeight="40px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    sx={{ cursor: 'help', marginBottom: 0.5 }}
                  >
                    <Typography variant="caption" sx={{ color: '#000', 
                      fontSize: '10px', 
                      fontFamily: 'Arial, sans-serif',
                      lineHeight: 1 
                    }}>
                      ECE
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      fontFamily: 'Arial, sans-serif',
                      lineHeight: 1 
                    }}>
                      {metrics.ece.toFixed(3)}
                    </Typography>
                  </Box>
                </MUITooltip>
              )}
              
              {metrics.brierScore !== null && (
                <MUITooltip 
                  title={
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      Brier Score for {subgroup}: {metrics.brierScore.toFixed(3)}. Lower is better. Values closer to 0 indicate better calibration and accuracy
                    </Typography>
                  }
                  arrow
                  placement="left"
                >
                  <Box 
                    px={0.5} 
                    py={0.5}
                    bgcolor="#f8f9fa" 
                    borderRadius={1} 
                    textAlign="center"
                    minHeight="40px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    sx={{ cursor: 'help', marginBottom: 0.5 }}
                  >
                    <Typography variant="caption" sx={{ color: '#000', 
                      fontSize: '10px', 
                      fontFamily: 'Arial, sans-serif',
                      lineHeight: 1 
                    }}>
                      Brier Score
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      fontFamily: 'Arial, sans-serif',
                      lineHeight: 1 
                    }}>
                      {metrics.brierScore.toFixed(3)}
                    </Typography>
                  </Box>
                </MUITooltip>
              )}
              
              {/* Calibration Quality Assessment */}
              {metrics.assessment && (
                <MUITooltip 
                  title={
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      Calibration Quality for {subgroup}: {metrics.assessment.level}. {metrics.assessment.message} Use the information button above for more details about calibration curves
                    </Typography>
                  }
                  arrow
                  placement="left"
                >
                  <Box 
                    px={0.5} 
                    py={0.5}
                    bgcolor={metrics.assessment.bgColor}
                    borderRadius={1} 
                    textAlign="center"
                    minHeight="40px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    sx={{ 
                      marginBottom: 1,
                      border: `1px solid ${metrics.assessment.color}`
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#000', 
                      fontSize: '10px', 
                      fontFamily: 'Arial, sans-serif',
                      lineHeight: 1 
                    }}>
                      Quality
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: 1,
                        color: metrics.assessment.color
                      }}
                    >
                      {metrics.assessment.level}
                    </Typography>
                  </Box>
                </MUITooltip>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Modal for enlarged chart */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span>{title} - {selectedDemographic}</span>
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
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Box style={{ height: '600px', width: '100%', display: 'flex', gap: '16px', overflow: 'hidden' }}>
            <Box flex={1}>
              <Line data={chartData} options={{ 
                ...options, 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  ...options.plugins,
                  legend: {
                    ...options.plugins.legend,
                    labels: {
                      ...options.plugins.legend.labels,
                      font: {
                        size: 12,
                        weight: 'bold',
                        family: 'Arial, sans-serif'
                      },
                      padding: 15
                    }
                  }
                }
              }} />
            </Box>
            
            {/* Expanded Metrics Panel in Modal - with Scroll */}
            <Box width="200px" display="flex" flexDirection="column" gap={1.5} sx={{ 
              overflowY: 'auto', 
              maxHeight: '580px',
              paddingRight: '8px',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f5f5f5',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#a8a8a8',
                }
              }
            }}>
              {Object.entries(subgroupCalibrationMetrics).map(([subgroup, metrics]) => (
                <Box key={subgroup}>
                  <Typography variant="h6" sx={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    fontFamily: 'Arial, sans-serif',
                    color: colorMap[subgroup] 
                  }}>
                    {subgroup}
                  </Typography>
                  
                  {metrics.ece !== null && (
                    <MUITooltip 
                      title={
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          Expected Calibration Error for {subgroup}: {metrics.ece.toFixed(3)}. Lower values (≤0.05) indicate excellent calibration
                        </Typography>
                      }
                      arrow
                      placement="left"
                    >
                      <Box 
                        px={0.5} 
                        py={0.8}
                        bgcolor="#f8f9fa" 
                        borderRadius={1} 
                        textAlign="center"
                        minHeight="55px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        sx={{ cursor: 'help', marginBottom: 0.5 }}
                      >
                        <Typography variant="caption" sx={{ color: '#000', 
                          fontSize: '12px', 
                          fontFamily: 'Arial, sans-serif'
                        }}>
                          Expected Calibration Error
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          fontFamily: 'Arial, sans-serif'
                        }}>
                          {metrics.ece.toFixed(3)}
                        </Typography>
                      </Box>
                    </MUITooltip>
                  )}
                  
                  {metrics.brierScore !== null && (
                    <MUITooltip 
                      title={
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          Brier Score for {subgroup}: {metrics.brierScore.toFixed(3)}. Lower is better. Values closer to 0 indicate better calibration and accuracy
                        </Typography>
                      }
                      arrow
                      placement="left"
                    >
                      <Box 
                        px={0.5} 
                        py={0.8}
                        bgcolor="#f8f9fa" 
                        borderRadius={1} 
                        textAlign="center"
                        minHeight="55px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        sx={{ cursor: 'help', marginBottom: 0.5 }}
                      >
                        <Typography variant="caption" sx={{ color: '#000', 
                          fontSize: '12px', 
                          fontFamily: 'Arial, sans-serif'
                        }}>
                          Brier Score
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          fontFamily: 'Arial, sans-serif'
                        }}>
                          {metrics.brierScore.toFixed(3)}
                        </Typography>
                      </Box>
                    </MUITooltip>
                  )}
                  
                  {/* Calibration Quality Assessment in Modal */}
                  {metrics.assessment && (
                    <MUITooltip 
                      title={
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          Calibration Quality for {subgroup}: {metrics.assessment.level}. {metrics.assessment.message} Use the information button in the header for more details about calibration curves
                        </Typography>
                      }
                      arrow
                      placement="left"
                    >
                      <Box 
                        px={0.5} 
                        py={0.8}
                        bgcolor={metrics.assessment.bgColor}
                        borderRadius={1} 
                        textAlign="center"
                        minHeight="55px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        sx={{ 
                          marginBottom: 1.5,
                          border: `2px solid ${metrics.assessment.color}`
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#000', 
                          fontSize: '12px', 
                          fontFamily: 'Arial, sans-serif'
                        }}>
                          Calibration Quality
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif',
                            color: metrics.assessment.color
                          }}
                        >
                          {metrics.assessment.level}
                        </Typography>
                      </Box>
                    </MUITooltip>
                  )}
                </Box>
              ))}
            </Box>
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

export default CalibrationBySubgroup;
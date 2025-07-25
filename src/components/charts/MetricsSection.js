import React, { useState, useRef } from 'react';
import { Grid, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { ZoomIn, Download, MoreVert } from '@mui/icons-material';
import CalibrationCurve from './CalibrationCurve';
import { downloadCanvasChart } from './ChartDownloadUtils';

const MetricsSection = ({ topic, metricsData, accuracyChart, barChartData, rocChart, recalculateMetrics,predictionValue,onPredictionChange, calibrationData }) => {
    const [threshold, setThreshold] = useState(20);
    const [openModal, setOpenModal] = useState(false);
    const [modalChart, setModalChart] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
    const [activeChart, setActiveChart] = useState(null);
    
    const accuracyChartRef = useRef(null);
    const barChartRef = useRef(null);
    const rocChartRef = useRef(null);
    const breakdownChartRef = useRef(null); 

    const total = metricsData.confusion_matrix.true_positive +
        metricsData.confusion_matrix.false_negative +   
            metricsData.confusion_matrix.false_positive +   
                metricsData.confusion_matrix.true_negative;

    const percent = (value) => {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(1) + '%';
    };


    const getTitle = () => {
        console.log("topic---" + topic)
        if (topic.includes("Chronic Kidney Disease") || topic.includes("CKD")) {
            return "Chronic Kidney Disease Risk Breakdown";
        } else if (topic.includes("Cardiovascular Disease") || topic.includes("CardioVascularDisease")) {
            return "Cardiovascular Risk Breakdown";
        } else {
            return "Metrics Breakdown";
        }
    };

    const handleThresholdChange = (event) => {
        const newThreshold = event.target.value;
        setThreshold(newThreshold);
        recalculateMetrics(newThreshold); 
    };

    const extendedChart = {
        ...accuracyChart,
        datasets: [
          ...accuracyChart.datasets,
          {
            label: `Provider defined threshold (${predictionValue})`,
            data: new Array(accuracyChart.labels.length).fill(predictionValue),
            borderColor: 'green',
            borderDash: [6, 6],
            pointRadius: 0,
            fill: false,
          },
        ],
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
        let fileName = `${activeChart}_chart`;
        let title = '';
        let tooltipData = null;
        let legendData = null;
        
        switch(activeChart) {
            case 'breakdown':
                // For breakdown chart download, always use the modal format for consistency
                // Create a temporary modal-style element if modal is not open
                const downloadBreakdownChart = () => {
                    // Always create a standardized temporary element for consistent downloads
                    // regardless of whether modal is open or closed
                    const element = document.createElement('div');
                    element.style.cssText = `
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                        width: 600px;
                        height: 400px;
                        padding: 20px;
                        background: white;
                        font-family: Arial, sans-serif;
                    `;
                    
                    // Create the four boxes with standardized styling for download
                    const boxes = [
                        {
                            data: metricsData.confusion_matrix.true_positive,
                            percent: percent(metricsData.confusion_matrix.true_positive),
                            label: 'Correctly predicted',
                            color: '#e0f2f1'
                        },
                        {
                            data: metricsData.confusion_matrix.false_negative,
                            percent: percent(metricsData.confusion_matrix.false_negative),
                            label: 'Missed Predictions',
                            color: '#ffebee'
                        },
                        {
                            data: metricsData.confusion_matrix.false_positive,
                            percent: percent(metricsData.confusion_matrix.false_positive),
                            label: 'Wrongly predicted positive',
                            color: '#ffebee'
                        },
                        {
                            data: metricsData.confusion_matrix.true_negative,
                            percent: percent(metricsData.confusion_matrix.true_negative),
                            label: 'Correctly predicted negative',
                            color: '#e0f2f1'
                        }
                    ];
                    
                    boxes.forEach(box => {
                        const boxElement = document.createElement('div');
                        boxElement.style.cssText = `
                            background-color: ${box.color};
                            padding: 16px;
                            border-radius: 8px;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 120px;
                        `;
                        
                        boxElement.innerHTML = `
                            <div>
                                <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 8px; font-family: Arial, sans-serif; color: #333;">
                                    ${box.data} (${box.percent})
                                </div>
                                <div style="font-size: 0.9rem; font-family: Arial, sans-serif; color: #666;">
                                    ${box.label}
                                </div>
                            </div>
                        `;
                        element.appendChild(boxElement);
                    });
                    
                    // Add title
                    const titleElement = document.createElement('div');
                    titleElement.style.cssText = `
                        grid-column: 1 / -1;
                        text-align: center;
                        font-size: 1.3rem;
                        font-weight: bold;
                        margin-bottom: 16px;
                        font-family: Arial, sans-serif;
                        color: #333;
                        order: -1;
                    `;
                    titleElement.textContent = getTitle();
                    element.appendChild(titleElement);
                    
                    // Temporarily add to DOM for rendering
                    element.style.position = 'absolute';
                    element.style.left = '-9999px';
                    element.style.top = '-9999px';
                    document.body.appendChild(element);
                    
                    const isTemporary = true;
                    
                    if (element) {
                        // Use html2canvas to capture the breakdown grid
                        import('html2canvas').then(html2canvas => {
                            html2canvas.default(element, {
                                backgroundColor: '#ffffff',
                                scale: 2,
                                useCORS: true,
                                allowTaint: true,
                                width: element.offsetWidth || 600,
                                height: element.offsetHeight || 400
                            }).then(canvas => {
                                // Clean up temporary element
                                if (isTemporary && element.parentNode) {
                                    element.parentNode.removeChild(element);
                                }
                                
                                downloadCanvasChart(canvas, format, 'risk_breakdown', getTitle(), {
                                    label: 'Risk Breakdown Analysis',
                                    value: `Total samples: ${total} | TP: ${metricsData.confusion_matrix.true_positive} | FP: ${metricsData.confusion_matrix.false_positive}`
                                }, [
                                    { label: 'True Positive', color: '#e0f2f1' },
                                    { label: 'False Positive', color: '#ffebee' },
                                    { label: 'False Negative', color: '#ffebee' },
                                    { label: 'True Negative', color: '#e0f2f1' }
                                ]);
                            }).catch(error => {
                                // Clean up on error
                                if (isTemporary && element.parentNode) {
                                    element.parentNode.removeChild(element);
                                }
                                console.error('Error capturing breakdown chart:', error);
                            });
                        });
                    }
                };
                
                downloadBreakdownChart();
                handleDownloadClose();
                return;
            case 'accuracy':
                canvas = accuracyChartRef.current?.canvas;
                fileName = 'accuracy_over_time';
                title = 'Accuracy Over Time';
                tooltipData = {
                    label: 'Accuracy Analysis',
                    value: `Threshold: ${predictionValue}% | Total samples: ${total}`
                };
                legendData = [
                    { label: 'Accuracy', color: '#42a5f5' },
                    { label: `Threshold (${predictionValue}%)`, color: 'green' }
                ];
                break;
            case 'bar':
                canvas = barChartRef.current?.canvas;
                fileName = 'accuracy_metrics';
                title = 'Accuracy Metrics';
                tooltipData = {
                    label: 'Performance Metrics',
                    value: `Accuracy: ${(metricsData.accuracy * 100).toFixed(1)}% | F1: ${(metricsData.f1_score * 100).toFixed(1)}%`
                };
                legendData = [
                    { label: 'Metrics', color: '#42a5f5' }
                ];
                break;
            case 'roc':
                canvas = rocChartRef.current?.canvas;
                fileName = 'roc_curve';
                title = 'ROC Curve';
                tooltipData = {
                    label: 'ROC Analysis',
                    value: `AUC: ${metricsData.auroc ? (metricsData.auroc * 100).toFixed(1) + '%' : 'N/A'}`
                };
                legendData = [
                    { label: 'ROC Curve', color: '#42a5f5' },
                    { label: 'Random Classifier', color: '#ff7c7c' }
                ];
                break;
            default:
                return;
        }

        if (canvas) {
            downloadCanvasChart(canvas, format, fileName, title, tooltipData, legendData);
        }
        handleDownloadClose();
    };
      
    

    return (
        <Box mt={4} width="100%">
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 600px), 1fr))',
                gap: '24px',
                width: '100%',
                gridAutoRows: 'minmax(400px, auto)'
            }}>
                {/* Chart 1 - Risk Breakdown */}
                <Paper 
                    elevation={2} 
                    style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    sx={{
                        '&:hover': {
                            elevation: 8,
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
                            {getTitle()} 
                        </Typography>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={() => handleEnlargeChart(null, getTitle(), 'breakdown')}
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
                                onClick={(e) => handleDownloadClick(e, 'breakdown')}
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
                    <Box
                        ref={breakdownChartRef}
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)" 
                        gap={1.5}
                        flex={1}
                        sx={{ 
                            height: 'calc(100% - 60px)', 
                            maxHeight: '320px',
                            paddingX: 2,
                            paddingY: 1
                        }}
                    >
                        <Box
                            bgcolor="#e0f2f1"
                            p={1.5}
                            borderRadius={2}
                            textAlign="center"
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center"
                            minHeight="0"
                            sx={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                                    bgcolor: '#c8e6c9'
                                }
                            }}
                        >
                            <div>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                    {metricsData.confusion_matrix.true_positive} 
                                    ({percent(metricsData.confusion_matrix.true_positive)})
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Correctly predicted</Typography>
                            </div>
                        </Box>
                        <Box
                            bgcolor="#ffebee"
                            p={1.5}
                            borderRadius={2}
                            textAlign="center"
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center"
                            minHeight="0"
                            sx={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 8px 20px rgba(244, 67, 54, 0.3)',
                                    bgcolor: '#ffcdd2'
                                }
                            }}
                        >
                            <div>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                    {metricsData.confusion_matrix.false_negative} 
                                    ({percent(metricsData.confusion_matrix.false_negative)})
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Missed Predictions</Typography>
                            </div>
                        </Box>
                        <Box
                            bgcolor="#ffebee"
                            p={1.5}
                            borderRadius={2}
                            textAlign="center"
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center"
                            minHeight="0"
                            sx={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 8px 20px rgba(244, 67, 54, 0.3)',
                                    bgcolor: '#ffcdd2'
                                }
                            }}
                        >
                            <div>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                    {metricsData.confusion_matrix.false_positive} 
                                    ({percent(metricsData.confusion_matrix.false_positive)})
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Wrongly predicted positive</Typography>
                            </div>
                        </Box>
                        <Box
                            bgcolor="#e0f2f1"
                            p={1.5}
                            borderRadius={2}
                            textAlign="center"
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center"
                            minHeight="0"
                            sx={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                                    bgcolor: '#c8e6c9'
                                }
                            }}
                        >
                            <div>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                    {metricsData.confusion_matrix.true_negative} 
                                    ({percent(metricsData.confusion_matrix.true_negative)})
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Correctly predicted negative</Typography>
                            </div>
                        </Box>
                    </Box>
                </Paper>

                {/* Chart 2 - Accuracy Over Time */}
                <Paper 
                    elevation={2} 
                    style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    sx={{
                        '&:hover': {
                            elevation: 8,
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>Accuracy Over Time</Typography>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={() => handleEnlargeChart(extendedChart, 'Accuracy Over Time', 'line')}
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
                                onClick={(e) => handleDownloadClick(e, 'accuracy')}
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
                    <FormControl sx={{ marginBottom: 2, width:"80%" }}>
                        <InputLabel id="prediction-label">Provider defined threshold</InputLabel>
                        <Select
                        labelId="prediction-label"
                        value={predictionValue}
                        label="Provider defined threshold"
                        onChange={onPredictionChange}
                        >
                        {[50, 60, 70, 80, 90, 100].map((val) => (
                            <MenuItem key={val} value={val}>{val}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                    <div style={{ flex: 1, height: '250px' }}>
                        <Line 
                        ref={accuracyChartRef}
                        data={extendedChart} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                    labels: {
                                        usePointStyle: true,
                                        pointStyle: 'line',
                                        pointStyleWidth: 50,
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        padding: 15,
                                        generateLabels: function(chart) {
                                            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                                            const labels = original.call(this, chart);
                                            
                                            labels.forEach((label, index) => {
                                                const dataset = chart.data.datasets[index];
                                                label.pointStyle = 'line';
                                                label.pointStyleWidth = 50;
                                                label.strokeStyle = dataset.borderColor || label.fillStyle;
                                                label.fillStyle = dataset.borderColor || label.fillStyle;
                                                label.lineWidth = 5;
                                                
                                                // Make dotted line for dashed datasets (green threshold line)
                                                if (dataset.borderDash && dataset.borderDash.length > 0) {
                                                    label.lineDash = [8, 4];
                                                }
                                            });
                                            
                                            return labels;
                                        }
                                    }
                                },
                            },
                            elements: {
                                line: {
                                    borderWidth: 4
                                },
                                point: {
                                    radius: 4,
                                    hoverRadius: 6
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time', 
                                        font: { 
                                            size: 14, 
                                            weight: 'bold', 
                                            family: 'Arial, sans-serif' 
                                        },
                                        color: '#333'
                                    },
                                    ticks: {
                                        font: { 
                                            size: 12, 
                                            weight: 'bold', 
                                            family: 'Arial, sans-serif' 
                                        },
                                        color: '#333'
                                    }
                                },
                                y: {
                                    min: 0, 
                                    ticks: {
                                        stepSize: 25,
                                        font: { 
                                            size: 12, 
                                            weight: 'bold', 
                                            family: 'Arial, sans-serif' 
                                        },
                                        color: '#333'
                                    },
                                    title: {
                                        display: true,
                                        text: 'Observed Frequency', 
                                        font: { 
                                            size: 14, 
                                            weight: 'bold', 
                                            family: 'Arial, sans-serif' 
                                        },
                                        color: '#333'
                                    }
                                },
                            },
                        }} />
                    </div>
                </Paper>

                {/* Chart 3 - Accuracy Metrics */}
                <Paper 
                    elevation={2} 
                    style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    sx={{
                        '&:hover': {
                            elevation: 8,
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>Accuracy Metrics</Typography>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={() => handleEnlargeChart(barChartData, 'Accuracy Metrics', 'bar')}
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
                                onClick={(e) => handleDownloadClick(e, 'bar')}
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
                    <div style={{ flex: 1, height: '320px' }}>
                        <Bar
                            ref={barChartRef}
                            data={{
                                ...barChartData,
                                datasets: barChartData.datasets.map(dataset => ({
                                    ...dataset,
                                    borderWidth: 2,
                                    borderRadius: 4,
                                    borderSkipped: false,
                                }))
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        titleColor: '#fff',
                                        bodyColor: '#fff',
                                        borderColor: '#333',
                                        borderWidth: 1,
                                        cornerRadius: 8,
                                        displayColors: true
                                    }
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Metrics',
                                            font: { 
                                                size: 14, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        ticks: {
                                            font: { 
                                                size: 12, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        min: 0,
                                        max: 1.2,
                                        ticks: { 
                                            stepSize: 0.2,
                                            font: { 
                                                size: 12, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        title: {
                                            display: true,
                                            text: 'Score',
                                            font: { 
                                                size: 14, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                },
                                elements: {
                                    bar: {
                                        borderWidth: 2,
                                        hoverBorderWidth: 2,
                                        hoverBackgroundColor: undefined,
                                        hoverBorderColor: undefined,
                                        shadowColor: 'rgba(0, 0, 0, 0.15)',
                                        shadowBlur: 8,
                                        shadowOffsetX: 0,
                                        shadowOffsetY: 4
                                    }
                                }
                            }}
                        />
                    </div>
                </Paper>

                {/* Chart 4 - ROC Curve */}
                <Paper 
                    elevation={2} 
                    style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    sx={{
                        '&:hover': {
                            elevation: 8,
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" gutterBottom align="left" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>ROC Curve</Typography>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={() => handleEnlargeChart(rocChart, 'ROC Curve', 'line')}
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
                                onClick={(e) => handleDownloadClick(e, 'roc')}
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
                    <div style={{ flex: 1, height: '320px' }}>
                        <Line
                            ref={rocChartRef}
                            data={rocChart}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top',
                                        labels: {
                                            usePointStyle: true,
                                            pointStyle: 'line',
                                            pointStyleWidth: 50,
                                            font: {
                                                size: 14,
                                                weight: 'bold'
                                            },
                                            padding: 15,
                                            generateLabels: function(chart) {
                                                const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                                                const labels = original.call(this, chart);
                                                
                                                labels.forEach((label, index) => {
                                                    const dataset = chart.data.datasets[index];
                                                    label.pointStyle = 'line';
                                                    label.pointStyleWidth = 50;
                                                    label.strokeStyle = dataset.borderColor || label.fillStyle;
                                                    label.fillStyle = dataset.borderColor || label.fillStyle;
                                                    label.lineWidth = 5;
                                                });
                                                
                                                return labels;
                                            }
                                        }
                                    }
                                },
                                elements: {
                                    line: {
                                        borderWidth: 4
                                    },
                                    point: {
                                        radius: 4,
                                        hoverRadius: 6
                                    }
                                },
                                scales: {
                                    x: { 
                                        type:'linear',
                                        title: {
                                            display:true,
                                            text:'False Positive Rate',
                                            font: { 
                                                size: 14, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        ticks: {
                                            font: { 
                                                size: 12, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        min: 0, 
                                        max: 1 
                                    },
                                    y: { 
                                        type:'linear',
                                        title: {
                                            display:true,
                                            text:'True Positive Rate',
                                            font: { 
                                                size: 14, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        ticks: {
                                            font: { 
                                                size: 12, 
                                                weight: 'bold', 
                                                family: 'Arial, sans-serif' 
                                            },
                                            color: '#333'
                                        },
                                        min: 0, 
                                        max: 1 
                                    },
                                },
                            }}
                        />
                    </div>
                </Paper>

                {/* Chart 5 - Calibration Curve - Full Width */}
                <div style={{ gridColumn: '1 / -1' }}>
                    {calibrationData && calibrationData.predictions && calibrationData.actual ? (
                        <CalibrationCurve 
                            predictions={calibrationData.predictions}
                            actual={calibrationData.actual}
                            processedData={calibrationData.processedData}
                            nBins={10}
                            title="Calibration Curve"
                        />
                    ) : (
                        <Paper elevation={2} style={{ padding: 16, height: '400px', width: '100%' }}>
                            <Typography variant="subtitle1" align="center" style={{ marginTop: '180px' }}>
                                Calibration data not available
                            </Typography>
                        </Paper>
                    )}
                </div>
            </div>

            {/* Modal for enlarged charts */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xl" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>{modalTitle}</span>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={(e) => {
                                    const chartType = modalChart?.type === 'line' ? (modalTitle.includes('Accuracy') ? 'accuracy' : 'roc') : 
                                                     modalChart?.type === 'breakdown' ? 'breakdown' : 'bar';
                                    handleDownloadClick(e, chartType);
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
                <DialogContent sx={{ overflow: 'hidden' }}>
                    <Box style={{ height: '600px', width: '100%', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                        {modalChart && modalChart.type === 'line' && (
                            <Line 
                                data={modalChart.data} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    layout: {
                                        padding: {
                                            top: 20,
                                            right: 20,
                                            bottom: 20,
                                            left: 20
                                        }
                                    },
                                    plugins: {
                                        legend: modalTitle.includes('ROC') ? {
                                            display: true,
                                            position: 'top',
                                            labels: {
                                                usePointStyle: true,
                                                pointStyle: 'line',
                                                pointStyleWidth: 50,
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                },
                                                padding: 15,
                                                generateLabels: function(chart) {
                                                    const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                                                    const labels = original.call(this, chart);
                                                    
                                                    labels.forEach((label, index) => {
                                                        const dataset = chart.data.datasets[index];
                                                        label.pointStyle = 'line';
                                                        label.pointStyleWidth = 50;
                                                        label.strokeStyle = dataset.borderColor || label.fillStyle;
                                                        label.fillStyle = dataset.borderColor || label.fillStyle;
                                                        label.lineWidth = 5;
                                                    });
                                                    
                                                    return labels;
                                                }
                                            }
                                        } : modalTitle.includes('Accuracy') ? {
                                            display: true,
                                            position: 'bottom',
                                            labels: {
                                                usePointStyle: true,
                                                pointStyle: 'line',
                                                pointStyleWidth: 50,
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                },
                                                padding: 15,
                                                generateLabels: function(chart) {
                                                    const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                                                    const labels = original.call(this, chart);
                                                    
                                                    labels.forEach((label, index) => {
                                                        const dataset = chart.data.datasets[index];
                                                        label.pointStyle = 'line';
                                                        label.pointStyleWidth = 50;
                                                        label.strokeStyle = dataset.borderColor || label.fillStyle;
                                                        label.fillStyle = dataset.borderColor || label.fillStyle;
                                                        label.lineWidth = 5;
                                                        
                                                        // Make dotted line for dashed datasets (green threshold line)
                                                        if (dataset.borderDash && dataset.borderDash.length > 0) {
                                                            label.lineDash = [8, 4];
                                                        }
                                                    });
                                                    
                                                    return labels;
                                                }
                                            }
                                        } : { display: false }
                                    },
                                    elements: {
                                        line: {
                                            borderWidth: 4
                                        },
                                        point: {
                                            radius: 4,
                                            hoverRadius: 6
                                        }
                                    },
                                    scales: modalTitle.includes('ROC') ? {
                                        x: { 
                                            type:'linear', 
                                            title: {
                                                display:true, 
                                                text:'False Positive Rate',
                                                font: { 
                                                    size: 14, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            ticks: {
                                                font: { 
                                                    size: 12, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            min: 0, 
                                            max: 1 
                                        },
                                        y: { 
                                            type:'linear', 
                                            title: {
                                                display:true, 
                                                text:'True Positive Rate',
                                                font: { 
                                                    size: 14, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            ticks: {
                                                font: { 
                                                    size: 12, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            min: 0, 
                                            max: 1 
                                        },
                                    } : modalTitle.includes('Accuracy') ? {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Time', 
                                                font: { 
                                                    size: 14, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            ticks: {
                                                font: { 
                                                    size: 12, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            }
                                        },
                                        y: {
                                            min: 0, 
                                            ticks: {
                                                stepSize: 25,
                                                font: { 
                                                    size: 12, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            title: {
                                                display: true,
                                                text: 'Observed Frequency', 
                                                font: { 
                                                    size: 14, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            }
                                        },
                                    } : {}
                                }} 
                            />
                        )}
                        {modalChart && modalChart.type === 'bar' && (
                            <Bar 
                                data={modalChart.data} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    layout: {
                                        padding: {
                                            top: 20,
                                            right: 20,
                                            bottom: 20,
                                            left: 20
                                        }
                                    },
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            titleColor: '#fff',
                                            bodyColor: '#fff',
                                            borderColor: '#333',
                                            borderWidth: 1,
                                            cornerRadius: 8,
                                            displayColors: true
                                        }
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Metrics',
                                                font: { 
                                                    size: 14, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            ticks: {
                                                font: { 
                                                    size: 12, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            grid: {
                                                display: false
                                            }
                                        },
                                        y: {
                                            min: 0,
                                            max: 1.2,
                                            ticks: { 
                                                stepSize: 0.2,
                                                font: { 
                                                    size: 12, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            title: {
                                                display: true,
                                                text: 'Score',
                                                font: { 
                                                    size: 14, 
                                                    weight: 'bold', 
                                                    family: 'Arial, sans-serif' 
                                                },
                                                color: '#333'
                                            },
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)'
                                            }
                                        },
                                    },
                                    elements: {
                                        bar: {
                                            borderWidth: 2,
                                            hoverBorderWidth: 2,
                                            hoverBackgroundColor: undefined,
                                            hoverBorderColor: undefined,
                                            shadowColor: 'rgba(0, 0, 0, 0.15)',
                                            shadowBlur: 8,
                                            shadowOffsetX: 0,
                                            shadowOffsetY: 4
                                        }
                                    }
                                }} 
                            />
                        )}
                        {modalChart && modalChart.type === 'breakdown' && (
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(2, 1fr)" 
                                gap={3}
                                columnGap={8}
                                rowGap={2}
                                sx={{ 
                                    height: '400px',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                    paddingX: 2,
                                    paddingY: 3
                                }}
                            >
                                <Box
                                    bgcolor="#e0f2f1"
                                    p={3}
                                    borderRadius={3}
                                    textAlign="center"
                                    display="flex" 
                                    justifyContent="center" 
                                    alignItems="center"
                                    height="200px"
                                    width="100%"
                                    sx={{
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        aspectRatio: '1',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.03)',
                                            boxShadow: '0 12px 30px rgba(76, 175, 80, 0.4)',
                                            bgcolor: '#c8e6c9'
                                        }
                                    }}
                                >
                                    <div>
                                        <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 1 }}>
                                            {metricsData.confusion_matrix.true_positive} 
                                            ({percent(metricsData.confusion_matrix.true_positive)})
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>Correctly predicted</Typography>
                                    </div>
                                </Box>
                                <Box
                                    bgcolor="#ffebee"
                                    p={3}
                                    borderRadius={3}
                                    textAlign="center"
                                    display="flex" 
                                    justifyContent="center" 
                                    alignItems="center"
                                    height="200px"
                                    width="100%"
                                    sx={{
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        aspectRatio: '1',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.03)',
                                            boxShadow: '0 12px 30px rgba(244, 67, 54, 0.4)',
                                            bgcolor: '#ffcdd2'
                                        }
                                    }}
                                >
                                    <div>
                                        <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 1 }}>
                                            {metricsData.confusion_matrix.false_negative} 
                                            ({percent(metricsData.confusion_matrix.false_negative)})
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>Missed Predictions</Typography>
                                    </div>
                                </Box>
                                <Box
                                    bgcolor="#ffebee"
                                    p={3}
                                    borderRadius={3}
                                    textAlign="center"
                                    display="flex" 
                                    justifyContent="center" 
                                    alignItems="center"
                                    height="200px"
                                    width="100%"
                                    sx={{
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        aspectRatio: '1',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.03)',
                                            boxShadow: '0 12px 30px rgba(244, 67, 54, 0.4)',
                                            bgcolor: '#ffcdd2'
                                        }
                                    }}
                                >
                                    <div>
                                        <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 1 }}>
                                            {metricsData.confusion_matrix.false_positive} 
                                            ({percent(metricsData.confusion_matrix.false_positive)})
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>Wrongly predicted positive</Typography>
                                    </div>
                                </Box>
                                <Box
                                    bgcolor="#e0f2f1"
                                    p={3}
                                    borderRadius={3}
                                    textAlign="center"
                                    display="flex" 
                                    justifyContent="center" 
                                    alignItems="center"
                                    height="200px"
                                    width="100%"
                                    sx={{
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        aspectRatio: '1',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.03)',
                                            boxShadow: '0 12px 30px rgba(76, 175, 80, 0.4)',
                                            bgcolor: '#c8e6c9'
                                        }
                                    }}
                                >
                                    <div>
                                        <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 1 }}>
                                            {metricsData.confusion_matrix.true_negative} 
                                            ({percent(metricsData.confusion_matrix.true_negative)})
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>Correctly predicted negative</Typography>
                                    </div>
                                </Box>
                            </Box>
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

export default MetricsSection;

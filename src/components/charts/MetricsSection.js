import React, { useState, useRef } from 'react';
import { Grid, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
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
        if (topic.includes("CKD")) {
            return "CKD Risk Breakdown";
        } else if (topic.includes("CardioVascularDisease")) {
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
                gridTemplateColumns: '1fr 1fr', 
                gap: '24px',
                width: '100%',
                gridAutoRows: 'minmax(400px, auto)'
            }}>
                {/* Chart 1 - Risk Breakdown */}
                <Paper elevation={2} style={{ padding: 16, height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
                            {getTitle()} 
                        </Typography>
                    </Box>
                    <Box
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
                <Paper elevation={2} style={{ padding: 16, height: '400px', display: 'flex', flexDirection: 'column' }}>
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
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time', 
                                        font: { size: 14 }
                                      }
                                },
                                y: {
                                    min: 0, 
                                    ticks: {
                                        stepSize: 25, 
                                    },
                                    title: {
                                        display: true,
                                        text: 'Observed Frequency', 
                                        font: { size: 14 }
                                      }
                                },
                            },
                        }} />
                    </div>
                </Paper>

                {/* Chart 3 - Accuracy Metrics */}
                <Paper elevation={2} style={{ padding: 16, height: '400px', display: 'flex', flexDirection: 'column' }}>
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
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        min: 0,
                                        max: 1.2,
                                        ticks: { stepSize: 0.2 },
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
                <Paper elevation={2} style={{ padding: 16, height: '400px', display: 'flex', flexDirection: 'column' }}>
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
                                scales: {
                                    x: { type:'linear',title : {display:true,text:'False Positive Rate'}, min: 0, max: 1 },
                                    y: { type:'linear',title : {display:true,text:'True Positive Rate'}, min: 0, max: 1 },
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
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>{modalTitle}</span>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={(e) => {
                                    setActiveChart(modalChart?.type === 'line' ? (modalTitle.includes('Accuracy') ? 'accuracy' : 'roc') : 'bar');
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
                    <Box style={{ height: '500px', width: '100%', padding: '16px', position: 'relative' }}>
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
                                    scales: modalTitle.includes('ROC') ? {
                                        x: { type:'linear', title: {display:true, text:'False Positive Rate'}, min: 0, max: 1 },
                                        y: { type:'linear', title: {display:true, text:'True Positive Rate'}, min: 0, max: 1 },
                                    } : modalTitle.includes('Accuracy') ? {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Time', 
                                                font: { size: 14 }
                                            }
                                        },
                                        y: {
                                            min: 0, 
                                            ticks: {
                                                stepSize: 25, 
                                            },
                                            title: {
                                                display: true,
                                                text: 'Observed Frequency', 
                                                font: { size: 14 }
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
                                    }
                                }} 
                            />
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

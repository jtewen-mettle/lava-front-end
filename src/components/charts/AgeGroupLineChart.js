import React, { useState, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';

const AgeGroupLineChart = ({ data }) => {
    const [openModal, setOpenModal] = useState(false);
    const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
    const chartRef = useRef(null);
    console.log("AgeGroupLineChart");
    console.log(data);

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
                
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                
                img.onload = () => {
                    canvas.width = svgElement.clientWidth || 800;
                    canvas.height = svgElement.clientHeight || 400;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    
                    let mimeType = 'image/png';
                    if (format === 'jpg' || format === 'jpeg') {
                        mimeType = 'image/jpeg';
                    }
                    
                    const downloadUrl = canvas.toDataURL(mimeType);
                    const link = document.createElement('a');
                    link.download = `age_group_analysis.${format === 'pdf' ? 'png' : format}`;
                    link.href = downloadUrl;
                    link.click();
                    
                    URL.revokeObjectURL(url);
                };
                
                img.src = url;
            }
        }
        handleDownloadClose();
    };

    const legendFormatter = (value) => (
        <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
            {value}
        </span>
    );

    const processedData = data
        .map((d) => ({
            ...d,
            "True Positive Rate": d["True Positive Rate"] * 100,
            "True Negative Rate": d["True Negative Rate"] * 100,
            "False Positive Rate": d["False Positive Rate"] * 100,
            "False Negative Rate": d["False Negative Rate"] * 100,
        }))
        .sort((a, b) => a.Subgroup.localeCompare(b.Subgroup));

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <h3 style={{ margin: 0, textAlign: 'left', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                    Subgroup Analysis across AgeGroup
                </h3>
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
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        ref={chartRef}
                        data={processedData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                    dataKey="Subgroup"
                    type="category"
                    label={{ value: "Age Group", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis
                    domain={[0, 120]}
                    ticks={[0, 20, 40, 60, 80, 100, 120]}
                    label={{ value: "Rate (%)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend formatter={legendFormatter} />
                    <Line type="monotone" dataKey="True Positive Rate" stroke="#ff0000" name="True Positive Rate" />
                    <Line type="monotone" dataKey="True Negative Rate" stroke="#cc8400" name="True Negative Rate" />
                    <Line type="monotone" dataKey="False Positive Rate" stroke="#0000ff" name="False Positive Rate" />
                    <Line type="monotone" dataKey="False Negative Rate" stroke="#ff00ff" name="False Negative Rate" />
                </LineChart>
            </ResponsiveContainer>
            </div>

            {/* Modal for enlarged chart */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xl" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>Subgroup Analysis across AgeGroup</span>
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
                    <Box style={{ height: '500px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={processedData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                dataKey="Subgroup"
                                type="category"
                                label={{ value: "Age Group", position: "insideBottomRight", offset: -5 }}
                                />
                                <YAxis
                                domain={[0, 120]}
                                ticks={[0, 20, 40, 60, 80, 100, 120]}
                                label={{ value: "Rate (%)", angle: -90, position: "insideLeft" }}
                                />
                                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                <Legend formatter={legendFormatter} />
                                <Line type="monotone" dataKey="True Positive Rate" stroke="#ff0000" name="True Positive Rate" />
                                <Line type="monotone" dataKey="True Negative Rate" stroke="#cc8400" name="True Negative Rate" />
                                <Line type="monotone" dataKey="False Positive Rate" stroke="#0000ff" name="False Positive Rate" />
                                <Line type="monotone" dataKey="False Negative Rate" stroke="#ff00ff" name="False Negative Rate" />
                            </LineChart>
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

export default AgeGroupLineChart;

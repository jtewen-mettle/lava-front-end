import React, { useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';

const GENDER_COLORS = ['rgb(130, 202, 157)', 'rgb(136, 132, 216)'];

const prepareChartData = (data) =>
    Object.entries(data).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize the label
        value
      }));

const DistributionPieChart = ({ title, data }) => {
    const [openModal, setOpenModal] = useState(false);
    const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
    const chartRef = useRef(null);

    const chartData = prepareChartData(data);
    console.log(data);
    console.log(chartData);

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
                    canvas.width = svgElement.clientWidth || 400;
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
                    link.download = `gender_distribution.${format === 'pdf' ? 'png' : format}`;
                    link.href = downloadUrl;
                    link.click();
                    
                    URL.revokeObjectURL(url);
                };
                
                img.src = url;
            }
        }
        handleDownloadClose();
    };
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14px"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload, label, coordinate }) => {
        if (active && payload && payload.length && coordinate) {
            const data = payload[0];
            
            // Get the chart container dimensions and center
            const chartCenter = { x: 200, y: 150 }; 
            const outerRadius = 100;
            const tooltipDistance = outerRadius -40;
            
            // Position both tooltips at the same place on the right side
            const tooltipX = chartCenter.x + tooltipDistance;
            const tooltipY = chartCenter.y;
            
            return (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '12px',
                    border: `2px solid ${data.payload.fill}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Arial, sans-serif',
                    position: 'absolute',
                    left: tooltipX,
                    top: tooltipY,
                    pointerEvents: 'none',
                    zIndex: 1000,
                    transform: 'translate(-50%, -50%)',
                    minWidth: '80px',
                    textAlign: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <p style={{ margin: 0, color: data.payload.fill, fontWeight: 'bold' }}>
                        {data.name}: {data.value}
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: '#333' }}>
                        {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };


    return (
        <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" gutterBottom align="left" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
                    {title}
                </Typography>
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
            <div style={{ flex: 1, height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart ref={chartRef}>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={100}
                            startAngle={90}
                            endAngle={450}
                            label={renderCustomLabel}
                            labelLine={false}
                            stroke="#fff"
                            strokeWidth={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                                    style={{
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} position={{ x: 0, y: 0 }} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            wrapperStyle={{ 
                                paddingTop: '20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                fontFamily: 'Arial, sans-serif'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Modal for enlarged chart */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>{title}</span>
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
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={180}
                                    startAngle={90}
                                    endAngle={450}
                                    label={renderCustomLabel}
                                    labelLine={false}
                                    stroke="#fff"
                                    strokeWidth={3}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                                            style={{
                                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} position={{ x: 0, y: 0 }} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    wrapperStyle={{ 
                                        paddingTop: '20px',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        fontFamily: 'Arial, sans-serif'
                                    }}
                                />
                            </PieChart>
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
        </Paper>
    );
};


export default DistributionPieChart;

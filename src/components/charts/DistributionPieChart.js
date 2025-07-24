import React, { useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#8dd1e1'];

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
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Adjust the label position closer to the center
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white" // Text color
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12px"
            >
                {value} {/* Display the value */}
            </text>
        );
    };


    return (
        <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" gutterBottom align="left">
                    {title}
                </Typography>
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
            <div style={{ flex: 1, height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart ref={chartRef}>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={renderCustomLabel}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '10px',bottom: '20px' }}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Modal for enlarged chart */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>{title}</span>
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
                    <Box style={{ height: '500px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    label={renderCustomLabel}
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '10px' }}/>
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

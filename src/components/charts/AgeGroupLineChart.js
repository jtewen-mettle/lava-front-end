import React, { useState, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { ZoomIn, Download } from '@mui/icons-material';
import { downloadChart as downloadChartUtil } from './ChartDownloadUtils';

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
            const chartContainer = chartRef.current.container;
            
            // Create tooltip data with age group analysis summary
            const tooltipData = {
                label: 'Age Group Analysis',
                value: `Total groups: ${data.length} | Metrics: TPR, TNR, FPR, FNR analyzed across age groups`
            };

            // Create legend data for age group metrics
            const legendData = [
                { label: 'True Positive Rate', color: '#8884d8' },
                { label: 'True Negative Rate', color: '#82ca9d' },
                { label: 'False Positive Rate', color: '#ffc658' },
                { label: 'False Negative Rate', color: '#ff7c7c' }
            ];
            
            downloadChartUtil({
                chartElement: chartContainer,
                format,
                fileName: 'age_group_analysis',
                title: 'Subgroup Analysis across AgeGroup',
                chartType: 'svg',
                tooltipData,
                legendData
            });
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
                    tick={{ 
                        fontSize: 12, 
                        fontWeight: 'bold', 
                        fontFamily: 'Arial, sans-serif',
                        fill: '#333'
                    }}
                    label={{ 
                        value: "Age Group", 
                        position: "insideBottom", 
                        offset: -5,
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
                        value: "Rate (%)", 
                        angle: -90, 
                        position: "insideLeft",
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
                    <Legend 
                        formatter={legendFormatter} 
                        wrapperStyle={{ fontSize: '14px', fontWeight: 'bold', paddingTop: '10px' }}
                    />
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
                <DialogContent sx={{ overflow: 'hidden' }}>
                    <Box style={{ height: '600px', width: '100%', overflow: 'hidden' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={processedData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                dataKey="Subgroup"
                                type="category"
                                tick={{ 
                                    fontSize: 12, 
                                    fontWeight: 'bold', 
                                    fontFamily: 'Arial, sans-serif',
                                    fill: '#333'
                                }}
                                label={{ 
                                    value: "Age Group", 
                                    position: "insideBottom", 
                                    offset: -5,
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
                                    value: "Rate (%)", 
                                    angle: -90, 
                                    position: "insideLeft",
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
                                <Legend 
                        formatter={legendFormatter} 
                        wrapperStyle={{ fontSize: '14px', fontWeight: 'bold', paddingTop: '10px' }}
                    />
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
                <MenuItem onClick={() => downloadChart('svg')}>Download as SVG</MenuItem>
            </Menu>
        </div>
    );
};

export default AgeGroupLineChart;

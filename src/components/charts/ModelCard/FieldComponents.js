import React from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import {
  FieldContainer,
  FieldLabel,
  FieldValue,
  StatusBadge,
  MetricValue,
  MetricLabel,
  WarningBox,
  CriticalBox,
  BoxTitle,
  CriticalBoxTitle,
  BoxList,
  CriticalBoxList,
  FairnessContainer,
  FairnessTitle,
  FairnessSubsection,
  FairnessSubtitle,
  FairnessText
} from './styles';

// Grid component for field layout
export const FieldGrid = ({ items, columns = 3 }) => (
  <Box 
    sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        md: `repeat(2, 1fr)`, 
        lg: `repeat(${columns}, 1fr)`
      },
      gap: 2,
      width: '100%',
      marginBottom: 2
    }}
  >
    {items.map((item, index) => (
      <FieldContainer key={index}>
        <FieldLabel>{item.label}</FieldLabel>
        <FieldValue>{item.value}</FieldValue>
      </FieldContainer>
    ))}
  </Box>
);

// Metric grid component
export const MetricGrid = ({ metrics }) => (
  <Box 
    sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)'
      },
      gap: 2,
      marginBottom: 2
    }}
  >
    {metrics.map((metric, index) => (
      <Box
        key={index}
        sx={{
          backgroundColor: '#f8f9fa',
          border: '2px solid #e3f2fd',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '40px',
          minHeight: '40px',
          maxHeight: '60px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#e3f2fd',
            borderColor: '#5dade2',
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(93, 173, 226, 0.2)',
          }
        }}
      >
        <MetricValue>{metric.value}</MetricValue>
        <MetricLabel>{metric.label}</MetricLabel>
      </Box>
    ))}
  </Box>
);

// Helper function to categorize demographic variables
const getDemographicCategory = (variable) => {
  const variableStr = String(variable).toLowerCase();
  if (variableStr.includes('race') || variableStr.includes('hispanic') || variableStr.includes('latino') || variableStr.includes('african') || variableStr.includes('white') || variableStr.includes('black')) {
    return 'race';
  }
  if (variableStr.includes('sex') || variableStr.includes('female') || variableStr.includes('male')) {
    return 'sex';
  }
  if (variableStr.includes('age')) {
    return 'age';
  }
  return 'other';
};

// Enhanced data table component with visual category grouping
export const DataTable = ({ headers, data }) => {
  // Group data by demographic categories for visual separation
  const getRowBackgroundColor = (index) => {
    const baseColor = index % 2 === 0 ? 'transparent' : '#f8f9fa';
    return baseColor;
  };

  const getCategoryBorderLeft = (variable) => {
    const category = getDemographicCategory(variable);
    switch (category) {
      case 'race':
        return '4px solid #e3f2fd'; // Light blue for race
      case 'sex':
        return '4px solid #f3e5f5'; // Light purple for sex
      case 'age':
        return '4px solid #e8f5e8'; // Light green for age
      default:
        return '4px solid transparent';
    }
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e1e8ed' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            {headers.map((header, index) => (
              <TableCell 
                key={index} 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  whiteSpace: 'pre-line',
                  textAlign: index === 0 ? 'left' : 'center',
                  padding: '12px'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => {
            const firstCellValue = Object.values(row)[0];
            return (
              <TableRow 
                key={index}
                sx={{
                  backgroundColor: getRowBackgroundColor(index),
                  borderLeft: getCategoryBorderLeft(firstCellValue),
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  }
                }}
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <TableCell 
                    key={cellIndex}
                    sx={{
                      textAlign: cellIndex === 0 ? 'left' : 'center',
                      padding: '12px'
                    }}
                  >
                    {cellIndex === 0 ? (
                      <Box sx={{ fontWeight: '500' }}>{cell}</Box>
                    ) : (
                      cell
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Warning box component
export const WarningBoxComponent = ({ title, items }) => (
  <WarningBox>
    <BoxTitle>⚠️ {title}</BoxTitle>
    <BoxList>
      {items?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </BoxList>
  </WarningBox>
);

// Critical box component
export const CriticalBoxComponent = ({ title, items }) => (
  <CriticalBox>
    <CriticalBoxTitle>🚫 {title}</CriticalBoxTitle>
    <CriticalBoxList>
      {items?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </CriticalBoxList>
  </CriticalBox>
);

// Reference list component
export const ReferenceList = ({ title, references }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
      {title}
    </Typography>
    {references?.map((reference, index) => (
      <Box key={index} sx={{ 
        p: 2, 
        mb: 2, 
        border: '1px solid #e1e8ed', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography sx={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
          {reference}
        </Typography>
      </Box>
    ))}
  </Box>
);

// Status badge with enhanced functionality
export const EnhancedStatusBadge = ({ variant, children, description }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <StatusBadge variant={variant}>{children}</StatusBadge>
    {description && (
      <Typography sx={{ mt: 1, fontSize: '16px', color: '#666' }}>
        {description}
      </Typography>
    )}
  </Box>
);

// Fairness Development Process component
export const FairnessComponent = ({ data }) => (
  <FairnessContainer>
    <FairnessTitle>
      🎯 Fairness Development Process
    </FairnessTitle>
    
    <FairnessSubsection>
      <FairnessSubtitle>Fairness Approach</FairnessSubtitle>
      <FairnessText>{data.fairnessApproach}</FairnessText>
    </FairnessSubsection>
    
    <FairnessSubsection>
      <FairnessSubtitle>Bias Management</FairnessSubtitle>
      <FairnessText>{data.biasManagement}</FairnessText>
    </FairnessSubsection>
  </FairnessContainer>
);

// Bullet point card component for references and lists
export const BulletPointCard = ({ title, items }) => (
  <FieldContainer>
    <FieldLabel>{title}</FieldLabel>
    <FieldValue>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {items?.map((item, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            {item}
          </li>
        ))}
      </ul>
    </FieldValue>
  </FieldContainer>
);
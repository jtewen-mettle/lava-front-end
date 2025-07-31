import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)({
  minHeight: 'auto',
  width: '100%',
  position: 'relative',
  backgroundColor: 'transparent',
  borderRadius: '12px 12px 0 0',
  padding: '0',
  margin: '0',
  borderBottom: '2.5px solid #e5e7eb',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: '10px',
    position: 'relative',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'None',
  fontWeight: 600,
  fontSize: '13px',
  fontFamily: 'Arial, sans-serif',
  borderRadius: '12px 12px 0 0',
  minHeight: '36px',
  padding: '8px 12px',
  marginRight: 0,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#e5e7eb',
  color: '#6b7280',
  border: 'none',
  borderBottom: '2.5px solid transparent',
  width: '160px',
  minWidth: '160px',
  maxWidth: '180px',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#d1d5db',
    color: '#374151',
    transform: 'scale(1.05)',
    borderBottom: '2.5px solid #93c5fd',
  },
  '&.Mui-selected': {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderBottom: '2.5px solid #1d4ed8',
    transform: 'scale(1.02)',
    '&:hover': {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderBottom: '2.5px solid #1d4ed8',
      transform: 'scale(1.05)',
    },
  },
}));

// Model Card styled components - exact match
const FieldContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #e1e8ed',
  transition: 'all 0.3s ease',
  minHeight: '120px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  '&:hover': {
    borderColor: '#5dade2',
    boxShadow: '0 4px 12px rgba(93, 173, 226, 0.1)',
  },
}));

const FieldLabel = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: '#275786',
  marginBottom: '12px',
  display: 'block',
  fontSize: '18px',
  fontFamily: 'Arial, sans-serif',
}));

const FieldValue = styled('div')(({ theme }) => ({
  color: '#333',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  lineHeight: 1.6,
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
}));

const PerformanceChip = styled(Chip)(({ severity }) => ({
  backgroundColor: 
    severity === 'excellent' ? '#d4edda' :
    severity === 'good' ? '#d1ecf1' :
    severity === 'fair' ? '#fff3cd' :
    severity === 'poor' ? '#f8d7da' : '#e9ecef',
  color:
    severity === 'excellent' ? '#155724' :
    severity === 'good' ? '#0c5460' :
    severity === 'fair' ? '#856404' :
    severity === 'poor' ? '#721c24' : '#495057',
  fontWeight: 'bold',
  fontSize: '12px',
  margin: '2px',
}));

const SectionDivider = styled('div')(({ theme }) => ({
  height: '2px',
  background: 'linear-gradient(90deg, #275786 0%, #1164ad 100%)',
  margin: '12px 0',
  borderRadius: '1px',
}));

const SubHeading = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  fontFamily: 'Arial, sans-serif',
  marginBottom: '12px',
  marginTop: '16px',
}));

const InfoSection = styled('div')(({ theme, bgColor }) => ({
  backgroundColor: bgColor || '#f8f9fa',
  padding: '16px',
  borderRadius: '6px',
  border: `1px solid ${bgColor === '#fff3cd' ? '#ffc107' : bgColor === '#f8d7da' ? '#dc3545' : '#e1e8ed'}`,
  marginBottom: '16px',
  fontSize: '16px',
  lineHeight: 1.6,
  fontFamily: 'Arial, sans-serif',
}));

const FormulaBox = styled('div')(({ theme }) => ({
  backgroundColor: '#e8f4f8',
  padding: '16px',
  borderRadius: '6px',
  border: '1px solid #b3d9e8',
  fontFamily: 'monospace',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#275786',
  marginBottom: '16px',
  textAlign: 'center',
}));

const PerformanceGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '6px',
  marginTop: '8px',
}));

const PerformanceItem = styled('div')(({ theme, severity }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px',
  borderRadius: '4px',
  backgroundColor: 'white',
  border: `1px solid ${
    severity === 'excellent' ? '#28a745' :
    severity === 'good' ? '#17a2b8' :
    severity === 'fair' ? '#ffc107' :
    severity === 'poor' ? '#dc3545' : '#6c757d'
  }`,
}));

const PerformanceBadge = styled('span')(({ theme, severity }) => ({
  backgroundColor: 
    severity === 'excellent' ? '#28a745' :
    severity === 'good' ? '#17a2b8' :
    severity === 'fair' ? '#ffc107' :
    severity === 'poor' ? '#dc3545' : '#6c757d',
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '4px 10px',
  borderRadius: '12px',
  minWidth: '70px',
  textAlign: 'center',
  display: 'inline-block',
  fontFamily: 'Arial, sans-serif',
}));

const ChartVisualization = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '200px',
  border: '2px solid #333',
  borderRadius: '8px',
  position: 'relative',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
}));

const GlossaryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const accuracyMetrics = [
    {
      label: "Overall Accuracy",
      definition: "The percentage of correct predictions out of all predictions made by the model",
      formula: "(True Positives + True Negatives) / (Total Predictions)",
      range: "0 to 100% (0.0 to 1.0)",
      interpretation: "Higher values indicate better performance. However, accuracy alone can be misleading in medical contexts with imbalanced datasets where one outcome is much more common than the other",
      tooltip: "Measures how often the model's predictions are correct overall",
      performance: [
        { range: "≥80%", level: "excellent", desc: "Excellent" },
        { range: "70-79%", level: "good", desc: "Good" },
        { range: "60-69%", level: "fair", desc: "Acceptable" },
        { range: "<60%", level: "poor", desc: "Poor" }
      ]
    },
    {
      label: "Positive Predictive Value (Precision)",
      definition: "Of all positive predictions made by the model, what percentage were actually correct",
      formula: "True Positives / (True Positives + False Positives)",
      range: "0 to 100% (0.0 to 1.0)",
      medicalContext: "When the model predicts a patient has the condition, how often is it actually right?",
      clinicalImpact: "Low precision results in many false alarms, leading to unnecessary patient anxiety, additional testing, medical procedures, and increased healthcare costs",
      performance: [
        { range: "≥80%", level: "excellent", desc: "Excellent reliability" },
        { range: "70-79%", level: "good", desc: "Good reliability" },
        { range: "60-69%", level: "fair", desc: "Acceptable reliability" },
        { range: "<60%", level: "poor", desc: "Poor reliability" }
      ]
    },
    {
      label: "Sensitivity (Recall)",
      definition: "Of all actual positive cases, what percentage did the model correctly identify",
      formula: "True Positives / (True Positives + False Negatives)",
      range: "0 to 100% (0.0 to 1.0)",
      medicalContext: "Of all patients who actually have the condition, how many did the model successfully detect?",
      clinicalImpact: "Low sensitivity means missing patients who need treatment, which can be dangerous or life-threatening for serious medical conditions",
      performance: [
        { range: "≥90%", level: "excellent", desc: "Excellent detection" },
        { range: "80-89%", level: "good", desc: "Good detection" },
        { range: "70-79%", level: "fair", desc: "Acceptable detection" },
        { range: "<70%", level: "poor", desc: "Poor detection" }
      ]
    },
    {
      label: "Balanced Prediction Score (F1 Score)",
      definition: "The harmonic mean of Precision and Recall, providing a single metric that balances both measures",
      formula: "2 × (Precision × Recall) / (Precision + Recall)",
      range: "0 to 100% (0.0 to 1.0)",
      medicalContext: "Ideal metric when you need to balance between catching all cases (recall) and avoiding false alarms (precision)",
      clinicalImpact: "Provides overall model effectiveness by giving equal weight to both precision and recall, especially valuable when both false positives and false negatives have significant consequences",
      performance: [
        { range: "≥80%", level: "excellent", desc: "Excellent balance" },
        { range: "70-79%", level: "good", desc: "Good balance" },
        { range: "60-69%", level: "fair", desc: "Acceptable balance" },
        { range: "<60%", level: "poor", desc: "Poor balance" }
      ]
    }
  ];

  const confusionMatrixTerms = [
    {
      label: "True Positives (TP)",
      definition: "Correct predictions of positive cases (having the condition)",
      medicalExample: "CKD patients correctly identified as having CKD, or high-risk cardiovascular patients correctly flagged for intervention",
      clinicalImpact: "Successful early detection - patients receive needed treatment",
      severity: "excellent"
    },
    {
      label: "True Negatives (TN)",
      definition: "Correct predictions of negative cases (not having the condition)",
      medicalExample: "Healthy patients correctly identified as low-risk for prostate cancer or hospitalization",
      clinicalImpact: "Appropriate reassurance - no unnecessary interventions",
      severity: "excellent"
    },
    {
      label: "False Positives (FP)",
      definition: "Incorrect predictions of positive cases (false alarms)",
      medicalExample: "Low-risk patients incorrectly flagged for CKD screening or cardiovascular intervention",
      clinicalImpact: "Unnecessary testing, anxiety, and healthcare costs",
      severity: "fair"
    },
    {
      label: "False Negatives (FN)",
      definition: "Incorrect predictions of negative cases (missed diagnoses)",
      medicalExample: "High-risk CKD or cardiovascular patients not identified by the model",
      clinicalImpact: "Most critical - patients miss needed preventive care or treatment",
      severity: "poor"
    }
  ];

  // Enhanced Field Grid for Accuracy Metrics
  const AccuracyMetricsGrid = ({ items, columns = 2 }) => (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: `repeat(${columns}, 1fr)`, 
        },
        gap: 3,
        width: '100%',
        marginBottom: 3
      }}
    >
      {items.map((metric, index) => (
        <FieldContainer key={index}>
          <FieldLabel>{metric.label}</FieldLabel>
          <FieldValue>
            <Box>
              {/* Definition */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Definition:</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  {metric.definition}
                </Typography>
              </Box>
              
              {/* Formula */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Formula:</SubHeading>
                <FormulaBox>
                  {metric.formula}
                </FormulaBox>
              </Box>
              
              {/* Range */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Range:</SubHeading>
                <InfoSection>
                  {metric.range}
                </InfoSection>
              </Box>
              
              {/* Medical Context or Interpretation */}
              {metric.medicalContext && (
                <Box sx={{ mb: 2 }}>
                  <SubHeading component="h6">Medical Context:</SubHeading>
                  <InfoSection bgColor="#e8f4f8">
                    {metric.medicalContext}
                  </InfoSection>
                </Box>
              )}
              
              {metric.interpretation && (
                <Box sx={{ mb: 2 }}>
                  <SubHeading component="h6">Interpretation:</SubHeading>
                  <InfoSection bgColor="#e8f4f8">
                    {metric.interpretation}
                  </InfoSection>
                </Box>
              )}
              
              {/* Clinical Impact */}
              {metric.clinicalImpact && (
                <Box sx={{ mb: 2 }}>
                  <SubHeading component="h6">Clinical Impact:</SubHeading>
                  <InfoSection bgColor="#fff3cd">
                    {metric.clinicalImpact}
                  </InfoSection>
                </Box>
              )}
              
              {/* Tooltip */}
              {metric.tooltip && (
                <Box sx={{ mb: 2 }}>
                  <SubHeading component="h6">Key Insight:</SubHeading>
                  <InfoSection bgColor="#f8f9fa">
                    {metric.tooltip}
                  </InfoSection>
                </Box>
              )}
              
              {/* Performance Ranges */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Performance Ranges:</SubHeading>
              <PerformanceGrid>
                {metric.performance.map((perf, idx) => (
                  <PerformanceItem key={idx} severity={perf.level}>
                    <PerformanceBadge severity={perf.level}>
                      {perf.range}
                    </PerformanceBadge>
                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                      {perf.desc}
                    </Typography>
                  </PerformanceItem>
                ))}
              </PerformanceGrid>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      ))}
    </Box>
  );

  // Enhanced Field Grid for Confusion Matrix
  const ConfusionMatrixGrid = ({ items, columns = 2 }) => (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: `repeat(${columns}, 1fr)`, 
        },
        gap: 3,
        width: '100%',
        marginBottom: 3
      }}
    >
      {items.map((term, index) => (
        <FieldContainer key={index}>
          <FieldLabel>
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: 
                    term.severity === 'excellent' ? '#28a745' :
                    term.severity === 'good' ? '#17a2b8' :
                    term.severity === 'fair' ? '#ffc107' :
                    term.severity === 'poor' ? '#dc3545' : '#6c757d',
                  borderRadius: '50%' 
                }}
              />
              {term.label}
            </Box>
          </FieldLabel>
          <FieldValue>
            <Box>
              {/* Definition */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Definition:</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  {term.definition}
                </Typography>
              </Box>
              
              {/* Medical Example */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Medical Example:</SubHeading>
                <InfoSection bgColor="#e8f4f8">
                  {term.medicalExample}
                </InfoSection>
              </Box>
              
              {/* Clinical Impact */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Clinical Impact:</SubHeading>
              <InfoSection 
                bgColor={
                  term.severity === 'poor' ? '#f8d7da' :
                  term.severity === 'fair' ? '#fff3cd' : '#d4edda'
                }
              >
                {term.clinicalImpact}
              </InfoSection>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      ))}
    </Box>
  );

  const renderAccuracyMetrics = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        mb: 3,
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        Accuracy Metrics
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FieldContainer sx={{ minHeight: 'auto' }}>
          <FieldValue>
            <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
              Core performance metrics for evaluating medical prediction models. Each metric provides different insights into how well the model performs in clinical scenarios.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

      <AccuracyMetricsGrid items={accuracyMetrics} columns={2} />
    </Box>
  );

  const renderPerformanceCharts = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        mb: 3,
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        Performance Metrics
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FieldContainer sx={{ minHeight: 'auto' }}>
          <FieldValue>
            <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
              Interactive charts and explanations for understanding model performance visualizations including confusion matrix components, ROC curves, and calibration curves.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Confusion Matrix Section */}
      <Box sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Confusion Matrix Components
                </SubHeading>
              </Box>
              
              {/* Overview Text */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  The confusion matrix breaks down all model predictions into four categories. Understanding these helps evaluate how well the Lava ML models perform for CKD, cardiovascular, prostate cancer, and hospitalization risk predictions.
                </Typography>
              </Box>
              
              {/* Four Confusion Matrix Term Cards */}
              <ConfusionMatrixGrid items={confusionMatrixTerms} columns={2} />
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Accuracy over Time Section */}
      <Box sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Accuracy over Time Charts
                </SubHeading>
              </Box>
              
              {/* What is Accuracy over Time */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is an Accuracy over Time Chart?</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  An <strong>Accuracy over Time chart</strong> shows how your model's performance metrics change across different time periods. This helps identify if model performance is stable, improving, or degrading over time.
                </Typography>
                
                <InfoSection bgColor="#fff3cd">
                  <strong>Key insight:</strong> Models can become less accurate over time due to data drift, changing patient populations, or evolving medical practices. Regular monitoring is essential.
                </InfoSection>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read the Time Chart</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  The chart typically displays:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>X-axis (Time Period):</strong> Dates, months, or prediction batches
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Y-axis (Performance Score):</strong> Accuracy, AUROC, or other metrics as percentages
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Trend Lines:</strong> Show whether performance is stable, declining, or improving
                  </Typography>
                </Box>
              </Box>

              {/* Performance Patterns */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Common Performance Patterns</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Stable Performance: Flat line indicates consistent model reliability over time",
                    "Gradual Decline: Downward trend suggests data drift or changing patient characteristics",
                    "Sudden Drop: Sharp decline may indicate data quality issues or system changes",
                    "Seasonal Patterns: Regular fluctuations may reflect cyclical health trends"
                  ].map((pattern, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {pattern}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Monitor trends, not just individual data points",
                    "Investigate sudden performance drops immediately",
                    "Expect some natural variation in performance metrics",
                    "Use time charts to plan model retraining schedules"
                  ].map((point, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {point}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Accuracy Metrics Chart Section */}
      <Box sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Accuracy Metrics Charts
                </SubHeading>
              </Box>
              
              {/* What is Accuracy Metrics Chart */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is an Accuracy Metrics Chart?</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  An <strong>Accuracy Metrics Chart</strong> provides a visual comparison of different performance metrics (Accuracy, Precision, Recall, F1-Score, AUROC) in a single view. This helps you quickly assess overall model performance.
                </Typography>
                
                <InfoSection bgColor="#e8f4f8">
                  <strong>Purpose:</strong> Shows how well-balanced your model is across different evaluation criteria, helping identify strengths and weaknesses.
                </InfoSection>
              </Box>

              {/* Chart Types */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Common Chart Types</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  Accuracy metrics can be displayed as:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Bar Charts:</strong> Side-by-side comparison of different metrics
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Radar/Spider Charts:</strong> Multi-dimensional view showing metric balance
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Gauge Charts:</strong> Individual metrics displayed as performance dials
                  </Typography>
                </Box>
              </Box>

              {/* How to Interpret */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Interpret the Charts</SubHeading>
                <InfoSection bgColor="#d4edda">
                  <strong>✅ Good Performance:</strong> All metrics above 70%, with balanced scores across Precision and Recall (no extreme differences >20%)
                </InfoSection>
                
                <InfoSection bgColor="#f8d7da">
                  <strong>⚠️ Concerning Patterns:</strong> One metric much lower than others, or overall scores below 60% indicating poor model performance
                </InfoSection>
              </Box>

              {/* Practical Tips */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Practical Tips</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Look for balanced performance across all metrics, not just high accuracy",
                    "Pay attention to Precision vs Recall trade-offs for your specific medical use case",
                    "AUROC values above 0.8 generally indicate good discriminative ability",
                    "F1-Score provides a good overall balance between Precision and Recall"
                  ].map((tip, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {tip}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* ROC Curve Section */}
      <Box sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Prediction Quality (ROC) Curves
                </SubHeading>
              </Box>
              
              {/* What is ROC Curve */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is a Prediction Quality (ROC) Curve?</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  A <strong>Prediction Quality Curve</strong> (ROC - Receiver Operating Characteristic) is a graph that shows how well a classification model performs.
                </Typography>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read a Prediction Quality Curve</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  The prediction quality curve plots two important rates:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Y-axis (True Positive Rate):</strong> How good is the model at catching the "yes" cases? (Higher is better)
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>X-axis (False Positive Rate):</strong> How often does the model incorrectly say "yes"? (Lower is better)
                  </Typography>
                </Box>
                
                <InfoSection bgColor="#fff3cd">
                  <strong>The ideal model</strong> would catch all the "yes" cases (high true positive rate) while rarely making false alarms (low false positive rate).
                </InfoSection>
              </Box>

              {/* Comparing Different Model Performance */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Comparing Different Model Performance</SubHeading>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    gap: '20px',
                    margin: '20px 0',
                    paddingX: '40px'
                  }}>
                    {[
                      { 
                        title: "Excellent Model", 
                        desc: "Curve hugs the top-left corner", 
                        auc: "AUC ≈ 0.95-1.0", 
                        color: "#28a745",
                        curvePath: "M10 190 Q30 50 50 30 L190 30"
                      },
                      { 
                        title: "Good Model", 
                        desc: "Curves upward toward top-left", 
                        auc: "AUC ≈ 0.7-0.9", 
                        color: "#007bff",
                        curvePath: "M10 190 Q60 100 190 30"
                      },
                      { 
                        title: "Random Guessing", 
                        desc: "Diagonal line", 
                        auc: "AUC = 0.5", 
                        color: "#ffc107",
                        curvePath: "M10 190 L190 30"
                      },
                      { 
                        title: "Poor Model", 
                        desc: "Curves toward bottom-right", 
                        auc: "AUC < 0.5", 
                        color: "#dc3545",
                        curvePath: "M10 190 Q140 160 190 130"
                      }
                    ].map((model, index) => (
                      <Box key={index} sx={{ textAlign: 'center', width: '240px', position: 'relative', mx: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: model.color, 
                          mb: 1,
                          fontSize: '16px'
                        }}>
                          {model.title}
                        </Typography>
                        <Box sx={{ 
                          width: '180px',
                          height: '180px',
                          border: '2px solid #333',
                          position: 'relative',
                          background: 'white',
                          borderRadius: '5px',
                          mb: 3,
                          mx: 'auto'
                        }}>
                          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                            <path 
                              d={model.curvePath}
                              stroke={model.color}
                              strokeWidth="3"
                              fill="none"
                            />
                          </svg>
                          <Typography sx={{ 
                            position: 'absolute',
                            bottom: '-25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '13px',
                            color: '#666',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}>
                            False Positive Rate
                          </Typography>
                          <Typography sx={{ 
                            position: 'absolute',
                            left: '-70px',
                            top: '50%',
                            transform: 'translateY(-50%) rotate(-90deg)',
                            transformOrigin: 'center',
                            fontSize: '13px',
                            color: '#666',
                            whiteSpace: 'nowrap'
                          }}>
                            True Positive Rate
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ 
                          fontSize: '13px', 
                          color: '#666',
                          lineHeight: 1.2,
                          mb: 0.5,
                          mt: 0.5
                        }}>
                          {model.desc}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontSize: '13px',
                          color: model.color,
                          fontWeight: 'bold'
                        }}>
                          {model.auc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Area Under Curve (AUC): Single number summarizing performance (0 to 1)",
                    "Perfect model: AUC = 1.0 (curve goes to top-left corner)",
                    "Useless model: AUC = 0.5 (diagonal line = random guessing)",
                    "Good models: AUC > 0.7 (curve bends toward top-left)",
                    "The closer to the top-left corner, the better the model"
                  ].map((point, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {point}
                    </Typography>
                  ))}
                </Box>
              </Box>
              </Box>
            </FieldValue>
          </FieldContainer>
      </Box>

      {/* Calibration Curve Section */}
      <Box>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Calibration Curves
                </SubHeading>
              </Box>
              
              {/* What is Calibration Curve */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is a Calibration Curve?</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  A <strong>calibration curve</strong> shows whether your model's confidence scores match reality. When a model says "I'm 80% confident a patient will develop a certain condition," a well-calibrated model should be right about 80% of the time.
                </Typography>
                
                <InfoSection bgColor="#fff3cd">
                  <strong>Key insight:</strong> A model can have high accuracy Prediction Quality (ROC) but poor calibration. Calibration tells you if you can trust the confidence scores, not just the final predictions.
                </InfoSection>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read a Calibration Curve</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  The calibration curve plots:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>X-axis (Mean Predicted Probability):</strong> What the model says the probability is
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Y-axis (Fraction of Positives):</strong> What actually happens in reality
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Diagonal line:</strong> Perfect calibration (predictions match reality)
                  </Typography>
                </Box>
              </Box>

              {/* Types of Calibration Performance */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Types of Calibration Performance</SubHeading>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    gap: '20px',
                    margin: '20px 0',
                    paddingX: '40px'
                  }}>
                    {[
                      { 
                        title: "Perfect Calibration", 
                        desc: "Curve follows diagonal line\nPredictions = Reality", 
                        color: "#28a745",
                        diagonalPath: "M10 190 L190 10",
                        curvePath: "M10 190 L190 10"
                      },
                      { 
                        title: "Well-Calibrated", 
                        desc: "Close to diagonal\nMinor deviations acceptable", 
                        color: "#007bff",
                        diagonalPath: "M10 190 L190 10",
                        curvePath: "M10 190 Q50 150 100 100 Q150 50 190 10"
                      },
                      { 
                        title: "Over-Confident", 
                        desc: "Curve below diagonal\nSays 90%, reality is 60%", 
                        color: "#dc3545",
                        diagonalPath: "M10 190 L190 10",
                        curvePath: "M10 190 Q100 140 190 60"
                      },
                      { 
                        title: "Under-Confident", 
                        desc: "Curve above diagonal\nSays 30%, reality is 70%", 
                        color: "#ff8c00",
                        diagonalPath: "M10 190 L190 10",
                        curvePath: "M10 190 Q100 60 190 40"
                      }
                    ].map((model, index) => (
                      <Box key={index} sx={{ textAlign: 'center', width: '240px', position: 'relative', mx: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: model.color, 
                          mb: 1,
                          fontSize: '16px'
                        }}>
                          {model.title}
                        </Typography>
                        <Box sx={{ 
                          width: '180px',
                          height: '180px',
                          border: '2px solid #333',
                          position: 'relative',
                          background: 'white',
                          borderRadius: '5px',
                          mb: 3,
                          mx: 'auto'
                        }}>
                          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                            <path 
                              d={model.diagonalPath}
                              stroke="#333"
                              strokeWidth="1"
                              strokeDasharray="5,5"
                              fill="none"
                            />
                            <path 
                              d={model.curvePath}
                              stroke={model.color}
                              strokeWidth="3"
                              fill="none"
                            />
                          </svg>
                          <Typography sx={{ 
                            position: 'absolute',
                            bottom: '-25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '13px',
                            color: '#666',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}>
                            Predicted Probability
                          </Typography>
                          <Typography sx={{ 
                            position: 'absolute',
                            left: '-50px',
                            top: '50%',
                            transform: 'translateY(-50%) rotate(-90deg)',
                            transformOrigin: 'center',
                            fontSize: '13px',
                            color: '#666',
                            whiteSpace: 'nowrap'
                          }}>
                            Actual Rate
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ 
                          fontSize: '13px', 
                          color: '#666',
                          lineHeight: 1.2,
                          whiteSpace: 'pre-line',
                          mt: 1,
                          mb: 1
                        }}>
                          {model.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Legend */}
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    margin: '0 0 0 0',
                    flexWrap: 'wrap'
                  }}>
                    {[
                      { label: "Perfect Calibration", color: "#28a745" },
                      { label: "Well-Calibrated", color: "#007bff" },
                      { label: "Over-Confident", color: "#dc3545" },
                      { label: "Under-Confident", color: "#ff8c00" }
                    ].map((item, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '5px'
                      }}>
                        <Box sx={{ 
                          width: '20px',
                          height: '3px',
                          backgroundColor: item.color,
                          borderRadius: '2px'
                        }} />
                        <Typography variant="body2" sx={{ fontSize: '14px' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Perfect calibration: Curve follows the diagonal line exactly",
                    "Over-confident: Curve below diagonal (model overestimates probabilities)",
                    "Under-confident: Curve above diagonal (model underestimates probabilities)",
                    "Calibration matters when you need to trust the probability scores, not just the final decision"
                  ].map((point, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {point}
                    </Typography>
                  ))}
                </Box>
              </Box>
              </Box>
            </FieldValue>
          </FieldContainer>
      </Box>

      {/* Accuracy over Time Section */}
      <Box sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Accuracy over Time Charts
                </SubHeading>
              </Box>
              
              {/* What is Accuracy over Time */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is an Accuracy over Time Chart?</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  An <strong>Accuracy over Time chart</strong> shows how your model's performance metrics change across different time periods. This helps identify if model performance is stable, improving, or degrading over time.
                </Typography>
                
                <InfoSection bgColor="#fff3cd">
                  <strong>Key insight:</strong> Models can become less accurate over time due to data drift, changing patient populations, or evolving medical practices. Regular monitoring is essential.
                </InfoSection>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read the Time Chart</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  The chart typically displays:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>X-axis (Time Period):</strong> Dates, months, or prediction batches
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Y-axis (Performance Score):</strong> Accuracy, AUROC, or other metrics as percentages
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Trend Lines:</strong> Show whether performance is stable, declining, or improving
                  </Typography>
                </Box>
              </Box>

              {/* Performance Patterns */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Common Performance Patterns</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Stable Performance: Flat line indicates consistent model reliability over time",
                    "Gradual Decline: Downward trend suggests data drift or changing patient characteristics",
                    "Sudden Drop: Sharp decline may indicate data quality issues or system changes",
                    "Seasonal Patterns: Regular fluctuations may reflect cyclical health trends"
                  ].map((pattern, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {pattern}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Monitor trends, not just individual data points",
                    "Investigate sudden performance drops immediately",
                    "Expect some natural variation in performance metrics",
                    "Use time charts to plan model retraining schedules"
                  ].map((point, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {point}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Accuracy Metrics Chart Section */}
      <Box>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Accuracy Metrics Charts
                </SubHeading>
              </Box>
              
              {/* What is Accuracy Metrics Chart */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is an Accuracy Metrics Chart?</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  An <strong>Accuracy Metrics Chart</strong> provides a visual comparison of different performance metrics (Accuracy, Precision, Recall, F1-Score, AUROC) in a single view. This helps you quickly assess overall model performance.
                </Typography>
                
                <InfoSection bgColor="#e8f4f8">
                  <strong>Purpose:</strong> Shows how well-balanced your model is across different evaluation criteria, helping identify strengths and weaknesses.
                </InfoSection>
              </Box>

              {/* Chart Types */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Common Chart Types</SubHeading>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                  Accuracy metrics can be displayed as:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Bar Charts:</strong> Side-by-side comparison of different metrics
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Radar/Spider Charts:</strong> Multi-dimensional view showing metric balance
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    • <strong>Gauge Charts:</strong> Individual metrics displayed as performance dials
                  </Typography>
                </Box>
              </Box>

              {/* How to Interpret */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Interpret the Charts</SubHeading>
                <InfoSection bgColor="#d4edda">
                  <strong>✅ Good Performance:</strong> All metrics above 70%, with balanced scores across Precision and Recall (no extreme differences >20%)
                </InfoSection>
                
                <InfoSection bgColor="#f8d7da">
                  <strong>⚠️ Concerning Patterns:</strong> One metric much lower than others, or overall scores below 60% indicating poor model performance
                </InfoSection>
              </Box>

              {/* Practical Tips */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Practical Tips</SubHeading>
                <Box sx={{ ml: 2 }}>
                  {[
                    "Look for balanced performance across all metrics, not just high accuracy",
                    "Pay attention to Precision vs Recall trade-offs for your specific medical use case",
                    "AUROC values above 0.8 generally indicate good discriminative ability",
                    "F1-Score provides a good overall balance between Precision and Recall"
                  ].map((tip, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      • {tip}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>
    </Box>
  );

  const renderSubgroupAnalysis = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        mb: 3,
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        Sub-Group Analysis
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FieldContainer sx={{ minHeight: 'auto' }}>
          <FieldValue>
            <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
              Shows performance comparison charts for Gender, Race, and Age groups using data from your current topic selection. Charts only appear when your dataset contains these demographic fields.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Three Analysis Cards in Row */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)', 
        },
        gap: 3,
        width: '100%'
      }}>
        {[
          {
            title: "Gender Performance Analysis",
            chartType: "Side-by-side bar chart comparing performance metrics (Accuracy, Sensitivity, PPV, F1-Score, AUROC) between Male and Female patients",
            whatToLook: "Each metric shows two bars - one for Male and one for Female patients. Colors help distinguish the groups (purple-blue for Male, green for Female)",
            technicalNote: "Uses CalculateSubgroupMetrics function to filter patient data by Gender field and calculate performance metrics separately for each group",
            goodResult: "Similar bar heights between Male and Female for all metrics (differences <10%). Both groups have adequate sample sizes for reliable comparison",
            badResult: "Consistently lower performance for one gender across multiple metrics. Very different bar heights indicate potential gender bias",
// whyImportant: "Disease presentation varies by gender (e.g., cardiovascular symptoms). Algorithmic fairness requires equitable performance to avoid systematic healthcare disparities"
          },
          {
            title: "Race/Ethnicity Performance Analysis",
            chartType: "Multi-group bar chart showing performance metrics across available racial categories in the dataset (White, Black, Hispanic, Asian, Other)",
            whatToLook: "Performance bars for each racial group with consistent color coding. Groups with insufficient data may show 'N/A' or be excluded",
            technicalNote: "Uses CalculateSubgroupMetrics function to filter by Race field. Only groups with ≥2 patients are included in analysis to ensure reliable metrics",
            goodResult: "All racial groups show similar performance levels. No single group has dramatically lower bars than others",
            badResult: "One or more racial groups show consistently poor performance across metrics. Missing groups may indicate data collection issues",
// whyImportant: "Historical healthcare disparities require AI systems to perform equitably. Regulatory compliance (FDA guidance) mandates bias assessment for medical AI"
          },
          {
            title: "Age Group Performance Analysis",
            chartType: "Bar chart displaying performance across age ranges: 0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+ years",
            whatToLook: "Performance metrics for each age bracket. Age groups with few patients may be excluded or combined",
            technicalNote: "Uses CalculateSubgroupAgeMetrics function with predefined age bins. Deduplicates patients by taking latest prediction timestamp per Patient_ID",
            goodResult: "Consistent performance across age groups relevant to the medical condition. Adult age groups typically show stable metrics",
            badResult: "Dramatic performance drops in specific age ranges. Elderly or pediatric groups often show different patterns due to limited training data",
// whyImportant: "Age affects disease pathophysiology and comorbidity patterns. Model must maintain clinical utility across the full patient age spectrum"
          }
        ].map((analysis, index) => (
          <FieldContainer key={index} sx={{ 
            minHeight: '450px',
            borderLeft: '4px solid #2c5aa0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <FieldValue sx={{ height: '100%' }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Title */}
                <Box sx={{ mb: 2 }}>
                  <SubHeading component="h6" sx={{ fontSize: '18px', fontWeight: 'bold', color: '#275786' }}>
                    {analysis.title}
                  </SubHeading>
                </Box>
                
                {/* Chart Type */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    What you see:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    {analysis.chartType}
                  </Typography>
                </Box>
                
                {/* What to Look For */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    What to look for:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    {analysis.whatToLook}
                  </Typography>
                </Box>
                
                {/* Technical Note */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    Technical approach:
                  </Typography>
                  <InfoSection bgColor="#f0f8ff">
                    {analysis.technicalNote}
                  </InfoSection>
                </Box>
                
                {/* Good Result */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    ✅ Good result:
                  </Typography>
                  <InfoSection bgColor="#d4edda">
                    {analysis.goodResult}
                  </InfoSection>
                </Box>
                
                {/* Bad Result */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    ⚠️ Concerning result:
                  </Typography>
                  <InfoSection bgColor="#f8d7da">
                    {analysis.badResult}
                  </InfoSection>
                </Box>
                
                {/* Why Important - Commented out for future consideration */}
                {/* <Box sx={{ mt: 'auto' }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    Why it matters:
                  </Typography>
                  <InfoSection bgColor="#e8f4f8">
                    {analysis.whyImportant}
                  </InfoSection>
                </Box> */}
              </Box>
            </FieldValue>
          </FieldContainer>
        ))}
      </Box>
    </Box>
  );

  const renderDataDistribution = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        mb: 3,
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        Data Distribution Analysis
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FieldContainer sx={{ minHeight: 'auto' }}>
          <FieldValue>
            <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
              Shows the demographic makeup of your current dataset. These charts help you understand the patient population your model was trained and tested on.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Three Chart Analysis Cards in Row */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)', 
        },
        gap: 3,
        width: '100%',
        mb: 3
      }}>
        {[
          {
            title: "Age Distribution Chart",
            chartType: "Bar chart displaying patient counts across age groups: 0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+ years",
            whatToLook: "Height of each bar shows number of patients in that age bracket. Hover over bars to see exact counts and percentages",
            technicalNote: "Uses Chart.js Bar component with blue color (#42a5f5). Data comes from DistributionCharts component processing age fields from your dataset",
            goodResult: "Reasonable distribution across age groups relevant to your medical topic. No single age group dominates >60% of patients",
            badResult: "Extreme concentration in one age group or complete absence of certain age ranges. Very low counts (<10) in multiple groups"
          },
          {
            title: "Gender Distribution Chart",
            chartType: "Pie/Doughnut chart showing proportional split between Male and Female patients with counts and percentages",
            whatToLook: "Pie slices representing gender distribution. Each slice shows both the count and percentage of patients",
            technicalNote: "Uses DistributionPieChart component with green (#66bb6a) for female and coral (#ef5350) for male. Data extracted from Gender field in your dataset",
            goodResult: "Reasonable gender balance for your medical condition (typically 30-70% range). Clear data quality with minimal missing values",
            badResult: "Extreme gender imbalance (>85% one gender) unless medically expected. Large 'Unknown' category suggests data quality issues"
          },
          {
            title: "Race/Ethnicity Distribution Chart",
            chartType: "Bar chart displaying patient counts across racial categories found in your dataset (White, Black, Hispanic, Asian, Other)",
            whatToLook: "Bars showing number of patients in each racial group. Groups are typically sorted alphabetically with consistent light pink coloring",
            technicalNote: "Uses Chart.js Bar component with light pink color (rgba(255, 182, 193, 0.95)). Data comes from Race field processing in DistributionCharts component",
            goodResult: "Multiple racial groups present in your dataset. Distribution reflects the patient population you're studying",
            badResult: "Only one racial group present or very uneven distribution. Missing racial data shows as gaps in representation"
          }
        ].map((chart, index) => (
          <FieldContainer key={index} sx={{ 
            minHeight: '450px',
            borderLeft: '4px solid #2c5aa0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <FieldValue sx={{ height: '100%' }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Title */}
                <Box sx={{ mb: 2 }}>
                  <SubHeading component="h6" sx={{ fontSize: '18px', fontWeight: 'bold', color: '#275786' }}>
                    {chart.title}
                  </SubHeading>
                </Box>
                
                {/* Chart Type */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    What you see:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    {chart.chartType}
                  </Typography>
                </Box>
                
                {/* What to Look For */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    What to look for:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                    {chart.whatToLook}
                  </Typography>
                </Box>
                
                {/* Technical Note */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    Technical approach:
                  </Typography>
                  <InfoSection bgColor="#f0f8ff">
                    {chart.technicalNote}
                  </InfoSection>
                </Box>
                
                {/* Good Result */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    ✅ Good result:
                  </Typography>
                  <InfoSection bgColor="#d4edda">
                    {chart.goodResult}
                  </InfoSection>
                </Box>
                
                {/* Bad Result */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    ⚠️ Concerning result:
                  </Typography>
                  <InfoSection bgColor="#f8d7da">
                    {chart.badResult}
                  </InfoSection>
                </Box>
              </Box>
            </FieldValue>
          </FieldContainer>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <FieldContainer sx={{ minHeight: 'auto' }}>
          <FieldValue>
            <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
              <strong>Key Point:</strong> These charts show the actual demographic composition of your current topic's dataset. Use them to understand what patient groups your model has been trained on and where performance analysis may be limited by small sample sizes.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 3 }, 
      mx: 'auto',
      maxWidth: '1400px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        textAlign: 'center',
        mb: 2,
        fontSize: '28px'
      }}>
        Lava Application Dashboard - Glossary
      </Typography>
      
      <Typography variant="body1" sx={{ 
        textAlign: 'center', 
        color: '#666', 
        mb: 4,
        fontSize: '16px',
        lineHeight: 1.5
      }}>
        Comprehensive guide to understanding medical machine learning metrics, visualizations, and concepts
      </Typography>

      <Box display="flex" justifyContent="center" width="100%" mb={3}>
        <StyledTabs value={activeTab} onChange={handleTabChange}>
          <StyledTab label="Accuracy Metrics" />
          <StyledTab label="Performance Metrics" />
          <StyledTab label="Sub-Group Analysis" />
          <StyledTab label="Data Distribution" />
        </StyledTabs>
      </Box>

      <Paper elevation={1} sx={{ p: 3, borderRadius: '0 0 12px 12px' }}>
        {activeTab === 0 && renderAccuracyMetrics()}
        {activeTab === 1 && renderPerformanceCharts()}
        {activeTab === 2 && renderSubgroupAnalysis()}
        {activeTab === 3 && renderDataDistribution()}
      </Paper>
    </Box>
  );
};

export default GlossaryPage;
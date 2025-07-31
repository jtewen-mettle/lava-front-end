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
  padding: '18px',
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
  color: '#2c3e50',
  marginBottom: '8px',
  display: 'block',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
}));

const FieldValue = styled('div')(({ theme }) => ({
  color: '#555',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  lineHeight: 1.5,
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
  color: '#275786',
  fontFamily: 'Arial, sans-serif',
  marginBottom: '8px',
  marginTop: '8px',
}));

const InfoSection = styled('div')(({ theme, bgColor }) => ({
  backgroundColor: bgColor || '#f8f9fa',
  padding: '12px',
  borderRadius: '6px',
  border: `1px solid ${bgColor === '#fff3cd' ? '#ffc107' : bgColor === '#f8d7da' ? '#dc3545' : '#e1e8ed'}`,
  marginBottom: '10px',
  fontSize: '16px',
  lineHeight: 1.5,
  fontFamily: 'Arial, sans-serif',
}));

const FormulaBox = styled('div')(({ theme }) => ({
  backgroundColor: '#e8f4f8',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #b3d9e8',
  fontFamily: 'monospace',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#275786',
  marginBottom: '10px',
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
        gap: 2,
        width: '100%',
        marginBottom: 2
      }}
    >
      {items.map((metric, index) => (
        <FieldContainer key={index}>
          <FieldLabel>{metric.label}</FieldLabel>
          <FieldValue>
            <Box>
              {/* Definition */}
              <SubHeading component="h6">Definition:</SubHeading>
              <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#555', fontFamily: 'Arial, sans-serif' }}>
                {metric.definition}
              </Typography>
              
              {/* Formula */}
              <SubHeading component="h6">Formula:</SubHeading>
              <FormulaBox>
                {metric.formula}
              </FormulaBox>
              
              {/* Range */}
              <SubHeading component="h6">Range:</SubHeading>
              <InfoSection>
                {metric.range}
              </InfoSection>
              
              {/* Medical Context or Interpretation */}
              {metric.medicalContext && (
                <>
                  <SubHeading component="h6">Medical Context:</SubHeading>
                  <InfoSection bgColor="#e8f4f8">
                    {metric.medicalContext}
                  </InfoSection>
                </>
              )}
              
              {metric.interpretation && (
                <>
                  <SubHeading component="h6">Interpretation:</SubHeading>
                  <InfoSection bgColor="#e8f4f8">
                    {metric.interpretation}
                  </InfoSection>
                </>
              )}
              
              {/* Clinical Impact */}
              {metric.clinicalImpact && (
                <>
                  <SubHeading component="h6">Clinical Impact:</SubHeading>
                  <InfoSection bgColor="#fff3cd">
                    {metric.clinicalImpact}
                  </InfoSection>
                </>
              )}
              
              {/* Tooltip */}
              {metric.tooltip && (
                <>
                  <SubHeading component="h6">Key Insight:</SubHeading>
                  <InfoSection bgColor="#f8f9fa">
                    {metric.tooltip}
                  </InfoSection>
                </>
              )}
              
              {/* Performance Ranges */}
              <SubHeading component="h6">Performance Ranges:</SubHeading>
              <PerformanceGrid>
                {metric.performance.map((perf, idx) => (
                  <PerformanceItem key={idx} severity={perf.level}>
                    <PerformanceBadge severity={perf.level}>
                      {perf.range}
                    </PerformanceBadge>
                    <Typography variant="caption" sx={{ fontSize: '14px', color: '#555', fontFamily: 'Arial, sans-serif' }}>
                      {perf.desc}
                    </Typography>
                  </PerformanceItem>
                ))}
              </PerformanceGrid>
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
        gap: 2,
        width: '100%',
        marginBottom: 2
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
              <SubHeading component="h6">Definition:</SubHeading>
              <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#555', fontFamily: 'Arial, sans-serif' }}>
                {term.definition}
              </Typography>
              
              {/* Medical Example */}
              <SubHeading component="h6">Medical Example:</SubHeading>
              <InfoSection bgColor="#e8f4f8">
                {term.medicalExample}
              </InfoSection>
              
              {/* Clinical Impact */}
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
          </FieldValue>
        </FieldContainer>
      ))}
    </Box>
  );

  const renderAccuracyMetrics = () => (
    <Box>
      <AccuracyMetricsGrid items={accuracyMetrics} columns={2} />
    </Box>
  );

  const renderPerformanceCharts = () => (
    <Box>
      {/* Confusion Matrix Section */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#275786', 
          mb: 2,
          fontSize: '20px'
        }}>
          Confusion Matrix Components
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <FieldContainer sx={{ minHeight: 'auto' }}>
            <FieldValue>
              <Typography variant="body2" sx={{ fontSize: '16px', color: '#555', fontFamily: 'Arial, sans-serif' }}>
                The confusion matrix breaks down all model predictions into four categories. Understanding these helps evaluate how well the Lava ML models perform for CKD, cardiovascular, prostate cancer, and hospitalization risk predictions.
              </Typography>
            </FieldValue>
          </FieldContainer>
        </Box>
        
        <ConfusionMatrixGrid items={confusionMatrixTerms} columns={2} />
      </Box>

      {/* ROC Curve Section - Consolidated Single Card */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#275786', 
          mb: 3,
          fontSize: '20px'
        }}>
          Understanding Prediction Quality (ROC) Curves
        </Typography>
        
        <Card elevation={2} sx={{ 
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            {/* What is ROC Curve */}
            <Box sx={{ 
              margin: '30px 0',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #2c5aa0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 2, fontSize: '18px' }}>
                What is a Prediction Quality (ROC) Curve?
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '16px', lineHeight: 1.6, color: '#333' }}>
                A <strong>Prediction Quality Curve</strong> (ROC - Receiver Operating Characteristic) is a graph that shows how well a classification model performs.
              </Typography>
            </Box>

            {/* How to Read */}
            <Box sx={{ 
              margin: '30px 0',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #2c5aa0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 2, fontSize: '18px' }}>
                How to Read a Prediction Quality Curve
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '16px', mb: 2, color: '#333' }}>
                The prediction quality curve plots two important rates:
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                  • <strong>Y-axis (True Positive Rate):</strong> How good is the model at catching the "yes" cases? (Higher is better)
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                  • <strong>X-axis (False Positive Rate):</strong> How often does the model incorrectly say "yes"? (Lower is better)
                </Typography>
              </Box>
              
              <Box sx={{ 
                background: '#fff3cd',
                padding: '15px',
                borderRadius: '5px',
                borderLeft: '4px solid #ffc107',
                margin: '15px 0'
              }}>
                <Typography variant="body1" sx={{ fontSize: '16px', color: '#333' }}>
                  <strong>The ideal model</strong> would catch all the "yes" cases (high true positive rate) while rarely making false alarms (low false positive rate).
                </Typography>
              </Box>
            </Box>

            {/* Comparing Different Model Performance */}
            <Box sx={{ 
              margin: '30px 0',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #2c5aa0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 3, fontSize: '18px' }}>
                Comparing Different Model Performance
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '20px',
                margin: '20px 0'
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
                  <Box key={index} sx={{ textAlign: 'center', width: '200px' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: model.color, 
                      mb: 1,
                      fontSize: '16px'
                    }}>
                      {model.title}
                    </Typography>
                    <Box sx={{ 
                      width: '200px',
                      height: '200px',
                      border: '2px solid #333',
                      position: 'relative',
                      background: 'white',
                      borderRadius: '5px',
                      mb: 1
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
                        bottom: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        False Positive Rate
                      </Typography>
                      <Typography sx={{ 
                        position: 'absolute',
                        left: '-60px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(-90deg)',
                        transformOrigin: 'center',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        True Positive Rate
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontSize: '14px', 
                      color: '#666',
                      lineHeight: 1.3,
                      mb: 1
                    }}>
                      {model.desc}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontSize: '14px',
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
            <Box sx={{ 
              background: '#e8f4f8',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #b3d9e8'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 2, fontSize: '18px' }}>
                Key Takeaways
              </Typography>
              <Box sx={{ ml: 2 }}>
                {[
                  "Area Under Curve (AUC): Single number summarizing performance (0 to 1)",
                  "Perfect model: AUC = 1.0 (curve goes to top-left corner)",
                  "Useless model: AUC = 0.5 (diagonal line = random guessing)",
                  "Good models: AUC > 0.7 (curve bends toward top-left)",
                  "The closer to the top-left corner, the better the model"
                ].map((point, index) => (
                  <Typography key={index} variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                    • {point}
                  </Typography>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Calibration Curve Section - Consolidated Single Card */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#275786', 
          mb: 3,
          fontSize: '20px'
        }}>
          Understanding Calibration Curves
        </Typography>
        
        <Card elevation={2} sx={{ 
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ 
              textAlign: 'center', 
              color: '#666', 
              fontStyle: 'italic',
              mb: 3,
              fontSize: '16px'
            }}>
              How Confident Should We Be in Our Model's Confidence?
            </Typography>

            {/* What is Calibration Curve */}
            <Box sx={{ 
              margin: '30px 0',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #2c5aa0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 2, fontSize: '18px' }}>
                What is a Calibration Curve?
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '16px', lineHeight: 1.6, color: '#333', mb: 2 }}>
                A <strong>calibration curve</strong> shows whether your model's confidence scores match reality. When a model says "I'm 80% confident a patient will develop a certain condition," a well-calibrated model should be right about 80% of the time.
              </Typography>
              
              <Box sx={{ 
                background: '#fff3cd',
                padding: '15px',
                borderRadius: '5px',
                borderLeft: '4px solid #ffc107',
                margin: '15px 0'
              }}>
                <Typography variant="body1" sx={{ fontSize: '16px', color: '#333' }}>
                  <strong>Key insight:</strong> A model can have high accuracy Prediction Quality (ROC) but poor calibration. Calibration tells you if you can trust the confidence scores, not just the final predictions.
                </Typography>
              </Box>
            </Box>

            {/* How to Read */}
            <Box sx={{ 
              margin: '30px 0',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #2c5aa0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 2, fontSize: '18px' }}>
                How to Read a Calibration Curve
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '16px', mb: 2, color: '#333' }}>
                The calibration curve plots:
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                  • <strong>X-axis (Mean Predicted Probability):</strong> What the model says the probability is
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                  • <strong>Y-axis (Fraction of Positives):</strong> What actually happens in reality
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                  • <strong>Diagonal line:</strong> Perfect calibration (predictions match reality)
                </Typography>
              </Box>
            </Box>

            {/* Types of Calibration Performance */}
            <Box sx={{ 
              margin: '30px 0',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #2c5aa0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 3, fontSize: '18px' }}>
                Types of Calibration Performance
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '20px',
                margin: '20px 0'
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
                  <Box key={index} sx={{ textAlign: 'center', width: '200px' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: model.color, 
                      mb: 1,
                      fontSize: '16px'
                    }}>
                      {model.title}
                    </Typography>
                    <Box sx={{ 
                      width: '200px',
                      height: '200px',
                      border: '2px solid #333',
                      position: 'relative',
                      background: 'white',
                      borderRadius: '5px',
                      mb: 1
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
                        bottom: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        Predicted Probability
                      </Typography>
                      <Typography sx={{ 
                        position: 'absolute',
                        left: '-45px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(-90deg)',
                        transformOrigin: 'center',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        Actual Rate
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontSize: '14px', 
                      color: '#666',
                      lineHeight: 1.3,
                      whiteSpace: 'pre-line'
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
                margin: '20px 0',
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
            <Box sx={{ 
              background: '#e8f4f8',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #b3d9e8'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', mb: 2, fontSize: '18px' }}>
                Key Takeaways
              </Typography>
              <Box sx={{ ml: 2 }}>
                {[
                  "Perfect calibration: Curve follows the diagonal line exactly",
                  "Over-confident: Curve below diagonal (model overestimates probabilities)",
                  "Under-confident: Curve above diagonal (model underestimates probabilities)",
                  "Calibration matters when you need to trust the probability scores, not just the final decision"
                ].map((point, index) => (
                  <Typography key={index} variant="body1" sx={{ fontSize: '16px', mb: 1, color: '#333' }}>
                    • {point}
                  </Typography>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  const renderSubgroupAnalysis = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        mb: 3,
        fontSize: '20px'
      }}>
        Sub-Group Analysis
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4, fontSize: '16px' }}>
        Sub-group analysis examines whether the model performs equally well across different demographic and clinical groups. This is crucial for ensuring fairness and identifying potential biases in medical AI systems.
      </Alert>

      {[
        {
          title: "Gender Analysis",
          purpose: "Ensures model works equally well for male and female patients",
          importance: "Many diseases present differently in men vs. women",
          evaluation: "All performance metrics (Accuracy, Precision, Recall, F1, AUROC) calculated separately for each gender",
          redFlags: "Significant performance differences between genders could indicate bias",
          icon: <InfoIcon color="primary" />
        },
        {
          title: "Race/Ethnicity Analysis",
          purpose: "Ensures equitable performance across racial and ethnic groups",
          importance: "Historical healthcare disparities make this analysis essential",
          evaluation: "Typically includes White, Black/African American, Hispanic/Latino, Asian, Other",
          redFlags: "Required for many healthcare AI deployments due to regulatory importance",
          icon: <WarningIcon color="warning" />
        },
        {
          title: "Age Groups",
          purpose: "Ensures model works across different age ranges",
          importance: "Disease presentation and risk factors change with age",
          evaluation: "Often divided into pediatric, young adult, middle-aged, elderly categories",
          redFlags: "Poor performance in specific age groups may indicate training data gaps",
          icon: <CheckCircleIcon color="success" />
        }
      ].map((analysis, index) => (
        <Card key={index} elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {analysis.icon}
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', fontSize: '16px' }}>
                {analysis.title}
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" paragraph sx={{ fontSize: '16px' }}>
                  <strong>Purpose:</strong> {analysis.purpose}
                </Typography>
                <Typography variant="body2" paragraph sx={{ fontSize: '16px' }}>
                  <strong>Why Important:</strong> {analysis.importance}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" paragraph sx={{ fontSize: '16px' }}>
                  <strong>Evaluation:</strong> {analysis.evaluation}
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontSize: '16px',
                  backgroundColor: '#fff3cd',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ffc107'
                }}>
                  <strong>Key Consideration:</strong> {analysis.redFlags}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Card elevation={2} sx={{ backgroundColor: '#ffe6e6' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <ErrorIcon color="error" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f', fontSize: '16px' }}>
              Addressing Demographic Bias
            </Typography>
          </Box>
          <Typography variant="body2" paragraph sx={{ fontSize: '16px' }}>
            <strong>Symptoms:</strong> Significant performance differences across demographic groups
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '16px' }}>
            <strong>Solutions:</strong> Balanced training data, fairness constraints, post-processing adjustments, and continuous monitoring
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const renderDataDistribution = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#275786', 
        mb: 3,
        fontSize: '20px'
      }}>
        Data Distribution Analysis
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4, fontSize: '16px' }}>
        Examines the underlying data characteristics to understand model behavior and identify potential issues with data quality or representativeness.
      </Alert>

      {[
        {
          title: "Age Distribution Chart (Bar Chart)",
          description: "A vertical bar chart displaying the number of patients in different age groups within your dataset",
          ageGroups: ["0-10 years", "11-20 years", "21-30 years", "31-40 years", "41-50 years", "51-60 years", "60-80+ years"],
          whyNeeded: [
            "Shows if your dataset represents different age ranges adequately",
            "Age affects disease risk and model performance differently",
            "Helps identify if the model will work for all age groups you intend to serve"
          ],
          interpretation: {
            good: "Balanced bars: Good representation across age groups",
            warning: "Very tall single bar: Most patients concentrated in one age range (potential bias)",
            poor: "Missing/very short bars: Underrepresented age groups may have poor model performance",
            expected: "Some medical conditions naturally affect certain age groups more"
          },
          technical: {
            type: "Vertical bar chart with blue color (#42a5f5)",
            xAxis: "Age group categories",
            yAxis: "Patient count",
            calculation: "Age calculated from patient birthdate field"
          }
        },
        {
          title: "Gender Distribution Chart (Pie Chart)",
          description: "A pie chart showing the proportional split of patients by gender in your dataset",
          categories: ["Male", "Female", "Unknown/Other (if present in data)"],
          whyNeeded: [
            "Many diseases present differently between genders",
            "Ensures model works equally well for both male and female patients",
            "Required for bias detection and regulatory compliance"
          ],
          interpretation: {
            good: "Roughly 50/50 split: Good gender balance for most conditions",
            warning: "60/40 or 70/30 split: Moderate imbalance, may need attention",
            poor: "80/20 or more extreme: Significant bias risk, model may not work well for underrepresented gender",
            expected: "Some conditions naturally affect one gender more (e.g., prostate conditions)"
          },
          technical: {
            type: "Pie/Doughnut chart",
            colors: "Green (#66bb6a) and coral (#ef5350)",
            display: "Shows both count and percentage for each segment",
            source: "Gender field from patient demographics"
          }
        },
        {
          title: "Race/Ethnicity Distribution Chart (Bar Chart)",
          description: "A horizontal or vertical bar chart displaying the number of patients across different racial and ethnic groups",
          categories: ["White/Caucasian", "Black/African American", "Hispanic/Latino", "Asian/Pacific Islander", "Native American", "Other/Mixed/Unknown"],
          whyNeeded: [
            "Different racial groups can have different disease patterns and risk factors",
            "Critical for ensuring equitable AI performance across all populations",
            "Regulatory requirement for healthcare AI systems"
          ],
          interpretation: {
            good: "Multiple groups represented: Better chance of equitable model performance",
            warning: "One group >80%: High risk of bias against underrepresented groups",
            poor: "Missing major groups: Model won't work for those populations",
            expected: "High 'Unknown' category: Data collection quality issues"
          },
          technical: {
            type: "Bar chart with purple color (#ab47bc)",
            xAxis: "Racial/ethnic group names",
            yAxis: "Patient count",
            source: "Race field from patient demographics",
            sorting: "Often sorted by frequency (highest to lowest count)"
          }
        }
      ].map((chart, index) => (
        <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleAccordionChange(`panel${index}`)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#275786', fontSize: '16px' }}>
              {chart.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph sx={{ fontSize: '16px', fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph sx={{ fontSize: '16px' }}>
              {chart.description}
            </Typography>

            {chart.ageGroups && (
              <>
                <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mt: 2 }}>
                  Age Groups Used:
                </Typography>
                <List dense>
                  {chart.ageGroups.map((group, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={group} primaryComponents={{ style: { fontSize: '16px' } }} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {chart.categories && (
              <>
                <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mt: 2 }}>
                  Categories shown:
                </Typography>
                <List dense>
                  {chart.categories.map((category, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={category} primaryComponents={{ style: { fontSize: '16px' } }} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mt: 2 }}>
              Why we need it:
            </Typography>
            <List dense>
              {chart.whyNeeded.map((reason, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary={reason} primaryComponents={{ style: { fontSize: '16px' } }} />
                </ListItem>
              ))}
            </List>

            <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mt: 2 }}>
              How to interpret:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#28a745' }}>
                  <strong>✅ Good:</strong> {chart.interpretation.good}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#ffc107' }}>
                  <strong>⚠️ Warning:</strong> {chart.interpretation.warning}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#dc3545' }}>
                  <strong>❌ Poor:</strong> {chart.interpretation.poor}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontSize: '16px', color: '#6c757d' }}>
                  <strong>ℹ️ Expected:</strong> {chart.interpretation.expected}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ backgroundColor: '#f8f9fa', padding: 2, borderRadius: 1, mt: 2 }}>
              <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1 }}>
                Technical details:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '16px' }}>
                <strong>Chart type:</strong> {chart.technical.type}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '16px' }}>
                <strong>X-axis:</strong> {chart.technical.xAxis}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '16px' }}>
                <strong>Y-axis:</strong> {chart.technical.yAxis}
              </Typography>
              {chart.technical.colors && (
                <Typography variant="body2" sx={{ fontSize: '16px' }}>
                  <strong>Colors:</strong> {chart.technical.colors}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: '16px' }}>
                <strong>Data source:</strong> {chart.technical.source}
              </Typography>
              {chart.technical.calculation && (
                <Typography variant="body2" sx={{ fontSize: '16px' }}>
                  <strong>Calculation:</strong> {chart.technical.calculation}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Alert severity="success" sx={{ mt: 4, fontSize: '16px' }}>
        <strong>Key Point:</strong> These three charts together show whether your dataset represents the patient population you want to serve. Imbalanced demographics often lead to biased AI models that work poorly for underrepresented groups.
      </Alert>
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
        Lava Medical ML Dashboard - Glossary
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
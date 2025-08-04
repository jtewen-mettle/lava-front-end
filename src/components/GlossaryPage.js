import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';


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


const GlossaryPage = ({ initialSection = null }) => {

  // Handle section-specific navigation
  React.useEffect(() => {
    if (initialSection === 'scroll-to-top') {
      // Context-aware navigation - scroll to top
      setTimeout(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 100);
    } else if (initialSection) {
      const sectionToElementMap = {
        // Performance Metrics sections
        'roc-curve': 'roc-curve-section',
        'confusion-matrix': 'confusion-matrix-section',
        'calibration-curve': 'calibration-curve-section',
        'accuracy-over-time': 'accuracy-over-time-section',
        'accuracy-metrics-chart': 'accuracy-metrics-section',
        
        // Accuracy Metrics sections
        'precision': 'accuracy-metrics-main',
        'recall': 'accuracy-metrics-main',
        'sensitivity': 'accuracy-metrics-main',
        'specificity': 'accuracy-metrics-main',
        'f1-score': 'accuracy-metrics-main',
        'overall-accuracy': 'accuracy-metrics-main',
        
        // Subgroup Analysis sections
        'subgroup-analysis': 'subgroup-analysis-main',
        'gender-performance': 'gender-performance-section',
        'race-performance': 'race-performance-section',
        'age-group-performance': 'age-group-section',
        
        // Data Distribution sections
        'data-distribution': 'data-distribution-main',
        'age-distribution': 'age-distribution-section',
        'gender-distribution': 'gender-distribution-section',
        'race-distribution': 'race-distribution-section'
      };
      
      const elementId = sectionToElementMap[initialSection];
      if (elementId) {
        // Scroll to element
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
    } else {
      // Fresh navigation from other pages - scroll to top
      setTimeout(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  }, [initialSection]);



  const accuracyMetrics = [
    {
      label: "Overall Accuracy",
      definition: "The percentage of correct predictions out of all predictions made by the model",
      formula: "(True Positives + True Negatives) / (Total Predictions)",
      range: "0 to 100% (0.0 to 1.0)",
      interpretation: "Higher values indicate better performance. However, accuracy alone can be misleading in medical contexts with imbalanced data where one outcome is much more common than the other",
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
      medicalContext: "Ideal metric when balancing between catching all cases (recall) and avoiding false alarms (precision)",
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
    <Box id="accuracy-metrics-main">
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
              Shows how well models perform using visual charts and metrics. These performance charts help understand model accuracy, reliability, and areas for improvement. Includes confusion matrix breakdowns, prediction quality (ROC) curves, calibration analysis, accuracy trends over time, and comprehensive metrics comparisons.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

             {/* Confusion Matrix Section */}
       <Box id="confusion-matrix-section" sx={{ mb: 2 }}>
         <FieldContainer sx={{ 
           minHeight: 'auto',
           borderLeft: '4px solid #2c5aa0'
         }}>
           <FieldValue>
             <Box>
               {/* Main Heading */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                   Understanding Confusion Matrix Components
                 </SubHeading>
               </Box>
               
               {/* What is Confusion Matrix */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">What is a Confusion Matrix?</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                       A <strong>confusion matrix</strong> is like a report card that shows exactly how the model performed on every single prediction. Instead of just saying "85% accurate," it breaks down that accuracy to show what kinds of mistakes the model makes and what it gets right. This detailed breakdown helps understand if the model is safe and useful for specific healthcare needs.
                     </Typography>
                   </FieldValue>
                 </FieldContainer>
               </Box>

               {/* How to Read */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">How to Read a Confusion Matrix</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                   <FieldValue>
                     <Box>
                       <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                         The matrix shows four types of predictions in a 2x2 grid, each with different clinical implications:
                       </Typography>
                       <Box sx={{ ml: 2, mb: 2 }}>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>True Positives (Top-left, Green):</strong> Correctly identified sick patients - Model said "risk" and patient was actually at risk
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>True Negatives (Bottom-right, Green):</strong> Correctly identified healthy patients - Model said "no risk" and patient was actually low risk
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>False Positives (Top-right, Red):</strong> False alarms - Model said "risk" but patient was actually low risk
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>False Negatives (Bottom-left, Red):</strong> Missed cases - Model said "no risk" but patient was actually at risk
                         </Typography>
                       </Box>
                       
                       <InfoSection bgColor="#fff3cd">
                         <strong>Clinical impact:</strong> False Negatives are usually more dangerous (missing sick patients) while False Positives create workflow burden (unnecessary alerts). Both matter, but patient safety comes first.
                       </InfoSection>
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>

               {/* Key Takeaways */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">Key Takeaways</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Box sx={{ ml: 2 }}>
                       {[
                         "Larger green sections (True Positives + True Negatives) indicate better overall model performance",
                         "Small False Negative section is critical - missing patients who need care should be avoided",
                         "Large False Positive section creates alert fatigue and workflow burden for staff",
                         "Perfect balance is impossible - decide which errors the clinical workflow can better handle",
                         "Use percentages, not just counts - a model might catch 95% of cases but still miss 200 patients",
                         "Compare the matrix to clinical priorities - screening tools can tolerate more false positives than diagnostic tools"
                       ].map((point, index) => (
                         <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • {point}
                         </Typography>
                       ))}
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>
             </Box>
           </FieldValue>
         </FieldContainer>
       </Box>

             {/* Accuracy over Time Section */}
       <Box id="accuracy-over-time-section" sx={{ mb: 2 }}>
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
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                       An <strong>accuracy over time chart</strong> is a line graph that tracks how well models perform month by month. It shows if models are getting better, staying stable, or declining in performance as time passes.
                     </Typography>
                   </FieldValue>
                 </FieldContainer>
               </Box>

               {/* How to Read */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">How to Read an Accuracy over Time Chart</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                   <FieldValue>
                     <Box>
                       <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                         The chart displays performance trends with these key elements:
                       </Typography>
                       <Box sx={{ ml: 2, mb: 2 }}>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>X-axis:</strong> Time periods (months/quarters)
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>Y-axis:</strong> Accuracy percentage (0-100%)
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>Line trend:</strong> Rising = improving, flat = stable, falling = declining
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>Data points:</strong> Hover to see exact accuracy values for each time period
                         </Typography>
                       </Box>
                       
                       <InfoSection bgColor="#fff3cd">
                         <strong>Watch for:</strong> Sudden drops in accuracy may indicate changes in patient population, data quality issues, or the need for model updates.
                       </InfoSection>
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>

               {/* Key Takeaways */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">Key Takeaways</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Box sx={{ ml: 2 }}>
                       {[
                         "Stable or rising lines indicate consistent model performance over time",
                         "Declining accuracy trends may signal the need for model retraining or updates",
                         "Seasonal patterns might reflect changes in disease prevalence or patient populations",
                         "Sharp drops often indicate data quality issues or significant changes in clinical practice",
                         "Use this chart to schedule regular model performance reviews and maintenance"
                       ].map((point, index) => (
                         <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • {point}
                         </Typography>
                       ))}
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>
             </Box>
           </FieldValue>
         </FieldContainer>
       </Box>

             {/* Accuracy Metrics Chart Section */}
       <Box id="accuracy-metrics-section" sx={{ mb: 2 }}>
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
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                       An <strong>accuracy metrics chart</strong> is a bar graph that shows five different ways to measure how well models perform. Think of it as a report card with multiple grades - each bar tells something different about model strengths and weaknesses.
                     </Typography>
                   </FieldValue>
                 </FieldContainer>
               </Box>

               {/* How to Read */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">How to Read an Accuracy Metrics Chart</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                   <FieldValue>
                     <Box>
                       <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                         The chart shows five performance measures as vertical bars:
                       </Typography>
                       <Box sx={{ ml: 2, mb: 2 }}>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>Accuracy:</strong> Overall correctness (higher = better)
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>PPV (Precision):</strong> When model says "yes," how often is it right? (higher = fewer false alarms)
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>Sensitivity:</strong> Of all sick patients, how many did we catch? (higher = fewer missed cases)
                         </Typography>
                         <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • <strong>F1 Score:</strong> Balance between precision and sensitivity (higher = better overall balance)
                         </Typography>
                       </Box>
                       
                       <InfoSection bgColor="#fff3cd">
                         <strong>Quick tip:</strong> Look for bars that are all reasonably high (above 70%). If one bar is much shorter than others, investigate what that means for clinical workflow.
                       </InfoSection>
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>

               {/* Key Takeaways */}
               <Box sx={{ mb: 2 }}>
                 <SubHeading component="h6">Key Takeaways</SubHeading>
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Box sx={{ ml: 2 }}>
                       {[
                         "All bars should be reasonably high - low bars indicate specific weaknesses",
                         "High Accuracy + Low Sensitivity = model misses sick patients (dangerous in healthcare)",
                         "High Sensitivity + Low PPV = model creates many false alarms (workflow burden)",
                         "F1 Score gives the best single measure of overall performance balance",
                         "Compare these metrics to clinical priorities - what matters most for patient safety?"
                       ].map((point, index) => (
                         <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • {point}
                         </Typography>
                       ))}
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>
             </Box>
           </FieldValue>
         </FieldContainer>
       </Box>

      {/* ROC Curve Section */}
      <Box id="roc-curve-section" sx={{ mb: 2 }}>
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
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      A <strong>Prediction Quality Curve</strong> (ROC - Receiver Operating Characteristic) is a graph that shows how well a classification model performs.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read a Prediction Quality Curve</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The prediction quality curve plots two important rates:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
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
                  </FieldValue>
                </FieldContainer>
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
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
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
                  </FieldValue>
                </FieldContainer>
              </Box>
              </Box>
            </FieldValue>
          </FieldContainer>
      </Box>

      {/* Calibration Curve Section */}
      <Box id="calibration-curve-section">
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
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        A <strong>calibration curve</strong> shows whether the model's confidence scores match reality. When a model says "I'm 80% confident a patient will develop a certain condition," a well-calibrated model should be right about 80% of the time.
                      </Typography>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Key insight:</strong> A model can have high accuracy Prediction Quality (ROC) but poor calibration. Calibration indicates whether confidence scores can be trusted, not just the final predictions.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read a Calibration Curve</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
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
                  </FieldValue>
                </FieldContainer>
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
                 <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                   <FieldValue>
                     <Box sx={{ ml: 2 }}>
                       {[
                         "Perfect calibration: Curve follows the diagonal line exactly",
                         "Over-confident: Curve below diagonal (model overestimates probabilities)",
                         "Under-confident: Curve above diagonal (model underestimates probabilities)",
                                                    "Calibration matters when probability scores need to be trusted, not just the final decision"
                       ].map((point, index) => (
                         <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                           • {point}
                         </Typography>
                       ))}
                     </Box>
                   </FieldValue>
                 </FieldContainer>
               </Box>
              </Box>
            </FieldValue>
          </FieldContainer>
      </Box>

    </Box>
  );

  const renderSubgroupAnalysis = () => (
    <Box id="subgroup-analysis-main">
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
              Shows how well models perform across different patient groups including Gender, Race/Ethnicity, and Age Groups. These comparison charts help identify potential bias and ensure models work equitably for all patients. Charts only appear when current data contains these demographic fields.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Gender Performance Analysis Section */}
      <Box id="gender-performance-section" sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Gender Performance Analysis
                </SubHeading>
              </Box>
              
              {/* What is Gender Performance Analysis */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is Gender Performance Analysis?</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      A <strong>gender performance analysis</strong> compares how well models perform on male versus female patients. It shows whether models work equally well for both genders, helping identify potential gender bias in healthcare predictions.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read Gender Performance Analysis</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The chart shows side-by-side performance bars for each metric:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Purple-blue bars:</strong> Male patient performance
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Green bars:</strong> Female patient performance
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Metrics compared:</strong> Accuracy, Sensitivity, PPV, F1-Score, AUROC
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Bar height:</strong> Higher bars indicate better performance
                        </Typography>
                      </Box>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Look for balance:</strong> Similar bar heights between male and female indicate fair performance. Large differences suggest potential gender bias.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box sx={{ ml: 2 }}>
                      {[
                        "Similar performance across genders (differences <10%) indicates fair, unbiased model behavior",
                        "Large gender gaps in Sensitivity could mean missing more cases in one gender - dangerous in healthcare",
                        "Different disease presentation by gender is normal, but model performance should remain consistent",
                        "Both groups need adequate sample sizes (>50 patients) for reliable comparison",
                        "Consider clinical context - some conditions naturally affect genders differently",
                        "Use this analysis to ensure models serve all patients equitably"
                      ].map((point, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Race/Ethnicity Performance Analysis Section */}
      <Box id="race-performance-section" sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Race/Ethnicity Performance Analysis
                </SubHeading>
              </Box>
              
              {/* What is Race/Ethnicity Performance Analysis */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is Race/Ethnicity Performance Analysis?</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      A <strong>race/ethnicity performance analysis</strong> shows how the model performs across different racial and ethnic groups in patient population. It helps identify whether the model works equally well for all communities, ensuring healthcare equity and preventing algorithmic bias.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read Race/Ethnicity Performance Analysis</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The chart displays performance metrics across racial groups:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Multiple groups:</strong> White, Black, Hispanic, Asian, Other (based on available data)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Color coding:</strong> Each racial group has consistent colors for easy comparison
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Missing groups:</strong> Groups with too few patients (less than 2) are excluded for reliability
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Performance bars:</strong> Compare heights across all metrics for each racial group
                        </Typography>
                      </Box>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Healthcare equity check:</strong> All racial groups should show similar performance levels. Significant differences may indicate bias that could worsen health disparities.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box sx={{ ml: 2 }}>
                      {[
                        "Consistent performance across racial groups indicates equitable model behavior for all communities",
                        "Large performance gaps between racial groups may perpetuate existing healthcare disparities",
                        "Missing racial groups in analysis suggests limited diversity in training data",
                        "Some performance variation is expected due to genetic and environmental factors",
                        "Focus on groups with significantly lower Sensitivity - these patients face higher risk of missed diagnoses",
                        "Consider social determinants of health when interpreting racial performance differences"
                      ].map((point, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Age Group Performance Analysis Section */}
      <Box id="age-group-section" sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Age Group Performance Analysis
                </SubHeading>
              </Box>
              
              {/* What is Age Group Performance Analysis */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is Age Group Performance Analysis?</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      An <strong>age group performance analysis</strong> compares how well model performs across different age ranges in patient population. It reveals whether the model maintains consistent accuracy from pediatric to geriatric patients, helping ensure age-appropriate healthcare predictions.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read Age Group Performance Analysis</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The chart shows performance metrics across age categories:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Age ranges:</strong> Typically 0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+ years
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Performance bars:</strong> Each age group shows bars for all metrics (Accuracy, Sensitivity, etc.)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Color distinction:</strong> Different colors help identify each age group clearly
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Combined groups:</strong> Age ranges with few patients may be merged for reliability
                        </Typography>
                      </Box>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Age-appropriate care:</strong> Performance should remain stable across relevant age groups for the medical condition. Dramatic drops in pediatric or elderly groups often signal training data limitations.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box sx={{ ml: 2 }}>
                      {[
                        "Consistent performance across clinically relevant age groups indicates robust model generalization",
                        "Performance drops in elderly patients (61+) are common due to complex comorbidities and limited training data",
                        "Pediatric performance (0-20) may vary significantly based on disease prevalence in younger populations",
                        "Adult age groups (21-60) typically show the most stable and reliable performance",
                        "Age-related physiological changes can naturally affect disease presentation and model accuracy",
                        "Consider minimum patient counts per age group - groups with <20 patients may show unreliable metrics"
                      ].map((point, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>
    </Box>
  );

  const renderDataDistribution = () => (
    <Box id="data-distribution-main">
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
              Shows the demographic makeup and distribution of patients in current data. These distribution charts help understand the patient population models were trained and tested on, including Age, Gender, and Race/Ethnicity breakdowns. Charts only appear when current data contains these demographic fields.
            </Typography>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Age Distribution Chart Section */}
      <Box id="age-distribution-section" sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Age Distribution Charts
                </SubHeading>
              </Box>
              
              {/* What is Age Distribution Chart */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is an Age Distribution Chart?</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      An <strong>age distribution chart</strong> shows the age makeup of all patients in the data. It displays how many patients fall into each age bracket, helping understand whether data represents a diverse age range appropriate for the medical condition.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read an Age Distribution Chart</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The chart displays patient counts across age groups:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>X-axis:</strong> Age ranges (0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+ years)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Y-axis:</strong> Number of patients in each age group
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Bar height:</strong> Taller bars mean more patients in that age range
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Hover details:</strong> Shows exact patient counts and percentages
                        </Typography>
                      </Box>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Representative sample:</strong> Look for reasonable spread across age groups relevant to the medical condition. Extreme concentration in one age range may limit model applicability.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box sx={{ ml: 2 }}>
                      {[
                        "Balanced age distribution (no single group >60%) suggests the model training data is representative",
                        "Missing age groups may indicate the model lacks training for certain patient populations",
                        "Disease-specific patterns are normal - pediatric conditions should have more young patients",
                        "Very low counts (<10 patients) in age groups may produce unreliable performance metrics",
                        "Consider clinical relevance - adult-onset diseases naturally have fewer pediatric cases",
                        "Use this chart to identify potential blind spots in the model's training data"
                      ].map((point, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Gender Distribution Chart Section */}
      <Box id="gender-distribution-section" sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Gender Distribution Charts
                </SubHeading>
              </Box>
              
              {/* What is Gender Distribution Chart */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is a Gender Distribution Chart?</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      A <strong>gender distribution chart</strong> shows the split between male and female patients in data as a pie chart. It helps see whether data has balanced gender representation or if it's skewed toward one gender, which can affect model performance.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read a Gender Distribution Chart</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The pie chart displays gender proportions:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Green slice:</strong> Female patients (with count and percentage)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Coral slice:</strong> Male patients (with count and percentage)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Slice size:</strong> Larger slices indicate more patients of that gender
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Missing data:</strong> "Unknown" category may appear if gender data is incomplete
                        </Typography>
                      </Box>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Balance matters:</strong> For most conditions, aim for reasonable gender balance (30-70% range). Extreme imbalance may indicate data collection bias unless medically expected.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box sx={{ ml: 2 }}>
                      {[
                        "Balanced gender distribution (30-70% range) supports reliable model performance for both male and female patients",
                        "Extreme gender imbalance (>85% one gender) may indicate data collection bias unless medically expected",
                        "Large 'Unknown' category suggests data quality issues that could impact model reliability",
                        "Some medical conditions naturally affect one gender more - consider disease-specific patterns",
                        "Gender-balanced data helps ensure the model works equitably for all patients",
                        "Monitor this distribution when adding new data to maintain representative sampling"
                      ].map((point, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>
            </Box>
          </FieldValue>
        </FieldContainer>
      </Box>

      {/* Race/Ethnicity Distribution Chart Section */}
      <Box id="race-distribution-section" sx={{ mb: 2 }}>
        <FieldContainer sx={{ 
          minHeight: 'auto',
          borderLeft: '4px solid #2c5aa0'
        }}>
          <FieldValue>
            <Box>
              {/* Main Heading */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h5" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#275786', fontFamily: 'Arial, sans-serif' }}>
                  Understanding Race/Ethnicity Distribution Charts
                </SubHeading>
              </Box>
              
              {/* What is Race/Ethnicity Distribution Chart */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">What is a Race/Ethnicity Distribution Chart?</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Typography variant="body2" sx={{ fontSize: '16px', color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                      A <strong>race/ethnicity distribution chart</strong> displays how many patients from different racial and ethnic backgrounds are included in the data. It shows whether data represents diverse communities or is concentrated in specific populations, which affects model generalizability.
                    </Typography>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* How to Read */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">How to Read a Race/Ethnicity Distribution Chart</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f9f9f9' }}>
                  <FieldValue>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '16px', mb: 2, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                        The chart shows patient counts by racial categories:
                      </Typography>
                      <Box sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Racial groups:</strong> White, Black, Hispanic, Asian, Other (based on available data)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Bar heights:</strong> Taller bars indicate more patients from that racial group
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Light pink coloring:</strong> Consistent color scheme across all racial categories
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • <strong>Missing groups:</strong> Absence of bars may indicate limited diversity in data collection
                        </Typography>
                      </Box>
                      
                      <InfoSection bgColor="#fff3cd">
                        <strong>Diversity check:</strong> Multiple racial groups should be present for robust model performance. Single-group dominance may limit applicability to diverse patient populations.
                      </InfoSection>
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>

              {/* Key Takeaways */}
              <Box sx={{ mb: 2 }}>
                <SubHeading component="h6">Key Takeaways</SubHeading>
                <FieldContainer sx={{ minHeight: 'auto', padding: '12px 18px', backgroundColor: '#f8f9ff' }}>
                  <FieldValue>
                    <Box sx={{ ml: 2 }}>
                      {[
                        "Multiple racial groups in the data indicate diverse training data that can serve varied communities",
                        "Single racial group dominance may limit model applicability to other populations",
                        "Missing racial categories suggest potential gaps in patient representation",
                        "Distribution should reflect the patient population intended to be served with the model",
                        "Consider healthcare access patterns - some disparities may reflect systemic issues rather than bias",
                        "Use this information to identify communities that may need additional data collection efforts"
                      ].map((point, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '16px', mb: 1, color: '#333', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </FieldValue>
                </FieldContainer>
              </Box>
            </Box>
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

      <Paper elevation={1} sx={{ p: 3, borderRadius: '12px' }}>
        {renderAccuracyMetrics()}
        <Box sx={{ my: 4 }}>
          <Divider />
        </Box>
        {renderPerformanceCharts()}
        <Box sx={{ my: 4 }}>
          <Divider />
        </Box>
        {renderSubgroupAnalysis()}
        <Box sx={{ my: 4 }}>
          <Divider />
        </Box>
        {renderDataDistribution()}
      </Paper>
    </Box>
  );
};

export default GlossaryPage;
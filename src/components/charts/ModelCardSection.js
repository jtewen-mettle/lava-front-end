import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Collapse, 
  IconButton, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, ExpandLess, Download } from '@mui/icons-material';
import { modelCardData } from '../../data/modelCardData';

// Styled components to match original design and HTML styling
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '0',
  border: '1px solid #e1e8ed',
  marginBottom: '24px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  borderLeft: '5px solid #5dade2',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #5dade2 0%, #48a3d9 100%)',
  color: 'white',
  padding: '20px 30px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:hover': {
    background: 'linear-gradient(135deg, #48a3d9 0%, #5dade2 100%)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 600,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}));

const SectionContent = styled(Box)(({ theme }) => ({
  padding: '30px',
  backgroundColor: 'white',
}));

const FieldContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '18px',
  borderRadius: '8px',
  border: '1px solid #e1e8ed',
  transition: 'all 0.3s ease',
  minHeight: '80px',
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

const StatusBadge = styled('span')(({ theme, variant }) => ({
  display: 'inline-block',
  padding: '6px 14px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: 'Arial, sans-serif',
  color: 'white',
  ...(variant === 'certified' && {
    backgroundColor: '#2ecc71',
  }),
  ...(variant === 'warning' && {
    backgroundColor: '#f39c12',
  }),
  ...(variant === 'validated' && {
    backgroundColor: '#9b59b6',
  }),
  ...(variant === 'monitored' && {
    backgroundColor: '#5dade2',
  }),
}));


const MetricValue = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#5dade2',
  marginBottom: '12px',
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1,
}));

const MetricLabel = styled('div')(({ theme }) => ({
  color: '#666',
  fontSize: '12px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  lineHeight: 1,
}));

const WarningBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff3cd',
  border: '2px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

const CriticalBox = styled('div')(({ theme }) => ({
  backgroundColor: '#f8d7da',
  border: '2px solid #f5c6cb',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

const BoxTitle = styled('h4')(({ theme }) => ({
  color: '#856404',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
}));

const CriticalBoxTitle = styled(BoxTitle)(({ theme }) => ({
  color: '#721c24',
}));

const BoxList = styled('ul')(({ theme }) => ({
  color: '#856404',
  marginLeft: '20px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  '& li': {
    marginBottom: '8px',
  },
}));

const CriticalBoxList = styled(BoxList)(({ theme }) => ({
  color: '#721c24',
}));

const ComplianceBadge = styled('div')(({ theme }) => ({
  display: 'inline-block',
  background: '#27ae60',
  color: 'white',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'Arial, sans-serif',
}));

const ModelCardSection = ({ topic }) => {
  const [openSections, setOpenSections] = useState({ 0: true }); // First section open by default
  const modelCardRef = useRef(null);

  // Map topic names to modelCardData keys
  const getModelCardKey = (topicName) => {
    const normalizedTopic = topicName.toLowerCase();
    if (normalizedTopic.includes('cardiovascular') || normalizedTopic.includes('cardio')) {
      return 'cardiovascular';
    } else if (normalizedTopic.includes('chronic kidney disease') || normalizedTopic.includes('kidney') || normalizedTopic.includes('ckd')) {
      return 'ckd';
    } else if (normalizedTopic.includes('prostate cancer') || normalizedTopic.includes('prostate')) {
      return 'prostate';
    } else if (normalizedTopic.includes('hospitalization') || normalizedTopic.includes('hospital')) {
      return 'hospitalization';
    }
    return 'cardiovascular'; // default fallback
  };

  const modelCardKey = getModelCardKey(topic?.toLowerCase() || 'cardiovascular');
  const data = modelCardData[modelCardKey];

  if (!data) {
    return null;
  }

  const toggleSection = (sectionIndex) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  const handleDownload = () => {
    // First, open all sections for the download
    const allSectionsOpen = { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true };
    setOpenSections(allSectionsOpen);
    
    // Wait for the DOM to update, then trigger print
    setTimeout(() => {
      const modelCardContent = modelCardRef.current.outerHTML;
      
      // Create a temporary div to hold the content
      const printDiv = document.createElement('div');
      printDiv.innerHTML = modelCardContent;
      
      // Hide all download buttons in the print content
      const downloadButtons = printDiv.querySelectorAll('.download-button, .MuiIconButton-root');
      downloadButtons.forEach(button => {
        button.style.display = 'none';
      });
      
      // Get all the styles from the current page
      const allStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Model Card - ${data.interventionName || 'Healthcare AI Model'}</title>
          <meta charset="utf-8">
          <style>
            ${allStyles}
            
            /* Additional print-specific styles */
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333; 
              line-height: 1.4;
              background: white;
            }
            
            /* Hide download buttons */
            .download-button, 
            .MuiIconButton-root { 
              display: none !important; 
            }
            
            /* Ensure cards maintain their styling */
            .css-1d3z3hw-MuiBox-root {
              margin-top: 32px;
              width: 100%;
            }
            
            /* Print-specific adjustments */
            @media print {
              body { 
                margin: 0; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .download-button, 
              .MuiIconButton-root { 
                display: none !important; 
              }
              /* Ensure backgrounds print */
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
            
            /* Force specific styling for key elements */
            .MuiPaper-root {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
              border-radius: 8px !important;
              margin-bottom: 24px !important;
            }
            
            /* Ensure gradients and colors are preserved */
            [style*="linear-gradient"] {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          </style>
        </head>
        <body>
          ${printDiv.innerHTML}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Close the print window after printing or if user cancels
      printWindow.onafterprint = () => {
        printWindow.close();
      };
      
      // Trigger print immediately
      printWindow.print();
    }, 500);
  };


  // Grid component for field layout
  const FieldGrid = ({ items, columns = 3 }) => (
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
  const MetricGrid = ({ metrics }) => (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(6, 1fr)'
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

  return (
    <Box mt={4} width="100%" ref={modelCardRef}>
      {/* Simple Header */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <Box>
          <Typography variant="h5" sx={{ 
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#000',
            textAlign: 'left',
            marginBottom: '4px'
          }}>
            ONC HTI-1 Compliant Model Card
          </Typography>
          <Typography sx={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#666',
            textAlign: 'left'
          }}>
            Predictive Decision Support Intervention - {data.interventionName?.split(' ')[1] || 'Risk Assessment'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ComplianceBadge>
            {data.complianceBadge}
          </ComplianceBadge>
          <Tooltip title="Download Model Card" arrow>
            <IconButton 
              size="small" 
              onClick={handleDownload}
              className="download-button"
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
          </Tooltip>
        </Box>
      </Box>

      {/* Section 1: Intervention Details and Output */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(0)}>
          <SectionTitle>
            1. Intervention Details and Output
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[0] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[0]}>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Intervention Name', value: data.interventionName },
              { label: 'Developer Name & Contact', value: data.developerContact },
              { label: 'Funding Source', value: data.fundingSource },
              { label: 'Value Produced as Output', value: data.valueOutput },
              { 
                label: 'Output Type', 
                value: <StatusBadge variant="validated">{data.outputType}</StatusBadge> 
              }
            ]} />
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 2: Purpose of Intervention */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(1)}>
          <SectionTitle>
            2. Purpose of Intervention
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[1] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[1]}>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Intended Use', value: data.intendedUse },
              { label: 'Intended Patient Population', value: data.intendedPatientPopulation },
              { label: 'Intended Users', value: data.intendedUsers },
              { 
                label: 'Decision-Making Role', 
                value: (
                  <>
                    <StatusBadge variant="monitored">{data.decisionMakingRole}</StatusBadge>
                    <br />
                    {data.decisionMakingDesc}
                  </>
                )
              }
            ]} />
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 3: Cautioned Out-of-Scope Use */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(2)}>
          <SectionTitle>
            3. Cautioned Out-of-Scope Use
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[2] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[2]}>
          <SectionContent>
            <CriticalBox>
              <CriticalBoxTitle>🚫 Tasks, Situations, or Populations to Avoid</CriticalBoxTitle>
              <CriticalBoxList>
                {data.criticalAvoidances?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </CriticalBoxList>
            </CriticalBox>

            <WarningBox>
              <BoxTitle>⚠️ Known Risks, Inappropriate Settings & Limitations</BoxTitle>
              <BoxList>
                {data.knownRisks?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </BoxList>
            </WarningBox>
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 4: Development Details and Input Features */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(3)}>
          <SectionTitle>
            4. Development Details and Input Features
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[3] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[3]}>
          <SectionContent>
            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Training Data Inclusion/Exclusion Criteria
            </Typography>
            <FieldGrid items={[
              { label: 'Inclusion Criteria', value: data.trainingInclusion },
              { label: 'Exclusion Criteria', value: data.trainingExclusion }
            ]} columns={2} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              USCDI v4 Data Elements as Input Features
            </Typography>
            <FieldGrid items={[
              { label: 'Race (§170.213)', value: data.uscdiElements?.race?.used ? `✓ Used - ${data.uscdiElements.race.description}` : `✗ Not Used - ${data.uscdiElements?.race?.description || 'Not included in risk calculation'}` },
              { label: 'Ethnicity (§170.213)', value: data.uscdiElements?.ethnicity?.used ? `✓ Used - ${data.uscdiElements.ethnicity.description}` : `✗ Not Used - ${data.uscdiElements?.ethnicity?.description || 'Not included in risk calculation'}` },
              { label: 'Sex (§170.213)', value: data.uscdiElements?.sex?.used ? `✓ Used - ${data.uscdiElements.sex.description}` : `✗ Not Used - ${data.uscdiElements?.sex?.description || 'Not included in risk calculation'}` },
              { label: 'Date of Birth (§170.213)', value: data.uscdiElements?.dateOfBirth?.used ? `✓ Used - ${data.uscdiElements.dateOfBirth.description}` : `✗ Not Used - ${data.uscdiElements?.dateOfBirth?.description || 'Not included in risk calculation'}` },
              { label: 'Language (§170.213)', value: data.uscdiElements?.language?.used ? `✓ Used - ${data.uscdiElements.language.description}` : `✗ Not Used - ${data.uscdiElements?.language?.description || 'Not included in risk calculation'}` },
              { label: 'Sexual Orientation (§170.213)', value: data.uscdiElements?.sexualOrientation?.used ? `✓ Used - ${data.uscdiElements.sexualOrientation.description}` : `✗ Not Used - ${data.uscdiElements?.sexualOrientation?.description || 'Not included in risk calculation'}` },
              { label: 'Gender Identity (§170.213)', value: data.uscdiElements?.genderIdentity?.used ? `✓ Used - ${data.uscdiElements.genderIdentity.description}` : `✗ Not Used - ${data.uscdiElements?.genderIdentity?.description || 'Not included in risk calculation'}` },
              { label: 'Social Determinants of Health (§170.213)', value: data.uscdiElements?.socialDeterminants?.used ? `✓ Used - ${data.uscdiElements.socialDeterminants.description}` : `✗ Not Used - ${data.uscdiElements?.socialDeterminants?.description || 'Not included in current model version'}` },
              { label: 'Health Status Assessments (§170.213)', value: data.uscdiElements?.healthAssessments?.used ? `✓ Used - ${data.uscdiElements.healthAssessments.description}` : `✗ Not Used - ${data.uscdiElements?.healthAssessments?.description || 'Not included in risk calculation'}` }
            ]} columns={3} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Demographic Representativeness of Training Data
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: '15px' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>Demographic Variable</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>Training Data %</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>US Population %</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>Representativeness</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.demographicRepresentativeness?.map((row, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f8f9fa' } }}>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.variable}</TableCell>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.trainingData}</TableCell>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.usPopulation}</TableCell>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>
                        <StatusBadge variant={
                          row.representativeness === 'Good' ? 'validated' : 
                          row.representativeness === 'Over-represented' ? 'monitored' : 
                          row.representativeness === 'Under-represented' ? 'warning' : 
                          'warning'
                        }>
                          {row.representativeness}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <FieldContainer>
              <FieldLabel>Relevance to Deployed Setting</FieldLabel>
              <FieldValue>{data.relevanceToDeployedSetting}</FieldValue>
            </FieldContainer>

            <Box sx={{ backgroundColor: '#e8f5e8', border: '2px solid #c3e6c3', borderRadius: '8px', padding: '20px', margin: '15px 0' }}>
              <Typography variant="h6" sx={{ color: '#155724', marginBottom: '12px', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                🎯 Fairness Development Process
              </Typography>
              <FieldGrid items={[
                { label: 'Fairness Approach', value: data.fairnessApproach },
                { label: 'Bias Management', value: data.biasManagement }
              ]} columns={2} />
            </Box>
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 5: External Validation Process */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(4)}>
          <SectionTitle>
            5. External Validation Process
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[4] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[4]}>
          <SectionContent>
            <FieldGrid items={[
              { label: 'External Data Sources', value: data.externalDataSources },
              { label: 'Clinical Settings', value: data.clinicalSettings },
              { label: 'External Testing Party', value: data.externalTestingParty },
              { label: 'External Validation Process', value: data.externalValidationProcess }
            ]} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              External Validation Demographics
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: '15px' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>Variable</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>MESA (n=6,814)</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>WHI (n=8,090)</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: 'Arial, sans-serif' }}>REGARDS (n=16,025)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.externalValidationDemographics?.map((row, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f8f9fa' } }}>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.variable}</TableCell>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.mesa}</TableCell>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.whi}</TableCell>
                      <TableCell sx={{ fontFamily: 'Arial, sans-serif' }}>{row.regards}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 6: Quantitative Performance Measures */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(5)}>
          <SectionTitle>
            6. Quantitative Performance Measures
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[5] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[5]}>
          <SectionContent>
            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Internal Validation (Same Source as Training)
            </Typography>
            <MetricGrid metrics={[
              { value: data.internalValidationMetrics?.aurocValidity, label: 'AUROC Validity' },
              { value: data.internalValidationMetrics?.fairnessScore, label: data.internalValidationMetrics?.fairnessScoreDesc || 'Fairness Score' },
              { value: data.internalValidationMetrics?.calibration, label: data.internalValidationMetrics?.calibrationDesc || 'Calibration' },
              { value: data.internalValidationMetrics?.sensitivity, label: 'Sensitivity' },
              { value: data.internalValidationMetrics?.specificity, label: 'Specificity' },
              { value: data.internalValidationMetrics?.ppv, label: 'PPV' }
            ]} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              External Validation (Different Source)
            </Typography>
            <MetricGrid metrics={[
              { value: data.externalValidationMetrics?.aurocValidity, label: data.externalValidationMetrics?.aurocValidityDesc || 'AUROC Validity' },
              { value: data.externalValidationMetrics?.fairnessScore, label: data.externalValidationMetrics?.fairnessScoreDesc || 'Fairness Score' },
              { value: data.externalValidationMetrics?.calibration, label: data.externalValidationMetrics?.calibrationDesc || 'Calibration' },
              { value: data.externalValidationMetrics?.publishedStudies, label: data.externalValidationMetrics?.publishedStudiesDesc || 'Published Studies' }
            ]} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Outcome Evaluation References
            </Typography>
            <FieldGrid items={[
              { 
                label: 'Clinical Outcomes Studies', 
                value: data.outcomeEvaluationReferences?.map((ref, index) => `• ${ref}`).join('\n') 
              },
              { label: 'Real-World Impact', value: data.realWorldImpact }
            ]} />
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 7: Ongoing Maintenance & Monitoring */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(6)}>
          <SectionTitle>
            7. Ongoing Maintenance & Monitoring
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[6] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[6]}>
          <SectionContent>
            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Validity Monitoring
            </Typography>
            <FieldGrid items={[
              { label: 'Monitoring Process & Frequency', value: data.monitoringProcess },
              { 
                label: 'Local Data Validity', 
                value: (
                  <>
                    <StatusBadge variant={
                      data.localDataValidity === 'Currently Monitored' ? 'validated' : 
                      'monitored'
                    }>{data.localDataValidity}</StatusBadge>
                    <br />
                    {data.localDataValidityDesc}
                  </>
                )
              }
            ]} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Fairness Monitoring
            </Typography>
            <FieldGrid items={[
              { label: 'Fairness Monitoring Process', value: data.fairnessMonitoringProcess },
              { 
                label: 'Local Fairness Data', 
                value: (
                  <>
                    <StatusBadge variant={
                      data.localFairnessData === 'Complete' ? 'validated' : 
                      data.localFairnessData === 'Incomplete' ? 'warning' :
                      'warning'
                    }>{data.localFairnessData}</StatusBadge>
                    <br />
                    {data.localFairnessDataDesc}
                  </>
                )
              }
            ]} />

            <Typography variant="h6" sx={{ color: '#34495e', fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', margin: '25px 0 15px 0', borderBottom: '2px solid #ecf0f1', paddingBottom: '8px' }}>
              Update & Validation Schedule
            </Typography>
            <FieldGrid items={[
              { label: 'Update Process & Frequency', value: data.updateProcess },
              { label: 'Performance Correction', value: data.performanceCorrection }
            ]} />

            <WarningBox>
              <BoxTitle>🔄 Current Monitoring Status</BoxTitle>
              <BoxList>
                {data.currentMonitoringStatus?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </BoxList>
            </WarningBox>
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 8: Evidence Base & Clinical Guidelines */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(7)}>
          <SectionTitle>
            8. Evidence Base & Clinical Guidelines
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[7] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[7]}>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Primary Citation', value: data.primaryCitation },
              { 
                label: 'Supporting Guidelines', 
                value: data.supportingGuidelines?.map((guideline, index) => `• ${guideline}`).join('\n')
              },
              { 
                label: 'Clinical Evidence Level', 
                value: (
                  <>
                    <StatusBadge variant="validated">{data.clinicalEvidenceLevel}</StatusBadge>
                    <br />
                    {data.clinicalEvidenceLevelDesc}
                  </>
                )
              }
            ]} />
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Section 9: Technical Implementation Details */}
      <StyledPaper>
        <SectionHeader onClick={() => toggleSection(8)}>
          <SectionTitle>
            9. Technical Implementation Details
          </SectionTitle>
          <IconButton size="small" sx={{ color: 'white' }}>
            {openSections[8] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={openSections[8]}>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Algorithm Type', value: data.algorithmType },
              { label: 'Integration Method', value: data.integrationMethod },
              { label: 'Response Time', value: data.responseTime },
              { label: 'Certification Details', value: data.certificationDetails }
            ]} />
          </SectionContent>
        </Collapse>
      </StyledPaper>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: '#ecf0f1',
        padding: '25px 40px',
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        borderTop: '1px solid #bdc3c7',
        lineHeight: 1.4
      }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)'
          },
          gap: 2,
          marginBottom: '20px'
        }}>
          <div>
            <strong>Clinical Support</strong><br />
            clinical.ai@cerner.com<br />
            1-800-237-6371
          </div>
          <div>
            <strong>Technical Support</strong><br />
            integration.support@cerner.com<br />
            Developer Portal: developer.cerner.com
          </div>
          <div>
            <strong>Regulatory Affairs</strong><br />
            regulatory@cerner.com<br />
            ONC Certification ID: 3069
          </div>
        </Box>
        <hr style={{ margin: '20px 0', border: '1px solid #bdc3c7' }} />
        <p>
          <strong>Last Updated:</strong> {data.lastUpdated || 'July 30, 2025'} | {' '}
          <strong>Model Card Version:</strong> {data.modelCardVersion || '2.1.3'} | {' '}
          <strong>ONC HTI-1 Compliant</strong>
        </p>
        <p>
          <strong>Document Classification:</strong> {data.documentClassification || 'For Healthcare Professional Use Only | HIPAA Compliant | 21st Century Cures Act Compliant'}
        </p>
      </Box>
    </Box>
  );
};

export default ModelCardSection;
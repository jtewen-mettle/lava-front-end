import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modelCardData } from '../../data/modelCardData';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  marginBottom: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#275786',
  fontSize: '18px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}));

const SubSectionTitle = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
  borderBottom: '2px solid #ecf0f1',
  paddingBottom: '5px',
}));

const FieldContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #e1e8ed',
  transition: 'all 0.3s ease',
  minHeight: '100px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: '#275786',
    boxShadow: '0 4px 12px rgba(39, 87, 134, 0.1)',
  },
}));

const FieldLabel = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: '#000',
  marginBottom: '5px',
  display: 'block',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
}));

const FieldValue = styled('div')(({ theme }) => ({
  color: '#000',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1.4,
  wordWrap: 'break-word',
  marginTop: '5px',
  flex: 1,
}));

const MetricContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  border: '2px solid #ecf0f1',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#275786',
    transform: 'translateY(-2px)',
  },
}));

const MetricValue = styled('div')(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#275786',
  marginBottom: '5px',
  fontFamily: 'Arial, sans-serif',
}));

const MetricLabel = styled('div')(({ theme }) => ({
  color: '#7f8c8d',
  fontSize: '12px',
  fontFamily: 'Arial, sans-serif',
}));

const StatusBadge = styled('span')(({ theme, variant }) => ({
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: 'Arial, sans-serif',
  ...(variant === 'certified' && {
    backgroundColor: '#2ecc71',
    color: 'white',
  }),
  ...(variant === 'warning' && {
    backgroundColor: '#f39c12',
    color: 'white',
  }),
  ...(variant === 'review' && {
    backgroundColor: '#e74c3c',
    color: 'white',
  }),
  ...(variant === 'monitoring' && {
    backgroundColor: '#3498db',
    color: 'white',
  }),
}));

const LimitationBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

const LimitationTitle = styled('h4')(({ theme }) => ({
  color: '#000',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
}));

const LimitationList = styled('ul')(({ theme }) => ({
  color: '#000',
  marginLeft: '20px',
  '& li': {
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '5px',
  },
}));

const ModelCardSection = ({ topic = 'cardiovascular' }) => {
  const data = modelCardData[topic] || modelCardData.cardiovascular;

  const getBiasStatusVariant = (status) => {
    switch (status) {
      case 'Under Review':
        return 'review';
      case 'Active Monitoring':
        return 'monitoring';
      case 'Enhanced Monitoring':
        return 'warning';
      case 'Active Mitigation':
        return 'monitoring';
      default:
        return 'warning';
    }
  };

  return (
    <Box mt={4} width="100%">
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontFamily: 'Arial, sans-serif', 
          fontWeight: 'bold', 
          fontSize: '18px',
          color: '#275786',
          marginBottom: '24px'
        }}
      >
        Model Card - {data.modelName}
      </Typography>

      {/* Model Identification Section */}
      <StyledPaper>
        <SectionTitle>
          Model Identification
        </SectionTitle>
        
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Model Name</FieldLabel>
              <FieldValue>{data.modelName}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Version</FieldLabel>
              <FieldValue>{data.version}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Developer / Manufacturer</FieldLabel>
              <FieldValue>{data.developer}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Release Date</FieldLabel>
              <FieldValue>{data.releaseDate}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Intended Use</FieldLabel>
              <FieldValue>{data.intendedUse}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Certification Status</FieldLabel>
              <FieldValue>
                <StatusBadge variant="certified">{data.certificationStatus}</StatusBadge>
              </FieldValue>
            </FieldContainer>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Algorithm Transparency Section */}
      <StyledPaper>
        <SectionTitle>
          Algorithm Transparency
        </SectionTitle>
        
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Model Type</FieldLabel>
              <FieldValue>{data.modelType}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Output Provided</FieldLabel>
              <FieldValue>{data.outputProvided}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>End Users</FieldLabel>
              <FieldValue>{data.endUsers}</FieldValue>
            </FieldContainer>
          </Grid>
        </Grid>

        <SubSectionTitle>Inputs Required (USCDI Aligned)</SubSectionTitle>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Demographics</FieldLabel>
              <FieldValue>{data.demographicsInputs}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Laboratory Values</FieldLabel>
              <FieldValue>{data.laboratoryInputs}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Clinical Measurements</FieldLabel>
              <FieldValue>{data.clinicalInputs}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Medical History</FieldLabel>
              <FieldValue>{data.medicalHistoryInputs}</FieldValue>
            </FieldContainer>
          </Grid>
        </Grid>

        <SubSectionTitle>Performance Metrics</SubSectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <MetricContainer>
              <MetricValue>{data.performanceMetrics.auroc}</MetricValue>
              <MetricLabel>AUROC/AUC</MetricLabel>
            </MetricContainer>
          </Grid>
          <Grid item xs={6} md={2}>
            <MetricContainer>
              <MetricValue>{data.performanceMetrics.sensitivity}</MetricValue>
              <MetricLabel>Sensitivity</MetricLabel>
            </MetricContainer>
          </Grid>
          <Grid item xs={6} md={2}>
            <MetricContainer>
              <MetricValue>{data.performanceMetrics.specificity}</MetricValue>
              <MetricLabel>Specificity</MetricLabel>
            </MetricContainer>
          </Grid>
          <Grid item xs={6} md={2}>
            <MetricContainer>
              <MetricValue>{data.performanceMetrics.ppv}</MetricValue>
              <MetricLabel>PPV</MetricLabel>
            </MetricContainer>
          </Grid>
          <Grid item xs={6} md={2}>
            <MetricContainer>
              <MetricValue>{data.performanceMetrics.npv}</MetricValue>
              <MetricLabel>NPV</MetricLabel>
            </MetricContainer>
          </Grid>
          <Grid item xs={6} md={2}>
            <MetricContainer>
              <MetricValue>{data.performanceMetrics.calibration}</MetricValue>
              <MetricLabel>Calibration</MetricLabel>
            </MetricContainer>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2, width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Internal Validation</FieldLabel>
              <FieldValue>{data.internalValidation}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>External Validation</FieldLabel>
              <FieldValue>{data.externalValidation}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Real-world Performance</FieldLabel>
              <FieldValue>{data.realWorldPerformance}</FieldValue>
            </FieldContainer>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Clinical Context & Limitations Section */}
      <StyledPaper>
        <SectionTitle>
          Clinical Context & Limitations
        </SectionTitle>
        
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Target Use</FieldLabel>
              <FieldValue>{data.targetUse}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Intended Population</FieldLabel>
              <FieldValue>{data.intendedPopulation}</FieldValue>
            </FieldContainer>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <FieldContainer>
              <FieldLabel>Clinical Setting</FieldLabel>
              <FieldValue>{data.clinicalSetting}</FieldValue>
            </FieldContainer>
          </Grid>
        </Grid>

        <SubSectionTitle>Exclusions</SubSectionTitle>
        <LimitationBox>
          <LimitationTitle>
            Patient Population Exclusions
          </LimitationTitle>
          <LimitationList>
            {data.exclusions.map((exclusion, index) => (
              <li key={index}>{exclusion}</li>
            ))}
          </LimitationList>
        </LimitationBox>

        <SubSectionTitle>Important Limitations</SubSectionTitle>
        <LimitationBox>
          <LimitationTitle>
            Clinical Decision Making
          </LimitationTitle>
          <LimitationList>
            {data.limitations.map((limitation, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: limitation }} />
            ))}
          </LimitationList>
        </LimitationBox>

        <FieldContainer>
          <FieldLabel>Bias Considerations</FieldLabel>
          <FieldValue>
            <StatusBadge variant={getBiasStatusVariant(data.biasStatus)}>
              {data.biasStatus}
            </StatusBadge>
            <span style={{ marginLeft: '10px' }}>{data.biasConsiderations}</span>
          </FieldValue>
        </FieldContainer>
      </StyledPaper>
    </Box>
  );
};

export default ModelCardSection;
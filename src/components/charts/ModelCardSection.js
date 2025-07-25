import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modelCardData } from '../../data/modelCardData';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '16px',
  border: '1px solid #e1e8ed',
  marginBottom: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
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
  padding: '16px',
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
    borderColor: '#275786',
    boxShadow: '0 4px 12px rgba(39, 87, 134, 0.1)',
  },
}));

const FieldLabel = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: '#000',
  marginBottom: '5px',
  display: 'block',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
}));

const FieldValue = styled('div')(({ theme }) => ({
  color: '#000',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  lineHeight: 1.5,
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
  marginTop: '8px',
  flex: 1,
  display: 'flex',
  alignItems: 'flex-start',
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
  fontSize: '12px',
  fontWeight: 'bold',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: 'Arial, sans-serif',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  ...(variant === 'certified' && {
    backgroundColor: '#2ecc71',
  }),
  ...(variant === 'warning' && {
    backgroundColor: '#f39c12',
  }),
  ...(variant === 'review' && {
    backgroundColor: '#e74c3c',
  }),
  ...(variant === 'monitoring' && {
    backgroundColor: '#3498db',
  }),
}));

const LimitationBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fef7e6',
  border: '1px solid #f4c430',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
  borderLeft: '4px solid #d4930a',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(212, 147, 10, 0.2)',
    borderColor: '#d4930a',
  },
}));

const LimitationTitle = styled('h4')(({ theme }) => ({
  color: '#000',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
}));

const LimitationList = styled('ul')(({ theme }) => ({
  color: '#000',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '& li': {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'normal',
    marginBottom: '8px',
    paddingLeft: '25px',
    position: 'relative',
    lineHeight: 1.6,
    '&::before': {
      content: '"➤"',
      position: 'absolute',
      left: '0',
      top: '0',
      fontSize: '14px',
      color: '#FAD473',
      fontWeight: 'bold',
    },
    '&:nth-child(even)::before': {
      color: '#2196f3',
    },
  },
}));

const ModelCardSection = ({ topic }) => {
  // Map topic names to modelCardData keys - no fallback
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
    return null; // no fallback
  };

  const modelCardKey = getModelCardKey(topic);
  const data = modelCardData[modelCardKey];

  // If no valid topic found, don't render the component
  if (!data) {
    return null;
  }

  // Reusable Dynamic Card Grid Function
  const DynamicCardGrid = ({ items }) => (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)', 
          lg: 'repeat(3, 1fr)'
        },
        gap: 2,
        width: '100%'
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e1e8ed',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '60px',
            maxHeight: '120px',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#275786',
              boxShadow: '0px 4px 12px rgba(39, 87, 134, 0.1)',
            }
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: '#000',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              marginBottom: '8px'
            }}
          >
            {item.label}
          </Typography>
          <Box
            sx={{
              color: '#000',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'normal',
              lineHeight: 1.5,
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start'
            }}
          >
            {item.value}
          </Box>
        </Box>
      ))}
    </Box>
  );

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
        Risk Assessment
      </Typography>

      {/* Model Identification Section */}
      <StyledPaper>
        <SectionTitle>
          Model Identification
        </SectionTitle>
        
        <DynamicCardGrid 
          items={[
            { label: 'Model Name', value: data.modelName },
            { label: 'Version', value: data.version },
            { label: 'Developer / Manufacturer', value: data.developer },
            { label: 'Release Date', value: data.releaseDate },
            { label: 'Intended Use', value: data.intendedUse },
            { 
              label: 'Certification Status', 
              value: <StatusBadge variant="certified">{data.certificationStatus}</StatusBadge> 
            }
          ]}
        />
      </StyledPaper>

      {/* Algorithm Transparency Section */}
      <StyledPaper>
        <SectionTitle>
          Algorithm Transparency
        </SectionTitle>
        
        <DynamicCardGrid 
          items={[
            { label: 'Model Type', value: data.modelType },
            { label: 'Output Provided', value: data.outputProvided },
            { label: 'End Users', value: data.endUsers }
          ]}
        />

        <SubSectionTitle>Inputs Required (USCDI Aligned)</SubSectionTitle>
        <DynamicCardGrid 
          items={[
            { label: 'Demographics', value: data.demographicsInputs },
            { label: 'Laboratory Values', value: data.laboratoryInputs },
            { label: 'Clinical Measurements', value: data.clinicalInputs },
            { label: 'Medical History', value: data.medicalHistoryInputs }
          ]}
        />

        <SubSectionTitle>Performance Metrics</SubSectionTitle>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(6, 1fr)'
            },
            gap: 2,
            width: '100%'
          }}
        >
          {[
            { value: data.performanceMetrics.auroc, label: 'AUROC/AUC' },
            { value: data.performanceMetrics.sensitivity, label: 'Sensitivity' },
            { value: data.performanceMetrics.specificity, label: 'Specificity' },
            { value: data.performanceMetrics.ppv, label: 'PPV' },
            { value: data.performanceMetrics.npv, label: 'NPV' },
            { value: data.performanceMetrics.calibration, label: 'Calibration' }
          ].map((metric, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: '#f8f9fa',
                border: '2px solid #e3f2fd',
                borderRadius: '12px',
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
                  borderColor: '#275786',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(39, 87, 134, 0.2)',
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#275786',
                  fontFamily: 'Arial, sans-serif',
                  marginBottom: '12px',
                  lineHeight: 1
                }}
              >
                {metric.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 'normal',
                  color: '#666',
                  fontFamily: 'Arial, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: 1
                }}
              >
                {metric.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3 }}>
          <DynamicCardGrid 
            items={[
              { label: 'Internal Validation', value: data.internalValidation },
              { label: 'External Validation', value: data.externalValidation },
              { label: 'Real-world Performance', value: data.realWorldPerformance }
            ]}
          />
        </Box>
      </StyledPaper>

      {/* Clinical Context & Limitations Section */}
      <StyledPaper>
        <SectionTitle>
          Clinical Context & Limitations
        </SectionTitle>
        
        <DynamicCardGrid 
          items={[
            { label: 'Target Use', value: data.targetUse },
            { label: 'Intended Population', value: data.intendedPopulation },
            { label: 'Clinical Setting', value: data.clinicalSetting }
          ]}
        />

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

        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              backgroundColor: 'white',
              border: '1px solid #e1e8ed',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#275786',
                boxShadow: '0 4px 12px rgba(39, 87, 134, 0.1)',
              }
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2,
                marginBottom: '16px',
                flexWrap: 'wrap'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#000',
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                Bias Considerations
              </Typography>
              <Box
                sx={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  backgroundColor: data.biasStatus === 'Under Review' ? '#FACC52' : '#4caf50',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                {data.biasStatus}
              </Box>
            </Box>
            <Typography
              sx={{
                color: '#000',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                lineHeight: 1.6,
                textAlign: 'left'
              }}
            >
              {data.biasConsiderations}
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default ModelCardSection;
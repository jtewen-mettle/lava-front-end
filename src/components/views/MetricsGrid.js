import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useAppContext } from '../../context/AppContext';

const MetricsGrid = ({ metrics }) => {
  const colors = ['#f9f9f9', '#f0f4f8'];
  const { navigateToGlossary } = useAppContext();

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
      width: '100%', 
      gap: '20px',
      marginBottom: '16px',
      maxWidth: '100%'
    }}>
      {metrics.map((metric, i) => (
        <Card
          key={i}
          elevation={2}
          style={{
            backgroundColor: colors[i % 2],
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '120px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          elevation={2}
          sx={{
            '&:hover': {
              elevation: 6,
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              backgroundColor: i % 2 === 0 ? '#f0f0f0' : '#e8f4f8',
            }
          }}
        >
          <CardContent style={{ 
            padding: '12px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            height: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight="bold"
                style={{ fontSize: '0.8rem', lineHeight: 1.1 }}
              >
                {metric.label}
              </Typography>
              <Tooltip
                title={
                  <>
                    <span>{metric.tooltip}</span>
                    <br />
                    <span color="white" style={{ fontStyle: 'italic' }}>
                      {metric.formula}
                    </span>
                    <br />
                    <span style={{ fontSize: '0.85em', color: '#e0e0e0' }}>
                      Click for more details
                    </span>
                  </>
                }
                arrow
              >
                <IconButton 
                  size="small" 
                  onClick={() => {
                    // Map metric labels to section names
                    const metricSectionMap = {
                      'Overall Accuracy': 'overall-accuracy',
                      'Positive Predictive Value': 'precision',
                      'Precision': 'precision',
                      'Sensitivity': 'sensitivity',
                      'Recall': 'recall',
                      'Specificity': 'specificity',
                      'F1 Score': 'f1-score'
                    };
                    const section = metricSectionMap[metric.label] || 'precision';
                    navigateToGlossary(section);
                  }}
                >
                  <InfoIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            
            <Typography variant="h6" textAlign="left" style={{ margin: '4px 0' }}>
              {metric.value}
              {metric.isGood ? (
                <CheckCircleIcon style={{ color: 'green', marginLeft: '8px', fontSize: '1.2rem' }} />
              ) : (
                <WarningIcon style={{ color: 'red', marginLeft: '8px', fontSize: '1.2rem' }} />
              )}
            </Typography>
            
            <Typography
              variant="body2"
              textAlign="left"
              style={{
                fontStyle: 'italic',
                color: '#757575',
                fontSize: '0.7rem',
                lineHeight: 1.2,
              }}
            >
              {metric.info}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsGrid;

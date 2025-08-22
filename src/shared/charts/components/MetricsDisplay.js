import React from 'react';
import { Box, Grid, Typography, Tooltip } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Card } from '../../ui';
import { tokens } from '../../../core/theme';

const MetricCard = ({ 
  title, 
  value, 
  description, 
  format = 'percentage',
  color = 'primary',
  size = 'medium'
}) => {
  const formatValue = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    
    switch (format) {
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`;
      case 'decimal':
        return val.toFixed(3);
      case 'integer':
        return Math.round(val).toString();
      case 'count':
        return val.toLocaleString();
      default:
        return val.toString();
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'success': return tokens.colors.semantic.success;
      case 'warning': return tokens.colors.semantic.warning;
      case 'error': return tokens.colors.semantic.error;
      case 'info': return tokens.colors.semantic.info;
      case 'primary':
      default: return tokens.colors.primary[600];
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          titleSize: tokens.typography.fontSize.sm,
          valueSize: tokens.typography.fontSize.lg,
          padding: 'small'
        };
      case 'large':
        return {
          titleSize: tokens.typography.fontSize.lg,
          valueSize: tokens.typography.fontSize['3xl'],
          padding: 'large'
        };
      case 'medium':
      default:
        return {
          titleSize: tokens.typography.fontSize.base,
          valueSize: tokens.typography.fontSize['2xl'],
          padding: 'medium'
        };
    }
  };

  const sizeConfig = getSizeConfig();

  return (
    <Card 
      elevation={2} 
      padding={sizeConfig.padding}
      sx={{
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: sizeConfig.titleSize,
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.neutral[700]
          }}
        >
          {title}
        </Typography>
        
        {description && (
          <Tooltip title={description} arrow>
            <InfoIcon 
              sx={{ 
                ml: 1, 
                fontSize: '16px', 
                color: tokens.colors.neutral[500],
                cursor: 'help'
              }} 
            />
          </Tooltip>
        )}
      </Box>
      
      <Typography
        variant="h3"
        sx={{
          fontSize: sizeConfig.valueSize,
          fontWeight: tokens.typography.fontWeight.bold,
          color: getColorValue(),
          fontFamily: tokens.typography.fontFamily.primary
        }}
      >
        {formatValue(value)}
      </Typography>
    </Card>
  );
};

const MetricsDisplay = ({
  metrics,
  title = 'Performance Metrics',
  layout = 'grid', // 'grid' or 'list'
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  showConfusionMatrix = true,
  customMetrics = [],
  size = 'medium'
}) => {
  const standardMetrics = [
    {
      key: 'accuracy',
      title: 'Accuracy',
      description: 'The proportion of correct predictions among all predictions',
      color: 'primary'
    },
    {
      key: 'sensitivity',
      title: 'Sensitivity',
      description: 'True positive rate - ability to correctly identify positive cases',
      color: 'success'
    },
    {
      key: 'specificity',
      title: 'Specificity', 
      description: 'True negative rate - ability to correctly identify negative cases',
      color: 'success'
    },
    {
      key: 'precision',
      title: 'Precision',
      description: 'Positive predictive value - proportion of predicted positives that are actually positive',
      color: 'info'
    },
    {
      key: 'npv',
      title: 'NPV',
      description: 'Negative predictive value - proportion of predicted negatives that are actually negative',
      color: 'info'
    },
    {
      key: 'f1Score',
      title: 'F1 Score',
      description: 'Harmonic mean of precision and sensitivity',
      color: 'primary'
    }
  ];

  const allMetrics = [...standardMetrics, ...customMetrics];

  const ConfusionMatrix = ({ confusionMatrix }) => {
    if (!confusionMatrix) return null;
    
    const { tp, tn, fp, fn } = confusionMatrix;
    const total = tp + tn + fp + fn;

    return (
      <Card padding="medium" elevation={2}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.neutral[700]
          }}
        >
          Confusion Matrix
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, alignItems: 'center' }}>
            {/* Headers */}
            <Box></Box>
            <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', color: tokens.colors.neutral[600] }}>
              Predicted Positive
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', color: tokens.colors.neutral[600] }}>
              Predicted Negative
            </Typography>
            
            {/* Actual Positive Row */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: tokens.colors.neutral[600] }}>
              Actual Positive
            </Typography>
            <Box sx={{
              p: 2,
              backgroundColor: tokens.colors.semantic.success + '20',
              border: `2px solid ${tokens.colors.semantic.success}`,
              borderRadius: tokens.borderRadius.md,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: tokens.colors.semantic.success }}>
                {tp}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                True Positive
              </Typography>
            </Box>
            <Box sx={{
              p: 2,
              backgroundColor: tokens.colors.semantic.error + '20',
              border: `2px solid ${tokens.colors.semantic.error}`,
              borderRadius: tokens.borderRadius.md,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: tokens.colors.semantic.error }}>
                {fn}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                False Negative
              </Typography>
            </Box>
            
            {/* Actual Negative Row */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: tokens.colors.neutral[600] }}>
              Actual Negative
            </Typography>
            <Box sx={{
              p: 2,
              backgroundColor: tokens.colors.semantic.error + '20',
              border: `2px solid ${tokens.colors.semantic.error}`,
              borderRadius: tokens.borderRadius.md,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: tokens.colors.semantic.error }}>
                {fp}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                False Positive
              </Typography>
            </Box>
            <Box sx={{
              p: 2,
              backgroundColor: tokens.colors.semantic.success + '20',
              border: `2px solid ${tokens.colors.semantic.success}`,
              borderRadius: tokens.borderRadius.md,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: tokens.colors.semantic.success }}>
                {tn}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                True Negative
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Total Samples: {total.toLocaleString()}
          </Typography>
        </Box>
      </Card>
    );
  };

  if (!metrics) {
    return (
      <Card padding="large">
        <Typography variant="body1" color="textSecondary" textAlign="center">
          No metrics data available
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {title && (
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.neutral[800]
          }}
        >
          {title}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Metrics Cards */}
        {allMetrics.map((metric) => (
          <Grid 
            item 
            xs={columns.xs} 
            sm={columns.sm} 
            md={columns.md} 
            lg={columns.lg}
            key={metric.key}
          >
            <MetricCard
              title={metric.title}
              value={metrics[metric.key]}
              description={metric.description}
              format={metric.format || 'percentage'}
              color={metric.color}
              size={size}
            />
          </Grid>
        ))}

        {/* Confusion Matrix */}
        {showConfusionMatrix && metrics.confusionMatrix && (
          <Grid item xs={12} md={6}>
            <ConfusionMatrix confusionMatrix={metrics.confusionMatrix} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MetricsDisplay;
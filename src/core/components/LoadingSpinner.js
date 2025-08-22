import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { tokens } from '../theme';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false,
  color = 'primary'
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 60;
      case 'medium':
      default: return 40;
    }
  };

  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: tokens.zIndex.modal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing[4]
  };

  return (
    <Box sx={containerStyles}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: tokens.spacing[3]
        }}
      >
        <CircularProgress
          size={getSizeValue()}
          color={color}
          thickness={4}
        />
        
        {message && (
          <Typography
            variant="body2"
            sx={{
              color: tokens.colors.neutral[600],
              fontWeight: tokens.typography.fontWeight.medium,
              textAlign: 'center'
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
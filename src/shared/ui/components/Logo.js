import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { tokens } from '../../../core/theme';

// Star animation keyframes
const sparkle = keyframes`
  0%, 100% { 
    opacity: 0.4; 
    transform: scale(0.8) rotate(0deg); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2) rotate(180deg); 
  }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const Logo = ({ 
  size = 'large',
  showText = true,
  variant = 'primary',
  sx = {},
  ...props 
}) => {
  const sizeConfig = {
    small: {
      logoWidth: '100px',
      logoHeight: '40px',
      fontSize: tokens.typography.fontSize.lg,
      spacing: tokens.spacing[2]
    },
    medium: {
      logoWidth: '100px',
      logoHeight: '40px',
      fontSize: tokens.typography.fontSize.xl,
      spacing: tokens.spacing[3]
    },
    large: {
      logoWidth: '100px',
      logoHeight: '40px',
      fontSize: tokens.typography.fontSize['3xl'],
      spacing: tokens.spacing[4]
    }
  };

  const config = sizeConfig[size];

  const logoColors = {
    primary: {
      background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[400]} 100%)`,
      text: tokens.colors.primary[700],
      accent: tokens.colors.primary[500]
    },
    white: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      text: tokens.colors.primary[600],
      accent: tokens.colors.primary[500]
    }
  };

  const colors = logoColors[variant];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: config.spacing,
        ...sx
      }}
      {...props}
    >
      {/* Logo Container */}
      <Box
        sx={{
          width: config.logoWidth,
          height: config.logoHeight,
          borderRadius: tokens.borderRadius.lg,
          background: colors.background,
          boxShadow: tokens.boxShadow.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: `2px solid ${colors.accent}40`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: `linear-gradient(45deg, ${colors.accent}15 0%, transparent 50%, ${colors.accent}15 100%)`,
            borderRadius: tokens.borderRadius.lg,
          }
        }}
      >
        {/* Star Animations */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '6px',
            height: '6px',
            background: '#ffffff',
            borderRadius: '50%',
            animation: `${sparkle} 2s ease-in-out infinite`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              width: '8px',
              height: '8px',
              background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
              borderRadius: '50%',
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            right: '20%',
            width: '4px',
            height: '4px',
            background: '#ffffff',
            borderRadius: '50%',
            animation: `${twinkle} 3s ease-in-out infinite 1s`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '25%',
            width: '5px',
            height: '5px',
            background: '#ffffff',
            borderRadius: '50%',
            animation: `${sparkle} 2.5s ease-in-out infinite 0.5s`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            right: '15%',
            width: '3px',
            height: '3px',
            background: '#ffffff',
            borderRadius: '50%',
            animation: `${twinkle} 2s ease-in-out infinite 2s`,
          }}
        />
        
        {/* LAVA Text */}
        <Typography
          sx={{
            fontSize: `calc(${config.logoHeight} * 0.35)`,
            fontWeight: tokens.typography.fontWeight.extrabold,
            color: variant === 'primary' ? '#ffffff' : colors.text,
            textShadow: variant === 'primary' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
            zIndex: 1,
            letterSpacing: '0.1em',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          LAVA
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
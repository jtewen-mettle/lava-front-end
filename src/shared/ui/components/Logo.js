import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tokens } from '../../../core/theme';

// Styled component with star border animation
const LogoBox = styled(Box)(({ theme, bgGradient }) => ({
  width: '100px',
  height: '40px',
  borderRadius: tokens.borderRadius.lg,
  boxShadow: tokens.boxShadow.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer',
  padding: '2px',
  background: bgGradient,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: tokens.borderRadius.lg,
    padding: '2px',
    background: `linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    )`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    backgroundSize: '300% 300%',
    animation: 'starBorderAnimation 3s ease-in-out infinite',
  },

  '@keyframes starBorderAnimation': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

const Logo = ({
  size = 'large',
  variant = 'primary',
  sx = {},
  ...props
}) => {
  const logoColors = {
    primary: {
      background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[400]} 100%)`,
      text: '#ffffff',
    },
    white: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      text: tokens.colors.primary[600],
    }
  };

  const colors = logoColors[variant];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: tokens.spacing[4],
        ...sx
      }}
      {...props}
    >
      <LogoBox bgGradient={colors.background}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: tokens.typography.fontWeight.extrabold,
            color: colors.text,
            letterSpacing: '0.1em',
            fontFamily: 'Arial, sans-serif',
            zIndex: 1,
          }}
        >
          LAVA
        </Typography>
      </LogoBox>
    </Box>
  );
};

export default Logo;

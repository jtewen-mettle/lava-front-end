import React from 'react';
import { Box } from '@mui/material';
import { tokens } from '../../../core/theme';

const Container = ({
  maxWidth = 'xl',
  padding = 'medium',
  children,
  centered = false,
  sx = {},
  ...props
}) => {
  const maxWidthValues = {
    xs: tokens.breakpoints.xs,
    sm: tokens.breakpoints.sm,
    md: tokens.breakpoints.md,
    lg: tokens.breakpoints.lg,
    xl: tokens.breakpoints.xl,
    '2xl': tokens.breakpoints['2xl'],
    full: '100%'
  };

  const paddingValues = {
    none: 0,
    small: { xs: tokens.spacing[2], sm: tokens.spacing[3], md: tokens.spacing[4] },
    medium: { xs: tokens.spacing[3], sm: tokens.spacing[4], md: tokens.spacing[6] },
    large: { xs: tokens.spacing[4], sm: tokens.spacing[6], md: tokens.spacing[8] }
  };

  const containerStyles = {
    width: '100%',
    maxWidth: maxWidthValues[maxWidth],
    margin: centered ? '0 auto' : '0',
    padding: paddingValues[padding],
    boxSizing: 'border-box',
    ...sx
  };

  return (
    <Box sx={containerStyles} {...props}>
      {children}
    </Box>
  );
};

export default Container;
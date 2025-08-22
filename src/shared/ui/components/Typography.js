import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { tokens } from '../../../core/theme';

const Typography = ({
  variant = 'body1',
  color = 'inherit',
  align = 'inherit',
  gutterBottom = false,
  component,
  children,
  sx = {},
  ...props
}) => {
  const colorMap = {
    primary: tokens.colors.primary[600],
    secondary: tokens.colors.primary[500],
    textPrimary: tokens.colors.neutral[900],
    textSecondary: tokens.colors.neutral[600],
    error: tokens.colors.semantic.error,
    warning: tokens.colors.semantic.warning,
    info: tokens.colors.semantic.info,
    success: tokens.colors.semantic.success,
    inherit: 'inherit'
  };

  const typographyStyles = {
    fontFamily: tokens.typography.fontFamily.primary,
    color: colorMap[color] || color,
    ...sx
  };

  return (
    <MuiTypography
      variant={variant}
      color="inherit"
      align={align}
      gutterBottom={gutterBottom}
      component={component}
      sx={typographyStyles}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { tokens, createHoverEffect } from '../../../core/theme';

const Button = ({ 
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  children,
  onClick,
  sx = {},
  ...props 
}) => {
  const sizeStyles = {
    small: {
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      fontSize: tokens.typography.fontSize.xs,
      borderRadius: tokens.borderRadius.lg
    },
    medium: {
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      fontSize: tokens.typography.fontSize.sm,
      borderRadius: tokens.borderRadius.xl
    },
    large: {
      padding: `${tokens.spacing[3]} ${tokens.spacing[8]}`,
      fontSize: tokens.typography.fontSize.lg,
      borderRadius: tokens.borderRadius.xl
    }
  };

  const baseStyles = {
    fontFamily: tokens.typography.fontFamily.primary,
    fontWeight: tokens.typography.fontWeight.bold,
    textTransform: 'none',
    boxShadow: variant === 'contained' ? tokens.boxShadow.button : 'none',
    transition: `all ${tokens.transition.duration[300]} ${tokens.transition.easing.inOut}`,
    '&:hover': {
      transform: disabled ? 'none' : 'translateY(-1px)',
      boxShadow: variant === 'contained' && !disabled ? tokens.boxShadow.buttonHover : 'inherit'
    },
    '&:disabled': {
      backgroundColor: tokens.colors.neutral[200],
      color: tokens.colors.neutral[500],
      boxShadow: 'none',
      transform: 'none'
    },
    ...sizeStyles[size],
    ...sx
  };

  return (
    <MuiButton
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      sx={baseStyles}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
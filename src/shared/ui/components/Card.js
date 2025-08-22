import React from 'react';
import { Card as MuiCard, CardContent, CardActions } from '@mui/material';
import { tokens } from '../../../core/theme';

const Card = ({
  elevation = 1,
  variant = 'elevated',
  children,
  actions,
  padding = 'medium',
  sx = {},
  ...props
}) => {
  const paddingValues = {
    small: tokens.spacing[3],
    medium: tokens.spacing[6],
    large: tokens.spacing[8]
  };

  const elevationStyles = {
    0: { boxShadow: 'none' },
    1: { boxShadow: tokens.boxShadow.sm },
    2: { boxShadow: tokens.boxShadow.base },
    3: { boxShadow: tokens.boxShadow.card },
    4: { boxShadow: tokens.boxShadow.lg }
  };

  const cardStyles = {
    borderRadius: tokens.borderRadius['2xl'],
    backgroundColor: variant === 'glass' ? tokens.colors.background.overlay : tokens.colors.background.primary,
    backdropFilter: variant === 'glass' ? 'blur(10px)' : 'none',
    border: variant === 'outlined' ? `1px solid ${tokens.colors.neutral[200]}` : 'none',
    transition: `all ${tokens.transition.duration[300]} ${tokens.transition.easing.inOut}`,
    ...elevationStyles[elevation],
    ...sx
  };

  const contentStyles = {
    padding: paddingValues[padding],
    '&:last-child': {
      paddingBottom: actions ? tokens.spacing[4] : paddingValues[padding]
    }
  };

  const actionStyles = {
    padding: `0 ${paddingValues[padding]} ${paddingValues[padding]}`,
    justifyContent: 'flex-end'
  };

  return (
    <MuiCard sx={cardStyles} variant={variant === 'outlined' ? 'outlined' : 'elevation'} {...props}>
      <CardContent sx={contentStyles}>
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={actionStyles}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
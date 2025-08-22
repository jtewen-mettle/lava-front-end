import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link, Box } from '@mui/material';
import { ChevronRight as ChevronRightIcon, Home as HomeIcon } from '@mui/icons-material';
import { tokens } from '../../../core/theme';

const Breadcrumbs = ({
  items = [],
  showHome = true,
  separator = <ChevronRightIcon fontSize="small" />,
  maxItems = 8,
  sx = {},
  onNavigate,
  ...props
}) => {
  const handleClick = (item, event) => {
    if (item.onClick) {
      event.preventDefault();
      item.onClick(item);
    } else if (onNavigate) {
      event.preventDefault();
      onNavigate(item);
    }
  };

  const breadcrumbItems = showHome ? [
    {
      label: 'Home',
      icon: <HomeIcon fontSize="small" />,
      path: '/',
      onClick: () => onNavigate && onNavigate({ path: '/', label: 'Home' })
    },
    ...items
  ] : items;

  return (
    <Box sx={{ py: 2, ...sx }} {...props}>
      <MuiBreadcrumbs
        separator={separator}
        maxItems={maxItems}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: tokens.colors.neutral[400],
            margin: `0 ${tokens.spacing[2]}`
          }
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          if (isLast) {
            return (
              <Typography
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing[1],
                  fontSize: tokens.typography.fontSize.sm,
                  fontWeight: tokens.typography.fontWeight.semibold,
                  color: tokens.colors.neutral[800],
                  fontFamily: tokens.typography.fontFamily.primary
                }}
              >
                {item.icon && item.icon}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              href={item.path || '#'}
              onClick={(event) => handleClick(item, event)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing[1],
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.primary[600],
                textDecoration: 'none',
                fontFamily: tokens.typography.fontFamily.primary,
                '&:hover': {
                  color: tokens.colors.primary[700],
                  textDecoration: 'underline'
                },
                cursor: 'pointer'
              }}
            >
              {item.icon && item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
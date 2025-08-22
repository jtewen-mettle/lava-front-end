import React from 'react';
import { Grid } from '@mui/material';
import { tokens } from '../../../core/theme';

const ResponsiveGrid = ({
  children,
  spacing = 3,
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
  minItemWidth = '280px',
  maxItemWidth = '400px',
  autoColumns = false,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  sx = {},
  ...props
}) => {
  // Auto-columns: calculate optimal grid based on container width
  const autoGridStyles = autoColumns ? {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, ${maxItemWidth}))`,
    gap: tokens.spacing[spacing],
    alignItems,
    justifyContent,
    width: '100%'
  } : {};

  if (autoColumns) {
    return (
      <div
        style={{
          ...autoGridStyles,
          ...sx
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Traditional MUI Grid system
  return (
    <Grid
      container
      spacing={spacing}
      alignItems={alignItems}
      justifyContent={justifyContent}
      sx={sx}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <Grid
          item
          xs={columns.xs}
          sm={columns.sm}
          md={columns.md}
          lg={columns.lg}
          xl={columns.xl}
          key={index}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveGrid;
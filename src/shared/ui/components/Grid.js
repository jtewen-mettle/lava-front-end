import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import { tokens } from '../../../core/theme';

const Grid = ({
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 0,
  direction = 'row',
  justifyContent,
  alignItems,
  wrap = 'wrap',
  children,
  sx = {},
  ...props
}) => {
  const gridStyles = {
    ...sx
  };

  return (
    <MuiGrid
      container={container}
      item={item}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      spacing={spacing}
      direction={direction}
      justifyContent={justifyContent}
      alignItems={alignItems}
      wrap={wrap}
      sx={gridStyles}
      {...props}
    >
      {children}
    </MuiGrid>
  );
};

export default Grid;
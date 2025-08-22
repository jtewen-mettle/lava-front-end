import React from 'react';
import { Box } from '@mui/material';

const FormField = ({ children, sx = {}, ...props }) => {
  return (
    <Box sx={sx} {...props}>
      {children}
    </Box>
  );
};

export default FormField;
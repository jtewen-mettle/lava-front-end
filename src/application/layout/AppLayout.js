import React from 'react';
import { Box } from '@mui/material';

import { tokens } from '../../core/theme';
import NavigationBar from './NavigationBar';

const AppLayout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '100vw', 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        backgroundColor: tokens.colors.background.primary
      }}
    >
      <NavigationBar />
      
      <Box 
        component="main"
        sx={{ 
          marginTop: '80px',
          width: '100%', 
          maxWidth: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
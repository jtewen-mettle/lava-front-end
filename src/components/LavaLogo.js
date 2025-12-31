import React from 'react';
import { Box, Typography } from '@mui/material';

const LavaLogo = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={2} mb={4}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
          backgroundColor: '#2C65EB',
          color: 'white',
          fontWeight: 600,
          fontSize: '18px',
          padding: '6px 16px',
          borderRadius: '6px',
          letterSpacing: '1px',
          border: '2px solid transparent',
          backgroundImage: `
            linear-gradient(#2C65EB, #2C65EB),
            linear-gradient(45deg, 
              transparent, 
              #ffffff, 
              transparent, 
              #ffffff, 
              transparent, 
              #ffffff, 
              transparent
            )
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          backgroundSize: 'auto, 300% 300%',
          animation: 'starBorder 4s ease-in-out infinite',
          '@keyframes starBorder': {
            '0%': {
              backgroundPosition: '0, 0% 50%',
            },
            '50%': {
              backgroundPosition: '0, 100% 50%',
            },
            '100%': {
              backgroundPosition: '0, 0% 50%',
            },
          },
        }}
      >
        LAVA
      </Box>
      <Typography variant="h5" mt={2} fontWeight="bold" textAlign="center">
        Local AI Evaluator
      </Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center">
        Securely evaluate your clinical decision support systems
      </Typography>
    </Box>
  );
};

export default LavaLogo;

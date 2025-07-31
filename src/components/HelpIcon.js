import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const HelpIcon = ({ tooltip = "Learn more in the Glossary", size = "small", section = null }) => {
  const { navigateToGlossary } = useAppContext();

  const handleHelpClick = () => {
    navigateToGlossary(section);
  };

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <IconButton
        size={size}
        onClick={handleHelpClick}
        sx={{
          color: '#1976d2',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            color: '#1976d2'
          },
          transition: 'all 0.2s ease'
        }}
      >
        <Info fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpIcon;
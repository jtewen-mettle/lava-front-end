import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { 
  createPageStructure,
  getCurrentSectionNumber,
  getPreviousPage,
  getNextPage,
  navigateToPage
} from './utils/navigationUtils';

const BottomNavigation = ({ 
  activeSection, 
  activeSubSection, 
  onNavigation, 
  setExpandedSections 
}) => {
  const allPages = createPageStructure();

  const handleNavigateToPage = (direction) => {
    navigateToPage(direction, activeSection, activeSubSection, allPages, onNavigation, setExpandedSections);
  };

  const previousPage = getPreviousPage(activeSection, activeSubSection, allPages);
  const nextPage = getNextPage(activeSection, activeSubSection, allPages);
  const currentPageNumber = getCurrentSectionNumber(activeSection, activeSubSection, allPages);

  if (!activeSection) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      margin: '5px 0',
      width: '100%'
    }}>
      <IconButton 
        onClick={() => handleNavigateToPage('previous')}
        disabled={!previousPage}
        sx={{
          padding: '8px 12px 8px 0',
          borderRadius: '4px',
          justifyContent: 'flex-start',
          alignSelf: 'flex-start',
          '&:hover': {
            backgroundColor: 'rgba(39, 87, 134, 0.1)',
          },
          '&:disabled': {
            color: '#bbb'
          }
        }}
      >
        <ChevronRight sx={{ 
          transform: 'rotate(180deg)', 
          mr: 1, 
          flexShrink: 0,
          color: !previousPage ? '#bbb' : '#275786'
        }} />
        <Typography sx={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          textAlign: 'left',
          color: !previousPage ? '#bbb' : '#275786'
        }}>
          {previousPage?.label || 'Previous'}
        </Typography>
      </IconButton>

      <IconButton 
        onClick={() => handleNavigateToPage('next')}
        disabled={!nextPage}
        sx={{
          padding: '8px 0 8px 12px',
          borderRadius: '4px',
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
          '&:hover': {
            backgroundColor: 'rgba(39, 87, 134, 0.1)',
          },
          '&:disabled': {
            color: '#bbb'
          }
        }}
      >
        <Typography sx={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          textAlign: 'right',
          color: !nextPage ? '#bbb' : '#275786'
        }}>
          {nextPage?.label || 'Next'}
        </Typography>
        <ChevronRight sx={{ 
          ml: 1, 
          flexShrink: 0,
          color: !nextPage ? '#bbb' : '#275786'
        }} />
      </IconButton>
    </Box>
  );
};

export default BottomNavigation;
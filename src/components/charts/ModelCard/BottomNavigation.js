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
      paddingTop: '30px',
      borderTop: '1px solid #e1e8ed',
      marginBottom: '40px'
    }}>
      <IconButton 
        onClick={() => handleNavigateToPage('previous')}
        disabled={!previousPage}
        sx={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e3f2fd',
          borderRadius: '8px',
          padding: '12px 20px',
          maxWidth: '40%',
          '&:hover': {
            backgroundColor: '#e3f2fd',
            border: '1px solid #bbdefb',
          },
          '&:disabled': {
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: '#bbb'
          }
        }}
      >
        <ChevronRight sx={{ transform: 'rotate(180deg)', mr: 1, flexShrink: 0 }} />
        <Typography sx={{ 
          fontSize: '14px', 
          fontWeight: '500',
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {previousPage?.label || 'Previous'}
        </Typography>
      </IconButton>

      <Typography sx={{ 
        fontSize: '14px', 
        color: '#666',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        Page {currentPageNumber} of {allPages.length}
      </Typography>

      <IconButton 
        onClick={() => handleNavigateToPage('next')}
        disabled={!nextPage}
        sx={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e3f2fd',
          borderRadius: '8px',
          padding: '12px 20px',
          maxWidth: '40%',
          '&:hover': {
            backgroundColor: '#e3f2fd',
            border: '1px solid #bbdefb',
          },
          '&:disabled': {
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: '#bbb'
          }
        }}
      >
        <Typography sx={{ 
          fontSize: '14px', 
          fontWeight: '500',
          textAlign: 'right',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {nextPage?.label || 'Next'}
        </Typography>
        <ChevronRight sx={{ ml: 1, flexShrink: 0 }} />
      </IconButton>
    </Box>
  );
};

export default BottomNavigation;
import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { Download } from '@mui/icons-material';
import { ComplianceBadge } from './styles';
import { downloadCurrentSection, downloadFullCard } from './utils/downloadUtils';
import { navigationItems } from './utils/navigationUtils';

const Header = ({ data, activeSection }) => {
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);

  const handleDownloadMenuOpen = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleDownloadCurrentSection = () => {
    handleDownloadMenuClose();
    downloadCurrentSection(activeSection, data);
  };

  const handleDownloadFullCard = () => {
    handleDownloadMenuClose();
    downloadFullCard(data, navigationItems);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px'
    }}>
      <Box>
        <Typography variant="h5" sx={{
          fontSize: '16px', 
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#000',
          textAlign: 'left',
          marginBottom: '4px'
        }}>
          ONC HTI-1 Compliant Model Card
        </Typography>
        <Typography sx={{ 
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          color: '#666',
          textAlign: 'left'
        }}>
          Predictive Decision Support Intervention - {data.interventionName?.split(' ')[1] || 'Risk Assessment'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ComplianceBadge>
          {data.complianceBadge}
        </ComplianceBadge>
        <Tooltip title="Download Options" arrow>
          <IconButton 
            size="small" 
            onClick={handleDownloadMenuOpen}
            className="download-button"
            sx={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e3f2fd',
              borderRadius: '4px',
              minWidth: '28px',
              minHeight: '28px',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                border: '1px solid #bbdefb',
                boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
              }
            }}
          >
            <Download sx={{ fontSize: 16, color: '#1976d2' }} />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={downloadMenuAnchor}
          open={Boolean(downloadMenuAnchor)}
          onClose={handleDownloadMenuClose}
        >
          <MenuItem onClick={handleDownloadCurrentSection}>
            Download Current Section
          </MenuItem>
          <MenuItem onClick={handleDownloadFullCard}>
            Download Full Model Card
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
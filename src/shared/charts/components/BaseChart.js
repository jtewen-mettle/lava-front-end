import React, { useRef, useEffect, useMemo } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreIcon, Download as DownloadIcon } from '@mui/icons-material';
import { tokens } from '../../../core/theme';
import { Card } from '../../ui';

const BaseChart = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  actions = [],
  downloadOptions = [],
  height = '400px',
  padding = 'medium',
  elevation = 1,
  sx = {},
  onDownload,
  ...props
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = (format) => {
    handleMenuClose();
    if (onDownload) {
      onDownload(format, chartRef.current);
    }
  };

  const chartStyles = useMemo(() => ({
    height,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    ...sx
  }), [height, sx]);

  const headerStyles = useMemo(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing[4],
    gap: tokens.spacing[2]
  }), []);

  const contentStyles = useMemo(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, // Important for flex children
    position: 'relative'
  }), []);

  if (error) {
    return (
      <Card elevation={elevation} padding={padding} sx={chartStyles}>
        <Box sx={headerStyles}>
          <Box>
            {title && (
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: tokens.typography.fontWeight.semibold,
                  color: tokens.colors.neutral[800]
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: tokens.colors.neutral[600],
                  marginTop: tokens.spacing[1]
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box 
          sx={{
            ...contentStyles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.colors.semantic.error,
            backgroundColor: tokens.colors.background.secondary,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing[4]
          }}
        >
          <Typography variant="body2">
            Error loading chart: {error.message || error}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card elevation={elevation} padding={padding} sx={chartStyles} {...props}>
      {/* Header */}
      <Box sx={headerStyles}>
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.neutral[800]
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: tokens.colors.neutral[600],
                marginTop: tokens.spacing[1]
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        {(actions.length > 0 || downloadOptions.length > 0) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
            {actions.map((action, index) => (
              <IconButton
                key={index}
                size="small"
                onClick={action.onClick}
                sx={{
                  color: tokens.colors.neutral[600],
                  '&:hover': {
                    backgroundColor: tokens.colors.neutral[100]
                  }
                }}
              >
                {action.icon}
              </IconButton>
            ))}
            
            {downloadOptions.length > 0 && (
              <>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: tokens.colors.neutral[600],
                    '&:hover': {
                      backgroundColor: tokens.colors.neutral[100]
                    }
                  }}
                >
                  <MoreIcon />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {downloadOptions.map((option) => (
                    <MenuItem 
                      key={option.format} 
                      onClick={() => handleDownload(option.format)}
                      sx={{ fontSize: tokens.typography.fontSize.sm }}
                    >
                      <DownloadIcon sx={{ marginRight: tokens.spacing[2] }} />
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Chart Content */}
      <Box ref={chartRef} sx={contentStyles}>
        {loading ? (
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: tokens.colors.background.secondary,
              borderRadius: tokens.borderRadius.md
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Loading chart...
            </Typography>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Card>
  );
};

export default BaseChart;
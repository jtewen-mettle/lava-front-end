import React from 'react';
import { AppBar, Typography, Button, Box } from '@mui/material';

import { useAppContext } from '../../core/context';
import { APP_CONFIG, PAGES } from '../../core/constants';
import { tokens } from '../../core/theme';

const NavigationBar = () => {
  const { 
    activePage, 
    setSelection,
    navigateToDashboard,
    navigateToModelAnalysis,
    navigateToGlossaryHome
  } = useAppContext();

  const getResponsiveText = (full, medium, short) => (
    <>
      <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
        {full}
      </Box>
      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'none' } }}>
        {medium}
      </Box>
      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none', md: 'none' } }}>
        {short}
      </Box>
    </>
  );

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      page: PAGES.DASHBOARD,
      action: navigateToDashboard
    },
    {
      id: 'dashboard',
      label: getResponsiveText('Topic Dashboard', 'Dashboard', 'Dashboard'),
      page: PAGES.MODEL_ANALYSIS,
      action: navigateToModelAnalysis
    },
    {
      id: 'glossary',
      label: 'Glossary',
      page: PAGES.GLOSSARY,
      action: () => navigateToGlossaryHome(activePage)
    }
  ];

  const buttonStyles = (isActive) => ({
    backgroundColor: isActive ? tokens.colors.primary[500] : 'transparent',
    color: '#fff',
    fontFamily: tokens.typography.fontFamily.primary,
    fontWeight: tokens.typography.fontWeight.bold,
    textTransform: 'none',
    borderRadius: tokens.borderRadius.xl,
    padding: { 
      xs: `${tokens.spacing[1.5]} ${tokens.spacing[3]}`, 
      sm: `${tokens.spacing[2]} ${tokens.spacing[4]}`, 
      md: `${tokens.spacing[2]} ${tokens.spacing[6]}` 
    },
    fontSize: { 
      xs: tokens.typography.fontSize.sm, 
      sm: tokens.typography.fontSize.sm, 
      md: tokens.typography.fontSize.sm 
    },
    minWidth: { xs: 'auto', sm: 'auto', md: 'auto' },
    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: isActive ? tokens.boxShadow.button : 'none',
    transition: `all ${tokens.transition.duration[300]} ${tokens.transition.easing.inOut}`,
    '&:hover': {
      backgroundColor: isActive ? tokens.colors.primary[500] : 'rgba(255, 255, 255, 0.1)',
      boxShadow: tokens.boxShadow.buttonHover,
      transform: 'translateY(-1px)'
    }
  });

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: tokens.colors.primary[600],
        boxShadow: tokens.boxShadow.elevated,
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[700]} 100%)`,
        width: '100%',
        padding: `${tokens.spacing[1.5]} 0`,
        boxSizing: 'border-box'
      }}
    >
      <Box 
        sx={{ 
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          px: { xs: 2, sm: 3, md: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '64px'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: tokens.typography.fontFamily.primary,
            fontWeight: tokens.typography.fontWeight.bold,
            letterSpacing: tokens.typography.letterSpacing.wide,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            flexShrink: 0
          }}
        >
          {getResponsiveText(APP_CONFIG.fullName, APP_CONFIG.fullName, APP_CONFIG.name)}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            flexShrink: 0,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: 'flex-end',
            marginRight: { xs: '26px', sm: '26px', md: '26px' }
          }}
        >
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              sx={buttonStyles(activePage === item.page)}
              onClick={item.action}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>
    </AppBar>
  );
};

export default NavigationBar;
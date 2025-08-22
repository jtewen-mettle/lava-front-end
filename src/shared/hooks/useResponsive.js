import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
  
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const isXlDown = useMediaQuery(theme.breakpoints.down('xl'));

  const currentBreakpoint = isXs ? 'xs' : 
                           isSm ? 'sm' : 
                           isMd ? 'md' : 
                           isLg ? 'lg' : 'xl';

  // Get responsive value based on current breakpoint
  const getResponsiveValue = (values) => {
    if (typeof values !== 'object') return values;
    
    const { xs, sm, md, lg, xl } = values;
    
    if (isXl && xl !== undefined) return xl;
    if (isLgUp && lg !== undefined) return lg;
    if (isMdUp && md !== undefined) return md;
    if (isSmUp && sm !== undefined) return sm;
    return xs;
  };

  // Common responsive patterns
  const isMobile = isXs || isSm;
  const isTablet = isMd;
  const isDesktop = isLg || isXl;

  // Navigation specific
  const shouldShowMobileNav = isMobile;
  const shouldCollapseNav = isMdDown;
  
  // Layout specific
  const sidebarWidth = getResponsiveValue({ xs: 0, sm: 240, md: 280, lg: 320 });
  const containerMaxWidth = getResponsiveValue({ xs: '100%', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' });
  
  // Chart specific
  const chartHeight = getResponsiveValue({ xs: '300px', sm: '350px', md: '400px', lg: '450px' });
  const chartColumns = getResponsiveValue({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 });
  
  // Typography specific
  const titleVariant = getResponsiveValue({ xs: 'h6', sm: 'h5', md: 'h4', lg: 'h3' });
  const subtitleVariant = getResponsiveValue({ xs: 'body2', sm: 'body1', md: 'h6' });

  // Spacing
  const gridSpacing = getResponsiveValue({ xs: 2, sm: 3, md: 3, lg: 4 });
  const cardPadding = getResponsiveValue({ xs: 'small', sm: 'medium', md: 'medium', lg: 'large' });

  return {
    // Breakpoint checks
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    isSmDown,
    isMdDown,
    isLgDown,
    isXlDown,
    
    // Current state
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    
    // Utility function
    getResponsiveValue,
    
    // Common patterns
    shouldShowMobileNav,
    shouldCollapseNav,
    sidebarWidth,
    containerMaxWidth,
    chartHeight,
    chartColumns,
    titleVariant,
    subtitleVariant,
    gridSpacing,
    cardPadding
  };
};

// Hook to get window dimensions
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for responsive chart dimensions
export const useChartDimensions = (defaultHeight = 400) => {
  const { chartHeight, isMobile, isTablet } = useResponsive();
  const { width } = useWindowSize();
  
  const height = parseInt(chartHeight) || defaultHeight;
  
  // Adjust height based on screen size and content
  const adjustedHeight = isMobile ? Math.min(height, 300) :
                        isTablet ? Math.min(height, 350) :
                        height;

  // Calculate aspect ratio
  const aspectRatio = width ? Math.min(width / adjustedHeight, 2.5) : 2;
  
  return {
    height: adjustedHeight,
    width: width ? Math.min(width - 32, 1200) : undefined, // Account for padding
    aspectRatio,
    maintainAspectRatio: false
  };
};
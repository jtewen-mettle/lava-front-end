import { tokens } from './tokens';

export const createResponsiveValue = (xs, sm, md, lg, xl) => ({
  xs: xs,
  sm: sm || xs,
  md: md || sm || xs,
  lg: lg || md || sm || xs,
  xl: xl || lg || md || sm || xs
});

export const getColorWithOpacity = (color, opacity) => {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const createGradient = (direction, ...colors) => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

export const mediaQuery = {
  up: (breakpoint) => `@media (min-width: ${tokens.breakpoints[breakpoint]})`,
  down: (breakpoint) => {
    const breakpoints = Object.keys(tokens.breakpoints);
    const index = breakpoints.indexOf(breakpoint);
    if (index === 0) return '@media (max-width: 0px)';
    const prevBreakpoint = breakpoints[index - 1];
    const maxWidth = parseInt(tokens.breakpoints[prevBreakpoint]) - 1;
    return `@media (max-width: ${maxWidth}px)`;
  },
  between: (min, max) => 
    `@media (min-width: ${tokens.breakpoints[min]}) and (max-width: ${parseInt(tokens.breakpoints[max]) - 1}px)`,
  only: (breakpoint) => {
    const breakpoints = Object.keys(tokens.breakpoints);
    const index = breakpoints.indexOf(breakpoint);
    
    if (index === 0) {
      return `@media (max-width: ${parseInt(tokens.breakpoints[breakpoints[1]]) - 1}px)`;
    }
    
    if (index === breakpoints.length - 1) {
      return `@media (min-width: ${tokens.breakpoints[breakpoint]})`;
    }
    
    const maxWidth = parseInt(tokens.breakpoints[breakpoints[index + 1]]) - 1;
    return `@media (min-width: ${tokens.breakpoints[breakpoint]}) and (max-width: ${maxWidth}px)`;
  }
};

export const spacing = (multiplier) => {
  if (Array.isArray(multiplier)) {
    return multiplier.map(m => tokens.spacing[m] || `${m * 0.25}rem`).join(' ');
  }
  return tokens.spacing[multiplier] || `${multiplier * 0.25}rem`;
};

export const elevation = (level) => {
  const shadowMap = {
    0: tokens.boxShadow.none,
    1: tokens.boxShadow.sm,
    2: tokens.boxShadow.base,
    3: tokens.boxShadow.md,
    4: tokens.boxShadow.lg,
    5: tokens.boxShadow.xl,
    6: tokens.boxShadow['2xl']
  };
  
  return shadowMap[level] || tokens.boxShadow.base;
};

export const typography = (variant) => {
  const variantMap = {
    h1: {
      fontSize: tokens.typography.fontSize['5xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight
    },
    h2: {
      fontSize: tokens.typography.fontSize['4xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight
    },
    h3: {
      fontSize: tokens.typography.fontSize['3xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.snug
    },
    h4: {
      fontSize: tokens.typography.fontSize['2xl'],
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.snug
    },
    h5: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.snug
    },
    h6: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.normal
    },
    body1: {
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.relaxed
    },
    body2: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.normal
    },
    caption: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.normal
    }
  };
  
  return variantMap[variant] || variantMap.body1;
};

export const transition = (properties = 'all', duration = '300', easing = 'inOut') => {
  const durationValue = tokens.transition.duration[duration] || duration + 'ms';
  const easingValue = tokens.transition.easing[easing] || easing;
  
  if (Array.isArray(properties)) {
    return properties.map(prop => `${prop} ${durationValue} ${easingValue}`).join(', ');
  }
  
  return `${properties} ${durationValue} ${easingValue}`;
};

export const createHoverEffect = (transform = 'translateY(-1px)', shadow = 'md') => ({
  transition: transition(['transform', 'box-shadow']),
  cursor: 'pointer',
  '&:hover': {
    transform,
    boxShadow: elevation(shadow === 'md' ? 3 : shadow)
  }
});

export const truncateText = (lines = 1) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical'
});

export const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};
import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary[600], // #275786
      light: tokens.colors.primary[500], // #1164ad
      dark: tokens.colors.primary[700], // #1e4a6f
      contrastText: '#ffffff'
    },
    secondary: {
      main: tokens.colors.primary[500], // #1164ad
      light: tokens.colors.primary[400],
      dark: tokens.colors.primary[600],
      contrastText: '#ffffff'
    },
    error: {
      main: tokens.colors.semantic.error
    },
    warning: {
      main: tokens.colors.semantic.warning
    },
    info: {
      main: tokens.colors.semantic.info
    },
    success: {
      main: tokens.colors.semantic.success
    },
    grey: {
      50: tokens.colors.neutral[50],
      100: tokens.colors.neutral[100],
      200: tokens.colors.neutral[200],
      300: tokens.colors.neutral[300],
      400: tokens.colors.neutral[400],
      500: tokens.colors.neutral[500],
      600: tokens.colors.neutral[600],
      700: tokens.colors.neutral[700],
      800: tokens.colors.neutral[800],
      900: tokens.colors.neutral[900]
    },
    background: {
      default: tokens.colors.background.primary,
      paper: tokens.colors.background.secondary
    }
  },
  
  typography: {
    fontFamily: tokens.typography.fontFamily.primary,
    fontSize: 16,
    h1: {
      fontSize: tokens.typography.fontSize['5xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.tight
    },
    h2: {
      fontSize: tokens.typography.fontSize['4xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.tight
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
    button: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.semibold,
      textTransform: 'none',
      letterSpacing: tokens.typography.letterSpacing.wide
    },
    caption: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.normal
    },
    overline: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      textTransform: 'uppercase',
      letterSpacing: tokens.typography.letterSpacing.widest,
      lineHeight: tokens.typography.lineHeight.tight
    }
  },
  
  spacing: (factor) => `${0.25 * factor}rem`,
  
  breakpoints: {
    values: {
      xs: parseInt(tokens.breakpoints.xs),
      sm: parseInt(tokens.breakpoints.sm),
      md: parseInt(tokens.breakpoints.md),
      lg: parseInt(tokens.breakpoints.lg),
      xl: parseInt(tokens.breakpoints.xl)
    }
  },
  
  shape: {
    borderRadius: parseInt(tokens.borderRadius.lg)
  },
  
  shadows: [
    'none',
    tokens.boxShadow.sm,
    tokens.boxShadow.base,
    tokens.boxShadow.md,
    tokens.boxShadow.lg,
    tokens.boxShadow.xl,
    tokens.boxShadow['2xl'],
    tokens.boxShadow.elevated,
    tokens.boxShadow.card,
    tokens.boxShadow.button,
    tokens.boxShadow.buttonHover,
    '0 6px 16px rgba(0, 0, 0, 0.12)',
    '0 8px 20px rgba(0, 0, 0, 0.14)',
    '0 10px 24px rgba(0, 0, 0, 0.16)',
    '0 12px 28px rgba(0, 0, 0, 0.18)',
    '0 14px 32px rgba(0, 0, 0, 0.20)',
    '0 16px 36px rgba(0, 0, 0, 0.22)',
    '0 18px 40px rgba(0, 0, 0, 0.24)',
    '0 20px 44px rgba(0, 0, 0, 0.26)',
    '0 22px 48px rgba(0, 0, 0, 0.28)',
    '0 24px 52px rgba(0, 0, 0, 0.30)',
    '0 26px 56px rgba(0, 0, 0, 0.32)',
    '0 28px 60px rgba(0, 0, 0, 0.34)',
    '0 30px 64px rgba(0, 0, 0, 0.36)',
    '0 32px 68px rgba(0, 0, 0, 0.38)'
  ],
  
  transitions: {
    easing: {
      easeInOut: tokens.transition.easing.inOut,
      easeOut: tokens.transition.easing.out,
      easeIn: tokens.transition.easing.in,
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: parseInt(tokens.transition.duration[150]),
      shorter: parseInt(tokens.transition.duration[200]),
      short: parseInt(tokens.transition.duration[250]) || 250,
      standard: parseInt(tokens.transition.duration[300]),
      complex: parseInt(tokens.transition.duration[375]) || 375,
      enteringScreen: parseInt(tokens.transition.duration[225]) || 225,
      leavingScreen: parseInt(tokens.transition.duration[195]) || 195
    }
  },
  
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.xl,
          fontFamily: tokens.typography.fontFamily.primary,
          fontWeight: tokens.typography.fontWeight.bold,
          textTransform: 'none',
          transition: `all ${tokens.transition.duration[300]} ${tokens.transition.easing.inOut}`,
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        },
        contained: {
          boxShadow: tokens.boxShadow.button,
          '&:hover': {
            boxShadow: tokens.boxShadow.buttonHover
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.colors.primary[600],
          boxShadow: tokens.boxShadow.elevated,
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[700]} 100%)`
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius['2xl'],
          boxShadow: tokens.boxShadow.card,
          backdropFilter: 'blur(10px)'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.neutral[200]
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.primary[600]
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.primary[600]
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: tokens.typography.fontFamily.primary
        }
      }
    }
  }
});
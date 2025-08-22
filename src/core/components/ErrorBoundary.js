import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { tokens } from '../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.colors.background.secondary,
            padding: tokens.spacing[4]
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: tokens.spacing[8],
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              borderRadius: tokens.borderRadius['2xl']
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: tokens.colors.semantic.error,
                marginBottom: tokens.spacing[4],
                fontWeight: tokens.typography.fontWeight.bold
              }}
            >
              Something went wrong
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing[6],
                lineHeight: tokens.typography.lineHeight.relaxed
              }}
            >
              We encountered an unexpected error. This could be due to a temporary issue 
              or a problem with the current operation.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  backgroundColor: tokens.colors.neutral[50],
                  border: `1px solid ${tokens.colors.neutral[200]}`,
                  borderRadius: tokens.borderRadius.md,
                  padding: tokens.spacing[4],
                  marginBottom: tokens.spacing[6],
                  textAlign: 'left'
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: tokens.typography.fontFamily.mono,
                    fontSize: tokens.typography.fontSize.xs,
                    color: tokens.colors.semantic.error,
                    whiteSpace: 'pre-wrap',
                    margin: 0
                  }}
                >
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                gap: tokens.spacing[3],
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Button
                variant="outlined"
                onClick={this.handleReset}
                sx={{
                  borderRadius: tokens.borderRadius.xl,
                  padding: `${tokens.spacing[2]} ${tokens.spacing[6]}`,
                  fontWeight: tokens.typography.fontWeight.semibold
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="contained"
                onClick={this.handleReload}
                sx={{
                  borderRadius: tokens.borderRadius.xl,
                  padding: `${tokens.spacing[2]} ${tokens.spacing[6]}`,
                  fontWeight: tokens.typography.fontWeight.semibold,
                  backgroundColor: tokens.colors.primary[600],
                  '&:hover': {
                    backgroundColor: tokens.colors.primary[700]
                  }
                }}
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
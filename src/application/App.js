import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import * as tf from '@tensorflow/tfjs';
import * as sk from 'scikitjs';

import { muiTheme } from '../core/theme';
import { AppProvider } from '../core/context';
import { ErrorBoundary, LoadingSpinner } from '../core/components';
import { useAuth } from '../core/hooks';
import { AppLayout } from './layout';
import { PageRouter } from './routing';

const AppContent = () => {
  const { isAuthorized, message, loading } = useAuth();
  const [mlReady, setMlReady] = useState(false);

  useEffect(() => {
    const initScikit = async () => {
      try {
        sk.setBackend(tf);
        setMlReady(true);
      } catch (error) {
        console.error('Failed to initialize ML backend:', error);
        setMlReady(true);
      }
    };
    
    initScikit();
  }, []);

  if (loading || !mlReady) {
    return (
      <LoadingSpinner 
        fullScreen
        message={loading ? message : 'Loading ML backend...'}
      />
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ 
        margin: 0, 
        padding: 0, 
        width: '100%', 
        overflowX: 'hidden',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        {message}
      </div>
    );
  }

  return (
    <AppProvider>
      <AppLayout>
        <PageRouter />
      </AppLayout>
    </AppProvider>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
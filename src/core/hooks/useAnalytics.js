import { useCallback, useRef, useEffect } from 'react';
import { useAppContext } from '../context';

export const useAnalytics = () => {
  const { activePage, selection } = useAppContext();
  const sessionStartTime = useRef(Date.now());
  const pageStartTime = useRef(Date.now());
  const interactionCount = useRef(0);

  // Track page views
  const trackPageView = useCallback((page, additionalData = {}) => {
    const event = {
      type: 'page_view',
      page,
      timestamp: Date.now(),
      sessionId: sessionStartTime.current,
      ...additionalData
    };

    // In production, this would send to analytics service
    console.log('Analytics:', event);
    
    // Store in localStorage for debugging
    if (process.env.NODE_ENV === 'development') {
      const events = JSON.parse(localStorage.getItem('lava_analytics') || '[]');
      events.push(event);
      localStorage.setItem('lava_analytics', JSON.stringify(events.slice(-100))); // Keep last 100 events
    }

    pageStartTime.current = Date.now();
  }, []);

  // Track user interactions
  const trackInteraction = useCallback((action, target, additionalData = {}) => {
    interactionCount.current++;
    
    const event = {
      type: 'interaction',
      action,
      target,
      timestamp: Date.now(),
      sessionId: sessionStartTime.current,
      page: activePage,
      interactionCount: interactionCount.current,
      ...additionalData
    };

    console.log('Analytics:', event);
    
    if (process.env.NODE_ENV === 'development') {
      const events = JSON.parse(localStorage.getItem('lava_analytics') || '[]');
      events.push(event);
      localStorage.setItem('lava_analytics', JSON.stringify(events.slice(-100)));
    }
  }, [activePage]);

  // Track chart interactions
  const trackChartInteraction = useCallback((chartType, action, data = {}) => {
    trackInteraction('chart_interaction', chartType, {
      chartAction: action,
      ...data
    });
  }, [trackInteraction]);

  // Track data analysis events
  const trackDataAnalysis = useCallback((analysisType, parameters = {}) => {
    const event = {
      type: 'data_analysis',
      analysisType,
      parameters,
      timestamp: Date.now(),
      sessionId: sessionStartTime.current,
      page: activePage,
      selection,
    };

    console.log('Analytics:', event);
    
    if (process.env.NODE_ENV === 'development') {
      const events = JSON.parse(localStorage.getItem('lava_analytics') || '[]');
      events.push(event);
      localStorage.setItem('lava_analytics', JSON.stringify(events.slice(-100)));
    }
  }, [activePage, selection]);

  // Track performance metrics
  const trackPerformance = useCallback((metricName, value, additionalData = {}) => {
    const event = {
      type: 'performance',
      metric: metricName,
      value,
      timestamp: Date.now(),
      sessionId: sessionStartTime.current,
      page: activePage,
      ...additionalData
    };

    console.log('Analytics:', event);
    
    if (process.env.NODE_ENV === 'development') {
      const events = JSON.parse(localStorage.getItem('lava_analytics') || '[]');
      events.push(event);
      localStorage.setItem('lava_analytics', JSON.stringify(events.slice(-100)));
    }
  }, [activePage]);

  // Track errors
  const trackError = useCallback((error, context = {}) => {
    const event = {
      type: 'error',
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      },
      context,
      timestamp: Date.now(),
      sessionId: sessionStartTime.current,
      page: activePage,
      selection
    };

    console.error('Analytics Error:', event);
    
    if (process.env.NODE_ENV === 'development') {
      const events = JSON.parse(localStorage.getItem('lava_analytics') || '[]');
      events.push(event);
      localStorage.setItem('lava_analytics', JSON.stringify(events.slice(-100)));
    }
  }, [activePage, selection]);

  // Get session analytics
  const getSessionAnalytics = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTime.current;
    const pageDuration = Date.now() - pageStartTime.current;
    
    return {
      sessionDuration,
      pageDuration,
      interactionCount: interactionCount.current,
      currentPage: activePage,
      currentSelection: selection
    };
  }, [activePage, selection]);

  // Automatically track page changes
  useEffect(() => {
    trackPageView(activePage, { selection });
  }, [activePage, selection, trackPageView]);

  return {
    trackPageView,
    trackInteraction,
    trackChartInteraction,
    trackDataAnalysis,
    trackPerformance,
    trackError,
    getSessionAnalytics
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const { trackPerformance } = useAnalytics();

  // Measure render time
  const measureRender = useCallback((componentName) => {
    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        trackPerformance('render_time', duration, { component: componentName });
        return duration;
      }
    };
  }, [trackPerformance]);

  // Measure data processing time
  const measureDataProcessing = useCallback((operation) => {
    const startTime = performance.now();
    
    return {
      end: (recordCount = null) => {
        const duration = performance.now() - startTime;
        trackPerformance('data_processing_time', duration, { 
          operation, 
          recordCount 
        });
        return duration;
      }
    };
  }, [trackPerformance]);

  // Monitor memory usage
  const monitorMemory = useCallback(() => {
    if (performance.memory) {
      trackPerformance('memory_usage', performance.memory.usedJSHeapSize, {
        totalHeapSize: performance.memory.totalJSHeapSize,
        heapLimit: performance.memory.jsHeapSizeLimit
      });
    }
  }, [trackPerformance]);

  // Monitor network requests
  const measureNetworkRequest = useCallback((url, method = 'GET') => {
    const startTime = performance.now();
    
    return {
      end: (success = true, responseSize = null) => {
        const duration = performance.now() - startTime;
        trackPerformance('network_request', duration, {
          url,
          method,
          success,
          responseSize
        });
        return duration;
      }
    };
  }, [trackPerformance]);

  return {
    measureRender,
    measureDataProcessing,
    monitorMemory,
    measureNetworkRequest
  };
};
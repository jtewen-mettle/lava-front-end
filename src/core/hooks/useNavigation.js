import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context';
import { TOPICS, PAGES } from '../constants';

export const useNavigation = () => {
  const { 
    activePage, 
    selection, 
    navigateToDashboard,
    navigateToModelAnalysis,
    navigateToGlossaryHome,
    setSelection 
  } = useAppContext();

  // Generate breadcrumb items based on current state
  const breadcrumbs = useMemo(() => {
    const items = [];

    // Add page-level breadcrumb
    switch (activePage) {
      case PAGES.DASHBOARD:
        items.push({ label: 'Dashboard', path: '/dashboard' });
        break;
      
      case PAGES.MODEL_ANALYSIS:
        items.push({ label: 'Model Analysis', path: '/model-analysis' });
        break;
      
      case PAGES.GLOSSARY:
        items.push({ label: 'Glossary', path: '/glossary' });
        break;
    }

    // Add selection-specific breadcrumb
    if (selection && (activePage === PAGES.DASHBOARD || activePage === PAGES.MODEL_ANALYSIS)) {
      const topic = Object.values(TOPICS).find(t => t.id === selection.topic);
      if (topic) {
        items.push({
          label: topic.name,
          path: `/model-analysis/${selection.diseaseCategory}/${selection.topic}`,
          data: selection
        });
      }
    }

    return items;
  }, [activePage, selection]);

  // Navigation handlers
  const navigateToHome = useCallback(() => {
    setSelection(null);
    navigateToDashboard();
  }, [navigateToDashboard, setSelection]);

  const navigateToTopic = useCallback((diseaseCategory, topic) => {
    setSelection({ diseaseCategory, topic });
    navigateToModelAnalysis();
  }, [navigateToModelAnalysis, setSelection]);

  const navigateBack = useCallback(() => {
    if (selection) {
      // If on a specific topic, go back to selection
      setSelection(null);
    } else {
      // Otherwise go to home
      navigateToHome();
    }
  }, [selection, setSelection, navigateToHome]);

  const navigateToGlossary = useCallback((section = null) => {
    navigateToGlossaryHome(activePage);
  }, [navigateToGlossaryHome, activePage]);

  // Breadcrumb navigation handler
  const handleBreadcrumbNavigation = useCallback((item) => {
    switch (item.path) {
      case '/':
        navigateToHome();
        break;
      
      case '/dashboard':
        setSelection(null);
        navigateToDashboard();
        break;
      
      case '/model-analysis':
        setSelection(null);
        navigateToModelAnalysis();
        break;
      
      case '/glossary':
        navigateToGlossary();
        break;
      
      default:
        if (item.data) {
          setSelection(item.data);
          navigateToModelAnalysis();
        }
    }
  }, [navigateToHome, navigateToDashboard, navigateToModelAnalysis, navigateToGlossary, setSelection]);

  // URL-like path for current state
  const currentPath = useMemo(() => {
    let path = '/';
    
    switch (activePage) {
      case PAGES.DASHBOARD:
        path = '/dashboard';
        break;
      case PAGES.MODEL_ANALYSIS:
        path = '/model-analysis';
        break;
      case PAGES.GLOSSARY:
        path = '/glossary';
        break;
    }

    if (selection) {
      path += `/${selection.diseaseCategory}/${selection.topic}`;
    }

    return path;
  }, [activePage, selection]);

  // Check if we can navigate back
  const canNavigateBack = useMemo(() => {
    return selection !== null || activePage !== PAGES.DASHBOARD;
  }, [selection, activePage]);

  // Get page title
  const pageTitle = useMemo(() => {
    if (selection) {
      const topic = Object.values(TOPICS).find(t => t.id === selection.topic);
      return topic?.name || 'Model Analysis';
    }

    switch (activePage) {
      case PAGES.DASHBOARD:
        return 'Dashboard';
      case PAGES.MODEL_ANALYSIS:
        return 'Model Analysis';
      case PAGES.GLOSSARY:
        return 'Glossary';
      default:
        return 'LAVA';
    }
  }, [activePage, selection]);

  // Get available navigation options
  const availableTopics = useMemo(() => {
    return Object.values(TOPICS).map(topic => ({
      id: topic.id,
      name: topic.name,
      vendor: topic.vendor
    }));
  }, []);

  return {
    // Current state
    activePage,
    selection,
    breadcrumbs,
    currentPath,
    pageTitle,
    canNavigateBack,
    
    // Navigation actions
    navigateToHome,
    navigateToTopic,
    navigateToGlossary,
    navigateBack,
    handleBreadcrumbNavigation,
    
    // Available options
    availableTopics,
    
    // Direct navigation methods (from context)
    navigateToDashboard,
    navigateToModelAnalysis,
    navigateToGlossaryHome
  };
};
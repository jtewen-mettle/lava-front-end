import React, { createContext, useContext, useState, useCallback } from 'react';
import { PAGES } from '../constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD);
  const [selection, setSelection] = useState(null);
  const [glossarySection, setGlossarySection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigateToGlossary = useCallback((section = null) => {
    setGlossarySection(section);
    setActivePage(PAGES.GLOSSARY);
  }, []);

  const navigateToGlossaryHome = useCallback((currentPage = null) => {
    if (currentPage === PAGES.GLOSSARY) {
      setGlossarySection('scroll-to-top');
    } else {
      setGlossarySection(null);
    }
    setActivePage(PAGES.GLOSSARY);
  }, []);

  const resetSelection = useCallback(() => {
    setSelection(null);
  }, []);

  const navigateToPage = useCallback((page) => {
    setActivePage(page);
  }, []);

  const navigateToDashboard = useCallback(() => {
    setSelection(null);
    setActivePage(PAGES.DASHBOARD);
  }, []);

  const navigateToModelAnalysis = useCallback(() => {
    setActivePage(PAGES.MODEL_ANALYSIS);
  }, []);

  const setAppError = useCallback((error) => {
    setError(error);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setAppLoading = useCallback((isLoading) => {
    setLoading(isLoading);
    if (isLoading) {
      setError(null);
    }
  }, []);

  const contextValue = {
    // State
    activePage,
    selection,
    glossarySection,
    loading,
    error,
    
    // Actions
    setActivePage,
    setSelection,
    setGlossarySection,
    navigateToGlossary,
    navigateToGlossaryHome,
    resetSelection,
    navigateToPage,
    navigateToDashboard,
    navigateToModelAnalysis,
    setAppError,
    clearError,
    setAppLoading
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [selection, setSelection] = useState(null);
  const [glossarySection, setGlossarySection] = useState(null);

  const navigateToGlossary = (section = null) => {
    setGlossarySection(section);
    setActivePage('Glossary');
  };

  const navigateToGlossaryHome = (currentPage = null) => {
    // If already on Glossary page, just scroll to top but keep current tab
    if (currentPage === 'Glossary') {
      setGlossarySection('scroll-to-top'); // Special signal to scroll to current tab top
    } else {
      setGlossarySection(null); // Reset for fresh navigation from other pages
    }
    setActivePage('Glossary');
  };

  return (
    <AppContext.Provider value={{ 
      activePage, 
      setActivePage, 
      selection, 
      setSelection, 
      glossarySection, 
      setGlossarySection,
      navigateToGlossary,
      navigateToGlossaryHome
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
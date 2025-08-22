import React from 'react';

import { useAppContext } from '../../core/context';
import { PAGES } from '../../core/constants';
import { Dashboard } from '../../features/dashboard';
import { ModelAnalysis } from '../../features/model-analysis';
import { Glossary } from '../../features/glossary';

const PageRouter = () => {
  const { activePage } = useAppContext();

  switch (activePage) {
    case PAGES.DASHBOARD:
      return <Dashboard />;
    
    case PAGES.MODEL_ANALYSIS:
      return <ModelAnalysis />;
    
    case PAGES.GLOSSARY:
      return <Glossary />;
    
    default:
      return <Dashboard />;
  }
};

export default PageRouter;
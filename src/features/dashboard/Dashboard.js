import React from 'react';
import { useAppContext } from '../../core/context';
import { SelectionForm } from './components';

const Dashboard = () => {
  const { setSelection, navigateToModelAnalysis } = useAppContext();

  const handleSelectionSubmit = (selectionData) => {
    setSelection(selectionData);
    navigateToModelAnalysis(); // Navigate to Model Analysis page after selection
  };

  return <SelectionForm onSubmit={handleSelectionSubmit} />;
};

export default Dashboard;
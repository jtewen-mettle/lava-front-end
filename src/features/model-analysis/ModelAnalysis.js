import React from 'react';
import { useAppContext } from '../../core/context';
import { SelectionForm } from '../dashboard/components';
import { TopicRenderer } from './components';

const ModelAnalysis = () => {
  const { selection, setSelection } = useAppContext();

  const handleSelectionSubmit = (selectionData) => {
    setSelection(selectionData);
  };

  return selection ? (
    <TopicRenderer />
  ) : (
    <SelectionForm onSubmit={handleSelectionSubmit} />
  );
};

export default ModelAnalysis;
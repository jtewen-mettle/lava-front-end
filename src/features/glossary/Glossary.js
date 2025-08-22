import React from 'react';
import { useAppContext } from '../../core/context';
import GlossaryPage from '../../components/GlossaryPage';

const Glossary = () => {
  const { glossarySection } = useAppContext();

  return <GlossaryPage initialSection={glossarySection} />;
};

export default Glossary;
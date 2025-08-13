import React, { useState } from 'react';
import { Box } from '@mui/material';
import { modelCardData } from './ModelCard/data';

// Import all modular components
import SideNavigation from './ModelCard/SideNavigation';
import ContentRenderer from './ModelCard/ContentRenderer';
import Header from './ModelCard/Header';
import BottomNavigation from './ModelCard/BottomNavigation';
import ModelCardFooter from './ModelCard/ModelCardFooter';
import { ContentArea } from './ModelCard/styles';
import { navigationItems, getModelCardKey } from './ModelCard/utils/navigationUtils';

const ModelCardSection = ({ topic }) => {
  // State management
  const [activeSection, setActiveSection] = useState('intervention-details');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Get model card data based on topic
  const modelCardKey = getModelCardKey(topic?.toLowerCase() || 'cardiovascular');
  const data = modelCardData[modelCardKey];

  // Early return if no data
  if (!data) {
    return null;
  }

  // Navigation handlers
  const handleNavigation = (sectionId, subSectionId = null) => {
    setActiveSection(sectionId);
    // Always set activeSubSection to null to show combined content
    setActiveSubSection(null);
  };

  const handleExpandClick = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
      {/* Side Navigation */}
      <SideNavigation 
        navigationItems={navigationItems}
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        expandedSections={expandedSections}
        onNavigation={handleNavigation}
        onExpandClick={handleExpandClick}
      />

      {/* Main Content Area */}
      <ContentArea>
        {/* Header with download functionality */}
        <Header data={data} activeSection={activeSection} />

        {/* Content Area */}
        <Box sx={{ marginBottom: '60px' }}>
          <div data-section-content>
            <ContentRenderer 
              activeSection={activeSection}
              activeSubSection={activeSubSection}
              navigationItems={navigationItems}
              data={data}
              onNavigation={handleNavigation}
            />
          </div>
        </Box>

        {/* Bottom Navigation */}
        <BottomNavigation 
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          onNavigation={handleNavigation}
          setExpandedSections={setExpandedSections}
        />

        {/* Footer */}
        <ModelCardFooter data={data} />
      </ContentArea>
    </Box>
  );
};

export default ModelCardSection;
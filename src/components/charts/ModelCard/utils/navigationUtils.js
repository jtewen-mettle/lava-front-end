// Navigation utilities for Model Card sections

// Navigation structure based on actual content analysis
export const navigationItems = [
  {
    id: 'intervention-details',
    label: '1. Intervention Details and Output',
    subItems: []
  },
  {
    id: 'purpose-intervention',
    label: '2. Purpose of Intervention',
    subItems: []
  },
  {
    id: 'cautioned-use',
    label: '3. Cautioned Out-of-Scope Use',
    subItems: [
      { id: 'tasks-populations', label: 'Tasks, Situations, or Populations to Avoid' },
      { id: 'known-risks', label: 'Known Risks, Inappropriate Settings & Limitations' }
    ]
  },
  {
    id: 'development-details',
    label: '4. Development Details and Input Features',
    subItems: [
      { id: 'training-data', label: 'Training Data Inclusion/Exclusion Criteria' },
      { id: 'data-elements', label: 'USCDI v4 Data Elements as Input Features' },
      { id: 'demographic-representativeness', label: 'Demographic Representativeness of Training Data' }
    ]
  },
  {
    id: 'external-validation',
    label: '5. External Validation Process',
    subItems: [
      { id: 'validation-basic', label: 'External Validation Information' },
      { id: 'validation-demographics', label: 'External Validation Demographics' }
    ]
  },
  {
    id: 'performance-measures',
    label: '6. Quantitative Performance Measures',
    subItems: [
      { id: 'internal-validation', label: 'Internal Validation (Same Source as Training)' },
      { id: 'external-validation-metrics', label: 'External Validation (Different Source)' },
      { id: 'outcome-evaluation', label: 'Outcome Evaluation References' }
    ]
  },
  {
    id: 'maintenance-monitoring',
    label: '7. Ongoing Maintenance & Monitoring',
    subItems: [
      { id: 'validity-monitoring', label: 'Validity Monitoring' },
      { id: 'fairness-monitoring', label: 'Fairness Monitoring' },
      { id: 'update-schedule', label: 'Update & Validation Schedule' },
      { id: 'monitoring-status', label: 'Current Monitoring Status' }
    ]
  },
  {
    id: 'evidence-base',
    label: '8. Evidence Base & Clinical Guidelines',
    subItems: []
  },
  {
    id: 'technical-implementation',
    label: '9. Technical Implementation Details',
    subItems: []
  }
];

// Map topic names to modelCardData keys
export const getModelCardKey = (topicName) => {
  const normalizedTopic = topicName.toLowerCase();
  if (normalizedTopic.includes('cardiovascular') || normalizedTopic.includes('cardio')) {
    return 'cardiovascular';
  } else if (normalizedTopic.includes('chronic kidney disease') || normalizedTopic.includes('kidney') || normalizedTopic.includes('ckd')) {
    return 'ckd';
  } else if (normalizedTopic.includes('prostate cancer') || normalizedTopic.includes('prostate')) {
    return 'prostate';
  } else if (normalizedTopic.includes('hospitalization') || normalizedTopic.includes('hospital')) {
    return 'hospitalization';
  }
  return 'cardiovascular'; // default fallback
};

// Create flat page structure for navigation
export const createPageStructure = () => {
  const pages = [];
  navigationItems.forEach(section => {
    if (section.subItems.length === 0) {
      pages.push({
        id: section.id,
        label: section.label,
        type: 'section'
      });
    } else {
      // Add main section first
      pages.push({
        id: section.id,
        label: section.label,
        type: 'section'
      });
      // Add subsections
      section.subItems.forEach(subItem => {
        pages.push({
          id: subItem.id,
          parentId: section.id,
          label: subItem.label,
          type: 'subsection'
        });
      });
    }
  });
  return pages;
};

// Navigation helper functions
export const getCurrentPageIndex = (activeSection, activeSubSection, allPages) => {
  if (activeSubSection) {
    return allPages.findIndex(page => page.id === activeSubSection);
  }
  return allPages.findIndex(page => page.id === activeSection && page.type === 'section');
};

export const getCurrentSectionNumber = (activeSection, activeSubSection, allPages) => {
  return getCurrentPageIndex(activeSection, activeSubSection, allPages) + 1;
};

export const getPreviousPage = (activeSection, activeSubSection, allPages) => {
  const currentIndex = getCurrentPageIndex(activeSection, activeSubSection, allPages);
  if (currentIndex > 0) {
    return allPages[currentIndex - 1];
  }
  return null;
};

export const getNextPage = (activeSection, activeSubSection, allPages) => {
  const currentIndex = getCurrentPageIndex(activeSection, activeSubSection, allPages);
  if (currentIndex < allPages.length - 1) {
    return allPages[currentIndex + 1];
  }
  return null;
};

export const navigateToPage = (direction, activeSection, activeSubSection, allPages, onNavigation, setExpandedSections) => {
  if (direction === 'previous') {
    const prevPage = getPreviousPage(activeSection, activeSubSection, allPages);
    if (prevPage) {
      if (prevPage.type === 'subsection') {
        onNavigation(prevPage.parentId, prevPage.id);
        setExpandedSections(prev => ({ ...prev, [prevPage.parentId]: true }));
      } else {
        onNavigation(prevPage.id, null);
        const pageItem = navigationItems.find(item => item.id === prevPage.id);
        setExpandedSections(prev => ({ ...prev, [prevPage.id]: pageItem?.subItems?.length > 0 }));
      }
    }
  } else if (direction === 'next') {
    const nextPage = getNextPage(activeSection, activeSubSection, allPages);
    if (nextPage) {
      if (nextPage.type === 'subsection') {
        onNavigation(nextPage.parentId, nextPage.id);
        setExpandedSections(prev => ({ ...prev, [nextPage.parentId]: true }));
      } else {
        onNavigation(nextPage.id, null);
        const pageItem = navigationItems.find(item => item.id === nextPage.id);
        setExpandedSections(prev => ({ ...prev, [nextPage.id]: pageItem?.subItems?.length > 0 }));
      }
    }
  }
};
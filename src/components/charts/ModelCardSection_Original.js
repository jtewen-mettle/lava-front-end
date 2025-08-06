import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  List,
  ListItemText,
  ListItemButton,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, ExpandLess, Download, ChevronRight } from '@mui/icons-material';
import { modelCardData } from '../../data/modelCardData';

// Styled components
const SideNav = styled(Box)(({ theme }) => ({
  width: '280px',
  backgroundColor: 'white',
  color: '#333',
  padding: '10px 0',
  height: 'fit-content',
  position: 'sticky',
  top: '20px',
  borderRadius: '8px',
  border: '1px solid #e1e8ed',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
}));

const ExpandedSubSection = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  margin: '0px',
}));

const NavItem = styled(ListItemButton)(({ active }) => ({
  padding: '12px 16px',
  backgroundColor: active ? '#275786' : 'transparent',
  margin: '2px 0',
  color: active ? 'white' : '#333',
  borderRadius: active ? '6px' : 'none',
  marginLeft: active ? '8px' : '0px',
  marginRight: active ? '8px' : '0px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: active ? '#275786' : '#f8f9fa',
    color: active ? 'white' : '#275786',
  },
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    fontWeight: active ? 600 : 500,
    color: active ? 'white' : '#333',
    fontFamily: 'Arial, sans-serif',
    transition: 'font-weight 0.2s ease',
  },
  '&:hover .MuiListItemText-primary': {
    color: active ? 'white' : '#275786',
    fontWeight: 600,
  },
}));

const SubNavItem = styled(ListItemButton)(({ active }) => ({
  padding: '8px 16px 8px 32px',
  backgroundColor: active ? '#1164ad' : 'transparent',
  margin: '0px',
  color: active ? 'white' : '#666',
  borderRadius: '0px',
  borderLeft: 'none',
  borderBottom: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? '#1164ad' : '#f8f9fa',
    color: active ? 'white' : '#1164ad',
  },
  '& .MuiListItemText-primary': {
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    color: active ? 'white' : '#666',
    fontFamily: 'Arial, sans-serif',
    transition: 'font-weight 0.2s ease',
  },
  '&:hover .MuiListItemText-primary': {
    color: active ? 'white' : '#1164ad',
    fontWeight: 500,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  marginLeft: '20px',
  minHeight: '600px',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #5dade2 0%, #48a3d9 100%)',
  color: 'white',
  padding: '20px 30px',
  borderRadius: '8px 8px 0 0',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '18px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 600,
  margin: 0,
}));

const SectionContent = styled(Box)(({ theme }) => ({
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '0 0 8px 8px',
  border: '1px solid #e1e8ed',
  borderTop: 'none',
}));

const FieldContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '18px',
  borderRadius: '8px',
  border: '1px solid #e1e8ed',
  transition: 'all 0.3s ease',
  minHeight: '80px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  '&:hover': {
    borderColor: '#5dade2',
    boxShadow: '0 4px 12px rgba(93, 173, 226, 0.1)',
  },
}));

const FieldLabel = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: '#2c3e50',
  marginBottom: '8px',
  display: 'block',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
}));

const FieldValue = styled('div')(({ theme }) => ({
  color: '#555',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  lineHeight: 1.5,
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
}));

const StatusBadge = styled('span')(({ theme, variant }) => ({
  display: 'inline-block',
  padding: '6px 14px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: 'Arial, sans-serif',
  color: 'white',
  ...(variant === 'certified' && {
    backgroundColor: '#2ecc71',
  }),
  ...(variant === 'warning' && {
    backgroundColor: '#f39c12',
  }),
  ...(variant === 'validated' && {
    backgroundColor: '#9b59b6',
  }),
  ...(variant === 'monitored' && {
    backgroundColor: '#5dade2',
  }),
}));

const MetricValue = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#5dade2',
  marginBottom: '12px',
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1,
}));

const MetricLabel = styled('div')(({ theme }) => ({
  color: '#666',
  fontSize: '12px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  lineHeight: 1,
}));

const WarningBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff3cd',
  border: '2px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

const CriticalBox = styled('div')(({ theme }) => ({
  backgroundColor: '#f8d7da',
  border: '2px solid #f5c6cb',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

const BoxTitle = styled('h4')(({ theme }) => ({
  color: '#856404',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
}));

const CriticalBoxTitle = styled(BoxTitle)(({ theme }) => ({
  color: '#721c24',
}));

const BoxList = styled('ul')(({ theme }) => ({
  color: '#856404',
  marginLeft: '20px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  '& li': {
    marginBottom: '8px',
  },
}));

const CriticalBoxList = styled(BoxList)(({ theme }) => ({
  color: '#721c24',
}));

const ComplianceBadge = styled('div')(({ theme }) => ({
  display: 'inline-block',
  background: '#27ae60',
  color: 'white',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'Arial, sans-serif',
}));

const ModelCardSection = ({ topic }) => {
  const [activeSection, setActiveSection] = useState('intervention-details');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const modelCardRef = useRef(null);

  // Map topic names to modelCardData keys
  const getModelCardKey = (topicName) => {
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

  const modelCardKey = getModelCardKey(topic?.toLowerCase() || 'cardiovascular');
  const data = modelCardData[modelCardKey];

  if (!data) {
    return null;
  }

  // Navigation structure based on actual content analysis
  const navigationItems = [
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

  const handleNavigation = (sectionId, subSectionId = null) => {
    setActiveSection(sectionId);
    setActiveSubSection(subSectionId);
  };

  const handleTextClick = (sectionId, subSectionId = null, event) => {
    event.stopPropagation();
    handleNavigation(sectionId, subSectionId);
  };

  const handleExpandClick = (sectionId) => {
    toggleSection(sectionId);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Download handlers
  const handleDownloadMenuOpen = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleDownloadCurrentSection = () => {
    handleDownloadMenuClose();
    if (!activeSection) {
      alert('Please select a section to download');
      return;
    }

    const sectionTitles = {
      'intervention-details': '1. Intervention Details and Output',
      'purpose-intervention': '2. Purpose of Intervention',
      'cautioned-use': '3. Cautioned Out-of-Scope Use',
      'development-details': '4. Development Details and Input Features',
      'external-validation': '5. External Validation Process',
      'performance-measures': '6. Quantitative Performance Measures',
      'maintenance-monitoring': '7. Ongoing Maintenance & Monitoring',
      'evidence-base': '8. Evidence Base & Clinical Guidelines',
      'technical-implementation': '9. Technical Implementation Details'
    };

    const sectionTitle = sectionTitles[activeSection] || 'Model Card Section';
    
    // Get the actual rendered content
    const contentElement = document.querySelector('[data-section-content]');
    let contentHtml = '';
    
    if (contentElement) {
      contentHtml = contentElement.innerHTML;
    } else {
      contentHtml = '<p>Section content not available for download.</p>';
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${sectionTitle} - ${data.interventionName || 'Healthcare AI Model'}</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6; 
            max-width: 1200px;
          }
          .section-title { 
            color: #275786; 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 30px; 
            padding-bottom: 10px;
            border-bottom: 2px solid #275786;
          }
          .field-container {
            background-color: white;
            padding: 18px;
            border-radius: 8px;
            border: 1px solid #e1e8ed;
            margin-bottom: 15px;
          }
          .field-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 16px;
          }
          .field-value {
            color: #555;
            font-size: 16px;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #e1e8ed;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            color: white;
          }
          .certified { background-color: #2ecc71; }
          .warning { background-color: #f39c12; }
          .validated { background-color: #9b59b6; }
          .monitored { background-color: #5dade2; }
        </style>
      </head>
      <body>
        <h1 class="section-title">${sectionTitle}</h1>
        <div class="content">
          ${contentHtml}
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleDateString()} | ${data.interventionName || 'Healthcare AI Model'}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadFullCard = () => {  
    handleDownloadMenuClose();
    
    // Generate full model card content by combining all sections
    const allSections = navigationItems.map(section => {
      const sectionData = renderFullSectionContent(section.id);
      return `
        <div class="section">
          <h2 class="section-title">${section.label}</h2>
          <div class="section-content">
            ${sectionData}
          </div>
        </div>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Complete Model Card - ${data.interventionName || 'Healthcare AI Model'}</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6; 
            max-width: 1200px;
          }
          .main-title {
            color: #275786;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 40px;
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px solid #275786;
          }
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          .section-title { 
            color: #275786; 
            font-size: 20px; 
            font-weight: bold; 
            margin-bottom: 20px; 
            padding-bottom: 8px;
            border-bottom: 1px solid #275786;
          }
          .field-container {
            background-color: white;
            padding: 18px;
            border-radius: 8px;
            border: 1px solid #e1e8ed;
            margin-bottom: 15px;
          }
          .field-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 16px;
          }
          .field-value {
            color: #555;
            font-size: 16px;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #e1e8ed;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            color: white;
          }
          .certified { background-color: #2ecc71; }
          .warning { background-color: #f39c12; }
          .validated { background-color: #9b59b6; }
          .monitored { background-color: #5dade2; }
          @media print {
            .section { page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <h1 class="main-title">ASTP HTI-1 Compliant Model Card</h1>
        <p style="text-align: center; margin-bottom: 40px; font-size: 18px; color: #666;">
          ${data.interventionName || 'Healthcare AI Model'} - Complete Documentation
        </p>
        ${allSections}
        <div style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleDateString()} | ${data.interventionName || 'Healthcare AI Model'} | Model Card Version ${data.modelCardVersion || '1.0'}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Helper function to render full section content for download
  const renderFullSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'intervention-details':
        return `
          <div class="field-container">
            <div class="field-label">Intervention Name</div>
            <div class="field-value">${data.interventionName || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Developer Name & Contact</div>
            <div class="field-value">${data.developerContact || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Funding Source</div>
            <div class="field-value">${data.fundingSource || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Value Produced as Output</div>
            <div class="field-value">${data.valueOutput || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Output Type</div>
            <div class="field-value"><span class="status-badge validated">${data.outputType || 'N/A'}</span></div>
          </div>
        `;
      case 'purpose-intervention':
        return `
          <div class="field-container">
            <div class="field-label">Intended Use</div>
            <div class="field-value">${data.intendedUse || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Intended Patient Population</div>
            <div class="field-value">${data.intendedPatientPopulation || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Intended Users</div>
            <div class="field-value">${data.intendedUsers || 'N/A'}</div>
          </div>
          <div class="field-container">
            <div class="field-label">Decision-Making Role</div>
            <div class="field-value">
              <span class="status-badge monitored">${data.decisionMakingRole || 'N/A'}</span><br>
              ${data.decisionMakingDesc || ''}
            </div>
          </div>
        `;
      default:
        return '<p>Section content available in application.</p>';
    }
  };

  // Create flat page structure for navigation
  const createPageStructure = () => {
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

  const allPages = createPageStructure();

  // Component to render subsection links
  const SubsectionLinksPage = ({ section }) => {
    const sectionData = navigationItems.find(item => item.id === section);
    
    if (!sectionData || sectionData.subItems.length === 0) {
      return null;
    }

    return (
      <Paper elevation={1}>
        <SectionHeader>
          <SectionTitle>{sectionData.label}</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <Box component="ul" sx={{ 
            listStyleType: 'none',
            paddingLeft: '0px',
            margin: 0
          }}>
            {sectionData.subItems.map((subItem, index) => (
              <Box
                component="li"
                key={subItem.id}
                onClick={() => handleNavigation(section, subItem.id)}
                sx={{
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ 
                  fontSize: '16px', 
                  fontWeight: '400',
                  color: '#275786',
                  fontFamily: 'Arial, sans-serif',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    fontWeight: '500'
                  }
                }}>
                  {sectionData.label.split('.')[0]}.{index + 1} {subItem.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionContent>
      </Paper>
    );
  };

  // Navigation helper functions
  const getCurrentPageIndex = () => {
    if (activeSubSection) {
      return allPages.findIndex(page => page.id === activeSubSection);
    }
    return allPages.findIndex(page => page.id === activeSection && page.type === 'section');
  };

  const getCurrentSectionNumber = () => {
    return getCurrentPageIndex() + 1;
  };

  const getPreviousPage = () => {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex > 0) {
      return allPages[currentIndex - 1];
    }
    return null;
  };

  const getNextPage = () => {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex < allPages.length - 1) {
      return allPages[currentIndex + 1];
    }
    return null;
  };

  const navigateToPage = (direction) => {
    if (direction === 'previous') {
      const prevPage = getPreviousPage();
      if (prevPage) {
        if (prevPage.type === 'subsection') {
          handleNavigation(prevPage.parentId, prevPage.id);
          setExpandedSections(prev => ({ ...prev, [prevPage.parentId]: true }));
        } else {
          handleNavigation(prevPage.id, null);
          setExpandedSections(prev => ({ ...prev, [prevPage.id]: prevPage.subItems?.length > 0 }));
        }
      }
    } else if (direction === 'next') {
      const nextPage = getNextPage();
      if (nextPage) {
        if (nextPage.type === 'subsection') {
          handleNavigation(nextPage.parentId, nextPage.id);
          setExpandedSections(prev => ({ ...prev, [nextPage.parentId]: true }));
        } else {
          handleNavigation(nextPage.id, null);
          setExpandedSections(prev => ({ ...prev, [nextPage.id]: nextPage.subItems?.length > 0 }));
        }
      }
    }
  };

  // Grid component for field layout
  const FieldGrid = ({ items, columns = 3 }) => (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: `repeat(2, 1fr)`, 
          lg: `repeat(${columns}, 1fr)`
        },
        gap: 2,
        width: '100%',
        marginBottom: 2
      }}
    >
      {items.map((item, index) => (
        <FieldContainer key={index}>
          <FieldLabel>{item.label}</FieldLabel>
          <FieldValue>{item.value}</FieldValue>
        </FieldContainer>
      ))}
    </Box>
  );

  // Metric grid component
  const MetricGrid = ({ metrics }) => (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(6, 1fr)'
        },
        gap: 2,
        marginBottom: 2
      }}
    >
      {metrics.map((metric, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#f8f9fa',
            border: '2px solid #e3f2fd',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: '40px',
            minHeight: '40px',
            maxHeight: '60px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              borderColor: '#5dade2',
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(93, 173, 226, 0.2)',
            }
          }}
        >
          <MetricValue>{metric.value}</MetricValue>
          <MetricLabel>{metric.label}</MetricLabel>
        </Box>
      ))}
    </Box>
  );

  // Render side navigation
  const renderSideNavigation = () => (
    <SideNav>
      <List>
        {navigationItems.map((item) => (
          <Box key={item.id}>
            <NavItem
              active={activeSection === item.id}
              onClick={() => {
                if (item.subItems.length === 0) {
                  handleNavigation(item.id);
                } else {
                  handleExpandClick(item.id);
                }
              }}
            >
              <Box 
                onClick={(e) => handleTextClick(item.id, null, e)}
                sx={{ 
                  flex: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  paddingRight: item.subItems.length > 0 ? '12px' : '0px'
                }}
              >
                <ListItemText primary={item.label} />
              </Box>
              {item.subItems.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  paddingLeft: '12px',
                  paddingRight: '8px',
                  cursor: 'pointer'
                }}>
                  <ChevronRight sx={{ 
                    transform: expandedSections[item.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: activeSection === item.id ? 'white' : '#666',
                    fontSize: '20px'
                  }} />
                </Box>
              )}
            </NavItem>
            {item.subItems.length > 0 && expandedSections[item.id] && (
              <ExpandedSubSection>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <SubNavItem
                      key={subItem.id}
                      active={activeSubSection === subItem.id}
                      onClick={() => handleNavigation(item.id, subItem.id)}
                    >
                      <ListItemText primary={subItem.label} />
                    </SubNavItem>
                  ))}
                </List>
              </ExpandedSubSection>
            )}
          </Box>
        ))}
      </List>
    </SideNav>
  );

  // Render content based on active section
  const renderContent = () => {
    if (!activeSection) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Select a section from the navigation to view its content
          </Typography>
        </Box>
      );
    }

    // Check if we should show subsection links page
    const currentSection = navigationItems.find(item => item.id === activeSection);
    if (currentSection && currentSection.subItems.length > 0 && !activeSubSection) {
      return <SubsectionLinksPage section={activeSection} />;
    }

    switch (activeSection) {
      case 'intervention-details':
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>1. Intervention Details and Output</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'Intervention Name', value: data.interventionName },
                { label: 'Developer Name & Contact', value: data.developerContact },
                { label: 'Funding Source', value: data.fundingSource },
                { label: 'Value Produced as Output', value: data.valueOutput },
                { 
                  label: 'Output Type', 
                  value: <StatusBadge variant="validated">{data.outputType}</StatusBadge> 
                }
              ]} />
            </SectionContent>
          </Paper>
        );

      case 'purpose-intervention':
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>2. Purpose of Intervention</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'Intended Use', value: data.intendedUse },
                { label: 'Intended Patient Population', value: data.intendedPatientPopulation },
                { label: 'Intended Users', value: data.intendedUsers },
                { 
                  label: 'Decision-Making Role', 
                  value: (
                    <>
                      <StatusBadge variant="monitored">{data.decisionMakingRole}</StatusBadge>
                      <br />
                      {data.decisionMakingDesc}
                    </>
                  )
                }
              ]} />
            </SectionContent>
          </Paper>
        );

      case 'cautioned-use':
        if (activeSubSection === 'tasks-populations') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>3. Cautioned Out-of-Scope Use - Tasks, Situations, or Populations to Avoid</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <CriticalBox>
                  <CriticalBoxTitle>🚫 Tasks, Situations, or Populations to Avoid</CriticalBoxTitle>
                  <CriticalBoxList>
                    {data.criticalAvoidances?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </CriticalBoxList>
                </CriticalBox>
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'known-risks') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>3. Cautioned Out-of-Scope Use - Known Risks, Inappropriate Settings & Limitations</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <WarningBox>
                  <BoxTitle>⚠️ Known Risks, Inappropriate Settings & Limitations</BoxTitle>
                  <BoxList>
                    {data.knownRisks?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </BoxList>
                </WarningBox>
              </SectionContent>
            </Paper>
          );
        }
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>3. Cautioned Out-of-Scope Use</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <CriticalBox>
                <CriticalBoxTitle>🚫 Tasks, Situations, or Populations to Avoid</CriticalBoxTitle>
                <CriticalBoxList>
                  {data.criticalAvoidances?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </CriticalBoxList>
              </CriticalBox>
              <WarningBox>
                <BoxTitle>⚠️ Known Risks, Inappropriate Settings & Limitations</BoxTitle>
                <BoxList>
                  {data.knownRisks?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </BoxList>
              </WarningBox>
            </SectionContent>
          </Paper>
        );

      case 'development-details':
        if (activeSubSection === 'training-data') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>4. Development Details and Input Features - Training Data Inclusion/Exclusion Criteria</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <FieldGrid items={[
                  { label: 'Inclusion Criteria', value: data.trainingInclusion },
                  { label: 'Exclusion Criteria', value: data.trainingExclusion }
                ]} columns={2} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'data-elements') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>4. Development Details and Input Features - USCDI v4 Data Elements as Input Features</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e1e8ed' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data Element</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Used in Model</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(data.uscdiElements || {}).map(([key, element]) => (
                        <TableRow key={key}>
                          <TableCell sx={{ textTransform: 'capitalize', fontWeight: '500' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge variant={element.used ? 'certified' : 'warning'}>
                              {element.used ? 'Yes' : 'No'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>{element.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'demographic-representativeness') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>4. Development Details and Input Features - Demographic Representativeness of Training Data</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e1e8ed', mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Variable</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Training Data</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>US Population</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Representativeness</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(data.demographicRepresentativeness || []).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: '500' }}>{item.variable}</TableCell>
                          <TableCell>{item.trainingData}</TableCell>
                          <TableCell>{item.usPopulation}</TableCell>
                          <TableCell>
                            <StatusBadge variant={
                              item.representativeness === 'Good' ? 'certified' : 
                              item.representativeness === 'Under-represented' ? 'warning' : 'validated'
                            }>
                              {item.representativeness}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <FieldGrid items={[
                  { label: 'Relevance to Deployed Setting', value: data.relevanceToDeployedSetting }
                ]} columns={1} />
              </SectionContent>
            </Paper>
          );
        }
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>4. Development Details and Input Features</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Training Data Inclusion/Exclusion Criteria
              </Typography>
              <FieldGrid items={[
                { label: 'Inclusion Criteria', value: data.trainingInclusion },
                { label: 'Exclusion Criteria', value: data.trainingExclusion }
              ]} columns={2} />
              
              <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Fairness Development Process
              </Typography>
              <FieldGrid items={[
                { label: 'Fairness Approach', value: data.fairnessApproach },
                { label: 'Bias Management', value: data.biasManagement }
              ]} columns={1} />
            </SectionContent>
          </Paper>
        );

      case 'external-validation':
        if (activeSubSection === 'validation-basic') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>5. External Validation Process - External Validation Information</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <FieldGrid items={[
                  { label: 'External Data Sources', value: data.externalDataSources },
                  { label: 'Clinical Settings', value: data.clinicalSettings },
                  { label: 'External Testing Party', value: data.externalTestingParty },
                  { label: 'External Validation Process', value: data.externalValidationProcess }
                ]} columns={2} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'validation-demographics') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>5. External Validation Process - External Validation Demographics</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e1e8ed' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Variable</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>MESA</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>WHI</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>REGARDS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(data.externalValidationDemographics || []).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: '500' }}>{item.variable}</TableCell>
                          <TableCell>{item.mesa}</TableCell>
                          <TableCell>{item.whi}</TableCell>
                          <TableCell>{item.regards}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SectionContent>
            </Paper>
          );
        }
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>5. External Validation Process</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'External Data Sources', value: data.externalDataSources },
                { label: 'Clinical Settings', value: data.clinicalSettings },
                { label: 'External Testing Party', value: data.externalTestingParty },
                { label: 'External Validation Process', value: data.externalValidationProcess }
              ]} columns={2} />
            </SectionContent>
          </Paper>
        );

      case 'performance-measures':
        if (activeSubSection === 'internal-validation') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>6. Quantitative Performance Measures - Internal Validation (Same Source as Training)</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <MetricGrid metrics={[
                  { value: data.internalValidationMetrics?.aurocValidity, label: 'AUROC Validity' },
                  { value: data.internalValidationMetrics?.fairnessScore, label: 'Fairness Score' },
                  { value: data.internalValidationMetrics?.sensitivity, label: 'Sensitivity' },
                  { value: data.internalValidationMetrics?.specificity, label: 'Specificity' },
                  { value: data.internalValidationMetrics?.ppv, label: 'PPV' },
                  { value: data.internalValidationMetrics?.calibration, label: 'Calibration' }
                ]} />
                <FieldGrid items={[
                  { label: 'Fairness Score Description', value: data.internalValidationMetrics?.fairnessScoreDesc },
                  { label: 'Calibration Description', value: data.internalValidationMetrics?.calibrationDesc }
                ]} columns={2} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'external-validation-metrics') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>6. Quantitative Performance Measures - External Validation (Different Source)</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <MetricGrid metrics={[
                  { value: data.externalValidationMetrics?.aurocValidity, label: 'AUROC Validity' },
                  { value: data.externalValidationMetrics?.fairnessScore, label: 'Fairness Score' },
                  { value: data.externalValidationMetrics?.publishedStudies, label: 'Published Studies' },
                  { value: data.externalValidationMetrics?.calibration, label: 'Calibration' }
                ]} />
                <FieldGrid items={[
                  { label: 'AUROC Description', value: data.externalValidationMetrics?.aurocValidityDesc },
                  { label: 'Fairness Score Description', value: data.externalValidationMetrics?.fairnessScoreDesc },
                  { label: 'Calibration Description', value: data.externalValidationMetrics?.calibrationDesc },
                  { label: 'Published Studies Description', value: data.externalValidationMetrics?.publishedStudiesDesc }
                ]} columns={2} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'outcome-evaluation') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>6. Quantitative Performance Measures - Outcome Evaluation References</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold' }}>
                    Published References
                  </Typography>
                  {(data.outcomeEvaluationReferences || []).map((reference, index) => (
                    <Box key={index} sx={{ 
                      p: 2, 
                      mb: 2, 
                      border: '1px solid #e1e8ed', 
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <Typography sx={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                        {reference}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <FieldGrid items={[
                  { label: 'Real World Impact', value: data.realWorldImpact }
                ]} columns={1} />
              </SectionContent>
            </Paper>
          );
        }
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>6. Quantitative Performance Measures</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Internal Validation Metrics
              </Typography>
              <MetricGrid metrics={[
                { value: data.internalValidationMetrics?.aurocValidity, label: 'AUROC Validity' },
                { value: data.internalValidationMetrics?.fairnessScore, label: 'Fairness Score' },
                { value: data.internalValidationMetrics?.sensitivity, label: 'Sensitivity' },
                { value: data.internalValidationMetrics?.specificity, label: 'Specificity' },
                { value: data.internalValidationMetrics?.ppv, label: 'PPV' },
                { value: data.internalValidationMetrics?.calibration, label: 'Calibration' }
              ]} />
              
              <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold' }}>
                External Validation Metrics
              </Typography>
              <MetricGrid metrics={[
                { value: data.externalValidationMetrics?.aurocValidity, label: 'AUROC Validity' },
                { value: data.externalValidationMetrics?.fairnessScore, label: 'Fairness Score' },
                { value: data.externalValidationMetrics?.publishedStudies, label: 'Published Studies' },
                { value: data.externalValidationMetrics?.calibration, label: 'Calibration' }
              ]} />
            </SectionContent>
          </Paper>
        );

      case 'maintenance-monitoring':
        if (activeSubSection === 'validity-monitoring') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>7. Ongoing Maintenance & Monitoring - Validity Monitoring</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <FieldGrid items={[
                  { label: 'Monitoring Process', value: data.monitoringProcess },
                  { 
                    label: 'Local Data Validity', 
                    value: (
                      <>
                        <StatusBadge variant="monitored">{data.localDataValidity}</StatusBadge>
                        <br />
                        {data.localDataValidityDesc}
                      </>
                    )
                  }
                ]} columns={1} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'fairness-monitoring') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>7. Ongoing Maintenance & Monitoring - Fairness Monitoring</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <FieldGrid items={[
                  { label: 'Fairness Monitoring Process', value: data.fairnessMonitoringProcess },
                  { 
                    label: 'Local Fairness Data', 
                    value: (
                      <>
                        <StatusBadge variant={data.localFairnessData === 'Complete' ? 'certified' : 'warning'}>
                          {data.localFairnessData}
                        </StatusBadge>
                        <br />
                        {data.localFairnessDataDesc}
                      </>
                    )
                  }
                ]} columns={1} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'update-schedule') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>7. Ongoing Maintenance & Monitoring - Update & Validation Schedule</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <FieldGrid items={[
                  { label: 'Update Process', value: data.updateProcess },
                  { label: 'Performance Correction', value: data.performanceCorrection }
                ]} columns={1} />
              </SectionContent>
            </Paper>
          );
        }
        if (activeSubSection === 'monitoring-status') {
          return (
            <Paper elevation={1}>
              <SectionHeader>
                <SectionTitle>7. Ongoing Maintenance & Monitoring - Current Monitoring Status</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold' }}>
                    Current Status Updates
                  </Typography>
                  {(data.currentMonitoringStatus || []).map((status, index) => (
                    <Box key={index} sx={{ 
                      p: 2, 
                      mb: 2, 
                      border: '1px solid #e1e8ed', 
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <Typography sx={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                        {status}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </SectionContent>
            </Paper>
          );
        }
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>7. Ongoing Maintenance & Monitoring</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Validity Monitoring
              </Typography>
              <FieldGrid items={[
                { label: 'Monitoring Process', value: data.monitoringProcess },
                { 
                  label: 'Local Data Validity', 
                  value: (
                    <>
                      <StatusBadge variant="monitored">{data.localDataValidity}</StatusBadge>
                      <br />
                      {data.localDataValidityDesc}
                    </>
                  )
                }
              ]} columns={1} />
              
              <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Fairness Monitoring
              </Typography>
              <FieldGrid items={[
                { label: 'Fairness Monitoring Process', value: data.fairnessMonitoringProcess },
                { 
                  label: 'Local Fairness Data', 
                  value: (
                    <>
                      <StatusBadge variant={data.localFairnessData === 'Complete' ? 'certified' : 'warning'}>
                        {data.localFairnessData}
                      </StatusBadge>
                      <br />
                      {data.localFairnessDataDesc}
                    </>
                  )
                }
              ]} columns={1} />
            </SectionContent>
          </Paper>
        );

      case 'evidence-base':
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>8. Evidence Base & Clinical Guidelines</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'Primary Citation', value: data.primaryCitation },
                { 
                  label: 'Clinical Evidence Level', 
                  value: (
                    <>
                      <StatusBadge variant="certified">{data.clinicalEvidenceLevel}</StatusBadge>
                      <br />
                      {data.clinicalEvidenceLevelDesc}
                    </>
                  )
                }
              ]} columns={1} />
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Supporting Guidelines
              </Typography>
              {(data.supportingGuidelines || []).map((guideline, index) => (
                <Box key={index} sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: '1px solid #e1e8ed', 
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <Typography sx={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                    {guideline}
                  </Typography>
                </Box>
              ))}
            </SectionContent>
          </Paper>
        );

      case 'technical-implementation':
        return (
          <Paper elevation={1}>
            <SectionHeader>
              <SectionTitle>9. Technical Implementation Details</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'Algorithm Type', value: data.algorithmType },
                { label: 'Integration Method', value: data.integrationMethod },
                { label: 'Response Time', value: data.responseTime },
                { label: 'Certification Details', value: data.certificationDetails }
              ]} columns={2} />
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#275786', fontWeight: 'bold' }}>
                Support Contacts
              </Typography>
              <FieldGrid items={[
                { label: 'Clinical Support', value: data.clinicalSupport },
                { label: 'Technical Support', value: data.technicalSupport },
                { label: 'Regulatory Affairs', value: data.regulatoryAffairs }
              ]} columns={1} />
            </SectionContent>
          </Paper>
        );

      default:
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Section content for "{activeSection}" is being implemented...
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
      {renderSideNavigation()}
      <ContentArea>
        {/* Header */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px'
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#000',
              textAlign: 'left',
              marginBottom: '4px'
            }}>
            ASTP HTI-1 Compliant Model Card
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              color: '#666',
              textAlign: 'left'
            }}>
              Predictive Decision Support Intervention - {data.interventionName?.split(' ')[1] || 'Risk Assessment'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ComplianceBadge>
              {data.complianceBadge}
            </ComplianceBadge>
            <Tooltip title="Download Options" arrow>
              <IconButton 
                size="small" 
                onClick={handleDownloadMenuOpen}
                className="download-button"
                sx={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e3f2fd',
                  borderRadius: '4px',
                  minWidth: '28px',
                  minHeight: '28px',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #bbdefb',
                    boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                  }
                }}
              >
                <Download sx={{ fontSize: 16, color: '#1976d2' }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={downloadMenuAnchor}
              open={Boolean(downloadMenuAnchor)}
              onClose={handleDownloadMenuClose}
            >
              <MenuItem onClick={handleDownloadCurrentSection}>
                Download Current Section
              </MenuItem>
              <MenuItem onClick={handleDownloadFullCard}>
                Download Full Model Card
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ marginBottom: '60px' }}>
          <div data-section-content>
            {renderContent()}
          </div>
        </Box>

        {/* Bottom Navigation */}
        {activeSection && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '30px',
            borderTop: '1px solid #e1e8ed',
            marginBottom: '40px'
          }}>
            <IconButton 
              onClick={() => navigateToPage('previous')}
              disabled={!getPreviousPage()}
              sx={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e3f2fd',
                borderRadius: '8px',
                padding: '12px 20px',
                maxWidth: '40%',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                },
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  color: '#bbb'
                }
              }}
            >
              <ChevronRight sx={{ transform: 'rotate(180deg)', mr: 1, flexShrink: 0 }} />
              <Typography sx={{ 
                fontSize: '14px', 
                fontWeight: '500',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {getPreviousPage()?.label || 'Previous'}
              </Typography>
            </IconButton>

            <Typography sx={{ 
              fontSize: '14px', 
              color: '#666',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center'
            }}>
              Page {getCurrentSectionNumber()} of {allPages.length}
            </Typography>

            <IconButton 
              onClick={() => navigateToPage('next')}
              disabled={!getNextPage()}
              sx={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e3f2fd',
                borderRadius: '8px',
                padding: '12px 20px',
                maxWidth: '40%',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                },
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  color: '#bbb'
                }
              }}
            >
              <Typography sx={{ 
                fontSize: '14px', 
                fontWeight: '500',
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {getNextPage()?.label || 'Next'}
              </Typography>
              <ChevronRight sx={{ ml: 1, flexShrink: 0 }} />
            </IconButton>
          </Box>
        )}
      </ContentArea>
    </Box>
  );
};

export default ModelCardSection;
import React from 'react';
import { Box, List, Typography, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore, FiberManualRecord } from '@mui/icons-material';
import { SideNav } from './styles';

const SideNavigation = ({
  navigationItems,
  activeSection,
  activeSubSection,
  expandedSections,
  onNavigation,
  onExpandClick
}) => {
  const handleMainClick = (item) => {
    // Always navigate to the main page only - no subsection navigation
    onNavigation(item.id);
    // Still expand for visual effect but don't navigate to subsections
    if (item.subItems.length > 0) {
      onExpandClick(item.id);
    }
  };

  const handleSubClick = (mainId, subId) => {
    // Remove subsection navigation functionality - just navigate to main section
    onNavigation(mainId);
  };

  return (
    <SideNav>
      <List sx={{ padding: '8px' }}>
        {navigationItems.map((item) => (
          <Box key={item.id} sx={{ marginBottom: '2px' }}>
            {/* Main Navigation Item */}
            <Box
              onClick={() => handleMainClick(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeSection === item.id ? '#275786' : 'transparent',
                color: activeSection === item.id ? 'white' : '#333',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid transparent',
                '&:hover': {
                  backgroundColor: activeSection === item.id ? '#275786' : '#f8f9fa',
                  borderColor: activeSection === item.id ? '#275786' : '#e1e8ed',
                  transform: 'translateX(2px)',
                  '& .main-nav-text': {
                    fontWeight: 600,
                  }
                },
              }}
            >
              <Typography
                className="main-nav-text"
                sx={{
                  fontSize: '14px',
                  fontWeight: activeSection === item.id ? 600 : 500,
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: 1.4,
                  color: 'inherit',
                  transition: 'font-weight 0.2s ease'
                }}
              >
                {item.label}
              </Typography>
              
              {item.subItems.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginLeft: '8px'
                }}>
                  {expandedSections[item.id] ? (
                    <ExpandLess sx={{ 
                      fontSize: '14px',
                      color: 'inherit',
                      transition: 'transform 0.2s ease'
                    }} />
                  ) : (
                    <ExpandMore sx={{ 
                      fontSize: '14px',
                      color: 'inherit',
                      transition: 'transform 0.2s ease'
                    }} />
                  )}
                </Box>
              )}
            </Box>

            {/* Expandable Sub-items */}
            {item.subItems.length > 0 && (
              <Collapse 
                in={expandedSections[item.id]} 
                timeout={300}
                unmountOnExit
              >
                <Box sx={{ 
                  marginTop: '4px',
                  marginLeft: '12px',
                  borderLeft: '2px solid #e1e8ed',
                  paddingLeft: '0px'
                }}>
                  {item.subItems.map((subItem, index) => (
                    <Box
                      key={subItem.id}
                      onClick={() => handleSubClick(item.id, subItem.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 16px',
                        marginLeft: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: activeSubSection === subItem.id ? '#1164ad' : 'transparent',
                        color: activeSubSection === subItem.id ? 'white' : '#666',
                        transition: 'all 0.2s ease-in-out',
                        border: '1px solid transparent',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: activeSubSection === subItem.id ? '#1164ad' : '#f0f7ff',
                          borderColor: activeSubSection === subItem.id ? '#1164ad' : '#bbdefb',
                          transform: 'translateX(4px)',
                          color: activeSubSection === subItem.id ? 'white' : '#1164ad',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: '-10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '1px',
                          backgroundColor: activeSubSection === subItem.id ? '#1164ad' : '#e1e8ed',
                          transition: 'background-color 0.2s ease'
                        }
                      }}
                    >
                      
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: activeSubSection === subItem.id ? 600 : 400,
                          fontFamily: 'Arial, sans-serif',
                          lineHeight: 1.3,
                          color: 'inherit',
                        }}
                      >
                        {subItem.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </SideNav>
  );
};

export default SideNavigation;
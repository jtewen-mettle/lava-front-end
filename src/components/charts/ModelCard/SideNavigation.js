import React from 'react';
import { Box, List, ListItemText } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import {
  SideNav,
  NavItem,
  SubNavItem,
  ExpandedSubSection
} from './styles';

const SideNavigation = ({
  navigationItems,
  activeSection,
  activeSubSection,
  expandedSections,
  onNavigation,
  onExpandClick
}) => {
  const handleTextClick = (sectionId, subSectionId = null, event) => {
    event.stopPropagation();
    onNavigation(sectionId, subSectionId);
  };

  return (
    <SideNav>
      <List>
        {navigationItems.map((item) => (
          <Box key={item.id}>
            <NavItem
              active={activeSection === item.id}
              onClick={() => {
                if (item.subItems.length === 0) {
                  onNavigation(item.id);
                } else {
                  onExpandClick(item.id);
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
                      onClick={() => onNavigation(item.id, subItem.id)}
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
};

export default SideNavigation;
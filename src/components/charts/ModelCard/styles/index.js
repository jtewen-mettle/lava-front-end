import { styled } from '@mui/material/styles';
import { Box, Typography, ListItemButton } from '@mui/material';

// Navigation Styles
export const SideNav = styled(Box)(({ theme }) => ({
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

export const ExpandedSubSection = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  margin: '0px',
}));

export const NavItem = styled(ListItemButton)(({ active }) => ({
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

export const SubNavItem = styled(ListItemButton)(({ active }) => ({
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

// Layout Styles
export const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  marginLeft: '20px',
  minHeight: '600px',
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #5dade2 0%, #48a3d9 100%)',
  color: 'white',
  padding: '20px 30px',
  borderRadius: '8px 8px 0 0',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '18px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 600,
  margin: 0,
}));

export const SectionContent = styled(Box)(({ theme }) => ({
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '0 0 8px 8px',
  border: '1px solid #e1e8ed',
  borderTop: 'none',
}));

// Field Display Styles
export const FieldContainer = styled('div')(({ theme }) => ({
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

export const FieldLabel = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: '#2c3e50',
  marginBottom: '8px',
  display: 'block',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
}));

export const FieldValue = styled('div')(({ theme }) => ({
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

// Badge and Status Styles
export const StatusBadge = styled('span')(({ theme, variant }) => ({
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

export const ComplianceBadge = styled('div')(({ theme }) => ({
  display: 'inline-block',
  background: '#27ae60',
  color: 'white',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'Arial, sans-serif',
}));

// Metric Display Styles
export const MetricValue = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#5dade2',
  marginBottom: '12px',
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1,
}));

export const MetricLabel = styled('div')(({ theme }) => ({
  color: '#666',
  fontSize: '12px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  lineHeight: 1.2,
  whiteSpace: 'pre-line',
  textAlign: 'center',
}));

// Warning and Alert Box Styles
export const WarningBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff3cd',
  border: '2px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

export const CriticalBox = styled('div')(({ theme }) => ({
  backgroundColor: '#f8d7da',
  border: '2px solid #f5c6cb',
  borderRadius: '8px',
  padding: '20px',
  margin: '15px 0',
}));

export const BoxTitle = styled('h4')(({ theme }) => ({
  color: '#856404',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
}));

export const CriticalBoxTitle = styled(BoxTitle)(({ theme }) => ({
  color: '#721c24',
}));

export const BoxList = styled('ul')(({ theme }) => ({
  color: '#856404',
  marginLeft: '20px',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  '& li': {
    marginBottom: '8px',
  },
}));

export const CriticalBoxList = styled(BoxList)(({ theme }) => ({
  color: '#721c24',
}));

// Footer Styles
export const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  border: '1px solid #e1e8ed',
  borderRadius: '0 0 8px 8px',
  padding: '10px 15px',
  marginTop: '40px',
  marginBottom: '40px',
}));

export const FooterGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: {
    xs: 'column',
    md: 'row'
  },
  justifyContent: 'space-between',
  marginBottom: '10px',
}));

export const FooterContactSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  flex: 1,
  padding: '10px 15px',
  position: 'relative',
  '&:not(:last-child)': {
    borderRight: {
      xs: 'none',
      md: '1px solid #e1e8ed'
    },
    borderBottom: {
      xs: '1px solid #e1e8ed',
      md: 'none'
    }
  }
}));

export const FooterContactTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#666',
  marginBottom: '12px',
  fontFamily: 'Arial, sans-serif',
}));

export const FooterContactInfo = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#333',
  lineHeight: 1.5,
  fontFamily: 'Arial, sans-serif',
  whiteSpace: 'pre-line',
}));

export const FooterDivider = styled(Box)(({ theme }) => ({
  height: '1px',
  backgroundColor: '#e1e8ed',
  margin: '20px 0',
}));

export const FooterMetaInfo = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666',
  textAlign: 'center',
  lineHeight: 1.6,
  fontFamily: 'Arial, sans-serif',
}));

// Fairness Development Process Styles
export const FairnessContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#e8f5e8',
  border: '2px solid #c8e6c9',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}));

export const FairnessTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2e7d32',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'Arial, sans-serif',
}));

export const FairnessSubsection = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '6px',
  padding: '15px',
  marginBottom: '15px',
  border: '1px solid #e0e0e0',
  '&:last-child': {
    marginBottom: 0,
  }
}));

export const FairnessSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '8px',
  fontFamily: 'Arial, sans-serif',
}));

export const FairnessText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#555',
  lineHeight: 1.5,
  fontFamily: 'Arial, sans-serif',
}));
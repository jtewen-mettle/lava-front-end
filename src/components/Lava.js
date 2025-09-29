import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SelectionPage from './SelectionPage';
import CKDPrediction from './topics/CKDPrediction';
import HospitalizationRiskPrediction from './topics/HospitalizationRiskPrediction';
import CardioVascularPrediction from './topics/CardioVascularPrediction';
import GlossaryPage from './GlossaryPage';
import * as tf from '@tensorflow/tfjs';
import * as sk from 'scikitjs';
import { useAppContext } from '../context/AppContext';
import ProstateCancerPrediction from './topics/ProstateCancerPrediciton';
import HeartFailurePrediction from './topics/HeartFailurePrediction';

const Lava = () => {
  //const [selection, setSelection] = useState(null);
  const {activePage, setActivePage, selection, setSelection, glossarySection, navigateToGlossaryHome} = useAppContext();
  const [ready, setReady] = useState(false);


  useEffect(() => {
    async function initScikit() {
      sk.setBackend(tf); 
      setReady(true); 
    }
    initScikit();
  }, []);

  if (!ready) return <div>Loading ML backend...</div>;

  const renderTopicComponent = () => {
    console.log("renderTopicComponent called");
    console.log(selection);
    setActivePage("ModelAnalysis");
    switch (selection.topic) {
      case 'CKD':
        console.log("CKD Prediction selected");
        return <CKDPrediction />;
      case 'CardioVascularPrediction':
        return <CardioVascularPrediction />;
      case 'ProstateCancerPrediction':
        return <ProstateCancerPrediction />;
      case 'HospitalizationRisk':
        return <HospitalizationRiskPrediction />;
      case 'HeartFailurePrediction':
        return <HeartFailurePrediction />;
      default:
        return <div>Coming Soon...</div>;
    }
  };

  const renderContent = () => {
    if (activePage === 'Dashboard') {
      return !selection ? (
        <SelectionPage onSubmit={setSelection} />
      ) : (
        renderTopicComponent()
      );
    } else if (activePage === 'ModelAnalysis') {
      return !selection ? (
        <SelectionPage onSubmit={setSelection} />
      ) : (
        renderTopicComponent()
      );
    } else if (activePage === 'Glossary') {
      return <GlossaryPage initialSection={glossarySection} />;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '100vw', 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      margin: 0,
      padding: 0
    }}>
      {/* Top Menu Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#275786',
          boxShadow: '0 4px 12px rgba(39, 87, 134, 0.3)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, #275786 0%, #1e4a6f 100%)',
          width: '100%',
          padding: '6px 0',
          boxSizing: 'border-box'
        }}
      >
        <Box 
          sx={{ 
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            px: { xs: 2, sm: 3, md: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '64px'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              color: '#fff',
              flexShrink: 0
            }}
          >
            {/* Responsive text for Lava application title */}
            <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
              LAVA (Local AI Evaluator)
            </Box>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'none' } }}>
              LAVA (Local AI Evaluator)
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none', md: 'none' } }}>
              LAVA
            </Box>
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 1.5 },
              flexShrink: 0,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              justifyContent: 'flex-end',
              marginRight: { xs: '26px', sm: '26px', md: '26px' }
            }}
          >
            <Button
              color="inherit"
              sx={{
                backgroundColor: activePage === 'Dashboard' ? '#1164ad' : 'transparent', 
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '12px',
                padding: { xs: '6px 12px', sm: '8px 16px', md: '8px 24px' },
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'auto', md: 'auto' },
                border: activePage === 'Dashboard' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: activePage === 'Dashboard' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: activePage === 'Dashboard' ? '#1164ad' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}
              onClick={() => {
                setSelection(null);
                setActivePage('Dashboard');
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              sx={{
                backgroundColor: activePage === 'ModelAnalysis' ? '#1164ad' : 'transparent', 
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '12px',
                padding: { xs: '6px 8px', sm: '8px 12px', md: '8px 16px' },
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'auto', md: 'auto' },
                border: activePage === 'ModelAnalysis' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: activePage === 'ModelAnalysis' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: activePage === 'ModelAnalysis' ? '#1164ad' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}
              onClick={() => setActivePage('ModelAnalysis')}
            >
              {/* Responsive text for Topic Dashboard */}
              <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
                Topic Dashboard
              </Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'none' } }}>
              Dashboard
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none', md: 'none' } }}>
              Dashboard
              </Box>
            </Button>
            <Button
              color="inherit"
              sx={{
                backgroundColor: activePage === 'Glossary' ? '#1164ad' : 'transparent', 
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '12px',
                padding: { xs: '6px 12px', sm: '8px 16px', md: '8px 24px' },
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'auto', md: 'auto' },
                border: activePage === 'Glossary' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: activePage === 'Glossary' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: activePage === 'Glossary' ? '#1164ad' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}
              onClick={() => navigateToGlossaryHome(activePage)}
            >
              Glossary
            </Button>
          </Box>
        </Box>
      </AppBar>

      {/* Main Content */}
      <Box 
        sx={{ 
          mt: '80px', 
          width: '100%', 
          maxWidth: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {renderContent()}
      </Box>
    </div>
  );
};

export default Lava;
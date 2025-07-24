import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SelectionPage from './SelectionPage';
import CKDPrediction from './topics/CKDPrediction';
import HospitalizationRiskPrediction from './topics/HospitalizationRiskPrediction';
import CardioVascularPrediction from './topics/CardioVascularPrediction';
import * as tf from '@tensorflow/tfjs';
import * as sk from 'scikitjs';
import { useAppContext } from '../context/AppContext';
import ProstateCancerPrediction from './topics/ProstateCancerPrediciton';

const Lava = () => {
  //const [selection, setSelection] = useState(null);
  const {activePage, setActivePage,selection,setSelection} = useAppContext();
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
    } else if (activePage === 'Settings') {
      return <div>Settings Page Coming Soon...</div>;
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
        position="static" 
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
        <Toolbar 
          sx={{ 
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            paddingLeft: { xs: 2, sm: 3, md: 3 },
            paddingRight: { xs: 2, sm: 3, md: 3 }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              textAlign: 'left',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            Lava Application
          </Typography>
          <Box>
          <Button
            color="inherit"
            sx={{
              backgroundColor: activePage === 'Dashboard' ? '#1164ad' : 'transparent', 
              color: activePage === 'Dashboard' ? '#fff' : '#fff',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              margin: '0 4px',
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
              color: activePage === 'ModelAnalysis' ? '#fff' : '#fff',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              margin: '0 4px',
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
            Topic Dashboard
          </Button>
          <Button
            color="inherit"
            sx={{
              backgroundColor: activePage === 'Settings' ? '#1164ad' : 'transparent', 
              color: activePage === 'Settings' ? '#fff' : '#fff',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              margin: '0 4px',
              border: activePage === 'Settings' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: activePage === 'Settings' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: activePage === 'Settings' ? '#1164ad' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-1px)'
              }
            }}
            onClick={() => setActivePage('Settings')}
          >
            Settings
          </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box 
        sx={{ 
          mt: 2, 
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
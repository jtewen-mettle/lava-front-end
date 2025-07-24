import React, { useState } from 'react';
import { Box, Typography, MenuItem, FormControl, Select, Button } from '@mui/material';
import LavaLogo from './LavaLogo';

const SelectionPage = ({ onSubmit }) => {
  const [vendor, setVendor] = useState('');
  const [topic, setTopic] = useState('');

  const handleVendorChange = (e) => {
    const selectedVendor = e.target.value;
    setVendor(selectedVendor);
    setTopic(''); // Reset topic when vendor changes
  };

  const handleSubmit = () => {
    if (vendor && topic) {
      onSubmit({ vendor, topic });
    }
  };

  // Define available topics based on vendor
  const getTopicsForVendor = () => {
    if (vendor === 'Vendor1') {
      return [
        { value: 'CardioVascularPrediction', label: 'CardioVascular Predictor Evaluation' },
      ];
    } else if (vendor === 'Vendor2') {
      return [
        { value: 'CKD', label: 'Kidney Failure Estimator' },
        { value: 'ProstateCancerPrediction', label: 'ProstateCancer Predictor Evaluation' },
      ];
    }
    return [];
  };

  const availableTopics = getTopicsForVendor();

  return (
    <Box 
      p={4} 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      gap={4}
      sx={{
        minHeight: '60vh',
        backgroundColor: 'transparent',
        margin: '20px',
        marginTop: '40px'
      }}
    >
      <LavaLogo />

      <Box 
        sx={{ 
          width: '100%', 
          maxWidth: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              color: '#275786',
              marginBottom: '12px'
            }}
          >
            Pick a DSI Application
          </Typography>
          <Select 
            value={vendor} 
            onChange={handleVendorChange} 
            displayEmpty
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#275786',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#275786',
              }
            }}
          >
            <MenuItem value="">Select a vendor</MenuItem>
            <MenuItem value="Vendor1">Cerner</MenuItem>
            <MenuItem value="Vendor2">DSI Vendor2</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!vendor} sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              color: vendor ? '#275786' : '#999',
              marginBottom: '12px'
            }}
          >
            Pick a Topic
          </Typography>
          <Select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            displayEmpty
            sx={{
              borderRadius: '8px',
              backgroundColor: vendor ? '#fff' : '#f5f5f5',
              boxShadow: vendor ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: vendor ? '#275786' : '#e0e0e0',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#275786',
              }
            }}
          >
            <MenuItem value="">Select a topic</MenuItem>
            {availableTopics.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={!vendor || !topic}
            sx={{
              backgroundColor: '#275786',
              padding: '12px 32px',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(39, 87, 134, 0.3)',
              '&:hover': {
                backgroundColor: '#1164ad',
                boxShadow: '0 6px 20px rgba(39, 87, 134, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                boxShadow: 'none'
              },
              transition: 'all 0.3s ease'
            }}
          >
            →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectionPage;

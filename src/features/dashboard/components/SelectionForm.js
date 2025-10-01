import React, { useState } from 'react';
import { Box, Typography, MenuItem, FormControl, Select, Button } from '@mui/material';
import { Logo } from '../../../shared/ui';
import { getEnabledToolsForCategory, getActiveDiseaseCategories } from '../../../config/toolsConfig';

const SelectionForm = ({ onSubmit }) => {
  const [diseaseCategory, setDiseaseCategory] = useState('');
  const [topic, setTopic] = useState('');

  const handleDiseaseCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setDiseaseCategory(selectedCategory);
    setTopic(''); // Reset topic when category changes
  };

  const handleSubmit = () => {
    if (diseaseCategory && topic) {
      onSubmit({ diseaseCategory, topic });
    }
  };

  // Get enabled DSI tools for the selected disease category from config
  const availableTopics = diseaseCategory ? getEnabledToolsForCategory(diseaseCategory) : [];

  // Get only disease categories that have enabled tools
  const activeDiseaseCategories = getActiveDiseaseCategories();

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      sx={{
        minHeight: '80vh',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        mx: 'auto',
        maxWidth: '1400px',
        px: { xs: 2, sm: 3, md: 3 },
        py: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Logo size="large" />

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#333',
            mb: 2
          }}
        >
          Local AI Evaluator
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#666',
            fontSize: '1.1rem'
          }}
        >
          Securely evaluate your clinical decision support systems
        </Typography>
      </Box>

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
            Pick a Disease Category
          </Typography>
          <Select
            value={diseaseCategory}
            onChange={handleDiseaseCategoryChange}
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
            <MenuItem value="">Select a disease category</MenuItem>
            {activeDiseaseCategories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!diseaseCategory} sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              color: diseaseCategory ? '#275786' : '#999',
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
              backgroundColor: diseaseCategory ? '#fff' : '#f5f5f5',
              boxShadow: diseaseCategory ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: diseaseCategory ? '#275786' : '#e0e0e0',
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
            disabled={!diseaseCategory || !topic}
            sx={{
              backgroundColor: '#275786',
              padding: '12px 32px',
              borderRadius: '25px',
              fontSize: '16px',
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
            Begin Analysis →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectionForm;
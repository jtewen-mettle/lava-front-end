import React from 'react';
import { FormControl, Select as MuiSelect, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { tokens } from '../../../core/theme';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  required = false,
  size = 'medium',
  sx = {},
  ...props
}) => {
  const selectStyles = {
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: disabled ? tokens.colors.neutral[50] : tokens.colors.background.primary,
    boxShadow: disabled ? 'none' : tokens.boxShadow.sm,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? tokens.colors.semantic.error : tokens.colors.neutral[200],
      transition: `border-color ${tokens.transition.duration[200]} ${tokens.transition.easing.out}`
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: error 
        ? tokens.colors.semantic.error 
        : disabled 
        ? tokens.colors.neutral[200] 
        : tokens.colors.primary[600]
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? tokens.colors.semantic.error : tokens.colors.primary[600],
      borderWidth: '2px'
    },
    '& .MuiSelect-select': {
      padding: size === 'small' 
        ? `${tokens.spacing[2]} ${tokens.spacing[3]}`
        : `${tokens.spacing[3]} ${tokens.spacing[4]}`
    },
    ...sx
  };

  const labelStyles = {
    color: error ? tokens.colors.semantic.error : tokens.colors.neutral[600],
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    '&.Mui-focused': {
      color: error ? tokens.colors.semantic.error : tokens.colors.primary[600]
    }
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      disabled={disabled}
      error={error}
      required={required}
      size={size}
    >
      {label && (
        <InputLabel sx={labelStyles}>
          {label}
        </InputLabel>
      )}
      
      <MuiSelect
        value={value}
        onChange={onChange}
        displayEmpty={!!placeholder}
        sx={selectStyles}
        label={label}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <span style={{ color: tokens.colors.neutral[400] }}>
              {placeholder}
            </span>
          </MenuItem>
        )}
        
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            sx={{
              fontSize: tokens.typography.fontSize.sm,
              fontFamily: tokens.typography.fontFamily.primary,
              '&:hover': {
                backgroundColor: tokens.colors.primary[50]
              },
              '&.Mui-selected': {
                backgroundColor: tokens.colors.primary[100],
                '&:hover': {
                  backgroundColor: tokens.colors.primary[200]
                }
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      
      {helperText && (
        <FormHelperText 
          sx={{
            fontSize: tokens.typography.fontSize.xs,
            marginTop: tokens.spacing[1],
            color: error ? tokens.colors.semantic.error : tokens.colors.neutral[500]
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;
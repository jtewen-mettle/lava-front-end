export const parseCSVRow = (row) => {
  if (!Array.isArray(row)) return {};
  
  const headers = [
    'Patient_ID', 'FirstName', 'LastName', 'Birthdate', 'Age',
    'eGFR', 'uACR_log', 'SerumAlbumin', 'SerumPhosphorous', 'SerumCalcium',
    'SerumBicarbonate', 'Actual_Outcome', 'BloodCreatinine', 'UrineProtein',
    'UltrasoundResult', 'Unnamed: 15', 'Predicted_Outcome', 'Gender', 'Race'
  ];
  
  const result = {};
  headers.forEach((header, index) => {
    result[header] = row[index] || '';
  });
  
  return result;
};

export const validateNumericValue = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const formatPercentage = (value, decimals = 1) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.0%';
  return `${(num * 100).toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 2) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  return num.toFixed(decimals);
};

export const calculateAge = (birthdate) => {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return direction === 'asc' ? numA - numB : numB - numA;
    }
    
    return 0;
  });
};

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (filterValue === null || filterValue === undefined || filterValue === '') {
        return true;
      }
      
      const itemValue = item[key];
      
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }
      
      if (typeof filterValue === 'string') {
        return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      
      return itemValue === filterValue;
    });
  });
};

export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]))].filter(Boolean);
};

export const calculateStats = (array, key) => {
  const values = array.map(item => parseFloat(item[key])).filter(val => !isNaN(val));
  
  if (values.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      std: 0
    };
  }
  
  const sorted = values.sort((a, b) => a - b);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  const median = values.length % 2 === 0
    ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
    : sorted[Math.floor(values.length / 2)];
  
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);
  
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    mean,
    median,
    std
  };
};
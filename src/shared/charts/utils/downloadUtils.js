import jsPDF from 'jspdf';

export const downloadChartAsImage = (chartElement, filename, format = 'png', quality = 1.0) => {
  if (!chartElement) {
    console.error('Chart element not found');
    return;
  }

  const canvas = chartElement.querySelector('canvas');
  if (!canvas) {
    console.error('Canvas element not found in chart');
    return;
  }

  const link = document.createElement('a');
  
  switch (format.toLowerCase()) {
    case 'png':
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}.png`;
      break;
    
    case 'jpg':
    case 'jpeg':
      link.href = canvas.toDataURL('image/jpeg', quality);
      link.download = `${filename}.jpg`;
      break;
    
    case 'svg':
      // For SVG, we need to convert the canvas to SVG
      // This is a simplified implementation - for full SVG support,
      // you might want to use a library like Chart.js SVG renderer
      const svgData = canvasToSVG(canvas);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(svgBlob);
      link.download = `${filename}.svg`;
      break;
    
    case 'pdf':
      downloadChartAsPDF(canvas, filename);
      return;
    
    default:
      console.error(`Unsupported format: ${format}`);
      return;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadChartAsPDF = (canvas, filename) => {
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
};

export const downloadChartData = (data, filename, format = 'csv') => {
  if (!data) {
    console.error('No data provided');
    return;
  }

  let content = '';
  let mimeType = '';
  let fileExtension = '';

  switch (format.toLowerCase()) {
    case 'csv':
      content = convertToCSV(data);
      mimeType = 'text/csv';
      fileExtension = 'csv';
      break;
    
    case 'json':
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
      break;
    
    case 'tsv':
      content = convertToTSV(data);
      mimeType = 'text/tab-separated-values';
      fileExtension = 'tsv';
      break;
    
    default:
      console.error(`Unsupported data format: ${format}`);
      return;
  }

  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.${fileExtension}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};

const convertToCSV = (data) => {
  if (!data.labels || !data.datasets) {
    return '';
  }

  const headers = ['Label', ...data.datasets.map(dataset => dataset.label || 'Data')];
  const rows = data.labels.map((label, index) => [
    label,
    ...data.datasets.map(dataset => dataset.data[index] || '')
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
};

const convertToTSV = (data) => {
  if (!data.labels || !data.datasets) {
    return '';
  }

  const headers = ['Label', ...data.datasets.map(dataset => dataset.label || 'Data')];
  const rows = data.labels.map((label, index) => [
    label,
    ...data.datasets.map(dataset => dataset.data[index] || '')
  ]);

  const tsvContent = [headers, ...rows]
    .map(row => row.join('\t'))
    .join('\n');

  return tsvContent;
};

const canvasToSVG = (canvas) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // This is a simplified conversion - for production use,
  // consider using a proper canvas-to-SVG library
  const svgData = `
    <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <img src="${canvas.toDataURL('image/png')}" width="100%" height="100%" />
      </foreignObject>
    </svg>
  `;

  return svgData;
};

// Utility to create a filename with timestamp
export const createTimestampedFilename = (baseName) => {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19); // Remove milliseconds and timezone
  
  return `${baseName}_${timestamp}`;
};

// Utility to validate and sanitize filename
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9_\-]/gi, '_') // Replace non-alphanumeric chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};
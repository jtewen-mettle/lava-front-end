/**
 * Chart Download Utilities
 * Comprehensive download functionality for all chart types with proper format handling,
 * backgrounds, titles, tooltips, and PDF generation.
 */

// Import jsPDF for PDF generation
import jsPDF from 'jspdf';

/**
 * Download a chart with proper format handling and title inclusion
 * @param {Object} params - Download parameters
 * @param {HTMLElement|HTMLCanvasElement} params.chartElement - Chart element (canvas or SVG container)
 * @param {string} params.format - Download format ('png', 'jpg', 'jpeg', 'pdf', 'svg')
 * @param {string} params.fileName - Base filename without extension
 * @param {string} params.title - Chart title to include in the download
 * @param {string} params.chartType - Type of chart ('canvas' for Chart.js, 'svg' for Recharts)
 * @param {Object} params.tooltipData - Optional tooltip data to include in the download
 * @param {Object} params.legendData - Color legend/guide data to include
 */
export const downloadChart = async ({
  chartElement,
  format,
  fileName,
  title,
  chartType = 'svg',
  tooltipData = null,
  legendData = null
}) => {
  if (!chartElement) {
    console.error('Chart element not found');
    return;
  }

  try {
    if (format === 'svg') {
      // Handle SVG download directly
      if (chartType === 'svg') {
        const svgElement = chartElement.querySelector ? chartElement.querySelector('svg') : chartElement;
        await downloadAsSVG(svgElement, fileName, title, tooltipData, legendData);
      } else {
        console.error('SVG format not supported for canvas charts');
      }
      return;
    }

    // For other formats, convert to canvas first
    let canvas;
    if (chartType === 'canvas') {
      // For Chart.js charts (already canvas)
      canvas = await convertCanvasToCanvasWithExtras(chartElement, title, tooltipData, legendData);
    } else {
      // For SVG charts (Recharts)
      const svgElement = chartElement.querySelector ? chartElement.querySelector('svg') : chartElement;
      canvas = await convertSvgToCanvas(svgElement, title, tooltipData, legendData);
    }

    if (!canvas) {
      console.error('Failed to create canvas');
      return;
    }

    if (format === 'pdf') {
      // Create actual PDF file
      await downloadAsPDF(canvas, fileName, title);
    } else {
      // Handle image formats
      let mimeType = 'image/png';
      let fileExtension = 'png';
      
      if (format === 'jpg' || format === 'jpeg') {
        mimeType = 'image/jpeg';
        fileExtension = 'jpg';
      }

      // Create download link
      const dataUrl = canvas.toDataURL(mimeType, 0.95); // High quality
      const link = document.createElement('a');
      link.download = `${fileName}.${fileExtension}`;
      link.href = dataUrl;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
  } catch (error) {
    console.error('Download failed:', error);
  }
};

/**
 * Download SVG with enhanced title, tooltip and legend
 * @param {SVGElement} svgElement - SVG element to download
 * @param {string} fileName - File name without extension
 * @param {string} title - Chart title
 * @param {Object} tooltipData - Tooltip data
 * @param {Object} legendData - Legend data
 */
const downloadAsSVG = async (svgElement, fileName, title, tooltipData, legendData) => {
  const svgClone = svgElement.cloneNode(true);
  const svgRect = svgElement.getBoundingClientRect();
  
  // Calculate dimensions for enhanced SVG
  const titleHeight = title ? 60 : 20;
  const tooltipHeight = tooltipData ? 40 : 0;
  const legendHeight = legendData ? (legendData.length * 25 + 20) : 0;
  const padding = 20;
  
  const newWidth = svgRect.width + (padding * 2);
  const newHeight = svgRect.height + titleHeight + tooltipHeight + legendHeight + (padding * 2);
  
  // Create new SVG with enhanced content
  const enhancedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  enhancedSvg.setAttribute('width', newWidth);
  enhancedSvg.setAttribute('height', newHeight);
  enhancedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Add white background
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', '100%');
  background.setAttribute('height', '100%');
  background.setAttribute('fill', 'white');
  enhancedSvg.appendChild(background);
  
  // Add title
  if (title) {
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleText.setAttribute('x', newWidth / 2);
    titleText.setAttribute('y', padding + 25);
    titleText.setAttribute('text-anchor', 'middle');
    titleText.setAttribute('font-family', 'Arial, sans-serif');
    titleText.setAttribute('font-size', '18');
    titleText.setAttribute('font-weight', 'bold');
    titleText.setAttribute('fill', '#333');
    titleText.textContent = title;
    enhancedSvg.appendChild(titleText);
  }
  
  // Add original chart with proper positioning
  const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  chartGroup.setAttribute('transform', `translate(${padding}, ${titleHeight + padding})`);
  
  // Copy all child elements from original SVG
  while (svgClone.firstChild) {
    chartGroup.appendChild(svgClone.firstChild);
  }
  enhancedSvg.appendChild(chartGroup);
  
  // Add legend if provided
  if (legendData && legendData.length > 0) {
    const legendY = titleHeight + padding + svgRect.height + 20;
    legendData.forEach((item, index) => {
      const legendItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Color square
      const colorRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      colorRect.setAttribute('x', padding);
      colorRect.setAttribute('y', legendY + (index * 25));
      colorRect.setAttribute('width', '15');
      colorRect.setAttribute('height', '15');
      colorRect.setAttribute('fill', item.color);
      legendItem.appendChild(colorRect);
      
      // Label text
      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', padding + 25);
      labelText.setAttribute('y', legendY + (index * 25) + 12);
      labelText.setAttribute('font-family', 'Arial, sans-serif');
      labelText.setAttribute('font-size', '14');
      labelText.setAttribute('fill', '#333');
      labelText.textContent = item.label;
      legendItem.appendChild(labelText);
      
      enhancedSvg.appendChild(legendItem);
    });
  }
  
  // Add tooltip info
  if (tooltipData) {
    const tooltipY = titleHeight + padding + svgRect.height + legendHeight + 25;
    const tooltipText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tooltipText.setAttribute('x', padding);
    tooltipText.setAttribute('y', tooltipY);
    tooltipText.setAttribute('font-family', 'Arial, sans-serif');
    tooltipText.setAttribute('font-size', '14');
    tooltipText.setAttribute('fill', '#666');
    tooltipText.textContent = `${tooltipData.label}: ${tooltipData.value}`;
    enhancedSvg.appendChild(tooltipText);
  }
  
  // Download the enhanced SVG
  const svgData = new XMLSerializer().serializeToString(enhancedSvg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  const link = document.createElement('a');
  link.download = `${fileName}.svg`;
  link.href = url;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Download canvas as PDF
 * @param {HTMLCanvasElement} canvas - Canvas to convert to PDF
 * @param {string} fileName - File name without extension
 * @param {string} title - Chart title
 */
const downloadAsPDF = async (canvas, fileName, title) => {
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  // Add the canvas image to PDF
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  
  // Save the PDF
  pdf.save(`${fileName}.pdf`);
};

/**
 * Convert canvas to canvas with extras (title, tooltips, legend)
 * @param {HTMLCanvasElement} originalCanvas - Original canvas
 * @param {string} title - Chart title
 * @param {Object} tooltipData - Tooltip data to include
 * @param {Array} legendData - Legend data to include
 * @returns {HTMLCanvasElement} Enhanced canvas
 */
const convertCanvasToCanvasWithExtras = async (originalCanvas, title, tooltipData, legendData) => {
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d');
  
  const titleHeight = title ? 60 : 20;
  const tooltipHeight = tooltipData ? 40 : 0;
  const legendHeight = legendData ? (legendData.length * 25 + 20) : 0;
  const padding = 20;
  
  newCanvas.width = originalCanvas.width + (padding * 2);
  newCanvas.height = originalCanvas.height + titleHeight + tooltipHeight + legendHeight + (padding * 2);
  
  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
  
  // Add title
  if (title) {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, newCanvas.width / 2, padding + 25);
  }
  
  // Draw original chart
  ctx.drawImage(originalCanvas, padding, titleHeight + padding);
  
  // Add legend if provided
  if (legendData && legendData.length > 0) {
    const legendY = titleHeight + padding + originalCanvas.height + 20;
    legendData.forEach((item, index) => {
      // Draw color square
      ctx.fillStyle = item.color;
      ctx.fillRect(padding, legendY + (index * 25), 15, 15);
      
      // Draw label text
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, padding + 25, legendY + (index * 25) + 12);
    });
  }
  
  // Add tooltip information if provided
  if (tooltipData) {
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'left';
    const tooltipY = titleHeight + padding + originalCanvas.height + legendHeight + 25;
    ctx.fillText(`${tooltipData.label || ''}: ${tooltipData.value || ''}`, padding, tooltipY);
  }
  
  return newCanvas;
};

/**
 * Convert SVG to Canvas with title, tooltips, legend and proper background
 * @param {SVGElement} svgElement - SVG element to convert
 * @param {string} title - Chart title
 * @param {Object} tooltipData - Tooltip data to include
 * @param {Array} legendData - Legend data to include
 * @returns {Promise<HTMLCanvasElement>} Canvas element
 */
const convertSvgToCanvas = (svgElement, title, tooltipData, legendData) => {
  return new Promise((resolve, reject) => {
    if (!svgElement) {
      reject(new Error('SVG element not found'));
      return;
    }

    // Get SVG dimensions
    const svgRect = svgElement.getBoundingClientRect();
    const svgWidth = svgRect.width || 800;
    const svgHeight = svgRect.height || 400;
    
    // Create canvas with extra space for title, tooltips and legend
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const titleHeight = title ? 60 : 20;
    const tooltipHeight = tooltipData ? 40 : 0;
    const legendHeight = legendData ? (legendData.length * 25 + 20) : 0;
    const padding = 20;
    
    canvas.width = svgWidth + (padding * 2);
    canvas.height = svgHeight + titleHeight + tooltipHeight + legendHeight + (padding * 2);
    
    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add title if provided
    if (title) {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, padding + 25);
    }
    
    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      try {
        // Draw the chart image on canvas
        ctx.drawImage(img, padding, titleHeight + padding, svgWidth, svgHeight);
        
        // Add legend if provided
        if (legendData && legendData.length > 0) {
          const legendY = titleHeight + padding + svgHeight + 20;
          legendData.forEach((item, index) => {
            // Draw color square
            ctx.fillStyle = item.color;
            ctx.fillRect(padding, legendY + (index * 25), 15, 15);
            
            // Draw label text
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, padding + 25, legendY + (index * 25) + 12);
          });
        }
        
        // Add tooltip information if provided
        if (tooltipData) {
          ctx.fillStyle = '#666';
          ctx.font = '14px Arial, sans-serif';
          ctx.textAlign = 'left';
          const tooltipY = titleHeight + padding + svgHeight + legendHeight + 25;
          ctx.fillText(`${tooltipData.label || ''}: ${tooltipData.value || ''}`, padding, tooltipY);
        }
        
        URL.revokeObjectURL(url);
        resolve(canvas);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    
    img.src = url;
  });
};

/**
 * Download Chart.js canvas with title, tooltips and legend
 * @param {HTMLCanvasElement} canvasElement - Chart.js canvas
 * @param {string} format - Download format
 * @param {string} fileName - Base filename
 * @param {string} title - Chart title
 * @param {Object} tooltipData - Optional tooltip data
 * @param {Array} legendData - Optional legend data
 */
export const downloadCanvasChart = async (canvasElement, format, fileName, title, tooltipData = null, legendData = null) => {
  if (!canvasElement) {
    console.error('Canvas element not found');
    return;
  }

  try {
    await downloadChart({
      chartElement: canvasElement,
      format,
      fileName,
      title,
      chartType: 'canvas',
      tooltipData,
      legendData
    });
  } catch (error) {
    console.error('Canvas chart download failed:', error);
  }
};
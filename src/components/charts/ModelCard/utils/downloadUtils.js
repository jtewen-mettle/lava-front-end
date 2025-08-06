// Download utilities for Model Card sections

export const sectionTitles = {
  'intervention-details': '1. Intervention Details and Output',
  'purpose-intervention': '2. Purpose of Intervention',
  'cautioned-use': '3. Cautioned Out-of-Scope Use',
  'development-details': '4. Development Details and Input Features',
  'external-validation': '5. External Validation Process',
  'performance-measures': '6. Quantitative Performance Measures',
  'maintenance-monitoring': '7. Ongoing Maintenance & Monitoring',
  'evidence-base': '8. Evidence Base & Clinical Guidelines',
  'technical-implementation': '9. Technical Implementation Details'
};

export const downloadCurrentSection = (activeSection, data) => {
  if (!activeSection) {
    alert('Please select a section to download');
    return;
  }

  const sectionTitle = sectionTitles[activeSection] || 'Model Card Section';
  
  // Get the actual rendered content
  const contentElement = document.querySelector('[data-section-content]');
  let contentHtml = '';
  
  if (contentElement) {
    contentHtml = contentElement.innerHTML;
  } else {
    contentHtml = '<p>Section content not available for download.</p>';
  }
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${sectionTitle} - ${data.interventionName || 'Healthcare AI Model'}</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333; 
          line-height: 1.6; 
          max-width: 1200px;
        }
        .section-title { 
          color: #275786; 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 30px; 
          padding-bottom: 10px;
          border-bottom: 2px solid #275786;
        }
        .field-container {
          background-color: white;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e1e8ed;
          margin-bottom: 15px;
        }
        .field-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .field-value {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e1e8ed;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .certified { background-color: #2ecc71; }
        .warning { background-color: #f39c12; }
        .validated { background-color: #9b59b6; }
        .monitored { background-color: #5dade2; }
      </style>
    </head>
    <body>
      <h1 class="section-title">${sectionTitle}</h1>
      <div class="content">
        ${contentHtml}
      </div>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        Generated on ${new Date().toLocaleDateString()} | ${data.interventionName || 'Healthcare AI Model'}
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// Helper function to render full section content for download
export const renderFullSectionContent = (sectionId, data) => {
  switch (sectionId) {
    case 'intervention-details':
      return `
        <div class="field-container">
          <div class="field-label">Intervention Name</div>
          <div class="field-value">${data.interventionName || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Developer Name & Contact</div>
          <div class="field-value">${data.developerContact || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Funding Source</div>
          <div class="field-value">${data.fundingSource || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Value Produced as Output</div>
          <div class="field-value">${data.valueOutput || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Output Type</div>
          <div class="field-value"><span class="status-badge validated">${data.outputType || 'N/A'}</span></div>
        </div>
      `;
    case 'purpose-intervention':
      return `
        <div class="field-container">
          <div class="field-label">Intended Use</div>
          <div class="field-value">${data.intendedUse || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Intended Patient Population</div>
          <div class="field-value">${data.intendedPatientPopulation || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Intended Users</div>
          <div class="field-value">${data.intendedUsers || 'N/A'}</div>
        </div>
        <div class="field-container">
          <div class="field-label">Decision-Making Role</div>
          <div class="field-value">
            <span class="status-badge monitored">${data.decisionMakingRole || 'N/A'}</span><br>
            ${data.decisionMakingDesc || ''}
          </div>
        </div>
      `;
    default:
      return '<p>Section content available in application.</p>';
  }
};

export const downloadFullCard = (data, navigationItems) => {
  // Generate full model card content by combining all sections
  const allSections = navigationItems.map(section => {
    const sectionData = renderFullSectionContent(section.id, data);
    return `
      <div class="section">
        <h2 class="section-title">${section.label}</h2>
        <div class="section-content">
          ${sectionData}
        </div>
      </div>
    `;
  }).join('');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Complete Model Card - ${data.interventionName || 'Healthcare AI Model'}</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333; 
          line-height: 1.6; 
          max-width: 1200px;
        }
        .main-title {
          color: #275786;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 40px;
          text-align: center;
          padding-bottom: 15px;
          border-bottom: 3px solid #275786;
        }
        .section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .section-title { 
          color: #275786; 
          font-size: 20px; 
          font-weight: bold; 
          margin-bottom: 20px; 
          padding-bottom: 8px;
          border-bottom: 1px solid #275786;
        }
        .field-container {
          background-color: white;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e1e8ed;
          margin-bottom: 15px;
        }
        .field-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .field-value {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e1e8ed;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .certified { background-color: #2ecc71; }
        .warning { background-color: #f39c12; }
        .validated { background-color: #9b59b6; }
        .monitored { background-color: #5dade2; }
        @media print {
          .section { page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      <h1 class="main-title">ONC HTI-1 Compliant Model Card</h1>
      <p style="text-align: center; margin-bottom: 40px; font-size: 18px; color: #666;">
        ${data.interventionName || 'Healthcare AI Model'} - Complete Documentation
      </p>
      ${allSections}
      <div style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #666;">
        Generated on ${new Date().toLocaleDateString()} | ${data.interventionName || 'Healthcare AI Model'} | Model Card Version ${data.modelCardVersion || '1.0'}
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
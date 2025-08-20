// Enhanced Download utilities for Model Card sections - Captures actual rendered content

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

// Function to get comprehensive content for each section - using data-based approach for reliability
const getEnhancedSectionContent = (sectionId, data) => {
  // Use data-based content generation for reliability and consistency
  return getComprehensiveDataContent(sectionId, data);
};

// Comprehensive data-based content generation with ALL available fields
const getComprehensiveDataContent = (sectionId, data) => {
  switch (sectionId) {
    case 'intervention-details':
      return `
        <div class="section-content">
          <h3>1. Intervention Details and Output</h3>
          <div class="info-grid">
            <p><strong>Intervention Name:</strong> ${data.interventionName || 'Not specified'}</p>
            <p><strong>Developer Name:</strong> ${data.developerName || 'Not specified'}</p>
            <p><strong>Developer Contact:</strong></p>
            <div class="contact-info">${(data.developerContact || 'Not specified').replace(/\n/g, '<br>')}</div>
            <p><strong>Funding Source:</strong> ${data.fundingSource || 'Not specified'}</p>
            <p><strong>Value Produced as Output:</strong> ${data.valueOutput || 'Not specified'}</p>
            <p><strong>Output Type:</strong> ${data.outputType || 'Not specified'}</p>
            ${data.complianceBadge ? `<div class="compliance-badge">${data.complianceBadge}</div>` : ''}
          </div>
        </div>
      `;

    case 'purpose-intervention':
      return `
        <div class="section-content">
          <h3>2. Purpose of Intervention</h3>
          <div class="purpose-details">
            <p><strong>Intended Use:</strong> ${data.intendedUse || 'Not specified'}</p>
            <p><strong>Intended Patient Population:</strong> ${data.intendedPatientPopulation || 'Not specified'}</p>
            <p><strong>Intended Users:</strong> ${data.intendedUsers || 'Not specified'}</p>
            <p><strong>Decision-Making Role:</strong> ${data.decisionMakingRole || 'Not specified'}</p>
            <p><strong>Decision-Making Description:</strong> ${data.decisionMakingDesc || 'Not specified'}</p>
          </div>
        </div>
      `;

    case 'cautioned-use':
      return `
        <div class="section-content">
          <h3>3. Cautioned Out-of-Scope Use</h3>
          
          <div class="subsection">
            <h4>3.1 Tasks, Situations, or Populations to Avoid</h4>
            <div class="critical-box">
              <strong>🚫 Critical Avoidances:</strong>
              <ul>
                ${(data.criticalAvoidances || []).map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="subsection">
            <h4>3.2 Known Risks, Inappropriate Settings & Limitations</h4>
            <div class="warning-box">
              <strong>⚠️ Known Risks & Limitations:</strong>
              <ul>
                ${(data.knownRisks || []).map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;

    case 'development-details':
      return `
        <div class="section-content">
          <h3>4. Development Details and Input Features</h3>
          
          <div class="subsection">
            <h4>4.1 Training Data Inclusion/Exclusion Criteria</h4>
            <p><strong>Training Data Inclusion Criteria:</strong> ${data.trainingInclusion || 'Not specified'}</p>
            <p><strong>Training Data Exclusion Criteria:</strong> ${data.trainingExclusion || 'Not specified'}</p>
          </div>
          
          <div class="subsection">
            <h4>4.2 USCDI v4 Data Elements as Input Features</h4>
            ${data.uscdiElements ? `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Data Element</th>
                    <th>Used in Model</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(data.uscdiElements).map(([elementName, elementData]) => `
                    <tr>
                      <td><strong>${elementName.charAt(0).toUpperCase() + elementName.slice(1).replace(/([A-Z])/g, ' $1')}</strong></td>
                      <td>${elementData.used ? 'Yes' : 'No'}</td>
                      <td>${elementData.description || 'Not specified'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>Not specified</p>'}
          </div>
          
          <div class="subsection">
            <h4>4.3 Demographic Representativeness of Training Data</h4>
            ${data.demographicRepresentativeness ? `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Demographic Variable</th>
                    <th>Training Data</th>
                    <th>US Population</th>
                    <th>Representativeness</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.demographicRepresentativeness.map(item => `
                    <tr>
                      <td><strong>${item.variable}</strong></td>
                      <td>${item.trainingData}</td>
                      <td>${item.usPopulation}</td>
                      <td>${item.representativeness}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>Not specified</p>'}
            ${data.relevanceToDeployedSetting ? `
              <p><strong>Relevance to Deployed Setting:</strong> ${data.relevanceToDeployedSetting}</p>
            ` : ''}
          </div>
          
          ${data.fairnessApproach ? `
            <div class="subsection">
              <h4>4.4 Fairness Development Process</h4>
              <p><strong>Fairness Approach:</strong> ${data.fairnessApproach}</p>
              <p><strong>Bias Management:</strong> ${data.biasManagement || 'Not specified'}</p>
              ${data.fairnessMetrics ? `
                <p><strong>Fairness Metrics:</strong></p>
                <ul>
                  ${data.fairnessMetrics.map(metric => `<li>${metric}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;

    case 'external-validation':
      return `
        <div class="section-content">
          <h3>5. External Validation Process</h3>
          
          <div class="subsection">
            <h4>5.1 External Validation Information</h4>
            <p><strong>External Data Sources:</strong> ${data.externalDataSources || 'Not specified'}</p>
            <p><strong>Clinical Settings:</strong> ${data.clinicalSettings || 'Not specified'}</p>
            <p><strong>External Testing Party:</strong> ${data.externalTestingParty || 'Not specified'}</p>
            <p><strong>External Validation Process:</strong> ${data.externalValidationProcess || 'Not specified'}</p>
          </div>
          
          <div class="subsection">
            <h4>5.2 External Validation Demographics</h4>
            ${data.externalValidationDemographics ? `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>MESA</th>
                    <th>WHI</th>
                    <th>REGARDS</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.externalValidationDemographics.map(item => `
                    <tr>
                      <td><strong>${item.variable}</strong></td>
                      <td>${item.mesa || 'N/A'}</td>
                      <td>${item.whi || 'N/A'}</td>
                      <td>${item.regards || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>Not specified</p>'}
            ${data.externalValidationSampleSizes ? `
              <p><strong>Sample Sizes:</strong></p>
              <ul>
                <li>MESA: ${data.externalValidationSampleSizes.mesa}</li>
                <li>WHI: ${data.externalValidationSampleSizes.whi}</li>
                <li>REGARDS: ${data.externalValidationSampleSizes.regards}</li>
              </ul>
            ` : ''}
          </div>
        </div>
      `;

    case 'performance-measures':
      return `
        <div class="section-content">
          <h3>6. Quantitative Performance Measures</h3>
          
          <div class="subsection">
            <h4>6.1 Internal Validation (Same Source as Training)</h4>
            ${data.internalValidationMetrics ? `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>AUROC</strong></td>
                    <td>${data.internalValidationMetrics.aurocValidity}</td>
                    <td>Area Under ROC Curve</td>
                  </tr>
                  <tr>
                    <td><strong>Fairness Score</strong></td>
                    <td>${data.internalValidationMetrics.fairnessScore}</td>
                    <td>${data.internalValidationMetrics.fairnessScoreDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Calibration</strong></td>
                    <td>${data.internalValidationMetrics.calibration}</td>
                    <td>${data.internalValidationMetrics.calibrationDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Sensitivity</strong></td>
                    <td>${data.internalValidationMetrics.sensitivity}</td>
                    <td>True Positive Rate</td>
                  </tr>
                  <tr>
                    <td><strong>Specificity</strong></td>
                    <td>${data.internalValidationMetrics.specificity}</td>
                    <td>True Negative Rate</td>
                  </tr>
                  <tr>
                    <td><strong>PPV</strong></td>
                    <td>${data.internalValidationMetrics.ppv}</td>
                    <td>Positive Predictive Value</td>
                  </tr>
                </tbody>
              </table>
            ` : '<p>Not specified</p>'}
          </div>
          
          <div class="subsection">
            <h4>6.2 External Validation (Different Source)</h4>
            ${data.externalValidationMetrics ? `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>AUROC</strong></td>
                    <td>${data.externalValidationMetrics.aurocValidity}</td>
                    <td>${data.externalValidationMetrics.aurocValidityDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Fairness Score</strong></td>
                    <td>${data.externalValidationMetrics.fairnessScore}</td>
                    <td>${data.externalValidationMetrics.fairnessScoreDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Calibration</strong></td>
                    <td>${data.externalValidationMetrics.calibration}</td>
                    <td>${data.externalValidationMetrics.calibrationDesc}</td>
                  </tr>
                  <tr>
                    <td><strong>Published Studies</strong></td>
                    <td>${data.externalValidationMetrics.publishedStudies}</td>
                    <td>${data.externalValidationMetrics.publishedStudiesDesc}</td>
                  </tr>
                </tbody>
              </table>
            ` : '<p>Not specified</p>'}
            ${data.realWorldImpact ? `
              <p><strong>Real World Impact:</strong> ${data.realWorldImpact}</p>
            ` : ''}
          </div>
          
          <div class="subsection">
            <h4>6.3 Outcome Evaluation References</h4>
            ${data.outcomeEvaluationReferences ? `
              <ul>
                ${data.outcomeEvaluationReferences.map(ref => `<li>${ref}</li>`).join('')}
              </ul>
            ` : '<p>Not specified</p>'}
          </div>
        </div>
      `;

    case 'maintenance-monitoring':
      return `
        <div class="section-content">
          <h3>7. Ongoing Maintenance & Monitoring</h3>
          <p><strong>Monitoring Process:</strong> ${data.monitoringProcess || 'Not specified'}</p>
          <p><strong>Local Data Validity:</strong> ${data.localDataValidity || 'Not specified'}</p>
          <p><strong>Local Data Validity Description:</strong> ${data.localDataValidityDesc || 'Not specified'}</p>
          <p><strong>Fairness Monitoring Process:</strong> ${data.fairnessMonitoringProcess || 'Not specified'}</p>
          <p><strong>Local Fairness Data:</strong> ${data.localFairnessData || 'Not specified'}</p>
          <p><strong>Local Fairness Data Description:</strong> ${data.localFairnessDataDesc || 'Not specified'}</p>
          <p><strong>Update Process:</strong> ${data.updateProcess || 'Not specified'}</p>
          <p><strong>Performance Correction:</strong> ${data.performanceCorrection || 'Not specified'}</p>
          ${data.currentMonitoringStatus ? `
            <p><strong>Current Monitoring Status:</strong></p>
            <ul>
              ${data.currentMonitoringStatus.map(status => `<li>${status}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;

    case 'evidence-base':
      return `
        <div class="section-content">
          <h3>8. Evidence Base & Clinical Guidelines</h3>
          <p><strong>Primary Citation:</strong> ${data.primaryCitation || 'Not specified'}</p>
          ${data.supportingGuidelines ? `
            <p><strong>Supporting Guidelines:</strong></p>
            <ul>
              ${data.supportingGuidelines.map(guideline => `<li>${guideline}</li>`).join('')}
            </ul>
          ` : ''}
          <p><strong>Clinical Evidence Level:</strong> ${data.clinicalEvidenceLevel || 'Not specified'}</p>
          <p><strong>Clinical Evidence Level Description:</strong> ${data.clinicalEvidenceLevelDesc || 'Not specified'}</p>
        </div>
      `;

    case 'technical-implementation':
      return `
        <div class="section-content">
          <h3>9. Technical Implementation Details</h3>
          <p><strong>Algorithm Type:</strong> ${data.algorithmType || 'Not specified'}</p>
          <p><strong>Integration Method:</strong> ${data.integrationMethod || 'Not specified'}</p>
          <p><strong>Response Time:</strong> ${data.responseTime || 'Not specified'}</p>
          <p><strong>Certification Details:</strong></p>
          <div class="contact-info">${(data.certificationDetails || 'Not specified').replace(/\n/g, '<br>')}</div>
          
          <h4>Contact Information</h4>
          <p><strong>Clinical Support:</strong></p>
          <div class="contact-info">${(data.clinicalSupport || 'Not specified').replace(/\n/g, '<br>')}</div>
          <p><strong>Technical Support:</strong></p>
          <div class="contact-info">${(data.technicalSupport || 'Not specified').replace(/\n/g, '<br>')}</div>
          <p><strong>Regulatory Affairs:</strong></p>
          <div class="contact-info">${(data.regulatoryAffairs || 'Not specified').replace(/\n/g, '<br>')}</div>
        </div>
      `;

    default:
      return '<p>Section content not available.</p>';
  }
};

// Enhanced current section download
export const downloadCurrentSection = (activeSection, data) => {
  if (!activeSection) {
    alert('Please select a section to download');
    return;
  }

  const sectionTitle = sectionTitles[activeSection] || 'Model Card Section';
  const sectionContent = getEnhancedSectionContent(activeSection, data);

  const printWindow = window.open('', '_blank');
  
  // Set up event handlers to close the window after printing
  const setupPrintHandlers = () => {
    printWindow.addEventListener('afterprint', () => {
      setTimeout(() => printWindow.close(), 100);
    });
    
    printWindow.addEventListener('beforeunload', () => {
      printWindow.close();
    });
  };

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${sectionTitle}</title>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Roboto', Arial, sans-serif;
          margin: 40px;
          color: #000;
          line-height: 1.6;
          background-color: #ffffff;
        }
        h1 {
          color: #275786;
          border-bottom: 3px solid #275786;
          padding-bottom: 10px;
          font-size: 28px;
          font-weight: 600;
        }
        h3 {
          color: #275786;
          margin-top: 30px;
          font-size: 22px;
          font-weight: 500;
        }
        h4 {
          color: #000;
          margin-top: 20px;
          font-size: 18px;
          font-weight: 500;
        }
        .subsection {
          margin: 25px 0;
          padding: 20px;
          border-left: 4px solid #275786;
          background-color: #f8f9fa;
          border-radius: 6px;
        }
        .critical-box, .warning-box {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
        }
        .critical-box {
          border-color: #dc3545;
          background-color: #f8d7da;
        }
        .data-table, table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        .data-table th, .data-table td, th, td {
          border: 1px solid #dee2e6;
          padding: 12px 8px;
          text-align: left;
          vertical-align: top;
        }
        .data-table th, th {
          background-color: #275786;
          color: white;
          font-weight: 600;
        }
        .data-table tbody tr:nth-child(even), tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        ul {
          margin: 15px 0;
          padding-left: 25px;
        }
        li {
          margin: 8px 0;
          line-height: 1.5;
        }
        .info-grid p {
          margin: 12px 0;
        }
        .contact-info {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        .compliance-badge {
          background-color: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #c3e6cb;
          margin: 15px 0;
          font-weight: 500;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #275786;
          text-align: center;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        @media print {
          body { margin: 20px; }
          .subsection { page-break-inside: avoid; }
          .data-table { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${sectionTitle}</h1>
      ${sectionContent}
      
      <div class="footer" style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #275786; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <div style="font-size: 16px; font-weight: bold; color: #275786; margin-bottom: 20px; text-align: center;">
          ASTP HTI-1 Compliant Model Card - ${sectionTitle}
        </div>
        
        <!-- Contact Information Section -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="text-align: center; flex: 1; min-width: 200px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #275786; margin-bottom: 8px;">Clinical Support</div>
            <div style="font-size: 12px; color: #000;">
              clinical.ai@cerner.com<br>
              1-800-237-6371
            </div>
          </div>
          <div style="text-align: center; flex: 1; min-width: 200px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #275786; margin-bottom: 8px;">Technical Support</div>
            <div style="font-size: 12px; color: #000;">
              integration.support@cerner.com<br>
              Developer Portal: developer.cerner.com
            </div>
          </div>
          <div style="text-align: center; flex: 1; min-width: 200px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #275786; margin-bottom: 8px;">Regulatory Affairs</div>
            <div style="font-size: 12px; color: #000;">
              regulatory@cerner.com<br>
              ASTP Certification ID: 3068
            </div>
          </div>
        </div>
        
        <!-- Document Information -->
        <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #000; line-height: 1.6;">
          <div style="margin-bottom: 10px;">
            <strong>Last Updated:</strong> July 30, 2025 | 
            <strong>Model Card Version:</strong> 2.1.3 | 
            <strong>ASTP HTI-1 Compliant</strong>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Document Classification:</strong> For Healthcare Professional Use Only | HIPAA Compliant | 21st Century Cures Act Compliant
          </div>
          <div>
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
            Model: ${data.interventionName || 'Healthcare AI Model'}<br>
            This document contains comprehensive model information as required by ASTP HTI-1 regulations.
          </div>
        </div>
      </div>
      
      <script>
        // Set up print handlers
        window.addEventListener('load', function() {
          window.focus();
          setTimeout(function() {
            window.print();
          }, 500);
        });
        
        window.addEventListener('afterprint', function() {
          setTimeout(function() {
            window.close();
          }, 100);
        });
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};

// Enhanced full card download
export const downloadFullCard = (data, navigationItems) => {
  const allSections = navigationItems.map(section => {
    const sectionContent = getEnhancedSectionContent(section.id, data);
    return `
      <div class="section">
        <h2>${section.label}</h2>
        ${sectionContent}
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
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Roboto', Arial, sans-serif;
          margin: 40px;
          color: #000;
          line-height: 1.6;
          background-color: #ffffff;
        }
        h1 {
          color: #275786;
          text-align: center;
          border-bottom: 3px solid #275786;
          padding-bottom: 15px;
          margin-bottom: 40px;
          font-size: 32px;
          font-weight: 700;
        }
        h2 {
          color: #275786;
          margin-top: 50px;
          border-bottom: 2px solid #275786;
          padding-bottom: 8px;
          font-size: 24px;
          font-weight: 600;
        }
        h3 {
          color: #275786;
          margin-top: 30px;
          font-size: 20px;
          font-weight: 500;
        }
        h4 {
          color: #000;
          margin-top: 20px;
          font-size: 18px;
          font-weight: 500;
        }
        .section {
          margin-bottom: 50px;
          page-break-inside: avoid;
        }
        .subsection {
          margin: 25px 0;
          padding: 20px;
          border-left: 4px solid #275786;
          background-color: #f8f9fa;
          border-radius: 6px;
        }
        .critical-box, .warning-box {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
        }
        .critical-box {
          border-color: #dc3545;
          background-color: #f8d7da;
        }
        .data-table, table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        .data-table th, .data-table td, th, td {
          border: 1px solid #dee2e6;
          padding: 12px 8px;
          text-align: left;
          vertical-align: top;
        }
        .data-table th, th {
          background-color: #275786;
          color: white;
          font-weight: 600;
        }
        .data-table tbody tr:nth-child(even), tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        ul {
          margin: 15px 0;
          padding-left: 25px;
        }
        li {
          margin: 8px 0;
          line-height: 1.5;
        }
        .info-grid p {
          margin: 12px 0;
        }
        .contact-info {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        .compliance-badge {
          background-color: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #c3e6cb;
          margin: 15px 0;
          font-weight: 500;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #275786;
          text-align: center;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        @media print {
          body { margin: 20px; }
          .section { page-break-after: auto; }
          .subsection { page-break-inside: avoid; }
          .data-table { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>ASTP HTI-1 Compliant Model Card</h1>
      <p style="text-align: center; margin-bottom: 40px; font-size: 18px; color: #000;">
        ${data.interventionName || 'Healthcare AI Model'} - Complete Documentation
      </p>
      ${allSections}
      
      <div class="footer" style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #275786; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <div style="font-size: 16px; font-weight: bold; color: #275786; margin-bottom: 20px; text-align: center;">
          ASTP HTI-1 Compliant Model Card - Complete Documentation
        </div>
        
        <!-- Contact Information Section -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="text-align: center; flex: 1; min-width: 200px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #275786; margin-bottom: 8px;">Clinical Support</div>
            <div style="font-size: 12px; color: #000;">
              clinical.ai@cerner.com<br>
              1-800-237-6371
            </div>
          </div>
          <div style="text-align: center; flex: 1; min-width: 200px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #275786; margin-bottom: 8px;">Technical Support</div>
            <div style="font-size: 12px; color: #000;">
              integration.support@cerner.com<br>
              Developer Portal: developer.cerner.com
            </div>
          </div>
          <div style="text-align: center; flex: 1; min-width: 200px; margin-bottom: 15px;">
            <div style="font-weight: bold; color: #275786; margin-bottom: 8px;">Regulatory Affairs</div>
            <div style="font-size: 12px; color: #000;">
              regulatory@cerner.com<br>
              ASTP Certification ID: 3068
            </div>
          </div>
        </div>
        
        <!-- Document Information -->
        <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #000; line-height: 1.6;">
          <div style="margin-bottom: 10px;">
            <strong>Last Updated:</strong> July 30, 2025 | 
            <strong>Model Card Version:</strong> 2.1.3 | 
            <strong>ASTP HTI-1 Compliant</strong>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Document Classification:</strong> For Healthcare Professional Use Only | HIPAA Compliant | 21st Century Cures Act Compliant
          </div>
          <div>
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
            Model: ${data.interventionName || 'Healthcare AI Model'}<br>
            This document contains comprehensive model information as required by ASTP HTI-1 regulations.
          </div>
        </div>
      </div>
      
      <script>
        window.addEventListener('load', function() {
          window.focus();
          setTimeout(function() {
            window.print();
          }, 500);
        });
        
        window.addEventListener('afterprint', function() {
          setTimeout(function() {
            window.close();
          }, 100);
        });
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  SectionHeader,
  SectionTitle,
  SectionContent,
  StatusBadge
} from './styles';
import {
  FieldGrid,
  MetricGrid,
  DataTable,
  PlainDataTable,
  WarningBoxComponent,
  CriticalBoxComponent,
  ReferenceList,
  FairnessComponent,
  BulletPointCard
} from './FieldComponents';

const ContentRenderer = ({ 
  activeSection, 
  activeSubSection, 
  navigationItems, 
  data,
  onNavigation 
}) => {
  // SubsectionLinksPage component removed - no longer needed since all content is combined

  // No section selected
  if (!activeSection) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" sx={{ fontSize: '16px' }}>
          Select a section from the navigation to view its content
        </Typography>
      </Box>
    );
  }

  // No longer show subsection links page - always show combined content
  // All sections now display their full content on a single page

  // Render section content
  switch (activeSection) {
    case 'intervention-details':
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>1. Intervention Details and Output</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Intervention Name', value: data.interventionName },
              { label: 'Developer Name & Contact', value: data.developerContact },
              { label: 'Funding Source', value: data.fundingSource },
              { label: 'Value Produced as Output', value: data.valueOutput },
              { 
                label: 'Output Type', 
                value: <StatusBadge variant="validated">{data.outputType}</StatusBadge> 
              }
            ]} columns={2} />
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'purpose-intervention':
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>2. Purpose of Intervention</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Intended Use', value: data.intendedUse },
              { label: 'Intended Patient Population', value: data.intendedPatientPopulation },
              { label: 'Intended Users', value: data.intendedUsers },
              { 
                label: 'Decision-Making Role', 
                value: (
                  <>
                    <StatusBadge variant="monitored">{data.decisionMakingRole}</StatusBadge>
                    <br />
                    {data.decisionMakingDesc}
                  </>
                )
              }
            ]} columns={2} />
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'cautioned-use':
      // Always show combined content - no more subsection pages
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>3. Cautioned Out-of-Scope Use</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <CriticalBoxComponent 
              title="Tasks, Situations, or Populations to Avoid"
              items={data.criticalAvoidances}
            />
            <WarningBoxComponent 
              title="Known Risks, Inappropriate Settings & Limitations"
              items={data.knownRisks}
            />
          </SectionContent>
        </Box>
      );

    case 'development-details':
      // Always show combined content - no more subsection pages
      const uscdiHeaders = ['Data Element', 'Used in Model', 'Description'];
      const uscdiData = (data.uscdiElements || []).map(element => ({
        element: element.element,
        used: <StatusBadge variant={element.used ? 'certified' : 'warning'}>{element.usedText}</StatusBadge>,
        description: element.description
      }));

      const demoHeaders = ['Variable', 'Training Data', 'US Population', 'Representativeness'];
      const demoData = (data.demographicRepresentativeness || []).map(item => ({
        variable: item.variable,
        trainingData: item.trainingData,
        usPopulation: item.usPopulation,
        representativeness: (
          <StatusBadge variant={
            item.representativeness === 'Good' ? 'certified' : 
            item.representativeness === 'Under-represented' ? 'warning' : 'validated'
          }>
            {item.representativeness}
          </StatusBadge>
        )
      }));

      return (
        <Box>
          <SectionHeader>
            <SectionTitle>4. Development Details and Input Features</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Training Data Inclusion/Exclusion Criteria
            </Typography>
            <FieldGrid items={[
              { label: 'Inclusion Criteria', value: data.trainingInclusion },
              { label: 'Exclusion Criteria', value: data.trainingExclusion }
            ]} columns={2} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              USCDI v4 Data Elements as Input Features
            </Typography>
            <PlainDataTable headers={uscdiHeaders} data={uscdiData} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Demographic Representativeness of Training Data
            </Typography>
            <DataTable headers={demoHeaders} data={demoData} />
            <Box sx={{ mt: 3 }}>
              <FieldGrid items={[
                { label: 'Relevance to Deployed Setting', value: data.relevanceToDeployedSetting }
              ]} columns={1} />
            </Box>
            <FairnessComponent data={data} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Fairness Development Process
            </Typography>
            <FieldGrid items={[
              { label: 'Fairness Approach', value: data.fairnessApproach },
              { label: 'Bias Management', value: data.biasManagement }
            ]} columns={1} />
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'external-validation':
      // Always show combined content - no more subsection pages
      const sampleSizes = data.externalValidationSampleSizes || {};
      const studies = data.externalValidationStudies || { studyNames: ['mesa', 'whi', 'regards'], studyLabels: ['MESA', 'WHI', 'REGARDS'] };
      
      const validationHeaders = [
        'Variable',
        ...studies.studyLabels.map((label, index) => {
          const studyKey = studies.studyNames[index];
          const sampleSize = sampleSizes[studyKey] || 'N/A';
          return `${label}\n(n=${sampleSize})`;
        })
      ];
      
      const validationData = (data.externalValidationDemographics || []).map(item => {
        const row = { variable: item.variable };
        studies.studyNames.forEach(studyName => {
          row[studyName] = item[studyName];
        });
        return row;
      });

      return (
        <Box>
          <SectionHeader>
            <SectionTitle>5. External Validation Process</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              External Validation Information
            </Typography>
            <FieldGrid items={[
              { label: 'External Data Sources', value: data.externalDataSources },
              { label: 'Clinical Settings', value: data.clinicalSettings },
              { label: 'External Testing Party', value: data.externalTestingParty },
              { label: 'External Validation Process', value: data.externalValidationProcess }
            ]} columns={2} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              External Validation Demographics
            </Typography>
            <DataTable headers={validationHeaders} data={validationData} />
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'performance-measures':
      // Always show combined content - no more subsection pages
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>6. Quantitative Performance Measures</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Internal Validation (Same Source as Training)
            </Typography>
            <MetricGrid metrics={[
              { value: data.internalValidationMetrics?.aurocValidity, label: 'AUROC VALIDITY' },
              { value: data.internalValidationMetrics?.fairnessScore, label: 'MIN SUBGROUP AUROC' },
              { value: data.internalValidationMetrics?.calibration, label: 'HOSMER-LEMESHOW\nP=0.12' },
              { value: data.internalValidationMetrics?.sensitivity, label: 'SENSITIVITY' },
              { value: data.internalValidationMetrics?.specificity, label: 'SPECIFICITY' },
              { value: data.internalValidationMetrics?.ppv, label: 'PPV' }
            ]} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              External Validation (Different Source)
            </Typography>
            <MetricGrid metrics={[
              { value: data.externalValidationMetrics?.aurocValidity, label: 'EXTERNAL COHORTS' },
              { value: data.externalValidationMetrics?.fairnessScore, label: 'MIN EXTERNAL AUROC' },
              { value: data.externalValidationMetrics?.calibration, label: 'SOME OVERESTIMATION' },
              { value: data.externalValidationMetrics?.publishedStudies, label: 'PUBLISHED STUDIES ON\nCLINICAL OUTCOMES' }
            ]} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Outcome Evaluation References
            </Typography>
            <BulletPointCard 
              title="Published References" 
              items={data.outcomeEvaluationReferences}
            />
            <Box sx={{ mt: 3 }}>
              <FieldGrid items={[
                { label: 'Real World Impact', value: data.realWorldImpact }
              ]} columns={1} />
            </Box>
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'maintenance-monitoring':
      // Always show combined content - no more subsection pages
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>7. Ongoing Maintenance & Monitoring</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Validity Monitoring
            </Typography>
            <FieldGrid items={[
              { label: 'Monitoring Process', value: data.monitoringProcess },
              { 
                label: 'Local Data Validity', 
                value: (
                  <>
                    <StatusBadge variant="monitored">{data.localDataValidity}</StatusBadge>
                    <br />
                    {data.localDataValidityDesc}
                  </>
                )
              }
            ]} columns={1} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Fairness Monitoring
            </Typography>
            <FieldGrid items={[
              { label: 'Fairness Monitoring Process', value: data.fairnessMonitoringProcess },
              { 
                label: 'Local Fairness Data', 
                value: (
                  <>
                    <StatusBadge variant={data.localFairnessData === 'Complete' ? 'certified' : 'warning'}>
                      {data.localFairnessData}
                    </StatusBadge>
                    <br />
                    {data.localFairnessDataDesc}
                  </>
                )
              }
            ]} columns={1} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Update & Validation Schedule
            </Typography>
            <FieldGrid items={[
              { label: 'Update Process', value: data.updateProcess },
              { label: 'Performance Correction', value: data.performanceCorrection }
            ]} columns={1} />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Current Monitoring Status
            </Typography>
            <BulletPointCard 
              title="Current Status Updates" 
              items={data.currentMonitoringStatus}
            />
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'evidence-base':
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>8. Evidence Base & Clinical Guidelines</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Primary Citation', value: data.primaryCitation },
              { 
                label: 'Clinical Evidence Level', 
                value: (
                  <>
                    <StatusBadge variant="certified">{data.clinicalEvidenceLevel}</StatusBadge>
                    <br />
                    {data.clinicalEvidenceLevelDesc}
                  </>
                )
              }
            ]} columns={1} />
            
            <Box sx={{ mt: 3 }}>
              <BulletPointCard 
                title="Supporting Guidelines" 
                items={data.supportingGuidelines}
              />
            </Box>
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    case 'technical-implementation':
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>9. Technical Implementation Details</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FieldGrid items={[
              { label: 'Algorithm Type', value: data.algorithmType },
              { label: 'Integration Method', value: data.integrationMethod },
              { label: 'Response Time', value: data.responseTime },
              { label: 'Certification Details', value: data.certificationDetails }
            ]} columns={2} />
            <Box sx={{ mb: 3 }} />
          </SectionContent>
        </Box>
      );

    default:
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" sx={{ fontSize: '16px' }}>
            Section content for "{activeSection}" is being implemented...
          </Typography>
        </Box>
      );
  }
};

export default ContentRenderer;
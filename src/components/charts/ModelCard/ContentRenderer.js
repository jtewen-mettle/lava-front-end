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
  // Component to render subsection links page
  const SubsectionLinksPage = ({ section }) => {
    const sectionData = navigationItems.find(item => item.id === section);
    
    if (!sectionData || sectionData.subItems.length === 0) {
      return null;
    }

    return (
      <Box>
        <SectionHeader>
          <SectionTitle>{sectionData.label}</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <Box component="ul" sx={{ 
            listStyleType: 'none',
            paddingLeft: '0px',
            margin: 0
          }}>
            {sectionData.subItems.map((subItem, index) => (
              <Box
                component="li"
                key={subItem.id}
                onClick={() => onNavigation(section, subItem.id)}
                sx={{
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ 
                  fontSize: '16px', 
                  fontWeight: '400',
                  color: '#275786',
                  fontFamily: 'Arial, sans-serif',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    fontWeight: '500'
                  }
                }}>
                  {sectionData.label.split('.')[0]}.{index + 1} {subItem.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionContent>
      </Box>
    );
  };

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

  // Check if we should show subsection links page
  const currentSection = navigationItems.find(item => item.id === activeSection);
  if (currentSection && currentSection.subItems.length > 0 && !activeSubSection) {
    return <SubsectionLinksPage section={activeSection} />;
  }

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
          </SectionContent>
        </Box>
      );

    case 'cautioned-use':
      if (activeSubSection === 'tasks-populations') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>3. Cautioned Out-of-Scope Use - Tasks, Situations, or Populations to Avoid</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <CriticalBoxComponent 
                title="Tasks, Situations, or Populations to Avoid"
                items={data.criticalAvoidances}
              />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'known-risks') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>3. Cautioned Out-of-Scope Use - Known Risks, Inappropriate Settings & Limitations</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <WarningBoxComponent 
                title="Known Risks, Inappropriate Settings & Limitations"
                items={data.knownRisks}
              />
            </SectionContent>
          </Box>
        );
      }
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
      if (activeSubSection === 'training-data') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>4. Development Details and Input Features - Training Data Inclusion/Exclusion Criteria</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'Inclusion Criteria', value: data.trainingInclusion },
                { label: 'Exclusion Criteria', value: data.trainingExclusion }
              ]} columns={2} />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'data-elements') {
        const uscdiHeaders = ['Data Element', 'Used in Model', 'Description'];
        const uscdiData = Object.entries(data.uscdiElements || {}).map(([key, element]) => ({
          element: key.replace(/([A-Z])/g, ' $1').trim(),
          used: <StatusBadge variant={element.used ? 'certified' : 'warning'}>{element.used ? 'Yes' : 'No'}</StatusBadge>,
          description: element.description
        }));

        return (
          <Box>
            <SectionHeader>
              <SectionTitle>4. Development Details and Input Features - USCDI v4 Data Elements as Input Features</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <DataTable headers={uscdiHeaders} data={uscdiData} />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'demographic-representativeness') {
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
              <SectionTitle>4. Development Details and Input Features - Demographic Representativeness of Training Data</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <DataTable headers={demoHeaders} data={demoData} />
              <Box sx={{ mt: 3 }}>
                <FieldGrid items={[
                  { label: 'Relevance to Deployed Setting', value: data.relevanceToDeployedSetting }
                ]} columns={1} />
              </Box>
              <FairnessComponent data={data} />
            </SectionContent>
          </Box>
        );
      }
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
              Fairness Development Process
            </Typography>
            <FieldGrid items={[
              { label: 'Fairness Approach', value: data.fairnessApproach },
              { label: 'Bias Management', value: data.biasManagement }
            ]} columns={1} />
          </SectionContent>
        </Box>
      );

    case 'external-validation':
      if (activeSubSection === 'validation-basic') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>5. External Validation Process - External Validation Information</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'External Data Sources', value: data.externalDataSources },
                { label: 'Clinical Settings', value: data.clinicalSettings },
                { label: 'External Testing Party', value: data.externalTestingParty },
                { label: 'External Validation Process', value: data.externalValidationProcess }
              ]} columns={2} />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'validation-demographics') {
        const sampleSizes = data.externalValidationSampleSizes || {};
        const validationHeaders = [
          'Variable', 
          `MESA\n(n=${sampleSizes.mesa || 'N/A'})`, 
          `WHI\n(n=${sampleSizes.whi || 'N/A'})`, 
          `REGARDS\n(n=${sampleSizes.regards || 'N/A'})`
        ];
        const validationData = (data.externalValidationDemographics || []).map(item => ({
          variable: item.variable,
          mesa: item.mesa,
          whi: item.whi,
          regards: item.regards
        }));

        return (
          <Box>
            <SectionHeader>
              <SectionTitle>5. External Validation Process - External Validation Demographics</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <DataTable headers={validationHeaders} data={validationData} />
            </SectionContent>
          </Box>
        );
      }
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>5. External Validation Process</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FieldGrid items={[
              { label: 'External Data Sources', value: data.externalDataSources },
              { label: 'Clinical Settings', value: data.clinicalSettings },
              { label: 'External Testing Party', value: data.externalTestingParty },
              { label: 'External Validation Process', value: data.externalValidationProcess }
            ]} columns={2} />
          </SectionContent>
        </Box>
      );

    case 'performance-measures':
      if (activeSubSection === 'internal-validation') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>6. Quantitative Performance Measures - Internal Validation (Same Source as Training)</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <MetricGrid metrics={[
                { value: data.internalValidationMetrics?.aurocValidity, label: 'AUROC VALIDITY' },
                { value: data.internalValidationMetrics?.fairnessScore, label: 'MIN SUBGROUP AUROC' },
                { value: data.internalValidationMetrics?.calibration, label: 'HOSMER-LEMESHOW\nP=0.12' },
                { value: data.internalValidationMetrics?.sensitivity, label: 'SENSITIVITY' },
                { value: data.internalValidationMetrics?.specificity, label: 'SPECIFICITY' },
                { value: data.internalValidationMetrics?.ppv, label: 'PPV' }
              ]} />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'external-validation-metrics') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>6. Quantitative Performance Measures - External Validation (Different Source)</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <MetricGrid metrics={[
                { value: data.externalValidationMetrics?.aurocValidity, label: 'EXTERNAL COHORTS' },
                { value: data.externalValidationMetrics?.fairnessScore, label: 'MIN EXTERNAL AUROC' },
                { value: data.externalValidationMetrics?.calibration, label: 'SOME OVERESTIMATION' },
                { value: data.externalValidationMetrics?.publishedStudies, label: 'PUBLISHED STUDIES ON\nCLINICAL OUTCOMES' }
              ]} />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'outcome-evaluation') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>6. Quantitative Performance Measures - Outcome Evaluation References</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <BulletPointCard 
                title="Published References" 
                items={data.outcomeEvaluationReferences}
              />
              <Box sx={{ mt: 3 }}>
                <FieldGrid items={[
                  { label: 'Real World Impact', value: data.realWorldImpact }
                ]} columns={1} />
              </Box>
            </SectionContent>
          </Box>
        );
      }
      return (
        <Box>
          <SectionHeader>
            <SectionTitle>6. Quantitative Performance Measures</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#275786', fontWeight: 'bold', fontSize: '16px' }}>
              Internal Validation Metrics
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
              External Validation Metrics
            </Typography>
            <MetricGrid metrics={[
              { value: data.externalValidationMetrics?.aurocValidity, label: 'EXTERNAL COHORTS' },
              { value: data.externalValidationMetrics?.fairnessScore, label: 'MIN EXTERNAL AUROC' },
              { value: data.externalValidationMetrics?.calibration, label: 'SOME OVERESTIMATION' },
              { value: data.externalValidationMetrics?.publishedStudies, label: 'PUBLISHED STUDIES ON\nCLINICAL OUTCOMES' }
            ]} />
          </SectionContent>
        </Box>
      );

    case 'maintenance-monitoring':
      if (activeSubSection === 'validity-monitoring') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>7. Ongoing Maintenance & Monitoring - Validity Monitoring</SectionTitle>
            </SectionHeader>
            <SectionContent>
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
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'fairness-monitoring') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>7. Ongoing Maintenance & Monitoring - Fairness Monitoring</SectionTitle>
            </SectionHeader>
            <SectionContent>
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
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'update-schedule') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>7. Ongoing Maintenance & Monitoring - Update & Validation Schedule</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FieldGrid items={[
                { label: 'Update Process', value: data.updateProcess },
                { label: 'Performance Correction', value: data.performanceCorrection }
              ]} columns={1} />
            </SectionContent>
          </Box>
        );
      }
      if (activeSubSection === 'monitoring-status') {
        return (
          <Box>
            <SectionHeader>
              <SectionTitle>7. Ongoing Maintenance & Monitoring - Current Monitoring Status</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <BulletPointCard 
                title="Current Status Updates" 
                items={data.currentMonitoringStatus}
              />
            </SectionContent>
          </Box>
        );
      }
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
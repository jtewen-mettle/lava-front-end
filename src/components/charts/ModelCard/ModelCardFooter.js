import React from 'react';
import {
  FooterContainer,
  FooterGrid,
  FooterContactSection,
  FooterContactTitle,
  FooterContactInfo,
  FooterDivider,
  FooterMetaInfo
} from './styles';

const ModelCardFooter = ({ data }) => {
  return (
    <FooterContainer>
      {/* Contact Information Row */}
      <FooterGrid>
        <FooterContactSection>
          <FooterContactTitle>Clinical Support</FooterContactTitle>
          <FooterContactInfo>{data.clinicalSupport}</FooterContactInfo>
        </FooterContactSection>
        
        <FooterContactSection>
          <FooterContactTitle>Technical Support</FooterContactTitle>
          <FooterContactInfo>{data.technicalSupport}</FooterContactInfo>
        </FooterContactSection>
        
        <FooterContactSection>
          <FooterContactTitle>Regulatory Affairs</FooterContactTitle>
          <FooterContactInfo>{data.regulatoryAffairs}</FooterContactInfo>
        </FooterContactSection>
      </FooterGrid>
      
      {/* Divider */}
      <FooterDivider />
      
      {/* Meta Information */}
      <FooterMetaInfo>
        <strong>Last Updated:</strong> {data.lastUpdated} | <strong>Model Card Version:</strong> {data.modelCardVersion} | <strong>ONC HTI-1 Compliant</strong>
        <br />
        <strong>Document Classification:</strong> {data.documentClassification}
      </FooterMetaInfo>
    </FooterContainer>
  );
};

export default ModelCardFooter;
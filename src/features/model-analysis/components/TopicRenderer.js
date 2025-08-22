import React from 'react';
import { useAppContext } from '../../../core/context';
import { TOPICS } from '../../../core/constants';
import CKDPrediction from '../../../components/topics/CKDPrediction';
import CardioVascularPrediction from '../../../components/topics/CardioVascularPrediction';
import ProstateCancerPrediction from '../../../components/topics/ProstateCancerPrediciton';
import HospitalizationRiskPrediction from '../../../components/topics/HospitalizationRiskPrediction';

const TopicRenderer = () => {
  const { selection } = useAppContext();

  if (!selection?.topic) {
    return <div>No topic selected</div>;
  }

  const renderTopicComponent = () => {
    switch (selection.topic) {
      case TOPICS.CKD.id:
        return <CKDPrediction />;
      
      case TOPICS.CARDIOVASCULAR.id:
        return <CardioVascularPrediction />;
      
      case TOPICS.PROSTATE_CANCER.id:
        return <ProstateCancerPrediction />;
      
      case TOPICS.HOSPITALIZATION.id:
        return <HospitalizationRiskPrediction />;
      
      default:
        return <div>Coming Soon...</div>;
    }
  };

  return renderTopicComponent();
};

export default TopicRenderer;
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import CKDPredictionCsvFromFhir from '../CKDPredictionCsvFromFhir';
import Prediction from '../views/Prediction';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const CKDPrediction = (props) => {
  const [csvData, setCsvData] = useState("");

  const handleCsvReady = (csv) => {
    console.log("CSV received in parent:", csv);
    setCsvData(csv);
  };


  return (
    <div>
      <CKDPredictionCsvFromFhir onCsvReady={handleCsvReady} />
      { csvData && csvData.length > 0 && (
        <Prediction csvData={csvData} topic="CKD Prediction"/>
      )}
    </div>
  );
};

export default CKDPrediction;

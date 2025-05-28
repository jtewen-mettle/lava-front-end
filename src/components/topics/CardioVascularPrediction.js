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
import ASCVDPredictionCsvFromFhir from '../ASCVDPredictionCsvFromFhir';
import Prediction from '../views/Prediction';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const CardioVascularPrediction = (props) => {
  const [tab, setTab] = useState(0);
  const [csvData, setCsvData] = useState("");
  const [thresholdDist, setThresholdDist] = useState(20);

  
  const handleCsvReady = (csv) => {
    console.log("CSV received in parent:", csv);
    setCsvData(csv);
  };

  return (
    <div>
      <ASCVDPredictionCsvFromFhir onCsvReady={handleCsvReady} />
      { csvData && csvData.length > 0 && (
        <Prediction csvData={csvData} topic="CardioVascularDisease Prediction" score="TenYearScore"/>
      )}
    </div>
  );
};

export default CardioVascularPrediction;

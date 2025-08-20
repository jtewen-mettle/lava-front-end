import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Tabs, Tab, Button, Paper,IconButton,Tooltip as MuiTooltip, FormControl,
  InputLabel,
  Select,
  MenuItem } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
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

import { CalculateMetrics } from '../metrics/CalculateMetrics';
import CKDPredictionCsvFromFhir from '../CKDPredictionCsvFromFhir';
import { CalculateSubgroupMetrics } from '../metrics/CalculateSubgroupMetrics';
import { CalculateSubgroupAgeMetrics } from '../metrics/CalculateSubgroupAgeMetrics';
import { calculateCalibrationData } from '../charts/CalibrationCurve';
import SubgroupBarChart from '../charts/SubgroupBarChart';
import MetricsSection from '../charts/MetricsSection';
import DistributionCharts from '../charts/DistributionCharts';
import CalibrationBySubgroup from '../charts/CalibrationBySubgroup';
import InfoIcon from '@mui/icons-material/Info';
import { ZoomIn, Download } from '@mui/icons-material';
import HelpIcon from '../HelpIcon';
import MetricsGrid from '../views/MetricsGrid';
import AgeGroupLineChart from '../charts/AgeGroupLineChart';
import ModelCardSection from '../charts/ModelCardSection';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)({
  minHeight: 'auto',
  width: '100%',
  position: 'relative',
  backgroundColor: 'transparent',
  borderRadius: '12px 12px 0 0',
  padding: '0',
  margin: '0',
  borderBottom: '2.5px solid #e5e7eb',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: '10px',
    position: 'relative',
  },
  '& .MuiTabs-scroller': {
    overflowX: 'auto !important',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '& .MuiTabs-scrollButtons': {
    display: 'none !important',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'None',
  fontWeight: 600,
  fontSize: '13px',
  fontFamily: 'Arial, sans-serif',
  borderRadius: '12px 12px 0 0',
  minHeight: '36px',
  padding: '8px 12px',
  marginRight: 0,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#e5e7eb',
  color: '#6b7280',
  border: 'none',
  borderBottom: '2.5px solid transparent', // So parent border shows through
  width: '160px',
  minWidth: '160px',
  maxWidth: '180px',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#d1d5db',
    color: '#374151',
    transform: 'scale(1.05)',
    borderBottom: '2.5px solid #93c5fd', // Light blue underline on hover
  },
  '&.Mui-selected': {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderBottom: '2.5px solid #1d4ed8', // Dark blue underline
    transform: 'scale(1.02)',
    '&:hover': {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderBottom: '2.5px solid #1d4ed8',
      transform: 'scale(1.05)',
    },
  },
}));

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Prediction = ({csvData,topic,score}) => {
  const [tab, setTab] = useState(0);
  const [metricsData, setMetricsData] = useState(null);
  const [genderMetrics, setGenderMetrics] = useState(null);
  const [raceMetrics, setRaceMetrics] = useState(null);
  const [ageMetrics, setAgeMetrics] = useState(null);
  const [ageGroupDist, setAgeGroupDist] = useState({});
  const [genderDist, setGenderDist] = useState({});
  const [raceDist, setRaceDist] = useState({});
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [predictionValue, setPredictionValue] = useState(80);
  const [calibrationData, setCalibrationData] = useState(null);

  // Get unique values for dropdowns
  const genderOptions = ['Male', 'Female'];
  const raceOptions = raceMetrics ? [...new Set(raceMetrics.map(item => item.Subgroup))] : [];

  // Filter data based on selected value or show all if none selected
  const filteredGenderData = selectedGender
    ? genderMetrics.filter(item => item.Subgroup.toLowerCase() === selectedGender.toLowerCase())
    : genderMetrics;

  const filteredRaceData = selectedRace
    ? raceMetrics.filter(item => item.Subgroup === selectedRace)
    : raceMetrics;

  const handleTabChange = (event, newValue) => setTab(newValue);

  function normalizeAndPredict(data, scoreKey, thresholdPercent = 40) {
    console.log(thresholdPercent);
    return data.map(row => {
      const score = parseFloat(row[scoreKey]) / 100; // Convert to 0–1
      return {
        ...row,
        Prediction: score >= (thresholdPercent / 100) ? 1 : 0
      };
    });
  }

  useEffect(() => {

    const fetchMetrics = async () => {

      try {

        const [headers, ...rows] = csvData;
        let formattedCsvData = rows.map(row =>
          headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {})
        );

        let result = formattedCsvData.map(row => ({
          ...row,
          Actual: parseInt(row.Actual_Outcome)
        }));

        const unique = new Map();
        result.forEach(row => {
          unique.set(row.Patient_ID, row); // keeps last by timestamp due to sorting
        });

        const finalData = Array.from(unique.values());

        if(score !== null && score !== undefined && score !== "") {
          const predictedData = normalizeAndPredict(finalData, score);
          finalData.forEach((row, index) => {
            row.Prediction = predictedData[index].Prediction;
          });
        }else{
            finalData.forEach(row => {
                row.Prediction = parseFloat(row.Predicted_Outcome);
            });
        }

        const y_true = finalData.map(row => row.Actual);
        const y_pred = finalData.map(row => row.Prediction);

        const data = await CalculateMetrics(y_true, y_pred, calibrationData?.processedData);
       
        const formatted = {
          summary_metrics: {
            overall_accuracy: data.Accuracy,
            alert_reliability: data.Precision,
            need_detection_rate: data.Recall,
            balanced_score: data["F1 Score"]
          },
          confusion_matrix: {
            true_positive: data["True Positive"],
            false_negative: data["False Negative"],
            false_positive: data["False Positive"],
            true_negative: data["True Negative"],
            true_positive_rate: data["True Positive Rate"].toFixed(2),
            true_negative_rate: data["True Negative Rate"].toFixed(2),
            false_positive_rate: data["False Positive Rate"].toFixed(2),
            false_negative_rate: data["False Negative Rate"].toFixed(2)
          },
          detailed_metrics: {
            accuracy: data.Accuracy,
            precision: data.Precision,
            recall: data.Recall,
            f1_score: data["F1 Score"],
            brier_score: data["Brier Score"]
          },
          accuracy_over_time: {
            months: ['Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024', 'Jan 2025'],
            claimed: [90, 90, 90, 90, 90],
            measured: [80, 75, 95, 85, 78]
          },
          roc_curve: {
            fpr: data.ROC_CURVE.fpr,
            tpr: data.ROC_CURVE.tpr,
            auc: data.AUROC
          }
        };

        setMetricsData(formatted);
      } catch (err) {
        console.error("API fetch failed", err);
      }
    };
    if (csvData && csvData.length > 0 && tab === 0) {
      fetchMetrics();
    }
  }, [csvData, tab, calibrationData, score]);

  useEffect(() => {
    const runSubgroup = async () => {
      if (csvData && csvData.length > 0 && tab === 1) {
        const [headers, ...rows] = csvData;
        let formattedCsvData = rows.map(row =>
          headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {})
        );
        const formattedData = formattedCsvData.map(row => {
          const birthDate = new Date(row.Birthdate);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();
          const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
          return {
            ...row,
            Age: adjustedAge,
            Actual: parseInt(row.Actual_Outcome)
          }
        });

        if(score !== null && score !== undefined && score !== "") {
            const predictedData = normalizeAndPredict(formattedData, score);
            formattedData.forEach((row, index) => {
              row.Prediction = predictedData[index].Prediction;
            });
          }else{
              formattedData.forEach(row => {
                  row.Prediction = parseFloat(row.Predicted_Outcome);
              });
          }


        const subgroupGenderResult = await CalculateSubgroupMetrics(
          formattedData,
          'Gender',
          score
        );

        const subgroupRaceResult = await CalculateSubgroupMetrics(
          formattedData,
          'Race',
          score
        );

        const ageGroupMetrics = await CalculateSubgroupAgeMetrics(
          formattedData,score
        );
        setGenderMetrics(subgroupGenderResult);
        setRaceMetrics(subgroupRaceResult);
        setAgeMetrics(ageGroupMetrics);
      }
    };

    runSubgroup();
  }, [csvData, tab, score]);

  useEffect(() => {
    const runDistributions = async () => {
      if (csvData && csvData.length > 0 && tab === 2) {
        const [headers, ...rows] = csvData;
        let formattedCsvData = rows.map(row =>
          headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {})
        );

        const unique = new Map();
        formattedCsvData.forEach(row => {
          unique.set(row.Patient_ID, row); // keeps last by timestamp due to sorting
        });

        formattedCsvData = Array.from(unique.values());

        const {ageGroups,genderCounts,raceCounts} = calculateDistributions(formattedCsvData);
        setAgeGroupDist(ageGroups);
        setGenderDist(genderCounts);      
        setRaceDist(raceCounts);
      }
    }
    runDistributions()
  }, [csvData, tab]);

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const predictions = [];
      const actual = [];
      
      // Process CSV data same way as fetchMetrics
      const [headers, ...rows] = csvData;
      
      const formattedCsvData = rows.map(row =>
        headers.reduce((acc, header, index) => {
          acc[header] = row[index];
          return acc;
        }, {})
      );
      
      formattedCsvData.forEach((row, index) => {
        // Use the score prop if provided, otherwise fallback to common column names
        let predScore;
        if (score && row[score] !== undefined) {
          predScore = row[score];
        } else {
          predScore = row.Prediction_Score || row.Risk_Score || row.Score || row.Predicted_Outcome;
        }
        
        // If your CSV has "Actual_Outcome" column:
        const actualOutcome = row.Actual_Outcome || row.Outcome || row.Actual;
        
        if (predScore !== undefined && actualOutcome !== undefined) {
          // Convert score to probability (0-1 range)
          let prob = parseFloat(predScore);
          
          // If your scores are 0-100, convert to 0-1
          if (prob > 1) {
            prob = prob / 100;
          }
          
          predictions.push(prob);
          actual.push(parseInt(actualOutcome));
        }
      });
    
      if (predictions.length > 0) {
        const calibrationResults = calculateCalibrationData(predictions, actual, 10);
        
        setCalibrationData({ 
          predictions, 
          actual,
          processedData: calibrationResults
        });
      }
    }
  }, [csvData, score]);

  const calculateDistributions = (data) => {
    const ageGroups = { '0-10': 0,'11-20': 0, '21-30': 0,'31-40': 0,'41-50': 0, '51-60': 0, '60-80+': 0 };
    const genderCounts = {};
    const raceCounts = {};
  
    data.forEach((row) => {
      const birthDate = new Date(row.Birthdate);
      const age = new Date().getFullYear() - birthDate.getFullYear();

      const ageGroupKey = Object.keys(ageGroups).find((range) => {
        const [start, end] = range.split('-').map((v) => (v === '+' ? Infinity : parseInt(v, 10)));
        return age >= start && age <= end;
      });
  
      if (ageGroupKey) {
        ageGroups[ageGroupKey]++;
      }
  
      // Gender
      const gender = row.Gender?.trim() || 'Unknown';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
  
      // Race
      const race = row.Race?.trim() || 'Unknown';
      raceCounts[race] = (raceCounts[race] || 0) + 1;
    });
  
    return { ageGroups, genderCounts, raceCounts };
  };

  const gridLabels = [
    {
      label: 'Overall Accuracy',
      field: 'overall_accuracy',
      format: (v) => `${(v * 100).toFixed(1)}%`,
      tooltip: "How often the model's predictions are correct overall.",
      formula: "Formula: (True Positives + True Negatives) / Total Predictions",
      info: "Correct predictions",
    },
    {
      label: 'Postive Predictive Value (Precision)',
      field: 'alert_reliability',
      format: (v) => `${(v * 100).toFixed(1)}%`,
      tooltip: 'When the model predicts "yes", how often is it actually correct?',
      formula: 'Formula: True Positives / (True Positives + False Positives)',
      info: "% of predictive positives that are correct",
    },
    {
      label: 'Sensitivity (Recall)',
      field: 'need_detection_rate',
      format: (v) => `${(v * 100).toFixed(1)}%`,
      tooltip: 'How well the model identifies all actual "yes" cases.',
      formula: 'Formula: True Positives / (True Positives + False Negatives)',
      info: "% of actual positives detected",
    },
    {
      label: 'Balanced Prediction Score (F1 Score)',
      field: 'balanced_score',
      format: (v) => v.toFixed(2),
      tooltip: "The harmonic mean of Precision and Recall, showing overall model effectiveness.",
      formula: "Formula: 2 * (Precision * Recall) / (Precision + Recall)",
      info: "Balance between Precision and Recall",
    },
  ];

    const metrics = metricsData
        ? gridLabels.map(({ label, field, format, tooltip, formula,info }) => {
            const value = metricsData.summary_metrics[field];
            const formattedValue = format(value);
            const isGood = value >= 0.6;
            return {
                label,
                value: formattedValue,
                tooltip,
                formula,
                info,
                isGood
            };
            })
        : [];

  const handlePredictionChange = (event) => {
    console.log("Prediction Value Changed: ", event.target.value);
    setPredictionValue(event.target.value);
  };

  const accuracyChart = {
    labels: metricsData?.accuracy_over_time.months || [],
    datasets: [
      {
        label: 'DSI Developer Claimed Accuracy',
        data: metricsData?.accuracy_over_time.claimed || [],
        borderColor: 'blue',
        fill: false
      },
      {
        label: 'Measured Accuracy',
        data: metricsData?.accuracy_over_time.measured || [],
        borderColor: 'red',
        fill: false
      }
    ]
  };

  const barChartData = {
                labels: ['Accuracy', 'PPV', 'Sensitivity', 'F1 Score', 'Brier Score'],
    datasets: [
      {
        label: 'Score',
        data: metricsData ? [
          metricsData.detailed_metrics.accuracy,
          metricsData.detailed_metrics.precision,
          metricsData.detailed_metrics.recall,
          metricsData.detailed_metrics.f1_score,
          metricsData.detailed_metrics.brier_score
        ] : [],
        backgroundColor: ['#d0e7f9', '#a5cbe2', '#7fb0cc', '#5894b6', '#3379a0']
      }
    ]
  };

  const rocChart = {
    datasets: [
      {
        label: `Prediction Quality (ROC) curve (area = ${metricsData?.roc_curve.auc.toFixed(2)})`,
        data: metricsData?.roc_curve.fpr.map((fpr, i) => ({
          x: fpr,
          y: metricsData.roc_curve.tpr[i]
        })),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      }
    ]
  };

  return (
    <div>
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3, md: 3 }, 
          mx: 'auto',
          maxWidth: '1400px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'hidden'
        }}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="h5" gutterBottom textAlign="left" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '18px' }}>
          Accuracy Metrics: Development of {topic}
        </Typography>
        </Box>

        {metricsData && (
          <>
            <Box width="100%" mt={2}>
              <MetricsGrid metrics={metrics} />
            </Box>
            <Box mt={4} width="100%">
              <Box display="flex" justifyContent="left">
                <StyledTabs 
                  value={tab} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons={false}
                >
                  <StyledTab label="Performance Metrics" />
                  <StyledTab label="Sub-Group Analysis" />
                  <StyledTab label="Data Distribution" />
                  <StyledTab label="Model Card" />
                </StyledTabs>
              </Box>
              {tab === 0 && (
                <MetricsSection topic={topic} metricsData={metricsData} accuracyChart={accuracyChart} barChartData={barChartData} rocChart={rocChart} predictionValue={predictionValue} onPredictionChange={handlePredictionChange} calibrationData={calibrationData}/>
              )}
              {tab === 1 && (
                <Box mt={4}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 600px), 1fr))',
                    gap: '16px',
                    width: '100%',
                    gridAutoRows: 'minmax(400px, auto)',
                    maxWidth: '100%',
                    overflow: 'visible'
                  }}>
                    {/* Gender Chart */}
                    <Paper 
                      elevation={2} 
                      style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '1px solid #e0e0e0'
                      }}
                      sx={{
                        '&:hover': {
                          elevation: 8,
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      <div style={{ flex: 1, height: '350px' }}>
                        <SubgroupBarChart
                          title="Metrics by Gender"
                          rawData={filteredGenderData}
                          selectedFeature="Gender"
                          allSubgroupsData={genderMetrics}
                          selectedValue={selectedGender}
                          onValueChange={setSelectedGender}
                          options={genderOptions}
                        />
                      </div>
                    </Paper>

                    {/* Race Chart */}
                    <Paper 
                      elevation={2} 
                      style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '1px solid #e0e0e0'
                      }}
                      sx={{
                        '&:hover': {
                          elevation: 8,
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      <div style={{ flex: 1, height: '350px' }}>
                        <SubgroupBarChart
                          title="Metrics by Race"
                          rawData={filteredRaceData}
                          selectedFeature="Race"
                          allSubgroupsData={raceMetrics}
                          selectedValue={selectedRace}
                          onValueChange={setSelectedRace}
                          options={raceOptions}
                        />
                      </div>
                    </Paper>

                    {/* Age Group Chart - starts new row */}
                    <Paper 
                      elevation={2} 
                      style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gridColumn: '1 / 2',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '1px solid #e0e0e0'
                      }}
                      sx={{
                        '&:hover': {
                          elevation: 8,
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" align="left" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
                          Age Group Analysis
                        </Typography>
                        <Box>
                          <HelpIcon tooltip="Learn more about age group performance analysis in the Glossary" section="age-group-performance" />
                          <IconButton 
                            size="small" 
                            title="Enlarge Chart"
                            sx={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e3f2fd',
                              borderRadius: '4px',
                              marginRight: '6px',
                              minWidth: '28px',
                              minHeight: '28px',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                                border: '1px solid #bbdefb',
                                boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                              }
                            }}
                          >
                            <ZoomIn sx={{ fontSize: 16, color: '#1976d2' }} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            title="Download Chart"
                            sx={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e3f2fd',
                              borderRadius: '4px',
                              minWidth: '28px',
                              minHeight: '28px',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                                border: '1px solid #bbdefb',
                                boxShadow: '0 2px 4px rgba(25,118,210,0.15)'
                              }
                            }}
                          >
                            <Download sx={{ fontSize: 16, color: '#1976d2' }} />
                          </IconButton>
                        </Box>
                      </Box>
                      <div style={{ flex: 1, height: '320px' }}>
                        {ageMetrics && <AgeGroupLineChart data={ageMetrics} />}
                      </div>
                    </Paper>

                    {/* Calibration by Subgroup Chart */}
                    <Paper 
                      elevation={2} 
                      style={{ 
                        padding: 16, 
                        height: '400px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '1px solid #e0e0e0'
                      }}
                      sx={{
                        '&:hover': {
                          elevation: 8,
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      <div style={{ flex: 1, height: '350px' }}>
                        <CalibrationBySubgroup
                          genderMetrics={genderMetrics}
                          raceMetrics={raceMetrics}
                          title="Model Calibration by Demographics"
                        />
                      </div>
                    </Paper>
                  </div>
                </Box>
              )}

              {tab === 2 && (
                <Box mt={4}>
                  <h5 align="left">Patient Demographic Distribution</h5>
                  <DistributionCharts ageGroups={ageGroupDist} genderCounts={genderDist} raceCounts={raceDist} />
                </Box>
              )}

              {tab === 3 && (
                <ModelCardSection topic={topic.toLowerCase()} />
              )}
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default Prediction;

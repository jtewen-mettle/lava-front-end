import { parseCSVRow, validateNumericValue, calculateStats, groupBy, sortBy, filterBy } from '../utils';

export class CSVProcessor {
  constructor(csvData) {
    this.rawData = csvData;
    this.processedData = this.processCSVData(csvData);
  }

  processCSVData(csvData) {
    if (!Array.isArray(csvData) || csvData.length < 2) {
      return [];
    }

    const headers = csvData[0];
    const rows = csvData.slice(1);

    return rows.map((row, index) => {
      const processedRow = parseCSVRow(row);
      
      return {
        ...processedRow,
        rowIndex: index,
        id: processedRow.Patient_ID || `row_${index}`,
        
        // Ensure numeric fields are properly converted
        Age: this.parseNumber(processedRow.Age),
        eGFR: this.parseNumber(processedRow.eGFR),
        uACR_log: this.parseNumber(processedRow.uACR_log),
        SerumAlbumin: this.parseNumber(processedRow.SerumAlbumin),
        SerumPhosphorous: this.parseNumber(processedRow.SerumPhosphorous),
        SerumCalcium: this.parseNumber(processedRow.SerumCalcium),
        SerumBicarbonate: this.parseNumber(processedRow.SerumBicarbonate),
        BloodCreatinine: this.parseNumber(processedRow.BloodCreatinine),
        UrineProtein: this.parseNumber(processedRow.UrineProtein),
        Actual_Outcome: this.parseNumber(processedRow.Actual_Outcome),
        Predicted_Outcome: this.parseNumber(processedRow.Predicted_Outcome),
        
        // Clean text fields
        FirstName: this.cleanString(processedRow.FirstName),
        LastName: this.cleanString(processedRow.LastName),
        Gender: this.cleanString(processedRow.Gender),
        Race: this.cleanString(processedRow.Race),
        
        // Parse birthdate
        Birthdate: this.parseDate(processedRow.Birthdate)
      };
    }).filter(row => row.id); // Filter out invalid rows
  }

  parseNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  cleanString(value) {
    if (typeof value !== 'string') return '';
    return value.trim();
  }

  parseDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  // Data filtering methods
  filterByAge(minAge, maxAge) {
    return this.processedData.filter(row => {
      const age = row.Age;
      if (age === null) return false;
      if (minAge !== undefined && age < minAge) return false;
      if (maxAge !== undefined && age > maxAge) return false;
      return true;
    });
  }

  filterByGender(genders) {
    if (!Array.isArray(genders) || genders.length === 0) return this.processedData;
    const normalizedGenders = genders.map(g => g.toLowerCase());
    return this.processedData.filter(row => 
      normalizedGenders.includes(row.Gender?.toLowerCase())
    );
  }

  filterByRace(races) {
    if (!Array.isArray(races) || races.length === 0) return this.processedData;
    return this.processedData.filter(row => races.includes(row.Race));
  }

  filterByOutcome(outcome) {
    if (outcome === null || outcome === undefined) return this.processedData;
    return this.processedData.filter(row => row.Actual_Outcome === outcome);
  }

  // Data grouping methods
  groupByGender() {
    return groupBy(this.processedData, 'Gender');
  }

  groupByRace() {
    return groupBy(this.processedData, 'Race');
  }

  groupByAgeGroups(groupSize = 10) {
    const grouped = {};
    this.processedData.forEach(row => {
      if (row.Age !== null) {
        const groupStart = Math.floor(row.Age / groupSize) * groupSize;
        const groupKey = `${groupStart}-${groupStart + groupSize - 1}`;
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(row);
      }
    });
    return grouped;
  }

  // Statistical analysis methods
  calculateFieldStats(fieldName) {
    return calculateStats(this.processedData, fieldName);
  }

  calculateCorrelation(field1, field2) {
    const validPairs = this.processedData
      .map(row => [row[field1], row[field2]])
      .filter(([x, y]) => x !== null && y !== null && !isNaN(x) && !isNaN(y));

    if (validPairs.length < 2) return null;

    const n = validPairs.length;
    const sumX = validPairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = validPairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = validPairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = validPairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Performance metrics calculation
  calculateConfusionMatrix(threshold = 0.5) {
    let tp = 0, tn = 0, fp = 0, fn = 0;

    this.processedData.forEach(row => {
      if (row.Actual_Outcome !== null && row.Predicted_Outcome !== null) {
        const actual = row.Actual_Outcome;
        const predicted = row.Predicted_Outcome >= threshold ? 1 : 0;

        if (actual === 1 && predicted === 1) tp++;
        else if (actual === 0 && predicted === 0) tn++;
        else if (actual === 0 && predicted === 1) fp++;
        else if (actual === 1 && predicted === 0) fn++;
      }
    });

    return { tp, tn, fp, fn };
  }

  calculateMetrics(threshold = 0.5) {
    const { tp, tn, fp, fn } = this.calculateConfusionMatrix(threshold);
    const total = tp + tn + fp + fn;

    if (total === 0) return null;

    const sensitivity = tp + fn > 0 ? tp / (tp + fn) : 0;
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const accuracy = (tp + tn) / total;
    const f1Score = precision + sensitivity > 0 ? 2 * (precision * sensitivity) / (precision + sensitivity) : 0;

    return {
      sensitivity,
      specificity,
      precision,
      accuracy,
      f1Score,
      confusionMatrix: { tp, tn, fp, fn }
    };
  }

  // Data export methods
  getProcessedData() {
    return this.processedData;
  }

  getUniqueValues(field) {
    const values = new Set();
    this.processedData.forEach(row => {
      if (row[field] !== null && row[field] !== undefined) {
        values.add(row[field]);
      }
    });
    return Array.from(values);
  }

  getSummaryStatistics() {
    const numericFields = [
      'Age', 'eGFR', 'uACR_log', 'SerumAlbumin', 'SerumPhosphorous', 
      'SerumCalcium', 'SerumBicarbonate', 'BloodCreatinine', 'UrineProtein',
      'Actual_Outcome', 'Predicted_Outcome'
    ];

    const stats = {};
    numericFields.forEach(field => {
      stats[field] = this.calculateFieldStats(field);
    });

    return {
      totalRows: this.processedData.length,
      numericStats: stats,
      categoricalStats: {
        Gender: this.groupByGender(),
        Race: this.groupByRace()
      }
    };
  }
}
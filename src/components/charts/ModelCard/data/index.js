// Import individual model data from separate files
import { cardiovascular } from './cardiovascular.js';
import { ckd } from './ckd.js';
import { prostate } from './prostate.js';
import { hospitalization } from './hospitalization.js';
import { heartfailure } from './heartfailure.js';

// Export consolidated model data
export const modelCardData = {
  cardiovascular,
  ckd,
  prostate,
  hospitalization,
  heartfailure
};
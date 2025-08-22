# LAVA (Local AI Evaluator) - Source Code Documentation

## 📋 Project Overview

LAVA is a comprehensive React-based web application designed for evaluating and analyzing machine learning models in healthcare environments. The application provides interactive dashboards, performance metrics, fairness analysis, and detailed visualizations for clinical decision support systems.

### 🎯 Core Features
- **AI Model Evaluation**: Comprehensive performance analysis with ROC curves, calibration plots, and confusion matrices
- **Fairness Assessment**: Subgroup analysis across demographics to identify bias
- **Interactive Visualizations**: Dynamic charts with filtering and export capabilities
- **Multi-Vendor Support**: Integration with various healthcare vendors (Cerner, DSI Vendor2)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

---

## 🏗️ Project Architecture

The application follows a modern React architecture with clear separation of concerns:

```
src/
├── application/          # Main app configuration & routing
├── core/                # Shared business logic & utilities
├── features/            # Feature-based modules
├── components/          # Legacy UI components (being phased out)
├── shared/             # Reusable UI components & utilities
├── index.js            # Application entry point
├── index.css           # Global styles
└── README.md           # This documentation
```

### Architecture Principles
1. **Feature-Based Organization**: Related functionality grouped together
2. **Separation of Concerns**: Business logic separated from UI components
3. **Reusable Components**: Shared UI elements in dedicated directories
4. **Modern React Patterns**: Hooks, context API, and functional components

---

## 📁 Directory Structure & Responsibilities

### `/application` - Application Configuration
**Purpose**: Main app setup, routing, and layout configuration

```
application/
├── App.js              # Root application component
├── index.js            # Application exports
├── layout/             # App-wide layout components
│   ├── AppLayout.js    # Main layout wrapper
│   ├── NavigationBar.js # Top navigation component
│   └── index.js        # Layout exports
└── routing/            # Application routing
    ├── PageRouter.js   # Main route configuration
    └── index.js        # Routing exports
```

**Key Components**:
- `App.js`: Manages authentication, ML backend initialization, theme provider
- `AppLayout.js`: Provides consistent layout structure
- `NavigationBar.js`: Handles navigation between main sections
- `PageRouter.js`: Routes between Dashboard, Model Analysis, and Glossary

---

### `/core` - Business Logic & Shared Services
**Purpose**: Core functionality, utilities, and shared business logic

```
core/
├── components/         # Core UI components
├── constants/          # Application constants
├── context/           # React context providers
├── data/              # Data processing utilities
├── hooks/             # Custom React hooks
├── services/          # Business logic services
├── theme/             # Styling and theme configuration
├── utils/             # Utility functions
└── index.js           # Core exports
```

#### Core Subdirectories:

**`/core/components`**
- `ErrorBoundary.js`: Global error handling
- `LoadingSpinner.js`: Loading state component

**`/core/constants`**
- Application-wide constants (vendors, topics, routes, auth config)

**`/core/context`**
- `AppProvider.js`: Global state management using React Context

**`/core/data`**
- `csvProcessor.js`: CSV data processing and statistical analysis

**`/core/hooks`**
- `useAuth.js`: Authentication logic
- `useAnalytics.js`: Analytics tracking
- `useNavigation.js`: Navigation utilities

**`/core/services`**
- `metricsCalculator.js`: ML model metrics calculations (ROC, AUC, calibration)

**`/core/theme`**
- `muiTheme.js`: Material-UI theme configuration
- `tokens.js`: Design tokens (colors, spacing, typography)
- `utils.js`: Theme utility functions

**`/core/utils`**
- `dataUtils.js`: Data manipulation utilities
- `urlUtils.js`: URL parsing and handling

---

### `/features` - Feature Modules
**Purpose**: Self-contained feature modules with their own components and logic

```
features/
├── dashboard/          # Landing page and vendor selection
├── glossary/           # Medical terminology glossary
├── model-analysis/     # ML model analysis dashboard
└── index.js            # Feature exports
```

#### Feature Structure:

**`/features/dashboard`**
- `Dashboard.js`: Main dashboard component
- `components/SelectionForm.js`: Vendor and topic selection form

**`/features/model-analysis`**
- `ModelAnalysis.js`: Model analysis wrapper
- `components/TopicRenderer.js`: Renders specific model analysis components

**`/features/glossary`**
- `Glossary.js`: Medical terminology and definitions

---

### `/components` - Legacy Components (Transitioning)
**Purpose**: Existing components being gradually moved to feature modules

```
components/
├── topics/             # Topic-specific analysis components
├── charts/             # Chart and visualization components
├── metrics/            # Metrics calculation components
├── views/              # View components
└── [various files]     # Standalone components
```

**Note**: This directory contains legacy components that are being gradually refactored into the feature-based structure.

---

### `/shared` - Reusable Components & Utilities
**Purpose**: Reusable UI components and utilities used across features

```
shared/
├── charts/             # Modern chart components
├── hooks/              # Shared React hooks
├── ui/                 # Reusable UI components
└── index.js            # Shared exports
```

#### Shared Subdirectories:

**`/shared/charts`**
- Modern, reusable chart components built with Chart.js and Recharts
- Components: BaseChart, LineChart, BarChart, PieChart, ROCChart, CalibrationChart

**`/shared/hooks`**
- `useResponsive.js`: Responsive design utilities
- `useDataProcessor.js`: Data processing and filtering
- `useDebounce.js`: Debounced value updates
- `useLocalStorage.js`: Local storage management

**`/shared/ui`**
- Reusable UI components following design system patterns
- Components: Button, Card, Select, Typography, Grid, Logo, Container

---

## 🛠️ Development Standards

### Code Formatting & Linting

**ESLint Configuration**:
- Import order: React imports → Third-party imports → Internal imports
- Unused variables must be prefixed with underscore
- No console statements in production code
- Consistent quote usage (single quotes preferred)

**Code Style Guidelines**:
```javascript
// Good: Proper import order
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@mui/material';

import { useAppContext } from '../core/context';
import { PAGES } from '../core/constants';

// Good: Component structure
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  return (
    <div>Content</div>
  );
};
```

### Component Documentation Standards

**Component Header Template**:
```javascript
/**
 * ComponentName - Brief description
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onSubmit - Submit handler
 * @param {boolean} [props.disabled=false] - Whether component is disabled
 * 
 * @example
 * <ComponentName 
 *   title="Example" 
 *   onSubmit={handleSubmit}
 *   disabled={false}
 * />
 */
```

### File Naming Conventions
- Components: `PascalCase.js` (e.g., `SelectionForm.js`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useResponsive.js`)
- Utilities: `camelCase.js` (e.g., `dataUtils.js`)
- Constants: `camelCase.js` or `UPPER_CASE.js`

---

## 🧪 Testing Utilities

### Current Testing Setup
The application uses React Testing Library and Jest for testing.

**Test File Structure**:
```
__tests__/
├── components/
├── hooks/
├── utils/
└── integration/
```

**Testing Patterns**:
```javascript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionForm } from '../features/dashboard/components';

describe('SelectionForm', () => {
  it('should render vendor selection', () => {
    render(<SelectionForm onSubmit={jest.fn()} />);
    expect(screen.getByText('Pick a DSI Application')).toBeInTheDocument();
  });
});
```

### Mock Data Location
```
src/
├── __mocks__/
│   ├── csvData.js      # Sample CSV data for testing
│   ├── chartData.js    # Chart data mocks
│   └── apiResponses.js # API response mocks
```

---

## 🎨 Design System

### Theme Configuration
Located in `/core/theme/`, the design system includes:

**Color Palette**:
```javascript
colors: {
  primary: '#275786',      // Main brand color
  secondary: '#1164ad',    // Hover states
  success: '#388e3c',      // Success states
  warning: '#f57c00',      // Warning states
  error: '#d32f2f',        // Error states
}
```

**Typography Scale**:
- Display: 3.5rem / 56px
- H1-H6: 2.5rem → 1.25rem
- Body: 1rem / 16px
- Caption: 0.75rem / 12px

**Spacing System**: 8px base unit (4px, 8px, 16px, 24px, 32px, etc.)

### Component Usage Examples

**Button Component**:
```jsx
import { Button } from '../shared/ui';

// Basic usage
<Button variant="contained" size="large">
  Click me
</Button>

// With custom styling
<Button 
  variant="outlined" 
  color="primary"
  onClick={handleClick}
  disabled={loading}
>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

**Card Component**:
```jsx
import { Card } from '../shared/ui';

<Card 
  variant="glass" 
  elevation={3}
  padding="large"
>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Responsive Grid**:
```jsx
import { ResponsiveGrid } from '../shared/ui';

<ResponsiveGrid 
  columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
  spacing={3}
>
  {items.map(item => <GridItem key={item.id} />)}
</ResponsiveGrid>
```

---

## 🚀 Development Workflow

### Adding New Features

1. **Create Feature Module**:
```bash
mkdir src/features/new-feature
cd src/features/new-feature
touch index.js NewFeature.js
mkdir components
```

2. **Component Structure**:
```javascript
// src/features/new-feature/NewFeature.js
import React from 'react';
import { useAppContext } from '../../core/context';

const NewFeature = () => {
  // Component logic
  return <div>New Feature</div>;
};

export default NewFeature;
```

3. **Update Routing**:
```javascript
// src/application/routing/PageRouter.js
import { NewFeature } from '../../features/new-feature';

// Add route case
case PAGES.NEW_FEATURE:
  return <NewFeature />;
```

### Adding New UI Components

1. **Create Component**:
```javascript
// src/shared/ui/components/NewComponent.js
import React from 'react';
import { tokens } from '../../../core/theme';

const NewComponent = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  ...props 
}) => {
  return (
    <div 
      style={{
        // Use design tokens
        padding: tokens.spacing[size === 'large' ? 4 : 2],
        borderRadius: tokens.borderRadius.md
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default NewComponent;
```

2. **Export Component**:
```javascript
// src/shared/ui/components/index.js
export { default as NewComponent } from './NewComponent';
```

### Data Processing

**Using CSV Processor**:
```javascript
import { CSVProcessor } from '../core/data';

const processor = new CSVProcessor(csvData);
const filteredData = processor.filterByAge(18, 65);
const metrics = processor.calculateMetrics();
```

**Using Data Processor Hook**:
```javascript
import { useDataProcessor } from '../shared/hooks';

const {
  filteredData,
  metrics,
  filters,
  updateFilters
} = useDataProcessor(csvData, { defaultThreshold: 0.5 });
```

---

## 🔧 Debugging Guidelines

### Common Issues & Solutions

**1. Import Errors**:
```javascript
// ❌ Wrong import order
import { MyComponent } from './MyComponent';
import React from 'react';

// ✅ Correct import order
import React from 'react';
import { MyComponent } from './MyComponent';
```

**2. Context Issues**:
```javascript
// ❌ Using context outside provider
const { activePage } = useAppContext(); // Error if not wrapped

// ✅ Ensure component is wrapped
<AppProvider>
  <MyComponent />
</AppProvider>
```

**3. Chart Rendering Issues**:
```javascript
// ✅ Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);
```

### Debug Tools

**React DevTools**: Enable component tree inspection
**Redux DevTools**: For context state debugging (if needed)
**Console Logging**: Use debug utility for development

```javascript
// Debug utility
const debug = process.env.NODE_ENV === 'development' 
  ? console.log 
  : () => {};

debug('Component rendered with props:', props);
```

---

## 📦 Deployment Notes

### Build Process
```bash
# Development
npm start

# Production build
npm run build

# Test build
npm run build && serve -s build
```

### Environment Variables
```bash
# .env.local
REACT_APP_API_URL=https://api.example.com
REACT_APP_DEBUG=true
```

### Build Optimization
- Code splitting implemented via React.lazy()
- Bundle analysis available via `npm run analyze`
- Asset optimization through webpack configuration

---

## 🤝 Contributing Guidelines

### Code Review Checklist
- [ ] Follows established architecture patterns
- [ ] Components are properly documented
- [ ] No unused imports or variables
- [ ] Consistent with design system
- [ ] Responsive design considerations
- [ ] Error handling implemented
- [ ] Performance considerations addressed

---

## 📚 Additional Resources

### External Dependencies
- **React 18**: Core framework
- **Material-UI v5**: Component library
- **Chart.js**: Data visualization
- **TensorFlow.js**: ML model execution
- **Recharts**: Additional charting library

### Learning Resources
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Chart.js Documentation](https://www.chartjs.org)

### Internal APIs
- Authentication: `/core/hooks/useAuth.js`
- Data Processing: `/core/data/csvProcessor.js`
- Metrics Calculation: `/core/services/metricsCalculator.js`

---

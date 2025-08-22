module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // React specific rules
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General code quality
    'no-unused-vars': ['warn', { 
      vars: 'all', 
      args: 'after-used', 
      ignoreRestSiblings: true,
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_'
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'no-var': 'error',
    
    // Import organization
    'import/order': ['warn', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'never',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    
    // Code style
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'semi': ['warn', 'always'],
    'comma-dangle': ['warn', 'never'],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    
    // Accessibility
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/aria-role': 'warn'
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/']
      }
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};
export default {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/__tests__/setup/env.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/setup/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/**/*.test.js',
    '!src/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};

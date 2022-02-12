const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'babel',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/test/**',
  ],
  coverageDirectory: 'coverage',
  // coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  preset: '@shelf/jest-mongodb',
};

module.exports = config;

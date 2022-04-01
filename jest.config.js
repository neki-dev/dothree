const alias = require('./tools/alias');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...alias.forJest(),
    '(.*).svg$': '<rootDir>/tools/test/void',
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
};

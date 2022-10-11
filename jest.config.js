const alias = require('alias-reuse');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/tools/test/preset.ts',
  ],
  moduleNameMapper: {
    ...alias(__dirname)
      .fromTsconfig()
      .toJest(),
    '^.+\\.svg$': '<rootDir>/tools/test/void',
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
};

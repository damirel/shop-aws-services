module.exports = {
  name: 'import-service',
  displayName: 'Import service tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@libs/(.*)$": "<rootDir>/src/libs/$1"
  },
};
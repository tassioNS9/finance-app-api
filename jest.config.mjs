/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js', '!src/generated/**'],
    coveragePathIgnorePatterns: ['/node_modules/', '/src/generated/'],
    globalSetup: '<rootDir>/jest.global-setup.js',
}

export default config

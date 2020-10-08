module.exports = {
    collectCoverageFrom: [
        '*/**/*.js',
        '**/*.jsx',
        '!userData/**',
        '!scripts/**',
        '!backend/**',
        '!test/**',
        '!widgets/**/backend.js',
        '!coverage-*/**',
        '!dist/**'
    ],
    coverageDirectory: 'coverage-jest',
    coverageReporters: ['json', 'lcov'],
    moduleNameMapper: {
        '\\.(s?css|png)$': '<rootDir>/test/jest/stub'
    },
    moduleDirectories: ['node_modules', 'app', 'widgets'],
    transformIgnorePatterns: ['node_modules/(?!cloudify-ui-components|react-syntax-highlighter)'],
    setupFiles: ['<rootDir>/test/jest/setup.js']
};

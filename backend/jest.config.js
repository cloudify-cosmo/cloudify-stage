module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['!migration.ts', '!migrations/**', '!**/*types.ts', '!**/*.json'],
    coverageThreshold: {
        '.': {
            statements: 52,
            branches: 37,
            lines: 52,
            functions: 43
        },
        '**/*': {
            branches: 2
        }
    },
    moduleNameMapper: {
        elkjs: '<rootDir>/node_modules/elkjs'
    },
    coverageReporters: ['text'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    testEnvironment: 'node'
};

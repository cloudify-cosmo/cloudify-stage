/* eslint-disable no-console */
// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

let changedFiles;
try {
    // Collect coverage only for files changed after this check was first introduced
    changedFiles = execSync(
        'git diff --name-only --relative 1b7bf59d979519d3b465d3f336d5ea69ba7404d7 -- "*.ts" "**/*.js" "**/*.ts"'
    )
        .toString()
        .trim()
        .split('\n');
} catch (e) {
    console.error(e.stderr.toString());
    throw e;
}

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [...changedFiles, 'config.ts', '!db/**', '!migrations/**', '!jest.config.js', '!migration.ts'],
    coverageThreshold: {
        '**/*.{js,ts}': {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1
        }
    },
    moduleNameMapper: {
        elkjs: '<rootDir>/node_modules/elkjs'
    },
    coverageReporters: ['text'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    testEnvironment: 'node'
};

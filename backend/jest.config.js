/* eslint-disable no-console */
// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

let changedFiles;
try {
    // Collect coverage only for files changed after this check was first introduced
    changedFiles = execSync(
        'git diff --name-only --relative 724e8a0f36f8d38cb461ab5373eb85af1f47a6dd -- "*.ts" "**/*.js" "**/*.ts"'
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
    collectCoverageFrom: [...changedFiles, 'config.ts', '!migrations/**', '!jest.config.js', '!migration.ts'],
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
    moduleDirectories: ['node_modules', '..'],
    testEnvironment: 'node'
};

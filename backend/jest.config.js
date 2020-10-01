// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

let changedFiles;
try {
    changedFiles = execSync('git diff --name-only --relative master -- *.js **/*.js 2> /dev/null')
        .toString()
        .trim()
        .split('\n');
} catch (e) {
    console.error(e.stdout.toString());
    throw e;
}

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [...changedFiles, '!migrations/**', '!jest.config.js', '!migration.js'],
    coverageThreshold: {
        '**/*.js': {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1
        }
    },
    coverageReporters: ['text']
};

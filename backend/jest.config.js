/* eslint-disable no-console */
// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

let changedFiles;
try {
    // Collect coverage only for files changed after this check was first introduced
    changedFiles = execSync(
        'git diff --name-only --relative c81b758c27db3147dab9effc7840f0827353e609 -- "*.js" "**/*.js"'
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
    collectCoverageFrom: [...changedFiles, 'config.js', '!migrations/**', '!jest.config.js', '!migration.js'],
    coverageThreshold: {
        '**/*.js': {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1
        }
    },
    coverageReporters: ['text'],
    moduleDirectories: ['node_modules', '..']
};

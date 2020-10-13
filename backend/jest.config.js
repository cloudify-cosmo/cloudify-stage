/* eslint-disable no-console */
// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

let changedFiles;
try {
    // Collect coverage only for files changed after this check was first introduced
    changedFiles = execSync(
        'git diff --name-only --relative dadc76fe91e33eb4bafef5a03306c4adab52ed58 -- "*.js" "**/*.js"'
    )
        .toString()
        .trim()
        .split('\n');
} catch (e) {
    console.error(e.stderr.toString());
    throw e;
}

console.log(`Collecting coverage for: ${changedFiles}`);

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
    coverageReporters: ['text']
};

// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

let changedFiles;
try {
    // Collect coverage only for files changed after this check was first introduced
    changedFiles = execSync(
        'git diff --name-only --relative 4347094038309750af37c8990389a360bf480e07 -- "*.js" "**/*.js"'
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

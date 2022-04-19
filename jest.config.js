// eslint-disable-next-line import/no-extraneous-dependencies
const { defaults } = require('jest-config');

/** @type {import('@jest/types').Config.GlobalConfig} */
module.exports = {
    moduleNameMapper: {
        '\\.(s?css|png)$': '<rootDir>/test/jest/stub'
    },
    moduleDirectories: ['node_modules', 'app', 'widgets'],
    /**
     * TS and TSX are included in the default jest extensions, but
     * eslint-import-resolver-jest uses a different array (https://github.com/JoinColony/eslint-import-resolver-jest/blob/c7b3d04195f1f1100e7c87fb54b1a0d73664e02c/src/index.js#L35)
     * Thus, set it explicitly for resolver-jest to pick it up.
     *
     * @see https://jestjs.io/docs/en/configuration#modulefileextensions-arraystring
     */
    moduleFileExtensions: defaults.moduleFileExtensions,
    transformIgnorePatterns: ['node_modules/(?!cloudify-ui-components|react-syntax-highlighter)'],
    setupFiles: ['<rootDir>/test/jest/setup.ts']
};

const plugins = ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'];
const { COVERAGE_CHECK } = process.env;

if (COVERAGE_CHECK) {
    console.info('Adding istanbul plugin to Babel setup.');
    plugins.push('istanbul');
}

module.exports = {
    presets: [
        [
            '@babel/env',
            {
                loose: true
            }
        ],
        '@babel/react',
        [
            '@babel/typescript',
            {
                onlyRemoveTypeImports: true
            }
        ]
    ],
    plugins
};

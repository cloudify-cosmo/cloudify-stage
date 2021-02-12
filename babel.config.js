module.exports = {
    presets: [
        '@babel/env',
        '@babel/react',
        [
            '@babel/typescript',
            {
                onlyRemoveTypeImports: true
            }
        ]
    ],
    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
};

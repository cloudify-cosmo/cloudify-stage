const mainConfig = require('../../../babel.config');

module.exports = {
    ...mainConfig,
    // NOTE: since the files are loaded into the browser as-is, `require` is not supported
    plugins: mainConfig.plugins.filter(pluginName => pluginName !== '@babel/plugin-transform-runtime')
};

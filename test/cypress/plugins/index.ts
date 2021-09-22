// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import performCommonSetup from 'cloudify-ui-common/cypress/plugins';
import { startDevServer } from '@cypress/webpack-dev-server/';
// @ts-ignore Webpack config not in TS
import getWebpackConfig from '../../../webpack.config';

const setupPluginsAndConfig: Cypress.PluginConfig = (on, config) => {
    config.baseUrl = 'http://localhost:4000';

    // TODO: RD-3233 To be moved to common configuration
    config.componentFolder = 'test/cypress/components';
    config.testFiles = '**/*_spec.{ts,tsx}';

    if (config.testingType === 'component') {
        on('dev-server:start', options =>
            startDevServer({ options, webpackConfig: getWebpackConfig({}, { mode: 'test' })[0] })
        );
    }

    return performCommonSetup(on, config);
};

export default setupPluginsAndConfig;

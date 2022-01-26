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
import del from 'del';
// @ts-ignore Webpack config not in TS
import getWebpackConfig from '../../../webpack.config';

const setupPluginsAndConfig: Cypress.PluginConfig = (on, config) => {
    config.baseUrl = 'http://localhost:4000';

    // Delete the recorded video for specs that had no retry attempts
    // https://github.com/cypress-io/cypress/issues/16377
    on('after:spec', async (spec, results) => {
        if (results && results.video) {
            // Do we have failures for any retry attempts?
            const failures = results.tests?.some(test => test.attempts.some(attempt => attempt?.state === 'failed'));
            if (!failures) {
                // delete the video if the spec passed and no tests retried
                await del(results.video);
            }
        }
    });

    return performCommonSetup(on, config, getWebpackConfig({}, { mode: 'test' })[0]);
};

export default setupPluginsAndConfig;

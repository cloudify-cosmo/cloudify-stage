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

const setupPluginsAndConfig: Cypress.PluginConfig = (on, config) => {
    config.baseUrl = 'http://localhost:4000';
    config.retries = 0;
    config.defaultCommandTimeout = 10;

    return performCommonSetup(on, config);
};

export default setupPluginsAndConfig;

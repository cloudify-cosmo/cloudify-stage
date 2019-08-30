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

module.exports = (on, config) => {
    if (config.env.dev) {
        config.baseUrl = 'http://localhost:4000';
    } else if (process.env.STAGE_E2E_MANAGER_URL) {
        config.baseUrl = `http://${process.env.STAGE_E2E_MANAGER_URL}`;
    } else {
        throw new Error('Environmental variable STAGE_E2E_MANAGER_URL not set.');
    }

    console.info(`Testing on: ${config.baseUrl}`);

    return config;
};

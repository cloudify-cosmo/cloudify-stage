// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// use `Cypress` instead of `cy` so this persists across all tests
Cypress.on('window:before:load', window => {
    // Uncomment for testing HTTP Requests from client-side
    // window.fetch = null;
});

Cypress.Cookies.defaults({
    whitelist: 'XSRF-TOKEN'
});

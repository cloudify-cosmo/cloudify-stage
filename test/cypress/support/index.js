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

// use `Cypress` instead of `cy` so this persists across all tests
Cypress.on('window:before:load', window => {
    delete window.fetch;
    cy.stub(window, 'open');
});

Cypress.Cookies.defaults({
    preserve: 'XSRF-TOKEN'
});

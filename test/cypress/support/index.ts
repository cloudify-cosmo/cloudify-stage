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

import '@cypress/code-coverage/support';

// Import commands.js using ES2015 syntax:
import './commands';
// use `Cypress` instead of `cy` so this persists across all tests
Cypress.on('window:before:load', window => {
    // @ts-ignore: The operand of a 'delete' operator must be optional
    delete window.fetch;
    cy.stub(window, 'open');
});

// Workaround for "ResizeObserver loop limit exceeded" error
// https://github.com/cypress-io/cypress/issues/8418
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
// @ts-ignore As Cypress.on returns "false | void" inconsistent return is fine
// eslint-disable-next-line consistent-return
Cypress.on('uncaught:exception', error => {
    if (resizeObserverLoopErrRe.test(error.message)) return false;
});

Cypress.Cookies.defaults({
    preserve: 'XSRF-TOKEN'
});

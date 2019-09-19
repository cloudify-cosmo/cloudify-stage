// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import './users';
import './sites';
import './templates';
import './localStorage';

let token = '';

Cypress.Commands.add('restoreState', () => cy.restoreLocalStorage());

Cypress.Commands.add('waitUntilLoaded', () => {
    cy.get('#loader', { timeout: 20000 }).should('be.not.visible', true);
});

Cypress.Commands.add('activate', (license = 'valid_trial_license') =>
    cy
        .fixture(`license/${license}.yaml`)
        .then(license =>
            cy.request({
                method: 'PUT',
                url: '/console/sp',
                qs: {
                    su: '/license'
                },
                headers: {
                    Authorization: `Basic ${btoa('admin:admin')}`,
                    'Content-Type': 'text/plain'
                },
                body: license
            })
        )
        .then(() => {
            cy.request({
                method: 'GET',
                url: '/console/sp',
                qs: {
                    su: '/tokens'
                },
                headers: {
                    Authorization: `Basic ${btoa('admin:admin')}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => (token = response.body.value));
        })
);

Cypress.Commands.add('cfyRequest', (url, method = 'GET', headers = null, body = null) =>
    cy.request({
        method,
        url: '/console/sp',
        qs: {
            su: url
        },
        headers: {
            'Authentication-Token': token,
            'Content-Type': 'application/json',
            ...headers
        },
        body
    })
);

Cypress.Commands.add('stageRequest', (url, method = 'GET', headers = null, body = null) => {
    cy.request({
        method,
        url,
        headers: {
            'Authentication-Token': token,
            'Content-Type': 'application/json',
            tenant: 'default-tenant',
            ...headers
        },
        body
    });
});

Cypress.Commands.add('login', (username = 'admin', password = 'admin') => {
    cy.visit('/console/login');

    cy.get('.form > :nth-child(1) > .ui > input')
        .clear()
        .type(username);
    cy.get('.form > :nth-child(2) > .ui > input')
        .clear()
        .type(password);
    cy.get('.form > button').click();

    cy.get('.form > button.loading').should('be.not.visible', true);

    cy.getCookies()
        .should('have.length', 1)
        .then(cookies => {
            expect(cookies[0]).to.have.property('name', 'XSRF-TOKEN');
        });

    cy.waitUntilLoaded().then(() => cy.saveLocalStorage());
});

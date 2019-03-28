// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import './localStorage';


Cypress.Commands.add('restoreState', () => cy.restoreLocalStorage());

Cypress.Commands.add('waitUntilLoaded', () => {
    cy.get('#loader', {timeout: 20000})
        .should('be.not.visible', true);
});

Cypress.Commands.add('activate', () =>
    cy.fixture('license/valid_paying_license.yaml')
        .then((license) =>
            cy.request({
                method: 'PUT',
                url: '/console/sp',
                qs: {
                    su: '/license'
                },
                headers: {
                    'Authorization': `Basic ${btoa('admin:admin')}`,
                    'Content-Type': 'text/plain'
                },
                body: license
            }))
);

Cypress.Commands.add('login', (username = 'admin', password = 'admin') => {
    cy.visit('/console/login')
        .waitUntilLoaded()

    cy.get('.form > :nth-child(1) > .ui > input').type(username);
    cy.get('.form > :nth-child(2) > .ui > input').type(password);
    cy.get('.form > button').click();

    cy.get('.form > button.loading')
        .should('be.not.visible', true);

    cy.getCookies()
        .should('have.length', 1)
        .then((cookies) => {
            expect(cookies[0]).to.have.property('name', 'XSRF-TOKEN');
        });

    cy.waitUntilLoaded()
        .then(() => cy.saveLocalStorage());
});
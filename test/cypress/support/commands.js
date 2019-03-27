// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/console/login');

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

    cy.get('#loader',{ timeout: 20000 })
        .should('be.not.visible', true);
});


let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
});

Cypress.Commands.add('restoreLocalStorage', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
});
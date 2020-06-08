describe('Page management', () => {
    const getPageRow = pageId =>
        cy
            .get('.red.segment')
            .should('be.visible', true)
            .within(() =>
                cy
                    .contains(pageId)
                    .parent()
                    .parent()
            );

    before(() => {
        cy.activate().removeUserPages();
        cy.login();
    });

    it('allows admin users to create and modify pages', () => {
        cy.get('.usersMenu').click();
        cy.get('.usersMenu')
            .contains('Template Management')
            .click();

        cy.get('.createPageButton').click();

        cy.log('Specifying page name');
        cy.get('.field > .ui > input').type('Page 1');

        cy.log('Creating page');
        cy.get('.actions > .ok').click();

        cy.log('Adding widgets');
        cy.contains('Add Widget').click();
        cy.get('[data-id="agents"]').click();
        cy.get('[data-id="blueprintSources"]').click();
        cy.get('button#addWidgetsBtn').click();

        cy.log('Saving page');
        cy.contains('Save').click();

        cy.log('Veryfiying page');
        cy.get('tr:contains(page_1) td:nth-child(2)').should('have.text', 'Page 1');

        cy.log('Editing page');
        cy.get('.edit').click();

        cy.log('Verifying widgets');
        cy.get('.agentsWidget').should('be.visible', true);
        cy.get('.blueprintSourcesWidget').should('be.visible', true);

        cy.log('Adding more widgets');
        cy.contains('Add Widget').click();
        cy.get('[data-id="plugins"]').click();
        cy.get('[data-id="snapshots"]').click();
        cy.get('button#addWidgetsBtn').click();

        cy.log('Saving page');
        cy.contains('Save')
            .click()
            .should('not.exist');

        cy.log('Removing page');
        cy.get('.remove').click();
        cy.get('.popup button.green').click();
        cy.get('.main .loading').should('be.not.visible', true);

        cy.log('Verifying page was removed');
        cy.getPages().then(data => expect(data.body.filter(page => page.id === 'page_1')).to.be.empty);
    });
});

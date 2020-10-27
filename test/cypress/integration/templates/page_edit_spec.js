describe('Page management', () => {
    before(() => {
        cy.activate().removeUserPages();
        cy.login();
    });

    it('allows admin users to create and modify pages', () => {
        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();

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

        cy.log('Managing tabs');
        cy.contains('Add Tabs').click();
        cy.get('.tabContent').contains('Add Widget').click();
        cy.get('[data-id="blueprints"]').click();
        cy.get('button#addWidgetsBtn').click();
        cy.get('.item .editModeButton .add').click();
        cy.get('.editModeButton .remove:eq(0)').click();
        cy.contains('Yes').click();
        cy.get('.editModeButton .remove:eq(0)').click();
        cy.get('.tabContent').contains('Add Widget').click();
        cy.get('[data-id="blueprints"]').click();
        cy.get('button#addWidgetsBtn').click();
        cy.get('.item .editModeButton .add').click();
        cy.get('.editModeButton .edit:eq(1)').click();
        cy.get('.modal input[type=text]').type(2);
        cy.get('.modal .toggle').click();
        cy.get('.modal').contains('Save').click();

        cy.log('Saving page');
        cy.contains('Save').click();

        cy.log('Veryfiying page row');
        cy.get('tr:contains(page_1) td:nth-child(2)').should('have.text', 'Page 1');

        cy.log('Verifying page content');
        cy.get('.updatePageIcon.edit').click();
        cy.get('.agentsWidget').should('be.visible', true);
        cy.get('.blueprintSourcesWidget').should('be.visible', true);
        cy.contains('New Tab').should('not.have.class', 'active');
        cy.contains('New Tab2').should('have.class', 'active');
        cy.contains('New Tab').click();
        cy.get('.blueprintsWidget');

        cy.log('Adding more widgets');
        cy.contains('Add Widget').click();
        cy.get('[data-id="plugins"]').click();
        cy.get('[data-id="snapshots"]').click();
        cy.get('button#addWidgetsBtn').click();

        cy.log('Saving page');
        cy.contains('Save').click().should('not.exist');

        cy.log('Removing page');
        cy.contains('.segment', 'Pages').find('.remove').click();
        cy.get('.popup button.green').click();
        cy.get('.main .loading').should('be.not.visible', true);

        cy.log('Verifying page was removed');
        cy.getPages().then(data => expect(data.body.filter(page => page.id === 'page_1')).to.be.empty);
    });
});

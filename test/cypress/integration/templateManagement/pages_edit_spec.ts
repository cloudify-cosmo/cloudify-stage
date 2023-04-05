import type { GetPagesResponse } from 'backend/routes/Templates.types';

describe('Page management', () => {
    before(() => {
        cy.activate().removeUserPages().goToTemplateManagement();
    });

    it('allows admin users to create and modify pages', () => {
        const pageName = 'Page 1';

        cy.get('.createPageButton').click();

        cy.log('Specifying page name');
        cy.get('.field > .ui > input').type(pageName);

        cy.log('Creating page');
        cy.get('.actions > .ok').click();

        cy.log('Setting icon');
        cy.get('.expand').click();
        cy.get('.popup').within(() => {
            cy.get('input').type('rocket{enter}');
            cy.contains('Save').click();
        });
        cy.get('.rocket').should('be.visible');

        cy.log('Adding widgets');
        cy.contains('Add Widgets').click();
        cy.waitUntilWidgetsDataLoaded(20);
        cy.contains('Add Widget').click();
        cy.waitUntilWidgetsDataLoaded(20);
        cy.get('[data-id="agents"]').click();
        cy.get('[data-id="blueprintSources"]').click();
        cy.contains('Add selected widgets (2)').click();

        cy.log('Managing tabs');
        cy.contains('Add Tabs').click();
        cy.get('.tabContent').contains('Add Widget').click();
        cy.get('[data-id="blueprints"]').click();
        cy.get('button#addWidgetsBtn').click();
        cy.get('.item .editModeButton .add').click();
        cy.get('.item .remove:eq(0)').click();
        cy.contains('Yes').click();
        cy.get('.item .remove:eq(0)').click();
        cy.get('.tabContent').contains('Add Widget').click();
        cy.get('[data-id="blueprints"]').click();
        cy.get('button#addWidgetsBtn').click();
        cy.get('.item .editModeButton .add').click();
        cy.get('.editModeButton .edit:eq(1)').click();
        cy.get('.modal input[type=text]').type('2');
        cy.get('.modal .toggle').click();
        cy.get('.modal').contains('Save').click();

        cy.log('Saving page');
        cy.intercept('GET', '/console/templates/pages').as('fetchPages');
        cy.contains('Save').click();

        cy.log('Veryfiying page row');
        cy.wait('@fetchPages');
        cy.get('.loading').should('not.exist');
        cy.contains('.segment', 'Pages')
            .find('table')
            .getTable()
            .should(tableContent => {
                const addedPageRow = tableContent[tableContent.length - 1];
                expect(addedPageRow['Page id']).to.equal('page_1');
                expect(addedPageRow['Page name']).to.equal('Page 1');
            });
        cy.contains('tr', 'page_1').find('.rocket').scrollIntoView().should('be.visible');

        cy.log('Verifying page content');
        cy.get('.updatePageIcon.edit').click();
        cy.get('.agentsWidget').should('be.visible', true);
        cy.get('.react-grid-item.blueprintSourcesWidget').scrollIntoView().should('be.visible', true);
        cy.contains('New Tab').should('not.have.class', 'active');
        cy.contains('New Tab2').should('have.class', 'active');
        cy.contains('New Tab').click();
        cy.get('.blueprintsWidget');

        cy.log('Changing page name');
        cy.get('.pageTitle').click();
        cy.get('.pageTitle input').type('.1');

        cy.log('Changing page icon');
        cy.get('.pages .rocket').click();
        cy.get('.popup').within(() => {
            cy.get('.dropdown.clear.icon').click();
            cy.contains('Save').click();
        });
        cy.get('.expand').should('be.visible');

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
        cy.get('.main .loading').should('not.exist');

        cy.log('Verifying page was removed');
        cy.getPages().then(
            ({ body }: { body: GetPagesResponse }) =>
                expect(body.filter(page => page?.id.startsWith('page'))).to.be.empty
        );
    });
});

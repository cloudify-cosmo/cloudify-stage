describe('Edit mode', () => {
    before(() => cy.activate('valid_trial_license'));

    beforeEach(() => {
        cy.fixture('page/page_with_tabs').then(testPage =>
            cy.stageRequest('/console/ua', 'POST', {
                body: {
                    appData: {
                        pages: [testPage]
                    },
                    version: 4
                }
            })
        );
        cy.login();
    });

    it('should allow to edit widget settings', () => {
        cy.get('.usersMenu').click();
        cy.contains('Edit Mode').click();

        cy.get('.blueprintsWidget .setting').click({ force: true });

        cy.get('.pollingTime input').type(0);
        cy.contains('Save').click();

        cy.reload();
        cy.get('.usersMenu').click();
        cy.contains('Edit Mode').click();

        cy.get('.blueprintsWidget .setting').click({ force: true });
        cy.get('.pollingTime input').should('have.value', '100');
    });

    it('should allow to remove widget', () => {
        cy.get('.usersMenu').click();
        cy.contains('Edit Mode').click();

        cy.get('.blueprintsWidget .remove').click({ force: true });
        cy.get('.blueprintsWidget').should('not.exist');

        cy.reload();
        cy.contains('.widgetName', 'Catalog').should('be.visible');
        cy.get('.blueprintsWidget').should('not.exist');
    });

    it('should allow to add widget', () => {
        cy.get('.usersMenu')
            .click()
            .contains('Edit Mode')
            .click();
        cy.get('.editModeButton:contains(Add Widget):eq(1)').click();
        cy.get('*[data-id=blueprintSources]').click();
        cy.contains('Add selected widgets').click();
        cy.contains('.message', 'Edit mode')
            .contains('Exit')
            .click();

        cy.contains('.react-grid-layout:eq(1) .widgetName', 'Blueprint Sources');

        cy.reload();
        cy.contains('.react-grid-layout:eq(1) .widgetName', 'Blueprint Sources');
    });
});

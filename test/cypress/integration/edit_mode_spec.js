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
        cy.get('.usersMenu')
            .click()
            .contains('Edit Mode')
            .click();
    });

    it('should allow to edit widget settings', () => {
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
        cy.get('.blueprintsWidget .remove').click({ force: true });
        cy.get('.blueprintsWidget').should('not.exist');

        cy.reload();
        cy.contains('.widgetName', 'Catalog').should('be.visible');
        cy.get('.blueprintsWidget').should('not.exist');
    });

    it('should allow to add widget', () => {
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

    it('should allow to remove and add tabs', () => {
        cy.get('.editModeButton .remove:eq(0)').click();
        cy.contains('Yes').click();
        cy.get('.editModeButton .remove').click();
        cy.contains('Yes').click();

        cy.contains('Add Tabs').click();

        cy.get('.editModeButton .remove:eq(0)').click();
        cy.contains('New Tab').should('have.length', 1);
    });

    it('should allow to rename tab and set default tab', () => {
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal input[type=text]').type(2);
        cy.get('.modal .toggle').click();
        cy.contains('Save').click();

        cy.log('Verify default flag was set');
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal .toggle.checked');
        cy.contains('Cancel').click();

        cy.log('Set another tab as default');
        cy.get('.editModeButton .edit:eq(1)').click();
        cy.get('.modal .toggle').click();
        cy.contains('Save').click();

        cy.log('Verify previous tab is no longer default');
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal .toggle:not(.checked)');

        cy.log('Verify updates are preserved');
        cy.reload().waitUntilLoaded();
        cy.contains('Tab12').should('not.have.class', 'active');
        cy.contains('Tab2').should('have.class', 'active');
    });
});

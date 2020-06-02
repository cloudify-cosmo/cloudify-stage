describe('Page tabs', () => {
    const testPage = {
        id: 'admin_dashboard',
        name: 'Admin Dashboard',
        description: '',
        tabs: [
            {
                name: 'Tab1',
                widgets: [
                    {
                        id: '9a710b70-9183-49a3-ba14-6c0d47c0b23d',
                        name: 'Cluster Status',
                        definition: 'highAvailability',
                        configuration: {}
                    },
                    {
                        id: '4331eb43-bd5e-4170-b3fd-aa01de7917b8',
                        name: 'Blueprints',
                        definition: 'blueprints',
                        configuration: {}
                    }
                ]
            },
            {
                name: 'Tab2',
                widgets: [
                    {
                        id: '3bb0dca0-b290-4dc1-ae2a-62b3bcb4fdef',
                        name: 'Number of deployments',
                        definition: 'deploymentNum',
                        configuration: { pollingTime: 10, page: 'deployments' }
                    }
                ]
            }
        ],
        widgets: [
            {
                id: '0be12640-7352-4e33-b651-ae4905942ebc',
                name: 'Number of blueprints',
                definition: 'blueprintNum',
                configuration: { pollingTime: 10, page: 'local_blueprints' }
            },
            {
                id: '9c8134b6-3ec3-4251-abb5-52ca8e6c9a61',
                name: 'Catalog',
                definition: 'blueprintCatalog',
                configuration: {}
            }
        ]
    };

    before(() => cy.activate('valid_trial_license').login());

    beforeEach(() => {
        cy.stageRequest('/console/ua', 'POST', {
            body: {
                appData: {
                    pages: [testPage]
                },
                version: 4
            }
        });
        cy.reload();
    });

    it('should work when present on active page', () => {
        cy.contains('.widgetName', 'Cluster Status');
        cy.contains('.widgetName', 'Blueprints');

        cy.contains('Tab2').click();

        // Verify tabs switching works
        cy.contains('.widgetName', 'Cluster Status').should('not.exist');
        cy.contains('.widgetName', 'Blueprints').should('not.exist');
        cy.get('.deploymentNumWidget');

        cy.contains('Tab1').click();

        // Verify widget maximize button works for widgets inside tabs
        cy.get('.blueprintsWidget .expand').click({ force: true });

        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.contains('.widgetName', 'Catalog').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        // Verify maximize state is saved
        cy.reload();
        cy.contains('.widgetName', 'Blueprints').should('be.visible');
        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.contains('.widgetName', 'Catalog').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        // Verify widget collapse button works
        cy.get('.blueprintsWidget .compress').click({ force: true });
        cy.contains('.widgetName', 'Catalog').should('be.visible');
    });

    it('should allow to edit widget settings when present on edited page', () => {
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

    it('should allow to remove widget when present on edited page', () => {
        cy.get('.usersMenu').click();
        cy.contains('Edit Mode').click();

        cy.get('.blueprintsWidget .remove').click({ force: true });
        cy.get('.blueprintsWidget').should('not.exist');

        cy.reload();
        cy.contains('.widgetName', 'Catalog').should('be.visible');
        cy.get('.blueprintsWidget').should('not.exist');
    });

    it('should work when present on page preview', () => {
        cy.server();
        cy.route('/console/appData/templates/pages/adminDash.json', testPage);

        cy.get('.usersMenu').click();
        cy.contains('Template Management').click();

        cy.get('.segment:contains(Pages) .search:eq(0)').click();

        // Verify tabs switching works
        cy.contains('Tab2').click();
        cy.contains('.widgetName', 'Cluster Status').should('not.exist');
        cy.contains('.widgetName', 'Blueprints').should('not.exist');
        cy.get('.deploymentNumWidget');

        cy.contains('Tab1').click();

        // Verify widget maximize button works for widgets inside tabs
        cy.get('.blueprintsWidget .expand').click({ force: true });

        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.contains('.widgetName', 'Catalog').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        // Verify widget collapse button works
        cy.get('.blueprintsWidget .compress').click({ force: true });
        cy.contains('.widgetName', 'Cluster Status').should('be.visible');
        cy.contains('.widgetName', 'Cluster Status').should('be.visible');
        cy.contains('Tab1').should('be.visible');
        cy.contains('Tab2').should('be.visible');
    });
});

import Consts from 'app/utils/consts';

describe('Page', () => {
    before(() => {
        cy.activate('valid_trial_license');
        cy.fixture('pages/page_with_tabs').then(testPage =>
            cy.stageRequest('/console/ua', 'POST', {
                body: {
                    appData: {
                        pages: [
                            testPage,
                            {
                                id: 'another_page',
                                name: 'Another Page',
                                type: 'page',
                                description: '',
                                widgets: []
                            }
                        ]
                    },
                    appDataVersion: Consts.APP_VERSION
                }
            })
        );
        cy.mockLogin();
    });

    function verifyAllWidgetsVisible() {
        cy.contains('.widgetName', 'Blueprints').should('be.visible');
        cy.contains('.widgetName', 'Cluster Status').should('be.visible');
        cy.contains('.widgetName', 'Catalog').should('be.visible');
        cy.get('.blueprintNumWidget').should('be.visible');
    }

    it('should allow to switch tabs and maximize widgets', () => {
        cy.intercept('POST', '/console/ua').as('updateUserApps');

        cy.contains('.widgetName', 'Cluster Status');
        cy.contains('.widgetName', 'Blueprints');

        cy.contains('Tab2').click();

        cy.log('Verify tabs switching works');
        cy.contains('.widgetName', 'Cluster Status').should('not.exist');
        cy.contains('.widgetName', 'Blueprints').should('not.exist');
        cy.get('.deploymentNumWidget');

        cy.log('Verify page switching reverts active tab to default');
        cy.visitPage('Another Page');
        cy.visitPage('Admin Dashboard');
        cy.contains('.active', 'Tab1');
        cy.contains('.item:not(.active)', 'Tab2');

        cy.log('Verify widget maximize button works for widgets inside tabs');
        cy.get('.blueprintsWidget .expand').click({ force: true });
        cy.wait('@updateUserApps');

        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.contains('.widgetName', 'Catalog').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        cy.log('Verify maximize state is not saved for widgets in tabs');
        cy.refreshTemplate();
        verifyAllWidgetsVisible();

        cy.log('Verify widget maximize button works for top level widgets');
        cy.get('.blueprintCatalogWidget .expand').click({ force: true });
        cy.wait('@updateUserApps');

        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.contains('.widgetName', 'Blueprints').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        cy.log('Verify maximize state is saved for top level widgets');
        cy.refreshTemplate();
        cy.contains('.widgetName', 'Catalog').should('be.visible');
        cy.contains('.widgetName', 'Blueprints').should('not.be.visible');
        cy.contains('.widgetName', 'Cluster Status').should('not.be.visible');
        cy.get('.blueprintNumWidget').should('not.be.visible');

        cy.log('Verify widget collapse button works');
        cy.get('.blueprintCatalogWidget .compress').click({ force: true });
        cy.wait('@updateUserApps');

        verifyAllWidgetsVisible();
    });
});

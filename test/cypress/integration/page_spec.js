describe('Page', () => {
    before(() => {
        cy.activate('valid_trial_license');
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

    it('should allow to switch tabs and maximize widgets', () => {
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
});

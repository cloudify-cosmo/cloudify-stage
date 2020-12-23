describe('Deployment Info', () => {
    const blueprintName = 'deployment_info_test_dp';
    const deploymentName = 'deployment_info_test_dep';
    const siteName = 'deployment_info_test_site';

    before(() => {
        cy.activate()
            .usePageMock('deploymentInfo', { showBlueprint: true, showCreator: true, showSite: true })
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .deleteSites()
            .uploadBlueprint('blueprints/simple.zip', blueprintName, 'blueprint.yaml', 'global')
            .deployBlueprint(blueprintName, deploymentName, { server_ip: 'localhost' })
            .createSite({ name: siteName, visibility: 'global' })
            .setDeploymentContext(deploymentName);
    });

    beforeEach(() => {
        cy.get('div.deploymentInfoWidget')
            .should('be.visible')
            .within(() => cy.contains('Loading').should('not.be.visible'));
    });

    it('provides basic information about deployment', () => {
        cy.get('div.deploymentInfoWidget').within(() => {
            cy.contains('h3.header', deploymentName).should('be.visible');
            cy.contains('h3.header div.sub.header', 'This is very simple blueprint').should('be.visible');
            cy.get('i.green.user.link.icon').should('be.visible'); // Visibility Icon
            cy.contains('h3.header', 'Blueprint').should('be.visible');
            cy.contains('h3.header div.sub.header', blueprintName).should('be.visible');
            cy.contains('h3.header', 'Site Name').should('not.be.visible');
            cy.contains('h3.header', 'Created').should('be.visible');
            cy.contains('h3.header', 'Updated').should('not.be.visible');
            cy.contains('h3.header', 'Creator').should('be.visible');
            cy.contains('h3.header', 'Node Instances').should('be.visible');
        });
    });

    it('allows to change deployment visibility', () => {
        cy.get('div.deploymentInfoWidget i.green.user.link.icon').click();
        cy.get('div.popup button.blue').click();
        cy.get('div.modal button.primary').click();

        cy.get('div.deploymentInfoWidget i.blue.globe.disabled.icon').should('be.visible');
    });

    it('allows to customize view in widget configuration', () => {
        cy.contains('h3.header', 'Blueprint').should('be.visible');

        // Turn on edit mode and open widget configuration
        cy.get('.usersMenu').click();
        cy.get('div#editModeMenuItem').click();
        cy.get('div.deploymentInfoWidget div.loader').should('be.not.visible');
        cy.get('div.react-grid-item div.deploymentInfoWidget .editWidgetIcon').click({ force: true });

        // Change widget configuration
        cy.get('div.modal').within(() => {
            cy.get('div.showBlueprint .checkbox').click();
            cy.get('button.ok').click();
        });

        // Turn off edit mode
        cy.get('.usersMenu').click();
        cy.get('div#editModeMenuItem').click();

        // Verify that changes were applied
        cy.contains('h3.header', 'Blueprint').should('not.be.visible');
    });

    it('shows Site Name only when it is not empty', () => {
        // Detach deployment from site
        cy.setSite(deploymentName, '');

        // Verify that Site Name is not displayed
        cy.contains('h3.header', 'Site Name', { timeout: 12000 }).should('not.be.visible');

        // Set site for deployment
        cy.setSite(deploymentName, siteName);

        // Verify that Site Name is displayed
        cy.contains('h3.header', 'Site Name', { timeout: 12000 }).should('be.visible');
        cy.contains('h3.header div.sub.header', siteName).should('be.visible');
    });
});

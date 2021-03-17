describe('Deployments View widget', () => {
    const blueprintName = 'deployments_view_test';
    const deploymentName = 'deployments_view_test_dep';
    const siteName = 'Olsztyn';
    const blueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/simple-hello-world-example.zip';

    before(() => {
        cy.activate()
            .deleteSites(siteName)
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite({ name: siteName })
            .setSite(deploymentName, siteName);
    });

    beforeEach(() => {
        cy.interceptSp('GET', 'deployments').as('deployments');
        // NOTE: add widget through Edit Mode to apply default configuration automatically
        cy.usePageMock([], {}, ['deploymentsView']).mockLogin().addWidget('deploymentsView');
    });

    // TODO: test changing the visible columns in the configuration

    it('should display the deployments', () => {
        cy.wait('@deployments');

        cy.get('tr').within(() => {
            cy.contains(deploymentName);
            cy.contains(blueprintName);
            cy.contains(siteName);
        });
    });
});

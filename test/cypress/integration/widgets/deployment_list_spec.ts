import { exampleBlueprintUrl } from '../../support/resource_urls';

describe('DeploymentList widget', () => {
    const blueprintName = 'deployments_test_hw';
    const deploymentId = 'deployments_test_hw_dep';
    const deploymentName = `${deploymentId}_name`;
    const siteName = 'Zakopane';
    const site = { name: siteName };
    const blueprintUrl = exampleBlueprintUrl;

    before(() => {
        cy.activate('valid_trial_license')
            .deleteSites(siteName)
            .deleteDeployments(deploymentId, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentId, { webserver_port: 9123 }, { display_name: deploymentName })
            .createSite(site)
            .usePageMock('deploymentList', { pollingTime: 5 })
            .mockLogin();
    });

    describe('should display', () => {
        it('blueprint name', () => {
            cy.get('.deploymentListWidget').within(() => {
                cy.contains(`${deploymentName}`);
            });
        });
    });
});

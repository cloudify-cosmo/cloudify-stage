import _ from 'lodash';
import { waitUntilEmpty } from '../../support/resource_commons';

describe('Topology', () => {
    const resourcePrefix = 'topology_test_';

    before(() => {
        cy.activate('valid_trial_license').usePageMock('topology', { pollingTime: 5 });
    });

    describe('presents data for selected', () => {
        const blueprintId = `${resourcePrefix}bp`;
        const deploymentId = `${resourcePrefix}dep`;
        const blueprintFile = 'blueprints/topology.zip';

        before(() => {
            cy.mockLogin()
                .deletePlugins()
                .uploadPluginFromCatalog('Terraform')
                .deleteDeployments(resourcePrefix, true)
                .deleteBlueprints(resourcePrefix, true)
                .uploadBlueprint(blueprintFile, blueprintId)
                .then(() => cy.deployBlueprint(blueprintId, deploymentId));
        });

        beforeEach(() => {
            cy.interceptSp('GET', '/summary').as('getSummary');
        });

        it('blueprint', () => {
            cy.setBlueprintContext(blueprintId);

            cy.log('Check Topology widget');
            cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
            cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
            cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');
        });

        it('deployment', () => {
            cy.setDeploymentContext(deploymentId);

            cy.log('Check Topology widget');
            cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
            cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');

            cy.log('Install the deployment');
            cy.executeWorkflow(deploymentId, 'install');

            const installDeploymentTimeout = 60 * 1000;

            cy.log('Check terraform module details');
            cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
            cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');
            cy.get('.nodeTopologyButton:eq(0)', { timeout: installDeploymentTimeout })
                .should('not.have.css', 'visibility', 'hidden')
                .click({ force: true });
            cy.get('.modal td:eq(0)').should('have.text', 'null_resource');
            cy.get('.modal td:eq(2)').should('have.text', 'provider["registry.terraform.io/hashicorp/null"]');
            cy.get('.modal tr:eq(1) td:eq(1)').should('have.text', 'foo1');
            cy.get('.modal tr:eq(2) td:eq(1)').should('have.text', 'foo2');
            cy.get('.modal tr:eq(1) td:eq(3)')
                .invoke('text')
                .then(rawData => {
                    const parsedData = JSON.parse(rawData);
                    expect(_.omit(parsedData, 'instances')).to.deep.equal({
                        provider: 'provider["registry.terraform.io/hashicorp/null"]',
                        type: 'null_resource',
                        mode: 'managed',
                        name: 'foo1'
                    });
                    expect(parsedData.instances.length).to.equal(2);
                    parsedData.instances.forEach((instance, i) => {
                        expect(_.omit(instance, 'attributes')).to.deep.equal({
                            schema_version: 0,
                            dependencies: ['null_resource.foo2'],
                            index_key: i
                        });
                        expect(_.size(instance.attributes)).to.equal(2);
                        expect(instance.attributes.id).to.match(/^\d+$/);
                        expect(instance.attributes.triggers).to.deep.equal({ cluster_instance_ids: 'dummy_id' });
                    });
                });
            cy.get('.modal tr:eq(2) td:eq(3)')
                .invoke('text')
                .then(rawData => {
                    const parsedData = JSON.parse(rawData);
                    expect(_.omit(parsedData, 'instances')).to.deep.equal({
                        provider: 'provider["registry.terraform.io/hashicorp/null"]',
                        type: 'null_resource',
                        mode: 'managed',
                        name: 'foo2'
                    });
                    expect(parsedData.instances.length).to.equal(1);
                    expect(_.omit(parsedData.instances[0], 'attributes')).to.deep.equal({
                        schema_version: 0
                    });
                    expect(_.size(parsedData.instances[0].attributes)).to.equal(2);
                    expect(parsedData.instances[0].attributes.id).to.match(/^\d+$/);
                    expect(parsedData.instances[0].attributes.triggers).to.be.null;
                });
            cy.contains('Close').click();

            cy.get('.nodeTopologyButton:eq(1)').click({ force: true });
            cy.contains('.nodeContainer', 'foo1').contains('.plannedInstances', 2);
            cy.contains('.nodeContainer', 'foo2').contains('.plannedInstances', 1);
            cy.get('.connectorContainer').should('have.length', 2);

            cy.get('.nodeTopologyButton:eq(1)').click({ force: true });
            cy.contains('foo1').should('not.exist');
            cy.contains('foo2').should('not.exist');
            cy.get('.connectorContainer').should('have.length', 1);
        });
    });

    describe('provides support for component nodes', () => {
        const appDeployment = 'app';
        const componentDeployment = 'component';

        before(() => {
            const blueprintFile = 'blueprints/component_app.zip';
            const componentBlueprint = 'component';
            const componentBlueprintYamlFile = 'component.yaml';
            const appBlueprint = 'app';
            const appBlueprintYamlFile = 'app.yaml';

            // NOTE: Do not mock login to load all currently available pages and test drill-down to site
            cy.login()
                .deleteDeployments('component', true)
                .deleteDeployments('app', true)
                .deleteBlueprints(componentBlueprint, true)
                .deleteBlueprints(appBlueprint, true)
                .uploadBlueprint(blueprintFile, componentBlueprint, componentBlueprintYamlFile)
                .uploadBlueprint(blueprintFile, appBlueprint, appBlueprintYamlFile)
                .then(() => cy.deployBlueprint(appBlueprint, appDeployment))
                .then(() => cy.executeWorkflow('app', 'install'));
        });

        beforeEach(() => {
            cy.interceptSp('GET', '/nodes').as('fetchNodes');
            cy.interceptSp('GET', '/node-instances').as('fetchNodeInstances');
            cy.interceptSp('GET', '/deployments').as('fetchDeployments');

            cy.visitPage('Test Page');
            cy.setDeploymentContext('app');
            waitUntilEmpty(`deployments?id=${appDeployment}&deployment_status=in_progress`);

            cy.wait('@fetchNodes');
            cy.wait('@fetchNodeInstances');
            cy.wait('@fetchDeployments');
            cy.waitUntilPageLoaded();

            cy.get('.scrollGlass').click();
        });

        it('allows to open component deployment page', () => {
            cy.get('.nodeTopologyButton').eq(0).as('goToDeploymentPageIcon').click();

            cy.location('pathname').should('be.equal', `/console/page/test_page_deployment/${componentDeployment}`);
            cy.location('search').then(queryString =>
                expect(JSON.parse(new URLSearchParams(queryString).get('c'))[1]).to.deep.equal({
                    context: { deploymentId: componentDeployment },
                    pageName: componentDeployment
                })
            );
        });

        it('allows to expand component node', () => {
            cy.get('.nodeTopologyButton').eq(1).as('expandCollapseComponentIcon').click({ force: true });
            cy.contains('host(component').should('be.visible');
        });
    });
});

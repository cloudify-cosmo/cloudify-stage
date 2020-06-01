import _ from 'lodash';

describe('Topology', () => {
    const resourcePrefix = 'topology_test_';
    const blueprintId = `${resourcePrefix}bp`;
    const deploymentId = `${resourcePrefix}dep`;
    const pluginWagonUrl =
        'http://repository.cloudifysource.org/cloudify/wagons/cloudify-terraform-plugin/0.13.1/cloudify_terraform_plugin-0.13.1-py27-none-linux_x86_64-redhat-Maipo.wgn';
    const pluginYamlUrl = 'http://www.getcloudify.org/spec/terraform-plugin/0.13.1/plugin.yaml';
    const blueprintFile = 'blueprints/topology.zip';

    before(() => {
        cy.activate('valid_trial_license').login();

        cy.installPlugin(pluginWagonUrl, pluginYamlUrl)
            .deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint(blueprintFile, blueprintId)
            .then(() => cy.deployBlueprint(blueprintId, deploymentId));
    });

    beforeEach(() => {
        cy.server();
        cy.route(/console\/sp\/\?su=\/summary/).as('getSummary');
    });

    it('is presented in Blueprint page', () => {
        // Navigate to Local Blueprints page
        cy.get('.local_blueprintsPageMenuItem').click();

        // Use search to limit number of presented blueprints
        cy.route(/console\/sp\/\?su=\/blueprints/).as('getBlueprints');
        cy.get('.blueprintsTable div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getBlueprints');
        cy.wait('@getSummary');

        // Go into Blueprint page
        cy.get(`#blueprintsTable_${blueprintId} > td > .blueprintName`).click();

        // Check Topology widget
        cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');
    });

    it('is presented in Deployment page', () => {
        // Navigate to Deployments page
        cy.get('.deploymentsPageMenuItem').click();

        // Use search to limit number of presented deployments
        cy.route(/console\/sp\/\?su=\/deployments/).as('getDeployments');
        cy.route(/console\/sp\/\?su=\/executions/).as('getExecutions');
        cy.get('.segmentList div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getDeployments');
        cy.wait('@getSummary');
        cy.wait('@getExecutions');

        // Go into Deployment page
        cy.get(`.ui.segment.${deploymentId} > .ui > .row`).click();

        // Check Topology widget
        cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');

        // Install the deployment
        cy.executeWorkflow(deploymentId, 'install');
        cy.get('.executionsTable tr:eq(2)');
        cy.get('.executionsTable tr:eq(1)').contains('completed');

        cy.reload();

        // Check terraform module details
        cy.get('.nodeTopologyButton:eq(0)').click({ force: true });
        cy.get('.modal td:eq(0)').should('have.text', 'null_resource');
        cy.get('.modal td:eq(2)').should('have.text', 'provider.null');
        cy.get('.modal tr:eq(1) td:eq(1)').should('have.text', 'foo1');
        cy.get('.modal tr:eq(2) td:eq(1)').should('have.text', 'foo2');
        cy.get('.modal tr:eq(1) td:eq(3)')
            .invoke('text')
            .then(rawData => {
                const parsedData = JSON.parse(rawData);
                expect(_.omit(parsedData, 'instances')).to.deep.equal({
                    provider: 'provider.null',
                    type: 'null_resource',
                    mode: 'managed',
                    name: 'foo1',
                    each: 'list'
                });
                expect(parsedData.instances.length).to.equal(2);
                parsedData.instances.forEach((instance, i) => {
                    expect(_.omit(instance, 'attributes')).to.deep.equal({
                        private: 'bnVsbA==',
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
                    provider: 'provider.null',
                    type: 'null_resource',
                    mode: 'managed',
                    name: 'foo2'
                });
                expect(parsedData.instances.length).to.equal(1);
                expect(_.omit(parsedData.instances[0], 'attributes')).to.deep.equal({
                    private: 'bnVsbA==',
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

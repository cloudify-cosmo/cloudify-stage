import _ from 'lodash';

describe('Topology', () => {
    const resourcePrefix = 'topology_test_';
    const blueprintId = `${resourcePrefix}bp`;
    const deploymentId = `${resourcePrefix}dep`;
    const blueprintFile = 'blueprints/topology.zip';

    before(() => {
        cy.activate('valid_trial_license').login();

        cy.deletePlugins()
            .uploadPluginFromCatalog('Terraform')
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
        cy.visitPage('Local Blueprints');

        cy.log('Use search to limit number of presented blueprints');
        cy.route(/console\/sp\/\?su=\/blueprints/).as('getBlueprints');
        cy.get('.blueprintsTable div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getBlueprints');
        cy.wait('@getSummary');

        cy.log('Go into Blueprint page');
        cy.get(`#blueprintsTable_${blueprintId} > td > .blueprintName`).click();

        cy.log('Check Topology widget');
        cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');
    });

    it('is presented in Deployment page', () => {
        cy.visitPage('Deployments');

        cy.log('Use search to limit number of presented deployments');
        cy.route(/console\/sp\/\?su=\/deployments/).as('getDeployments');
        cy.route(/console\/sp\/\?su=\/executions/).as('getExecutions');
        cy.get('.segmentList div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getDeployments');
        cy.wait('@getSummary');
        cy.wait('@getExecutions');

        cy.log('Go into Deployment page');
        cy.get(`.ui.segment.${deploymentId} > .ui > .row`).click();

        cy.log('Check Topology widget');
        cy.contains('Deployment Info').click();
        cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');

        cy.log('Install the deployment');
        cy.executeWorkflow(deploymentId, 'install');

        cy.log('Wait for deployment to be installed');
        const installDeploymentTimeout = 60 * 1000;
        cy.contains('Last Execution').click();
        cy.waitUntilPageLoaded();
        cy.get('.executionsWidget .label i').should('have.class', 'spinner');
        cy.get('.executionsWidget .label i', { timeout: installDeploymentTimeout }).should('have.class', 'checkmark');
        cy.contains('Deployment Info').click();
        cy.waitUntilPageLoaded();

        cy.log('Check terraform module details');
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'terraform');
        cy.contains('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title', 'cloud_resources');
        cy.get('.nodeTopologyButton:eq(0)')
            .should('not.have.css', 'visibility', 'hidden')
            .click({ force: true });
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

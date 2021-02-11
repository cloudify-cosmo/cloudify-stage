describe('Agents widget', () => {
    const blueprintName = 'agents_test_blueprint';
    const deploymentName = 'agents_test_deployment';

    before(() => {
        cy.usePageMock('agents', {
            fieldsToShow: ['Id', 'Node', 'Deployment', 'IP', 'Install Method', 'System', 'Version', 'Actions'],
            pageSize: 15
        })
            .activate()
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: 'localhost' });
    });

    it('should allow to validate agent', () => {
        cy.contains('Validate').click();
        cy.get('div[name=deploymentId] input').type(deploymentName);
        cy.get('div[name=nodeId]').click();
        cy.get('div[name=nodeId] .item').click();
        cy.get('div[name=nodeInstanceId]').click();
        cy.get('div[name=nodeInstanceId] .item').click();
        cy.contains('.modal button', 'Validate').click();
        cy.contains('Close').click();
    });

    it('should allow to install new agent', () => {
        cy.contains('Install').click();
        cy.get('div[name=deploymentId] input').type(deploymentName);
        cy.get('div[name=nodeId]').click();
        cy.get('div[name=nodeId] .item').click();
        cy.get('div[name=nodeInstanceId]').click();
        cy.get('div[name=nodeInstanceId] .item').click();
        cy.contains('.modal button', 'Install').click();
        cy.contains('Close').click();
    });

    it('should display agents that match the search phrase', () => {
        const items = [];
        for (let i = 0; i < 15; i += 1) {
            items.push({
                id: `test-${i + 1}`,
                ip: '127.0.0.1',
                deployment: '9f13b1a1798277648adb544a2dd14fb7',
                node: 'test',
                system: 'centos core',
                version: '1.0.0',
                host_id: 'test',
                install_method: 'remote'
            });
        }
        cy.interceptSp('GET', '/agents?&_search=test', {
            metadata: {
                pagination: {
                    total: 1000,
                    size: items.length,
                    offset: 0
                },
                filtered: null
            },
            items
        }).as('search');
        cy.get('input[placeholder="Search..."]').type('test');
        cy.wait('@search');
        cy.get('table.agentsTable').contains('9f13b1a1798277648adb544a2dd14fb7');
        cy.get('div.gridPagination').contains('1 to 15 of 1000 entries');
        cy.get('div#pageSizeField').contains('15');
    });
});

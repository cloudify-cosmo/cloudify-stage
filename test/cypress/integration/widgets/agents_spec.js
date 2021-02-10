describe('Agents widget', () => {
    const blueprintName = 'agents_test_blueprint';
    const deploymentName = 'agents_test_deployment';

    before(() => {
        cy.usePageMock('agents', {
            fieldsToShow: ['Id', 'Node', 'Deployment', 'IP', 'Install Method', 'System', 'Version', 'Actions']
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

    it('should display agents for search action', () => {
        cy.interceptSp('GET', '/agents?&_search=test', {
            metadata: {
                pagination: {
                    total: 3,
                    size: 100,
                    offset: 0
                },
                filtered: null
            },
            items: [
                {
                    id: 'test',
                    ip: '127.0.0.1',
                    deployment: '9f13b1a1798277648adb544a2dd14fb7',
                    node: 'test',
                    system: 'centos core',
                    version: '1.0.0',
                    host_id: 'test',
                    install_method: 'remote'
                }
            ]
        }).as('search');
        cy.get('input[placeholder="Search..."]').type('test');
        cy.wait('@search');
        cy.get('table.agentsTable').contains('9f13b1a1798277648adb544a2dd14fb7');
    });
});

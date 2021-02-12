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
                ip: `127.0.0.${i + 1}`,
                deployment: `9f13b1a1798277648adb544a2dd14fb7-${i + 1}`,
                node: `test-${i + 1}`,
                system: `centos core-${i + 1}`,
                version: `1.0.${i + 1}`,
                host_id: `test-${i + 1}`,
                install_method: `remote-${i + 1}`
            });
        }
        cy.interceptSp('GET', RegExp(`^/agents\\b.*\\b_search=test\\b`), {
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
        cy.get('table.agentsTable tbody').find('tr').its('length').should('eq', items.length);
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            for (let j = 0; j < item.length; j += 1) {
                cy.get('table.agentsTable tbody')
                    .find('tr')
                    .get(`td:nth-child[${j + 1}]`)
                    .contains(item[j]);
            }
        }
        cy.get('div.gridPagination').contains('1 to 15 of 1000 entries');
        cy.get('div#pageSizeField').contains(String(items.length));
    });
});

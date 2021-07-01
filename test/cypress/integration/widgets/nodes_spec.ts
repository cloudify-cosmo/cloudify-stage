describe('Nodes list widget', () => {
    const blueprintName = 'nodes_list_test';
    const deployment1Id = `${blueprintName}_dep1_id`;
    const deployment1Name = `${blueprintName}_dep1_name`;
    const deployment2Id = `${blueprintName}_dep2_id`;
    const deployment2Name = `${blueprintName}_dep2_name`;

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('nodes', { fieldsToShow: ['Deployment', 'Deployment ID'] })
            .mockLogin()
            .deleteDeployments(blueprintName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(
                blueprintName,
                deployment1Id,
                { server_ip: '127.0.0.1' },
                { display_name: deployment1Name }
            )
            .deployBlueprint(
                blueprintName,
                deployment2Id,
                { server_ip: '127.0.0.1' },
                { display_name: deployment2Name }
            )
    );

    it('should display nodes list', () => {
        cy.setBlueprintContext(blueprintName);
        cy.get('tbody tr').should('have.length', 2);
        cy.get('table')
            .getTable()
            .should(tableData => {
                expect(tableData[0].Deployment).to.eq(deployment1Name);
                expect(tableData[0]['Deployment ID']).to.eq(deployment1Id);
                expect(tableData[1].Deployment).to.eq(deployment2Name);
                expect(tableData[1]['Deployment ID']).to.eq(deployment2Id);
            });

        cy.setDeploymentContext(deployment1Id);
        cy.contains('th', 'Deployment').should('not.exist');
    });
});

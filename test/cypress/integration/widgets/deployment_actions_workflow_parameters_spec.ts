describe('Execute Workflow modal handles parameters of type', () => {
    const resourcePrefix = 'workflow_parameters_test_';

    const types = ['node_id', 'node_type', 'node_instance', 'scaling_group'];

    const openWorkflowParametersModal = (type: string) => {
        const deploymentName = `${resourcePrefix}${type}_type_deployment`;
        cy.clearDeploymentContext().setDeploymentContext(deploymentName);
        cy.contains('Execute workflow').click();
        cy.contains('Script').click();
        cy.contains('Test parameters').click();
    };

    const verifyNumberOfOptions = (number: number) => {
        cy.get('input').click();

        if (number === 0) {
            cy.get('.menu').contains('No results found.').should('be.visible');
        } else {
            cy.get(`.menu .item[role="option"]`).should('have.length', number);
        }
        cy.get('label').click();
    };

    const verifyDropdownNumberOfOptions = (number: number) => {
        cy.get('[role="listbox"]').click();
        cy.get(`.menu .item[role="option"]`).should('have.length', number);
        cy.get('label').click();
    };

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentActionButtons').mockLogin();

        cy.deleteDeployments(resourcePrefix, true).deleteBlueprints(resourcePrefix, true);

        types.forEach(type =>
            cy
                .uploadBlueprint(
                    'blueprints/workflow_parameters.zip',
                    `${resourcePrefix}${type}_type`,
                    `${type}_type.yaml`
                )
                .deployBlueprint(`${resourcePrefix}${type}_type`, `${resourcePrefix}${type}_type_deployment`)
        );
    });

    afterEach(() => {
        cy.contains('button', 'Cancel').click();
    });

    it('node_id', () => {
        openWorkflowParametersModal('node_id');
        cy.getField('node1').within(() => {
            verifyNumberOfOptions(2);
        });
        cy.getField('node2').within(() => {
            verifyDropdownNumberOfOptions(2);
        });
    });

    it('node_type', () => {
        openWorkflowParametersModal('node_type');
        cy.getField('node_type_all').within(() => {
            verifyNumberOfOptions(2);
        });
        cy.getField('node_type_with_constraints').within(() => {
            verifyDropdownNumberOfOptions(2);
        });
    });

    it('node_instance', () => {
        openWorkflowParametersModal('node_instance');
        cy.getField('node_instance_all').within(() => {
            verifyNumberOfOptions(3);
        });
        cy.getField('node_instance_starts_With_node1').within(() => {
            verifyNumberOfOptions(2);
        });
    });

    it('scaling_group', () => {
        openWorkflowParametersModal('scaling_group');
        cy.getField('scaling_group_all').within(() => {
            verifyNumberOfOptions(3);
        });
        cy.getField('scaling_group_contains_node1').within(() => {
            verifyNumberOfOptions(2);
        });
    });
});

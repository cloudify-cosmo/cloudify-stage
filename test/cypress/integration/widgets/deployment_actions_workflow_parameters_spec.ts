describe('Deployment Action Buttons widget provides Execute Workflow modal and handles', () => {
    const resourcePrefix = 'workflow_parameters_test_';

    const types = [
        'node_id',
        'node_type',
        'node_instance',
        'scaling_group',
        'node_id_list',
        'node_instance_list',
        'operation_name'
    ];

    const openWorkflowParametersModal = (deploymentName: string, workflowName: string) => {
        cy.clearDeploymentContext().setDeploymentContext(deploymentName);
        cy.contains('Execute workflow').click();
        cy.contains('Script').click();
        cy.contains(workflowName).click();
    };

    const openWorkflowParametersModalForType = (type: string) => {
        openWorkflowParametersModal(`${resourcePrefix}${type}_type_deployment`, 'Test parameters');
    };

    const verifyMultipleDropdown = () => {
        cy.get(`.multiple`).should('exist');
    };

    const verifyNumberOfOptions = (number: number) => {
        cy.get('div.dropdown').click();

        if (number === 0) {
            cy.get('.menu').contains('No results found.').should('be.visible');
        } else {
            cy.get(`.menu .item[role="option"]`).should('have.length', number);
        }
        cy.get('label').click();
    };

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentActionButtons').mockLogin();

        cy.deleteDeployments(resourcePrefix, true).deleteBlueprints(resourcePrefix, true);

        types.forEach(type =>
            cy
                .uploadBlueprint('blueprints/workflow_parameters.zip', `${resourcePrefix}${type}_type`, {
                    yamlFile: `${type}_type.yaml`
                })
                .deployBlueprint(`${resourcePrefix}${type}_type`, `${resourcePrefix}${type}_type_deployment`)
        );
    });

    afterEach(() => {
        cy.clickButton('Cancel');
    });

    describe('parameters of type', () => {
        it('node_id', () => {
            openWorkflowParametersModalForType('node_id');
            cy.getField('node1').within(() => {
                verifyNumberOfOptions(2);
            });
            cy.getField('node2').within(() => {
                verifyNumberOfOptions(2);
            });
            cy.getField('node_from_deployment').within(() => {
                verifyNumberOfOptions(4);
            });
        });

        it('node_type', () => {
            openWorkflowParametersModalForType('node_type');
            cy.getField('node_type_all').within(() => {
                verifyNumberOfOptions(2);
            });
            cy.getField('node_type_with_constraints').within(() => {
                verifyNumberOfOptions(2);
            });
            cy.getField('node_type_from_deployment').within(() => {
                verifyNumberOfOptions(1);
            });
        });

        it('node_instance', () => {
            openWorkflowParametersModalForType('node_instance');
            cy.getField('node_instance_all').within(() => {
                verifyNumberOfOptions(3);
            });
            cy.getField('node_instance_starts_With_node1').within(() => {
                verifyNumberOfOptions(2);
            });
            cy.getField('node_instance_from_deployment').within(() => {
                verifyNumberOfOptions(4);
            });
        });

        it('scaling_group', () => {
            openWorkflowParametersModalForType('scaling_group');
            cy.getField('scaling_group_all').within(() => {
                verifyNumberOfOptions(3);
            });
            cy.getField('scaling_group_from_deployment').within(() => {
                verifyNumberOfOptions(3);
            });
            cy.getField('scaling_group_contains_node1').within(() => {
                verifyNumberOfOptions(2);
            });
        });

        it('node_id list', () => {
            openWorkflowParametersModalForType('node_id_list');
            cy.getField('node1').within(() => {
                verifyNumberOfOptions(2);
                verifyMultipleDropdown();
            });
            cy.getField('node2').within(() => {
                verifyNumberOfOptions(2);
                verifyMultipleDropdown();
            });
        });

        it('node_instance list', () => {
            openWorkflowParametersModalForType('node_instance_list');
            cy.getField('node_instance_all').within(() => {
                verifyNumberOfOptions(3);
                verifyMultipleDropdown();
            });
            cy.getField('node_instance_starts_With_node1').within(() => {
                verifyNumberOfOptions(2);
                verifyMultipleDropdown();
            });
        });

        it('operation_name', () => {
            openWorkflowParametersModalForType('operation_name');
            cy.get('.modal').within(() => {
                cy.getField('operation').within(() => {
                    verifyNumberOfOptions(46);
                });
            });
        });
    });

    it('parameters sorting', () => {
        function caseInsensitiveCompareFn(a: string, b: string) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }
        function verifyParametersLabels(expectedParametersLabels: string[]) {
            return cy.get('.field label').then($labels => {
                const actualParametersLabels = _.map($labels, field => field.innerText.trim()).slice(
                    0,
                    parametersLabelsInOriginalOrder.length
                );
                expect(actualParametersLabels).deep.equal(expectedParametersLabels);
            });
        }
        function waitForParametersLabelsToBeReordered() {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000);
        }
        function openSortOrderDropdown() {
            cy.get('[aria-label="Sort order"]').click();
        }

        const parametersLabelsInOriginalOrder = [
            'scaling_group_all',
            'scaling_group_from_deployment',
            'scaling_group_contains_node1',
            'script_path'
        ];
        const parametersLabelsInAscendingOrder = [...parametersLabelsInOriginalOrder].sort(caseInsensitiveCompareFn);
        const parametersLabelsInDescendingOrder = [...parametersLabelsInAscendingOrder].reverse();

        openWorkflowParametersModalForType('scaling_group');
        openSortOrderDropdown();
        cy.get('[title="Original order"]').click();
        waitForParametersLabelsToBeReordered();
        verifyParametersLabels(parametersLabelsInOriginalOrder);

        openSortOrderDropdown();
        cy.get('[title="Ascending alphabetical order"]').click();
        waitForParametersLabelsToBeReordered();
        verifyParametersLabels(parametersLabelsInAscendingOrder);

        openSortOrderDropdown();
        cy.get('[title="Descending alphabetical order"]').click();
        waitForParametersLabelsToBeReordered();
        verifyParametersLabels(parametersLabelsInDescendingOrder);
    });

    it('optional/required parameters', () => {
        const testBlueprint = `${resourcePrefix}optional_required`;
        const testDeployment = `${testBlueprint}_deployment`;

        cy.deleteDeployments(testDeployment, true)
            .deleteBlueprints(testBlueprint, true)
            .uploadBlueprint('blueprints/workflow_parameters.zip', testBlueprint, {
                yamlFile: 'optional_required.yaml'
            })
            .deployBlueprint(testBlueprint, testDeployment);

        openWorkflowParametersModal(testDeployment, 'Optional required');

        cy.get('.modal').within(() => {
            cy.getField('optional_parameter').should('not.have.class', 'required');
            cy.getField('required_parameter').should('have.class', 'required');

            cy.clickButton('Execute');

            cy.getField('optional_parameter').contains('Please provide optional_parameter').should('not.exist');
            cy.getField('required_parameter').contains('Please provide required_parameter').should('exist');
        });
    });
});

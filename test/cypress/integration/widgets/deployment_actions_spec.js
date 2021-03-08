describe('Deployment Action Buttons widget', () => {
    const blueprintName = 'deployment_action_buttons_test';
    const deploymentName = 'deployment_action_buttons_test';

    before(() =>
        cy
            .usePageMock('deploymentActionButtons')
            .activate()
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: '127.0.0.1' })
    );

    it('when deploymentId is not set in the context it should be disabled', () => {
        cy.get('button.executeWorkflowButton').should('have.attr', 'disabled');
        cy.get('button.deploymentActionsButton').should('have.attr', 'disabled');
    });

    describe('when deploymentId is set in the context', () => {
        beforeEach(() => cy.setDeploymentContext(deploymentName));

        it('should allow to execute a workflow', () => {
            cy.interceptSp('POST', `/executions`).as('executeWorkflow');

            cy.get('button.executeWorkflowButton').should('not.have.attr', 'disabled');
            cy.get('button.executeWorkflowButton').click();
            cy.get('.popupMenu > .menu').contains('Start').click();
            cy.get('.executeWorkflowModal').should('be.visible');
            cy.get('.executeWorkflowModal button.ok').click();

            cy.wait('@executeWorkflow');
            cy.get('.executeWorkflowModal').should('not.exist');
        });

        it('should allow to start an action on the deployment', () => {
            const siteName = 'deployment_action_buttons_test';
            cy.deleteSites(siteName).createSite({ name: siteName });
            cy.interceptSp('POST', `/deployments/${deploymentName}/set-site`).as('setSite');

            cy.get('button.deploymentActionsButton').should('not.have.attr', 'disabled');
            cy.get('button.deploymentActionsButton').click();

            cy.get('.popupMenu > .menu').contains('Set Site').click();
            cy.get('.modal').within(() => {
                cy.get('div[name="siteName"]').click();
                cy.get(`div[option-value="${siteName}"]`).click();
                cy.get('button.ok').click();
            });

            cy.wait('@setSite');
            cy.get('.modal').should('not.exist');
        });
    });

    describe('should allow to manage deployment labels', () => {
        function typeLabelKey(key) {
            cy.get('div[name=labelKey] > input').clear().type(key);
        }
        function typeLabelValue(value) {
            cy.get('div[name=labelValue] > input').clear().type(value);
        }
        function addLabel(key, value) {
            typeLabelKey(key);
            typeLabelValue(value);
            cy.get('button .add').click();
        }

        before(() => {
            cy.setLabels(deploymentName, [{ existing_key: 'existing_value' }]);
            cy.setDeploymentContext(deploymentName);
            cy.interceptSp('GET', `/deployments/${deploymentName}?_include=labels`).as('fetchLabels');
            cy.get('button.deploymentActionsButton').click();
            cy.get('.popupMenu > .menu').contains('Manage Labels').click();
            cy.get('.modal').within(() => {
                cy.wait('@fetchLabels');
                cy.get('form.loading').should('not.exist');
                cy.get('.selection').click();
            });
        });

        beforeEach(() => {
            // NOTE: Clicking at the header to close opened dropdowns / popups
            cy.get('.modal .tags').click();
        });

        it('adds new label by typing', () => {
            cy.get('.modal').within(() => {
                addLabel('sample_key', 'sample_value');

                cy.contains('a.label', 'sample_key sample_value').should('be.visible');
            });
        });

        it('adds new label by dropdown selection', () => {
            cy.interceptSp('GET', '/labels/deployments?_search=exist').as('fetchFilteredKeys');
            cy.interceptSp('GET', '/labels/deployments/existing_key').as('fetchValues');
            cy.interceptSp('GET', '/labels/deployments/existing_key?_search=sample_value').as('checkIfLabelExists');

            cy.get('.modal').within(() => {
                cy.get('div[name=labelKey]').click();
                typeLabelKey('exist');
                cy.wait('@fetchFilteredKeys');
                cy.get('div[option-value=existing_key]').click();
                cy.wait('@fetchValues');

                typeLabelValue('sample_value');
                cy.get('button .add').click();
                cy.wait('@checkIfLabelExists');

                cy.contains('a.label', 'existing_key sample_value').should('be.visible');
            });
        });

        it('prevents adding existing label', () => {
            cy.get('.modal').within(() => {
                typeLabelKey('existing_key');
                typeLabelValue('existing_value');

                cy.get('button.disabled').should('have.attr', 'disabled');
            });
            cy.contains('.popup', 'Cannot add the same label twice').should('be.visible');
        });

        it('prevents adding invalid label', () => {
            function validateIfNotPermitted(string) {
                typeLabelKey(string);
                cy.contains('.popup', 'Only letters, digits').should('be.visible');
            }
            function validateIfPermitted(string) {
                typeLabelKey(string);
                cy.get('.popup').should('not.exist');
            }

            validateIfPermitted('abc-._');
            validateIfNotPermitted(' ');
            validateIfNotPermitted('$');
            validateIfNotPermitted('&');
        });

        it('allows to remove label from the list', () => {
            cy.get('.modal').within(() => {
                const existingLabel = 'existing_key existing_value';
                cy.contains('a.label', existingLabel).should('be.visible');
                cy.contains('a.label', existingLabel).within(() => cy.get('.delete').click());
                cy.contains('a.label', existingLabel).should('not.exist');
            });
        });

        it('allows to revert to initial value', () => {
            cy.get('.modal').within(() => {
                addLabel('my_key', 'my_value');
                cy.get('i.undo').click();

                cy.get('i.undo').should('not.exist');
                cy.contains('a.label', 'existing_key existing_value').should('be.visible');
            });
        });
    });
});

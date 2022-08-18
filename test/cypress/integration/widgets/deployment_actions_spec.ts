import type { LabelInputType } from '../../../../widgets/common/src/labels/types';
import { isLabelModifiable } from '../../../../widgets/common/src/labels/common';

describe('Deployment Action Buttons widget', () => {
    const blueprintName = 'deployment_action_buttons_test';
    const deploymentId = 'deployment_action_buttons_test';
    const deploymentName = `${deploymentId}_name`;

    const typeLabelInput = (inputType: LabelInputType, text: string) => {
        if (inputType === 'key') {
            cy.typeLabelKey(text);
        } else {
            cy.typeLabelKey('a');
            cy.typeLabelValue(text);
        }
    };

    before(() =>
        cy
            .usePageMock('deploymentActionButtons')
            .activate()
            .mockLogin()
            .deleteDeployments(deploymentId, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentId, { server_ip: '127.0.0.1' }, { display_name: deploymentName })
    );

    it('should be disabled when deploymentId is not set in the context', () => {
        cy.contains('button', 'Execute workflow').should('have.attr', 'disabled');
        cy.contains('button', 'Deployment actions').should('have.attr', 'disabled');
    });

    describe('when deploymentId is set in the context', () => {
        beforeEach(() => cy.clearDeploymentContext().setDeploymentContext(deploymentId));

        it('should allow to execute a workflow', () => {
            cy.interceptSp('POST', `/executions`).as('executeWorkflow');

            cy.get('button.executeWorkflowButton').should('not.have.attr', 'disabled');
            cy.get('button.executeWorkflowButton').click();
            cy.get('.popupMenu > .menu').contains('Start').click();
            cy.get('.executeWorkflowModal')
                .should('be.visible')
                .within(() => {
                    cy.contains(`Execute workflow start on ${deploymentName} (${deploymentId})`);
                    cy.get('button.ok').click();
                });
            cy.wait('@executeWorkflow');
            cy.get('.executeWorkflowModal').should('not.exist');
        });

        it('should allow to start an action on the deployment', () => {
            const siteName = 'deployment_action_buttons_test';
            cy.deleteSites(siteName).createSite({ name: siteName });
            cy.interceptSp('POST', `/deployments/${deploymentId}/set-site`).as('setSite');

            cy.contains('button', 'Deployment actions').should('not.have.attr', 'disabled');
            cy.clickButton('Deployment actions');

            cy.get('.popupMenu > .menu').contains('Set Site').click();
            cy.get('.modal').within(() => {
                cy.contains(`Set the site of deployment ${deploymentName} (${deploymentId})`);
                cy.get('div[name="siteName"]').click();
                cy.get(`div[option-value="${siteName}"]`).click();
                cy.get('button.ok').click();
            });

            cy.wait('@setSite');
            cy.get('.modal').should('not.exist');
        });

        it('should show only available workflows and actions', () => {
            cy.clickButton('Deployment actions');
            cy.get('.popupMenu > .menu').within(() => {
                cy.contains('Uninstall').should('have.class', 'disabled');
                cy.contains('Install').should('not.have.class', 'disabled');
            });

            cy.clickButton('Execute workflow');
            cy.get('.popupMenu > .menu').within(() => {
                cy.contains('Uninstall').should('not.exist');
                cy.contains('Install').should('be.visible');
            });
        });
    });

    describe('should allow to manage deployment labels', () => {
        function checkIfPopupIsDisplayed(inputType: LabelInputType, text: string, popupContent: string) {
            typeLabelInput(inputType, text);
            cy.contains('.popup', popupContent).should('be.visible');
        }
        function checkIfPopupIsNotDisplayed(inputType: LabelInputType, text: string) {
            typeLabelInput(inputType, text);
            cy.get('.popup').should('not.exist');
        }
        function toggleLabelsInput() {
            cy.getByTestId('labels-input-switch').click();
        }

        before(() => {
            cy.setLabels(deploymentId, [{ existing_key: 'existing_value' }]);
            cy.clearDeploymentContext().setDeploymentContext(deploymentId);
            cy.interceptSp('GET', { path: `/deployments/${deploymentId}?_include=labels` }).as('fetchLabels');
            cy.clickButton('Deployment actions');
            cy.get('.popupMenu > .menu').contains('Manage Labels').click();
            cy.get('.modal').within(() => {
                cy.contains(`Manage labels for deployment ${deploymentName} (${deploymentId})`);
                cy.wait('@fetchLabels');
                cy.get('form.loading').should('not.exist');
                toggleLabelsInput();
            });
        });

        beforeEach(() => {
            // NOTE: Close and open labels input to reset popups and dropdowns.
            toggleLabelsInput();
            toggleLabelsInput();
        });

        it('adds new label by typing', () => {
            cy.get('.modal').within(() => {
                cy.addLabel('sample_key', 'sample_value');
            });
        });

        it('adds new label by dropdown selection', () => {
            cy.interceptSp('GET', { pathname: '/labels/deployments', query: { _search: 'exist' } }).as(
                'fetchFilteredKeys'
            );
            cy.interceptSp('GET', '/labels/deployments/existing_key').as('fetchValues');
            cy.interceptSp('GET', { path: '/labels/deployments/existing_key?_search=sample_value' }).as(
                'checkIfLabelExists'
            );

            cy.get('.modal').within(() => {
                cy.get('div[name=labelKey]').click();
                cy.typeLabelKey('exist');
                cy.wait('@fetchFilteredKeys');
                cy.get('div[option-value=existing_key]').click();
                cy.wait('@fetchValues');

                cy.typeLabelValue('sample_value');
                cy.get('button[aria-label=Add]').click();
                cy.wait('@checkIfLabelExists');

                cy.contains('a.label', 'existing_key sample_value').should('be.visible');
            });
        });

        it('prevents adding existing label', () => {
            cy.get('.modal').within(() => {
                cy.typeLabelKey('existing_key');
                cy.typeLabelValue('existing_value');

                cy.get('button[aria-label=Add]').should('have.attr', 'disabled');
            });
            cy.contains('.popup', 'Cannot add the same label twice').should('be.visible');
        });

        it('prevents adding label with invalid characters', () => {
            function checkIfInvalidCharactersPopupIsDisplayedForKey(key: string) {
                checkIfPopupIsDisplayed('key', key, 'Only letters, digits');
            }
            function checkIfInvalidCharactersPopupIsDisplayedForValue(value: string) {
                checkIfPopupIsDisplayed('value', value, 'The " character and control characters');
            }

            checkIfPopupIsNotDisplayed('key', 'abc-._');
            checkIfPopupIsNotDisplayed('value', 'small BIG !@#$%%^^&*()');

            checkIfInvalidCharactersPopupIsDisplayedForKey(' ');
            checkIfInvalidCharactersPopupIsDisplayedForKey('$');
            checkIfInvalidCharactersPopupIsDisplayedForKey('&');

            checkIfInvalidCharactersPopupIsDisplayedForValue('"');
        });

        it('prevents adding label with not permitted key', () => {
            function checkIfInternalKeyIsNotPermitted(key: string) {
                checkIfPopupIsDisplayed('key', key, 'All labels starting with `csys-` are reserved for internal usage');
                cy.typeLabelValue('a');
                cy.get('button[aria-label=Add]').should('have.attr', 'disabled');
            }
            function checkIfInternalKeyIsPermitted(key: string) {
                checkIfPopupIsNotDisplayed('key', key);
                cy.typeLabelValue('a');
                cy.get('button[aria-label=Add]').should('not.have.attr', 'disabled');
            }
            cy.getReservedLabelKeys().then(reservedLabelKeys => {
                const reservedKeys = reservedLabelKeys.filter(isLabelModifiable);
                reservedKeys.forEach(checkIfInternalKeyIsPermitted);
            });
            checkIfInternalKeyIsNotPermitted('csys-');
            checkIfInternalKeyIsNotPermitted('csys-my-fake-key');
        });

        it('allows to remove label from the list', () => {
            cy.get('.modal').within(() => {
                const existingLabel = 'existing_key existing_value';
                cy.contains('a.label', existingLabel).should('be.visible');
                cy.contains('a.label', existingLabel).find('.delete').click();
                cy.contains('a.label', existingLabel).should('not.exist');
            });
        });

        it('allows to revert to initial value', () => {
            cy.get('.modal').within(() => {
                cy.addLabel('my_key', 'my_value');

                cy.revertToDefaultValue();
                cy.contains('a.label', 'existing_key existing_value').should('be.visible');
            });
        });
    });
});

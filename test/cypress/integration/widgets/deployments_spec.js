describe('Deployments widget', () => {
    const blueprintName = 'deployments_test_hw';
    const deploymentName = 'deployments_test_hw_dep';
    const siteName = 'Zakopane';
    const site = { name: siteName };
    const blueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/simple-hello-world-example.zip';

    const selectActionFromMenu = (deploymentId, menuClassName, action) => {
        cy.searchInDeploymentsWidget(deploymentId);
        cy.contains('div.row', deploymentId).find(menuClassName).click();
        cy.get('.popupMenu > .menu').contains(action).click();
    };
    const executeDeploymentAction = (deploymentId, action) => {
        selectActionFromMenu(deploymentId, '.deploymentActionsMenu', action);
    };
    const executeWorkflow = (deploymentId, workflow) => {
        selectActionFromMenu(deploymentId, '.workflowsMenu', workflow);
    };
    const verifyWorkflowIsStarted = () => {
        cy.contains('div.row', deploymentName).find('.spinner.loading.icon').should('be.visible');
    };
    const waitUntilWorkflowIsFinished = () => {
        const workflowExecutionTimeout = 60000;
        cy.contains('div.row', deploymentName)
            .find('.spinner.loading.icon', { timeout: workflowExecutionTimeout })
            .should('not.exist');
    };

    before(() => {
        cy.activate('valid_trial_license')
            .deleteSites(siteName)
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite(site)
            .usePageMock('deployments', { pollingTime: 5, clickToDrillDown: true, showExecutionStatusLabel: false })
            .mockLogin();
    });

    it('should be present in Deployments page', () => {
        cy.searchInDeploymentsWidget(deploymentName);
        cy.get('.deploymentSegment h3').should('have.text', deploymentName);
    });

    describe('should provide display configuration for', () => {
        /*
        Default configuration
        - clickToDrillDown = true
        - showExecutionStatusLabel = false
        - blueprintIdFilter = ''
        - displayStyle = List
        */

        before(cy.refreshPage);

        it('clickToDrillDown option', () => {
            cy.searchInDeploymentsWidget(deploymentName);
            cy.get('.deploymentsWidget').contains(deploymentName).click();
            cy.location('pathname').should('contain', '_deployment/deployments_test_hw_dep');
            cy.contains('.breadcrumb', 'deployments_test_hw_dep');

            cy.refreshPage();
            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="clickToDrillDown"]').parent().click();
            });

            cy.get('.deploymentsWidget').contains(deploymentName).click();
            cy.location('pathname').should('not.contain', '_deployment/deployments_test_hw_dep');
            cy.get('.deploymentsWidget');
        });

        it('showExecutionStatusLabel option', () => {
            cy.searchInDeploymentsWidget(deploymentName);

            const lastExecutionCellSelector = 'tr#deploymentsTable_deployments_test_hw_dep td:nth-child(2)';
            cy.get(lastExecutionCellSelector).within(() => {
                cy.get('.icon').should('be.visible');
                cy.get('.label').should('not.exist');
            });

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="showExecutionStatusLabel"]').parent().click();
            });

            cy.searchInDeploymentsWidget(deploymentName);
            cy.get(lastExecutionCellSelector).within(() => {
                cy.get('.icon').should('be.visible');
                cy.get('.label').should('be.visible');
            });
        });

        it('blueprintIdFilter option', () => {
            cy.interceptSp('GET', RegExp(`/deployments.*blueprint_id=${blueprintName}`)).as('getFilteredDeployments');

            cy.refreshPage();

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="blueprintIdFilter"]').clear().type(blueprintName);
            });

            cy.wait('@getFilteredDeployments');
        });

        it('displayStyle option', () => {
            cy.get('table.deploymentsTable').should('be.visible');
            cy.get('div.segmentList').should('not.exist');

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('div[name="displayStyle"]').click();
                cy.get('div[option-value="list"]').click();
            });

            cy.get('table.deploymentsTable').should('not.exist');
            cy.get('div.segmentList').should('be.visible');
        });
    });

    describe('should allow to execute', () => {
        beforeEach(() => {
            cy.interceptSp('POST', `/executions`).as('executeWorkflow');
        });

        const startAndVerifyWorkflowExecution = () => {
            cy.get('.executeWorkflowModal button.ok').click();
            cy.wait('@executeWorkflow');
            verifyWorkflowIsStarted();
            waitUntilWorkflowIsFinished();
        };

        it('install workflow from deployment actions menu', () => {
            executeDeploymentAction(deploymentName, 'Install');
            startAndVerifyWorkflowExecution();
        });

        it('a workflow from workflows menu', () => {
            executeWorkflow(deploymentName, 'Restart');
            startAndVerifyWorkflowExecution();
        });
    });

    it('should allow to set site for deployment', () => {
        cy.interceptSp('POST', `/deployments/${deploymentName}/set-site`).as('setDeploymentSite');

        executeDeploymentAction(deploymentName, 'Set Site');

        cy.get('.modal').within(() => {
            cy.get('div[name="siteName"]').click();
            cy.get(`div[option-value="${siteName}"]`).click();
            cy.get('button.ok').click();
        });

        cy.wait('@setDeploymentSite');
        cy.contains('div.row', deploymentName)
            .find('div.column:nth-child(2) h5:nth-child(2) .sub.header')
            .should('have.text', siteName);
    });

    it('should allow to update deployment', () => {
        cy.interceptSp('PUT', `/deployment-updates/${deploymentName}/update/initiate`).as('updateDeployment');

        cy.interceptSp('GET', RegExp(`/blueprints.*&state=uploaded`)).as('uploadedBlueprints');
        executeDeploymentAction(deploymentName, 'Update');

        cy.get('.updateDeploymentModal').within(() => {
            cy.get('div[name=blueprintName]').click();
            cy.wait('@uploadedBlueprints');
            cy.get('textarea[name="webserver_port"]').clear({ force: true }).type('9321');
            cy.get('button.blue.ok').click();
        });

        cy.get('.updateDetailsModal').within(() => {
            cy.contains('tr', 'webserver_port').within(() => {
                cy.get('td:nth-child(2)').should('have.text', '9123');
                cy.get('td:nth-child(3)').should('have.text', '9321');
            });
            cy.get('button.ok').click();
        });

        cy.wait('@updateDeployment');
        cy.get('.updateDetailsModal').should('not.exist');
        verifyWorkflowIsStarted();
        waitUntilWorkflowIsFinished();
        cy.contains('div.row', deploymentName)
            .get('div.column:nth-child(3) h5:nth-child(2)')
            .should('contain.text', 'Updated');
    });

    it('should allow to manage deployment labels', () => {
        const labelKey = 'test-key';
        const labelValue = 'test-value';

        cy.setLabels(deploymentName, [{ a: 'b' }]);
        cy.interceptSp('PATCH', `/deployments/${deploymentName}`).as('updateLabels');
        cy.interceptSp('GET', `/deployments/${deploymentName}?_include=labels`).as('fetchLabels');
        cy.interceptSp('GET', `/labels/deployments`).as('checkLabelPresence');

        const typeInput = (name, value) => {
            cy.get(`div[name=${name}]`).click();
            cy.get(`div[name=${name}] input`).type(value);
        };
        executeDeploymentAction(deploymentName, 'Manage Labels');
        cy.get('.modal').within(() => {
            cy.wait('@fetchLabels');
            cy.get('form.loading').should('not.exist');

            cy.get('.segment.dropdown').click();
            typeInput('labelKey', labelKey);
            typeInput('labelValue', labelValue);
            cy.get('button .add').click();

            cy.wait('@checkLabelPresence');
            cy.get('.blue.label').should('have.text', `${labelKey} ${labelValue}`);

            cy.get('button.ok').click();
        });
        cy.wait('@updateLabels');

        cy.getDeployment(deploymentName).then(response => {
            const { labels } = response.body;
            const verifyLabel = (index, key, value) => {
                expect(labels[index]).to.have.property('key', key);
                expect(labels[index]).to.have.property('value', value);
            };

            expect(labels).to.have.length(2);
            verifyLabel(0, 'a', 'b');
            verifyLabel(1, labelKey, labelValue);
        });
    });

    it('should allow to remove deployment', () => {
        const testDeploymentName = `${deploymentName}_remove`;
        cy.deployBlueprint(blueprintName, testDeploymentName);
        cy.interceptSp('DELETE', `/deployments/${testDeploymentName}?force=true`).as('deleteDeployment');

        executeDeploymentAction(testDeploymentName, 'Force Delete');

        cy.get('.modal button.primary').click();

        cy.wait('@deleteDeployment');
        cy.contains('div.row', testDeploymentName).should('not.exist');
    });
});

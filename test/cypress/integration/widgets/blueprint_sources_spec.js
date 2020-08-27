describe('Blueprint Sources widget', () => {
    const blueprintName = 'blueprints_sources_test';
    const deploymentName = 'blueprints_sources_test_dep';

    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName)
    );

    describe('provides information when', () => {
        function setFilter(name, text) {
            cy.get(`.${name}FilterField`).click();
            if (text === '') {
                cy.get(`.${name}FilterField .dropdown.icon`).click();
            } else {
                cy.get(`.${name}FilterField input`)
                    .clear()
                    .type(`${text}{enter}`, { force: true });
            }
        }

        before(() => {
            cy.addPage('Blueprint Sources Test')
                .addWidget('blueprintSources')
                .addWidget('filter');
        });

        it('blueprint is not selected', () => {
            cy.get('.message').should('have.text', 'Please select blueprint to display source files');
        });

        it('blueprint is selected', () => {
            cy.get('.filterWidget').within(() => {
                setFilter('deployment', '');
                setFilter('blueprint', blueprintName);
            });

            cy.contains(blueprintName).should('be.visible');
            cy.get('.message').should('not.be.visible');
        });

        it('deployment is selected', () => {
            cy.get('.filterWidget').within(() => {
                setFilter('blueprint', '');
                setFilter('deployment', deploymentName);
            });

            cy.contains(blueprintName).should('be.visible');
            cy.get('.message').should('not.be.visible');
        });
    });

    it('should be present in blueprint page', () => {
        cy.visitPage('Local Blueprints');
        cy.get(`tr#blueprintsTable_${blueprintName}`).click();
        cy.get('.blueprintSourcesWidget .widgetItem')
            .scrollIntoView()
            .should('be.visible');
    });

    it('should be present in deployment page', () => {
        cy.visitPage('Deployments');
        cy.contains(deploymentName).click();
        cy.contains('Deployment Info').click();
        cy.get('.blueprintSourcesWidget .widgetItem')
            .scrollIntoView()
            .should('be.visible');
    });

    it('should show blueprint sources details', () => {
        cy.visitPage('Local Blueprints');
        cy.get(`tr#blueprintsTable_${blueprintName}`).click();

        cy.get('.blueprintSourcesWidget .widgetItem')
            .scrollIntoView()
            .within(() => {
                cy.get('.layout-pane:nth-child(1)').as('leftPane');
                cy.get('.layout-pane:nth-child(3)').as('rightPane');

                cy.get('@leftPane').within(() => {
                    cy.contains(blueprintName).should('be.visible');
                    cy.contains('empty').should('be.visible');
                    cy.contains('blueprint.yaml').should('be.visible');
                });
                cy.get('@rightPane').within(() => {
                    cy.get('pre').should('not.be.visible');
                    cy.get('i.grey.file.icon').should('be.visible');
                });

                cy.get('@leftPane').within(() => {
                    cy.contains('blueprint.yaml').click();
                });
                cy.get('@rightPane').within(() => {
                    cy.get('pre').should('contain.text', 'tosca_definitions_version: cloudify_dsl_1_3');
                    cy.get('.attached.label')
                        .should('be.visible')
                        .should('have.text', 'blueprint.yamlMain')
                        .click();
                });
            });

        cy.get('.modal')
            .should('be.visible')
            .within(() => {
                cy.get('.header').should('have.text', 'blueprint.yamlMain');
                cy.get('.content').should('contain.text', 'tosca_definitions_version: cloudify_dsl_1_3');
                cy.get('.actions .button').click();
            });
        cy.get('.modal').should('not.be.visible');
    });
});

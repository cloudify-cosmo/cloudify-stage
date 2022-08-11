describe('Blueprint Sources widget', () => {
    const blueprintName = 'blueprints_sources_test';
    const deploymentName = 'blueprints_sources_test_dep';

    before(() =>
        cy
            .activate()
            .usePageMock('blueprintSources')
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/blueprint_with_image.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName)
    );

    describe('provides information when', () => {
        it('blueprint is not selected', () => {
            cy.get('.message').should('have.text', 'Please select blueprint to display source files');
        });

        it('blueprint is selected', () => {
            cy.setBlueprintContext(blueprintName);

            cy.get('.blueprintSourcesWidget .widgetItem')
                .scrollIntoView()
                .within(() => {
                    cy.get('.message').should('not.exist');

                    cy.get('.layout-pane:nth-child(1)').as('leftPane');
                    cy.get('.layout-pane:nth-child(3)').as('rightPane');

                    cy.get('@leftPane').within(() => {
                        cy.contains(blueprintName).should('be.visible');
                        cy.contains('blueprint_with_image').should('be.visible');
                        cy.contains('blueprint.yaml').should('be.visible');
                        cy.contains('Main').should('be.visible');
                    });
                    cy.get('@rightPane').within(() => {
                        cy.get('pre').should('not.exist');
                        cy.get('i.grey.file.icon').should('be.visible');
                    });

                    cy.get('@leftPane').within(() => {
                        cy.contains('cloudify_logo.png').click();
                    });
                    cy.get('@rightPane').within(() => {
                        cy.get('img').should('have.attr', 'src').should('include', 'cloudify_logo.png');
                    });

                    cy.get('@leftPane').within(() => {
                        cy.contains('blueprint.yaml').click();
                    });
                    cy.get('@rightPane').within(() => {
                        cy.get('pre').should('contain.text', 'tosca_definitions_version: cloudify_dsl_1_3');
                        cy.get('.attached.label').should('have.text', 'blueprint.yamlMain').click();
                    });
                });

            cy.get('.modal')
                .should('be.visible')
                .within(() => {
                    cy.get('.header').should('have.text', 'blueprint.yamlMain');
                    cy.get('.content').should('contain.text', 'tosca_definitions_version: cloudify_dsl_1_3');
                    cy.get('.actions .button').click();
                });
            cy.get('.modal').should('not.exist');
        });

        it('deployment is selected', () => {
            cy.clearBlueprintContext();
            cy.setDeploymentContext(deploymentName);

            cy.get('.blueprintSourcesWidget').within(() => {
                cy.contains(blueprintName).should('be.visible');
                cy.get('.message').should('not.exist');
            });
        });
    });
});

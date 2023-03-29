describe('Environment button widget', () => {
    before(() => {
        cy.activate().useWidgetWithDefaultConfiguration('environmentButton');
    });

    it('opens From Blueprint modal and lists only environment blueprints', () => {
        cy.interceptSp('POST', '/searches/blueprints').as('blueprintsRequest');

        cy.contains('Create Environment').click();
        cy.contains('From Blueprint').click();

        cy.contains('.modal', 'Deploy blueprint').should('be.visible');
        cy.wait('@blueprintsRequest').then(({ request }) =>
            expect(request.body).to.deep.eq({
                filter_rules: [{ operator: 'any_of', type: 'label', key: 'csys-obj-type', values: ['environment'] }]
            })
        );
        cy.clickButton('Cancel');
    });

    describe('opens New modal and', () => {
        function fillCapabilityInputs(row: number, name: string, source?: 'Secret' | 'Input', value?: string) {
            cy.get('tr')
                .eq(row)
                .within(() => {
                    cy.get('input[name=name]').type(name);
                    if (source) cy.contains(source).click({ force: true });
                    if (value) cy.get('.value').find('input').type(value);
                });
        }

        beforeEach(() => {
            cy.contains('Create Environment').click();
            cy.contains('New').click();
        });

        it('validates form', () => {
            cy.get('.modal').within(() => {
                cy.clickButton('Create');
                cy.getField('Name').contains('Environment name is required');
                cy.getField('Blueprint Name').contains('Environment blueprint name should be provided');

                cy.typeToFieldInput('Blueprint Name', '!');
                cy.clickButton('Create');
                cy.getField('Blueprint Name').contains('Invalid blueprint name');

                const existingBlueprintName = 'existing';
                cy.typeToFieldInput('Blueprint Name', existingBlueprintName);
                cy.typeToFieldInput('Name', 'Valid');
                cy.interceptSp('GET', '/blueprints', { items: [0] });
                cy.clickButton('Create');
                cy.getField('Blueprint Name').contains('Blueprint with this name already exists');

                cy.clickButton('Add');
                cy.clickButton('Add');
                cy.clickButton('Add');
                cy.contains('Capabilities')
                    .next()
                    .within(() => {
                        fillCapabilityInputs(2, 'a');
                        fillCapabilityInputs(3, 'a');
                    });
                cy.clickButton('Create');
                cy.contains('Capabilities')
                    .next()
                    .within(() => {
                        cy.get('tr').eq(1).contains('Please provide capability name');
                        cy.get('tr').eq(1).contains('Please provide capability source');
                        cy.get('tr').eq(3).contains('Capability name already defined');
                    });
                cy.contains('Capabilities')
                    .next()
                    .find('tbody')
                    .within(() => {
                        fillCapabilityInputs(0, 'secret_capability_key', 'Secret', '');
                    });
                cy.clickButton('Create');
                cy.contains('Capabilities')
                    .next()
                    .within(() => {
                        cy.get('tr').eq(1).contains('Please provide capability value');
                    });
                cy.clickButton('Cancel');
            });
            cy.contains('Are you sure you would like to discard the filled data and close?').should('be.visible');
            cy.clickButton('Yes');
            cy.get('.modal').should('not.exist');
        });

        it('passes on form data on submit', () => {
            const deploymentName = 'Environment button test';
            cy.deleteBlueprint('environment_button_test');

            const secretKey = 'create_environment_secret';
            cy.createSecret(secretKey, 'value');

            const siteName = 'London';
            cy.deleteSites(siteName).createSite({ name: siteName });

            const blueprintDescription = 'Blueprint description';
            const secretCapabilityKey = 'secret_capability_key';
            const inputCapabilityKey = 'input_capability_key';
            const inputCapabilityValue = 'input_capability';
            const labelKey = 'label_key';
            const labelValue = 'label_value';

            cy.get('.modal').within(() => {
                cy.typeToFieldInput('Name', deploymentName);
                cy.getField('Blueprint Description').get('textarea').type(blueprintDescription);
                cy.contains('Location').next().find('input').type(`${siteName}{enter}`);

                cy.addLabel(labelKey, labelValue);

                cy.clickButton('Add');
                cy.clickButton('Add');
                cy.contains('Capabilities')
                    .next()
                    .find('tbody')
                    .within(() => {
                        fillCapabilityInputs(0, secretCapabilityKey, 'Secret', `${secretKey}{enter}`);
                        fillCapabilityInputs(1, inputCapabilityKey, 'Input', inputCapabilityValue);
                    });

                cy.intercept('/console/environment/blueprint').as('generateBlueprint');

                cy.clickButton('Create');
            });

            cy.wait('@generateBlueprint').then(({ request }) => {
                const { description, labels, capabilities } = request.body;
                expect(description).to.eq(blueprintDescription);

                expect(labels.length).to.eq(1);
                expect(labels[0].key).to.eq(labelKey);
                expect(labels[0].value).to.eq(labelValue);
                expect(labels[0].blueprintDefault).to.be.undefined;

                expect(capabilities.length).to.eq(2);
                expect(capabilities[0].name).to.eq(secretCapabilityKey);
                expect(capabilities[0].source).to.eq('secret');
                expect(!!capabilities[0].blueprintDefault).to.be.false;
                expect(capabilities[0].value).to.eq(secretKey);
                expect(capabilities[1].name).to.eq(inputCapabilityKey);
                expect(capabilities[1].source).to.eq('input');
                expect(!!capabilities[1].blueprintDefault).to.be.false;
                expect(capabilities[1].value).to.eq(inputCapabilityValue);
            });

            cy.getField('Deployment name').find('input').should('have.value', deploymentName);
            cy.getField('secret_capability_key')
                .find('input')
                .should('have.value', '{ get-secret: create_environment_secret }');
            cy.getField('input_capability_key').find('input').should('have.value', '{ get-input: input_capability }');

            cy.contains('Deployment Metadata').click();
            cy.getField('Site name').contains(siteName).should('be.visible');
            cy.getField('Labels').within(() => {
                cy.contains(labelKey);
                cy.contains(labelValue);
            });
        });
    });
});

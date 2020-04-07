describe('Deployment - Inputs', () => {
    const blueprintPrefix = 'cypress_test_';
    const firstInputNthChild = 8;

    const selectBlueprintInModal = type => {
        cy.get('.modal form div[name="blueprintName"]')
            .click()
            .within(() => {
                cy.get('input').type(`${blueprintPrefix}${type}`);
                cy.get(`div[option-value="${blueprintPrefix}${type}_type"]`).click();
            });
    };

    const verifyNumberInput = (min = null, max = null, value = '', step = 1) => {
        cy.get('input').then($input => {
            const checkAttr = (attrName, attrValue) => {
                if (attrValue !== null) {
                    expect($input).to.have.attr(attrName, String(attrValue));
                } else {
                    expect($input).to.not.have.attr(attrName);
                }
            };
            checkAttr('min', min);
            checkAttr('max', max);
            checkAttr('step', step);
            checkAttr('value', value);
        });
    };

    before(() => {
        cy.activate('valid_spire_license').login();

        cy.deleteBlueprints(blueprintPrefix);
        const types = ['boolean', 'dict', 'float', 'integer', 'list', 'regex', 'string'];
        types.forEach(type =>
            cy.uploadBlueprint('blueprints/input_types.zip', `${blueprintPrefix}${type}_type`, `${type}_type.yaml`)
        );

        cy.get('div.deploymentButtonWidget button').click();
    });

    it('handles boolean types', () => {
        selectBlueprintInModal('boolean');

        cy.get(`form :nth-child(${firstInputNthChild}).field`)
            .as('boolean_no_default')
            .within(() => {
                cy.get('div.toggle.checkbox')
                    .as('toggle')
                    .should('not.have.class', 'checked');
                cy.get('@toggle').should('have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('have.class', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('not.have.class', 'checked');
            });

        cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
            .as('boolean_default_false')
            .within(() => {
                cy.get('div.toggle.checkbox')
                    .as('toggle')
                    .should('not.have.class', 'checked');
                cy.get('@toggle').should('not.have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('i.undo.link.icon')
                    .as('revertToDefaultValue')
                    .should('be.visible');
                cy.get('@toggle').should('have.class', 'checked');

                cy.get('@revertToDefaultValue').click();
                cy.get('@revertToDefaultValue').should('not.be.visible');
                cy.get('@toggle').should('not.have.class', 'checked');
            });

        cy.get(`form :nth-child(${firstInputNthChild + 2}).field`)
            .as('boolean_default_true')
            .within(() => {
                cy.get('div.toggle.checkbox')
                    .as('toggle')
                    .should('have.class', 'checked');
                cy.get('@toggle').should('not.have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('i.undo.link.icon')
                    .as('revertToDefaultValue')
                    .should('be.visible');
                cy.get('@toggle').should('not.have.class', 'checked');

                cy.get('@revertToDefaultValue').click();
                cy.get('@revertToDefaultValue').should('not.be.visible');
                cy.get('@toggle').should('have.class', 'checked');
            });
    });

    it('handles integer types', () => {
        selectBlueprintInModal('integer');

        cy.get(`form :nth-child(${firstInputNthChild}).field`)
            .as('integer_constraint_max_1')
            .within(() => verifyNumberInput(null, 50));
        cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
            .as('integer_constraint_max_2')
            .within(() => verifyNumberInput(null, 60));
        cy.get(`form :nth-child(${firstInputNthChild + 2}).field`)
            .as('integer_constraint_max_3')
            .within(() => verifyNumberInput(null, 50));
        cy.get(`form :nth-child(${firstInputNthChild + 3}).field`)
            .as('integer_constraint_max_4')
            .within(() => verifyNumberInput(5, 15));

        cy.get(`form :nth-child(${firstInputNthChild + 4}).field`)
            .as('integer_constraint_min_1')
            .within(() => verifyNumberInput(2));
        cy.get(`form :nth-child(${firstInputNthChild + 5}).field`)
            .as('integer_constraint_min_2')
            .within(() => verifyNumberInput(4));
        cy.get(`form :nth-child(${firstInputNthChild + 6}).field`)
            .as('integer_constraint_min_3')
            .within(() => verifyNumberInput(4));
        cy.get(`form :nth-child(${firstInputNthChild + 7}).field`)
            .as('integer_constraint_min_4')
            .within(() => verifyNumberInput(5, 8));

        cy.get(`form :nth-child(${firstInputNthChild + 9}).field`)
            .as('integer_constraint_min_max')
            .within(() => verifyNumberInput(5, 15, 10));

        cy.get(`form :nth-child(${firstInputNthChild + 8}).field`)
            .as('integer_no_default')
            .within(() => verifyNumberInput());

        cy.get(`form :nth-child(${firstInputNthChild + 10}).field`)
            .as('integer_default')
            .within(() => {
                verifyNumberInput(null, null, 50);

                cy.get('input')
                    .as('inputField')
                    .clear()
                    .type('123')
                    .blur();

                verifyNumberInput(null, null, 123);
                cy.get('i.undo.link.icon')
                    .as('revertToDefaultValue')
                    .should('be.visible');

                cy.get('@revertToDefaultValue').click();
                verifyNumberInput(null, null, 50);
                cy.get('@revertToDefaultValue').should('not.be.visible');
            });
    });

    it('handles float types', () => {
        selectBlueprintInModal('float');

        cy.get(`form :nth-child(${firstInputNthChild}).field`)
            .as('float_no_default')
            .within(() => verifyNumberInput(null, null, '', 'any'));

        cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
            .as('float_default')
            .within(() => {
                verifyNumberInput(null, null, 3.14, 'any');

                cy.get('input')
                    .as('inputField')
                    .clear()
                    .type('2.71')
                    .blur();

                verifyNumberInput(null, null, 2.71, 'any');
                cy.get('i.undo.link.icon')
                    .as('revertToDefaultValue')
                    .should('be.visible');

                cy.get('@revertToDefaultValue').click();
                verifyNumberInput(null, null, 3.14, 'any');
                cy.get('@revertToDefaultValue').should('not.be.visible');
            });
    });

    it('handles dict types', () => {
        selectBlueprintInModal('dict');

        cy.get(`form :nth-child(${firstInputNthChild}).field`)
            .as('dict_no_default')
            .within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should('have.text', '{}0 items');
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link')
                    .as('switchIcon')
                    .should('be.visible');
                cy.get('.icon.info')
                    .as('infoIcon')
                    .should('be.visible');

                cy.get('@reactJsonView').trigger('mouseout');
                cy.get('@switchIcon').should('not.be.visible');
                cy.get('@infoIcon').should('not.be.visible');

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('@switchIcon').click();
                cy.get('textarea').should('have.text', '{}');
            });

        cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
            .as('dict_default')
            .within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link')
                    .as('switchIcon')
                    .click();
                cy.get('textarea')
                    .as('rawTextArea')
                    .clear()
                    .type('{}');
                cy.get('@switchIcon').click();

                cy.get('@reactJsonView').should('have.text', '{}0 items');
                cy.get('.icon.undo.link')
                    .as('revertToDefaultIcon')
                    .click();

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('@switchIcon').click();
                cy.get('@rawTextArea').should(
                    'have.text',
                    '{"a":1,"c":[1,2,3],"b":3.14,"d":{"e":1,"f":null},"g":"abc"}'
                );
            });
    });

    it('handles list types', () => {
        selectBlueprintInModal('list');

        cy.get(`form :nth-child(${firstInputNthChild}).field`)
            .as('list_no_default')
            .within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should('have.text', '[]0 items');
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link')
                    .as('switchIcon')
                    .should('be.visible');
                cy.get('.icon.info')
                    .as('infoIcon')
                    .should('be.visible');
            });

        cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
            .as('list_default')
            .within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should(
                    'have.text',
                    '[5 items0:int11:{1 item"a":string"b"}2:string"test"3:[3 items0:int11:int22:int3]4:float3.14]'
                );
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit')
                    .should('have.class', 'link')
                    .click();

                cy.get('textarea')
                    .clear()
                    .type('invalidValue');

                cy.get('.icon.edit').should('have.class', 'disabled');
            });
    });

    it.only('handles string types', () => {
        selectBlueprintInModal('string');

        cy.get(`form :nth-child(${firstInputNthChild}).field`)
            .as('string_no_default')
            .within(() => {});

        cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
            .as('string_constraint_pattern')
            .within(() => {});

        cy.get(`form :nth-child(${firstInputNthChild + 2}).field`)
            .as('string_constraint_valid_values')
            .within(() => {});

        cy.get(`form :nth-child(${firstInputNthChild + 3}).field`)
            .as('string_default')
            .within(() => {});

        cy.get(`form :nth-child(${firstInputNthChild + 4}).field`)
            .as('string_default_null')
            .within(() => {});
    });
});

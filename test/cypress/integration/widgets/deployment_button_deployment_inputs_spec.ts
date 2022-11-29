describe('Create Deployment modal handles deployment inputs', () => {
    const resourcePrefix = 'deployment_inputs_test_';

    const types = [
        'boolean',
        'dict',
        'float',
        'integer',
        'list',
        'regex',
        'string',
        'textarea',
        'blueprint_id',
        'blueprint_id_list',
        'deployment_id',
        'deployment_id_list',
        'capability_value',
        'secret_key',
        'with_deployment_id_constraint'
    ];

    const checkAttribute = (input: JQuery<any>, attrName: string, attrValue?: string | number) => {
        if (attrValue !== undefined) {
            expect(input).to.have.attr(attrName, String(attrValue));
        } else {
            expect(input).to.not.have.attr(attrName);
        }
    };

    const verifyTextInput = (value = '') => {
        cy.get('input').then($input => {
            checkAttribute($input, 'value', value);
        });
    };

    const verifyTextareaContent = (value = '') => {
        cy.get('textarea').then($input => {
            expect($input).to.have.text(value);
        });
    };

    const verifyTextareaRows = (value = 10) => {
        cy.get('textarea').then($input => {
            checkAttribute($input, 'rows', value);
        });
    };

    const verifyNumberInput = ({
        min,
        max,
        value = '',
        step = 1
    }: { min?: number; max?: number; value?: number | string; step?: number | 'any' } = {}) => {
        cy.get('input').then($input => {
            checkAttribute($input, 'min', min);
            checkAttribute($input, 'max', max);
            checkAttribute($input, 'step', step);
            checkAttribute($input, 'value', value);
        });
    };

    const verifyNumberOfOptions = (number: number, atLeast = false, typedPrefix = resourcePrefix) => {
        if (typedPrefix) {
            cy.get('div.dropdown').click().type(typedPrefix);
        } else {
            cy.get('div.dropdown').click();
        }

        const contains = typedPrefix ? ` :contains("${typedPrefix}")` : '';
        if (number === 0) {
            cy.get('.menu').contains('No results found.').should('be.visible');
        } else if (atLeast) {
            cy.get(`.menu .item[role="option"]${contains}`).should('have.length.at.least', number);
        } else {
            cy.get(`.menu .item[role="option"]${contains}`).should('have.length', number);
        }
        cy.get('label').click();
    };

    const verifyMultipleDropdown = () => {
        cy.get(`.multiple`).should('exist');
    };

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentButton').mockLogin();
        cy.deleteSecrets(resourcePrefix);
        cy.deleteDeployments(resourcePrefix, true).deleteBlueprints(resourcePrefix, true);

        types.forEach(type =>
            cy.uploadBlueprint('blueprints/input_types.zip', `${resourcePrefix}${type}_type`, {
                yamlFile: `${type}_type.yaml`
            })
        );
    });

    const selectBlueprintInModal = (type: string) => {
        cy.get('.modal').within(() => {
            const blueprintName = `${resourcePrefix}${type}_type`;
            cy.log(`Selecting blueprint: ${blueprintName}.`);
            cy.setSearchableDropdownValue('Blueprint', blueprintName);

            cy.log('Waiting for blueprint to load and modal to be operational.');
            cy.contains('Deployment Inputs').should('be.visible');
        });
    };

    beforeEach(() => {
        cy.refreshPage();
        cy.interceptSp('POST', { pathname: '/searches/blueprints', query: { state: 'uploaded' } }).as(
            'uploadedBlueprints'
        );
        cy.get('div.deploymentButtonWidget button').click();
    });

    afterEach(() => cy.contains('button', 'Cancel').click());

    describe('of type', () => {
        it('boolean', () => {
            selectBlueprintInModal('boolean');

            cy.getField('bool_no_default').within(() => {
                cy.get('div.toggle.checkbox').as('toggle').should('not.have.class', 'checked');
                cy.get('@toggle').should('have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('have.class', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('not.have.class', 'checked');
            });

            cy.getField('bool_default_false').within(() => {
                cy.get('div.toggle.checkbox').as('toggle').should('not.have.class', 'checked');
                cy.get('@toggle').should('not.have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('have.class', 'checked');

                cy.revertToDefaultValue();
                cy.get('@toggle').should('not.have.class', 'checked');
            });

            cy.getField('bool_default_true').within(() => {
                cy.get('div.toggle.checkbox').as('toggle').should('have.class', 'checked');
                cy.get('@toggle').should('not.have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('not.have.class', 'checked');

                cy.revertToDefaultValue();
                cy.get('@toggle').should('have.class', 'checked');
            });
        });

        it('integer', () => {
            selectBlueprintInModal('integer');

            cy.getField('integer_constraint_max_1').within(() => verifyNumberInput({ max: 50 }));
            cy.getField('integer_constraint_max_2').within(() => verifyNumberInput({ max: 60 }));
            cy.getField('integer_constraint_max_3').within(() => verifyNumberInput({ max: 50 }));
            cy.getField('integer_constraint_max_4').within(() => verifyNumberInput({ min: 5, max: 15 }));

            cy.getField('integer_constraint_min_1').within(() => verifyNumberInput({ min: 2 }));
            cy.getField('integer_constraint_min_2').within(() => verifyNumberInput({ min: 4 }));
            cy.getField('integer_constraint_min_3').within(() => verifyNumberInput({ min: 4 }));
            cy.getField('integer_constraint_min_4').within(() => verifyNumberInput({ min: 5, max: 8 }));

            cy.getField('integer_constraint_min_max').within(() => verifyNumberInput({ min: 5, max: 15, value: 10 }));

            cy.getField('integer_no_default').within(() => verifyNumberInput());

            cy.getField('integer_default').within(() => {
                verifyNumberInput({ value: 50 });

                cy.get('input').as('inputField').clear().type('123').blur();

                verifyNumberInput({ value: 123 });

                cy.revertToDefaultValue();
                verifyNumberInput({ value: 50 });
            });
        });

        it('float', () => {
            selectBlueprintInModal('float');

            cy.getField('float_no_default').within(() => verifyNumberInput({ step: 'any' }));

            cy.getField('float_default').within(() => {
                verifyNumberInput({ value: 3.14, step: 'any' });

                cy.get('input').as('inputField').clear().type('2.71').blur();

                verifyNumberInput({ value: 2.71, step: 'any' });

                cy.revertToDefaultValue();
                verifyNumberInput({ value: 3.14, step: 'any' });
            });
        });

        it('dict', () => {
            selectBlueprintInModal('dict');

            cy.getField('dict_no_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should('have.text', '{}0 items');
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link').as('switchIcon').should('be.visible');
                cy.get('.icon.info').as('infoIcon').should('be.visible');

                cy.get('@reactJsonView').trigger('mouseout');
                cy.get('@switchIcon').should('not.exist');
                cy.get('@infoIcon').should('not.exist');

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('@switchIcon').click();
                cy.get('textarea').should('have.text', '{}');
            });

            cy.getField('dict_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link').as('switchIcon').click();
                cy.get('textarea').as('rawTextArea').clear().type('{}');
                cy.get('@switchIcon').click();

                cy.get('@reactJsonView').should('have.text', '{}0 items');
                cy.revertToDefaultValue();

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('@switchIcon').click();
                cy.get('@rawTextArea')
                    .invoke('text')
                    .then(text =>
                        expect(JSON.parse(text)).to.deep.equal({
                            a: 1,
                            b: 3.14,
                            c: [1, 2, 3],
                            d: { e: 1, f: null },
                            g: 'abc'
                        })
                    );
            });
        });

        it('list', () => {
            selectBlueprintInModal('list');

            cy.getField('list_no_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should('have.text', '[]0 items');
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link').should('be.visible');
                cy.get('.icon.info').should('be.visible');
            });

            cy.getField('list_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should(
                    'have.text',
                    '[5 items0:int11:{1 item"a":string"b"}2:string"test"3:[3 items0:int11:int22:int3]4:float3.14]'
                );
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit').should('have.class', 'link').click();

                cy.get('textarea').clear().type('invalidValue');

                cy.get('.icon.edit').should('have.class', 'disabled');
            });
        });

        it('string', () => {
            selectBlueprintInModal('string');

            cy.getField('string_no_default').within(() => {
                verifyTextInput();
            });

            cy.getField('string_constraint_pattern').within(() => {
                verifyTextInput('Ubuntu 18.04');
                cy.get('input').clear().type('Something').blur();
                verifyTextInput('Something');
                cy.revertToDefaultValue();
                verifyTextInput('Ubuntu 18.04');
            });

            cy.getField('string_constraint_valid_values').within(() => {
                cy.get('div.text').as('text').should('have.text', 'en');
                cy.get('div.dropdown').click();

                cy.get('div[name="pl"]').should('be.visible');
                cy.get('div[name="en"]').should('be.visible');
                cy.get('div[name="fr"]').should('be.visible');
                cy.get('div[name="pl"]').click();
                cy.get('@text').should('have.text', 'pl');

                cy.revertToDefaultValue();
                cy.get('@text').should('have.text', 'en');

                cy.get('i.dropdown.icon').as('dropdownOrClearIcon').should('be.visible').should('have.class', 'clear');
                cy.get('@dropdownOrClearIcon').click();

                cy.get('@text').should('not.exist');
                cy.get('@dropdownOrClearIcon').should('not.have.class', 'clear');

                cy.revertToDefaultValue();
                cy.get('@text').should('have.text', 'en');
            });

            cy.getField('string_default').within(() => {
                verifyTextInput('Some default string');
            });

            cy.getField('string_default_null').within(() => {
                verifyTextInput('null');
            });
        });

        it('textarea', () => {
            selectBlueprintInModal('textarea');

            cy.getField('textarea_default_en').within(() => {
                verifyTextareaContent('en');
            });

            cy.getField('textarea_display_rows_5').within(() => {
                verifyTextareaContent('');
            });

            cy.getField('textarea_default_en').within(() => {
                verifyTextareaRows();
            });

            cy.getField('textarea_display_rows_5').within(() => {
                verifyTextareaRows(5);
            });
        });

        it('blueprint_id', () => {
            selectBlueprintInModal('blueprint_id');

            cy.getField('blueprint_id_all').within(() => {
                verifyNumberOfOptions(5, true);
            });

            cy.getField('blueprint_id_name_contains_blueprint_id_type').within(() => {
                verifyNumberOfOptions(1);
            });
        });

        it('blueprint_id_list', () => {
            selectBlueprintInModal('blueprint_id_list');

            cy.getField('blueprint_id_all').within(() => {
                verifyNumberOfOptions(5, true);
                verifyMultipleDropdown();
            });

            cy.getField('blueprint_id_name_contains_blueprint_id_type').within(() => {
                verifyNumberOfOptions(1);
                verifyMultipleDropdown();
            });
        });

        it('deployment_id', () => {
            const emptyBlueprintId = `${resourcePrefix}emptyBlueprintId`;
            const testDeploymentId = `${emptyBlueprintId}deployment1234`;

            cy.uploadBlueprint('blueprints/empty.zip', emptyBlueprintId).deployBlueprint(
                emptyBlueprintId,
                testDeploymentId
            );

            selectBlueprintInModal('deployment_id');

            cy.getField('deployment_id_all').within(() => {
                verifyNumberOfOptions(1, true);
            });

            cy.getField('deployment_id_name_contains_deployment1234').within(() => {
                verifyNumberOfOptions(1);
            });

            cy.getField('deployment_id_name_contains_not_existing').within(() => {
                verifyNumberOfOptions(0);
            });
        });

        it('deployment_id_list', () => {
            selectBlueprintInModal('deployment_id_list');

            cy.getField('deployment_id_all').within(() => {
                verifyNumberOfOptions(1, true);
                verifyMultipleDropdown();
            });

            cy.getField('deployment_id_name_contains_deployment1234').within(() => {
                verifyNumberOfOptions(1);
                verifyMultipleDropdown();
            });

            cy.getField('deployment_id_name_contains_not_existing').within(() => {
                verifyNumberOfOptions(0);
                verifyMultipleDropdown();
            });
        });

        it('capability_value', () => {
            const capabilitiesBlueprintId = `${resourcePrefix}capabilities`;
            const testDeploymentId = `${capabilitiesBlueprintId}_dep`;

            cy.uploadBlueprint('blueprints/capabilities.zip', capabilitiesBlueprintId).deployBlueprint(
                capabilitiesBlueprintId,
                testDeploymentId
            );

            selectBlueprintInModal('capability_value');

            cy.getField('capability_value_all').within(() => {
                verifyNumberOfOptions(3, true, '');
            });

            cy.getField('capability_value_contains_y').within(() => {
                verifyNumberOfOptions(2, true, '');
            });
        });

        it('secret_key', () => {
            selectBlueprintInModal('secret_key');

            cy.createSecret(`${resourcePrefix}key`, 'value');
            cy.createSecret(`${resourcePrefix}key2`, 'value2');
            cy.createSecret(`${resourcePrefix}some_name`, 'value2');

            cy.getField('secret_key_all').within(() => {
                verifyNumberOfOptions(3, false);
            });

            cy.getField('secret_key_contains_key').within(() => {
                verifyNumberOfOptions(2, false);
            });
        });
    });

    describe('with deployment_id constraint', () => {
        it('when deployment is not present', () => {
            selectBlueprintInModal('with_deployment_id_constraint');
            cy.getField('node_id_from_deployment').within(() => verifyNumberOfOptions(0, false, ''));
            cy.getField('node_instance_from_deployment').within(() => verifyNumberOfOptions(0, false, ''));
            cy.getField('node_type_from_deployment').within(() => verifyNumberOfOptions(0, false, ''));
            cy.getField('scaling_group_from_deployment').within(() => verifyNumberOfOptions(0, false, ''));
        });

        it('when deployment is present', () => {
            const testBlueprintId = `${resourcePrefix}contraint_test`;
            const testDeploymentId = `${testBlueprintId}_dep`;

            cy.uploadBlueprint('blueprints/workflow_parameters.zip', testBlueprintId, {
                yamlFile: 'scaling_group_type.yaml'
            })
                .deployBlueprint(testBlueprintId, testDeploymentId)
                .waitForExecutionToEnd('create_deployment_environment', { deploymentId: testDeploymentId });

            selectBlueprintInModal('with_deployment_id_constraint');
            cy.getField('node_id_from_deployment').within(() => verifyNumberOfOptions(4, false, ''));
            cy.getField('node_instance_from_deployment').within(() => verifyNumberOfOptions(4, false, ''));
            cy.getField('node_type_from_deployment').within(() => verifyNumberOfOptions(1, false, ''));
            cy.getField('scaling_group_from_deployment').within(() => verifyNumberOfOptions(3, false, ''));
        });
    });
});

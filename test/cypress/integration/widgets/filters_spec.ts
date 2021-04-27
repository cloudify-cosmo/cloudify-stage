import {
    FilterRule,
    FilterRuleOperator,
    FilterRuleOperators,
    FilterRuleRowType,
    FilterRuleType
} from '../../../../widgets/common/src/filters/types';

// TODO: Temporary solution. We should import isAnyOperator from '../../../../widgets/common/src/filters/common'
function isAnyOperator(operator: FilterRuleOperator) {
    const anyOperators: FilterRuleOperator[] = [FilterRuleOperators.AnyOf, FilterRuleOperators.NotAnyOf];
    return anyOperators.includes(operator);
}
function isFreeTextOperator(operator: FilterRuleOperator) {
    const freeTextOperator: FilterRuleOperator[] = [
        FilterRuleOperators.Contains,
        FilterRuleOperators.NotContains,
        FilterRuleOperators.StartsWith,
        FilterRuleOperators.EndsWith
    ];
    return freeTextOperator.includes(operator);
}

describe('Filters widget', () => {
    before(() => {
        cy.usePageMock(['filters', 'onlyMyResources']).activate().mockLogin();
    });

    const filterName = 'filters_test_filter';
    const filterRules: Stage.Common.Filters.Rule[] = [
        { type: FilterRuleType.Attribute, key: 'blueprint_id', values: ['bpid'], operator: FilterRuleOperators.AnyOf },
        { type: FilterRuleType.Label, key: 'precious', values: ['yes'], operator: FilterRuleOperators.AnyOf }
    ];

    beforeEach(() => {
        cy.deleteDeploymentsFilters(filterName).createDeploymentsFilter(filterName, filterRules).refreshPage();
        cy.getSearchInput().type(filterName);
        cy.get('.loading').should('not.exist');
    });

    function openAddFilterModal() {
        cy.contains('Add').click();
    }

    function openCloneFilterModal() {
        cy.get('.clone').click();
    }

    function openEditFilterModal() {
        cy.get('.edit').click();
    }

    function saveFilter() {
        cy.contains('Save').click();
    }

    function addNewRule() {
        cy.contains('Add new rule').click();
    }

    function removeLastRule() {
        withinTheLastRuleRow(() => cy.get('button[aria-label="Remove rule"]').click());
    }

    function typeAttributeRuleValue(value: string) {
        cy.get('[name=ruleValue]').click().find('input').type(`${value}{enter}`).blur();
    }

    function getFilterIdInput() {
        return cy.contains('.field', 'Filter ID').find('input');
    }

    function withinTheLastRuleRow(fn: (currentSubject: JQuery<HTMLElement>) => void) {
        cy.get('.fields:last-of-type').within(fn);
    }

    function withinNthRuleRow(rowNumber: number, fn: (currentSubject: JQuery<HTMLElement>) => void) {
        cy.get(`.fields:eq(${rowNumber})`).within(fn);
    }

    function checkExistingRules() {
        withinNthRuleRow(0, () => {
            cy.contains('Blueprint');
            cy.contains('is one of');
            cy.contains('bpid');
        });

        withinNthRuleRow(1, () => {
            cy.contains('Label');
            cy.contains('is one of');
            cy.contains('precious');
            cy.contains('yes');
        });
    }

    const newBlueprintRuleValue = 'newBlueprintId';
    function modifyBlueprintRule() {
        withinNthRuleRow(0, () => {
            cy.contains('is one of').click();
            cy.contains('contains').click();
            typeAttributeRuleValue(newBlueprintRuleValue);
        });
    }

    function checkRequestRules() {
        cy.wait('@rulesRequest').then(({ request }) => {
            const requestRules = request.body.filter_rules;
            expect(requestRules).to.have.length(2);
            expect(requestRules[0]).to.deep.equal({
                type: FilterRuleType.Attribute,
                key: 'blueprint_id',
                values: [newBlueprintRuleValue],
                operator: FilterRuleOperators.Contains
            });
            expect(requestRules[1]).to.deep.equal(filterRules[1]);
        });
    }

    it('should list existing filters', () => {
        cy.get('table')
            .getTable()
            .should(tableData => {
                expect(tableData).to.have.length(1);
                expect(tableData[0]['Filter name']).to.eq(filterName);
                expect(tableData[0].Creator).to.eq('admin');
                expect(tableData[0].Created).not.to.be.null;
            });
        cy.get('.filtersWidget .checkbox:not(.checked)');

        const systemFilterName = 'csys-environment-filter';
        cy.getSearchInput().clear().type(systemFilterName);
        cy.get('.loading').should('not.exist');

        cy.get('table')
            .getTable()
            .should(tableData => {
                expect(tableData).to.have.length(1);
                expect(tableData[0]['Filter name']).to.eq(systemFilterName);
                expect(tableData[0].Creator).to.eq('admin');
                expect(tableData[0].Created).not.to.be.null;
            });

        cy.get('.filtersWidget .checkbox.checked');

        const disabledIconTitle = "System filter can't be edited or deleted";
        cy.get('.edit').should('have.class', 'disabled');
        cy.get('.edit').should('have.prop', 'title', disabledIconTitle);
        cy.get('.trash').should('have.class', 'disabled');
        cy.get('.trash').should('have.prop', 'title', disabledIconTitle);
        cy.get('.clone').should('not.have.class', 'disabled');
    });

    it('should allow to add new filter', () => {
        const blueprintId = 'filters_test_blueprint';
        const deploymentId = 'filters_test_deployment';
        const labelKey = 'label_key';

        cy.deleteDeployments(deploymentId)
            .deleteBlueprints(blueprintId)
            .uploadBlueprint('blueprints/empty.zip', blueprintId)
            .deployBlueprint(blueprintId, deploymentId)
            .setLabels(deploymentId, [{ [labelKey]: 'label_value' }]);

        const newFilterName = `${filterName}_added`;
        openAddFilterModal();

        cy.get('.modal').within(() => {
            getFilterIdInput().type(newFilterName);
            withinTheLastRuleRow(() => typeAttributeRuleValue(blueprintId));
            addNewRule();
            withinTheLastRuleRow(() => {
                cy.get('[name=ruleRowType]').click();
                cy.contains('Label').click();
                cy.get('[name=ruleOperator]').click();
                cy.contains('key is not').click();
                cy.get('[name=labelKey]').click();
                cy.get('[name=labelKey] input').type(labelKey);
                cy.get(`[option-value=${labelKey}]`).click();
            });

            cy.interceptSp('PUT', `/filters/deployments/${newFilterName}`).as('createRequest');
            saveFilter();
            cy.wait('@createRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.have.length(2);
                expect(requestRules[0]).to.deep.equal({
                    type: FilterRuleType.Attribute,
                    key: 'blueprint_id',
                    values: [blueprintId],
                    operator: FilterRuleOperators.Contains
                });
                expect(requestRules[1]).to.deep.equal({
                    type: FilterRuleType.Label,
                    key: labelKey,
                    values: [],
                    operator: FilterRuleOperators.IsNull
                });
            });
        });

        cy.get('.modal').should('not.exist');
        cy.contains(newFilterName);

        cy.get('table')
            .getTable()
            .should(tableData => {
                expect(tableData).to.have.length(2);
                expect(tableData[1]['Filter name']).to.eq(newFilterName);
                expect(tableData[1].Creator).to.eq('admin');
                expect(tableData[1].Created).not.to.be.null;
            });
        cy.get('.filtersWidget .checkbox:not(.checked)').should('have.length', 2);
    });

    it('should allow to edit existing filter', () => {
        openEditFilterModal();

        cy.get('.modal').within(() => {
            cy.contains(`Edit filter '${filterName}'`);

            checkExistingRules();
            modifyBlueprintRule();

            cy.interceptSp('PATCH', `/filters/deployments/${filterName}`).as('rulesRequest');
            cy.interceptSp('GET', `/filters/deployments`).as('filtersRequest');
            saveFilter();
            checkRequestRules();
        });

        cy.get('.modal').should('not.exist');
        cy.log('Verify filters list is refetched immediatelly');
        cy.wait('@filtersRequest', { requestTimeout: 1000 });
    });

    it('should allow to clone existing filter', () => {
        openCloneFilterModal();

        cy.get('.modal').within(() => {
            cy.contains(`Clone filter '${filterName}'`);

            getFilterIdInput().should('have.value', `${filterName}_clone`);

            getFilterIdInput().clear().type('csys-invalid');
            typeAttributeRuleValue('test');
            saveFilter();
            cy.contains('All filters with a `csys-` prefix are reserved for internal use');

            getFilterIdInput().clear().type(`${filterName}_2`);

            checkExistingRules();
            modifyBlueprintRule();

            cy.interceptSp('PUT', `/filters/deployments/${filterName}_2`).as('rulesRequest');
            saveFilter();
            checkRequestRules();
        });

        cy.get('.modal').should('not.exist');
    });

    it('should allow to remove existing filter', () => {
        cy.get('.trash').click();
        cy.contains('Yes').click();

        cy.contains('There are no filters defined');
    });

    it('should prevent filter used as default from being removed', () => {
        cy.intercept('GET', `/console/filters/usage/${filterName}`, [
            { pageName: 'Dashboard', widgetName: 'Deployments View', username: 'admin' }
        ]).as('usageRequest');

        cy.get('.trash').click();
        cy.contains('Yes').click();

        cy.wait('@usageRequest');

        cy.contains("Filter 'filters_test_filter' cannot be removed");
        cy.contains("Used as default filter in 'Deployments View' widget in 'Dashboard' page by user 'admin'");

        cy.contains('OK').click();
        cy.get('.modal').should('not.exist');
    });

    it('should support "Only my resources" setting', () => {
        cy.interceptSp('GET', new RegExp('/filters/deployments\\?.*created_by=admin.*')).as('getRequest');

        cy.contains('Show only my resources').click();

        cy.wait('@getRequest');
    });

    describe('should handle errors', () => {
        type FilterModalError = {
            name: string;
            prepare?: () => void;
            verify: () => void;
            clean?: () => void;
        };

        const commonModalErrors: FilterModalError[] = [
            {
                name: 'not all values provided',
                prepare: () => addNewRule(),
                verify: () => {
                    cy.contains('Please provide all the values in filter rules section');
                    withinTheLastRuleRow(() => cy.get('[name="ruleValue"]').parent().should('have.class', 'error'));
                },
                clean: () => removeLastRule()
            }
        ];

        function verifyErrorHandling(error: FilterModalError) {
            cy.log(`Verify error handling - ${error.name}`);

            if (typeof error.prepare === 'function') error.prepare();
            saveFilter();
            error.verify();
            if (typeof error.clean === 'function') error.clean();

            cy.get('.error.message .close').click();
        }

        it('when adding new filter', () => {
            const addModalOnlyErrors: FilterModalError[] = [
                {
                    name: 'empty form',
                    prepare: () => {
                        getFilterIdInput().clear();
                        addNewRule();
                    },
                    verify: () => {
                        cy.contains('Please provide the filter ID');
                        cy.contains('Please provide all the values in filter rules section');
                    },
                    clean: () => removeLastRule()
                },
                {
                    name: 'reserved filter ID provided',
                    prepare: () => {
                        getFilterIdInput().clear().type('csys-invalid');
                        withinTheLastRuleRow(() => typeAttributeRuleValue('csys'));
                    },
                    verify: () => cy.contains('All filters with a `csys-` prefix are reserved for internal use'),
                    clean: () => withinTheLastRuleRow(() => cy.get('.label[value="csys"] .delete').click())
                }
            ];

            openAddFilterModal();
            cy.get('.modal').within(() => {
                const addModalErrors = [...addModalOnlyErrors, ...commonModalErrors];
                addModalErrors.forEach(verifyErrorHandling);
            });
        });

        it('when editing existing filter', () => {
            openEditFilterModal();
            cy.get('.modal').within(() => {
                const editModalErrors = commonModalErrors;
                editModalErrors.forEach(verifyErrorHandling);
            });
        });

        it('should handle errors when cloning existing filter', () => {
            const cloneModalOnlyErrors: FilterModalError[] = [
                {
                    name: 'reserved filter ID provided',
                    prepare: () => {
                        getFilterIdInput().clear().type('csys-invalid');
                    },
                    verify: () => cy.contains('All filters with a `csys-` prefix are reserved for internal use')
                }
            ];

            openCloneFilterModal();
            cy.get('.modal').within(() => {
                const cloneModalErrors = [...cloneModalOnlyErrors, ...commonModalErrors];
                cloneModalErrors.forEach(verifyErrorHandling);
            });
        });
    });
    describe('should allow to define all kinds of filter rules', () => {
        const testPrefix = 'filters_test_form';
        const blueprintId = `${testPrefix}_blueprint`;
        const deploymentId = `${testPrefix}_deployment`;

        before(() => {
            cy.deleteDeployments(testPrefix)
                .deleteBlueprints(testPrefix)
                .uploadBlueprint('blueprints/empty.zip', blueprintId)
                .deployBlueprint(blueprintId, deploymentId)
                .setLabels(deploymentId, [
                    { os: 'linux' },
                    { os: 'windows' },
                    { infra: 'aws' },
                    { infra: 'gcp' },
                    { infra: 'azure' }
                ])
                .deleteSites(testPrefix)
                .createSites([
                    { name: `${testPrefix}_Cracow` },
                    { name: `${testPrefix}_Warsaw` },
                    { name: `${testPrefix}_TelAviv` }
                ]);
        });

        function selectRuleRowType(ruleRowType: FilterRuleRowType) {
            withinTheLastRuleRow(() => {
                cy.get('div[name="ruleRowType"]').click();
                cy.get(`div[option-value="${ruleRowType}"]`).click();
            });
        }

        function selectRuleOperator(operator: FilterRuleOperator) {
            withinTheLastRuleRow(() => {
                cy.get('div[name="ruleOperator"]').click();
                cy.get(`div[option-value="${operator}"]`).click();
            });
        }

        function selectRuleAttributeValues(
            ruleRowType: FilterRuleRowType,
            values: string[],
            newValues = [] as string[],
            withAutocomplete = false
        ) {
            if (values.length > 0) {
                withinTheLastRuleRow(() => {
                    const endpoint = ((rowType: FilterRuleRowType) => {
                        switch (rowType) {
                            case 'blueprint_id':
                                return 'blueprints';
                            case 'site_name':
                                return 'sites';
                            case 'created_by':
                                return 'users';
                            default:
                                throw new Error('Unknown rule row type.');
                        }
                    })(ruleRowType);
                    cy.get('div[name="ruleValue"]')
                        .click()
                        .within(() => {
                            values.forEach(value => {
                                if (withAutocomplete)
                                    cy.interceptSp('GET', RegExp(`${endpoint}.*_search=${value}`)).as(
                                        `value_${value}_Search`
                                    );
                                cy.get('input').type(`${value}`);
                                if (withAutocomplete) cy.wait(`@value_${value}_Search`);
                                if (newValues.includes(value)) cy.contains('[role="option"]', 'Add ').click();
                                else cy.get(`div[option-value="${value}"]`).click();
                                cy.get(`.label[value="${value}"]`).should('exist');
                            });
                        });
                });
            }
        }

        function selectRuleLabelKey(key: string, newKey = false) {
            withinTheLastRuleRow(() => {
                cy.interceptSp('GET', `/labels/deployments?_search=${key}`).as(`keySearch_${key}`);
                cy.get('div[name="labelKey"]').within(() => {
                    cy.get('input').type(key);
                    cy.wait(`@keySearch_${key}`);
                    if (newKey) cy.contains('[role="option"]', 'New key ').click();
                    else cy.get(`div[option-value="${key}"]`).click();
                    cy.get(`input.search`).should('not.have.value');
                });
            });
        }

        function selectRuleLabelValues(values: string[], newValues = [] as string[]) {
            if (values.length > 0) {
                withinTheLastRuleRow(() => {
                    cy.get('div[name="labelValue"]')
                        .click()
                        .within(() => {
                            values.forEach(value => {
                                cy.interceptSp('GET', RegExp(`/labels/deployments/.*?_search=${value}`)).as(
                                    `valueSearch_${value}`
                                );
                                cy.get('input').type(`${value}`);
                                cy.wait(`@valueSearch_${value}`);
                                if (newValues.includes(value)) cy.contains('[role="option"]', 'New value ').click();
                                else cy.get(`div[option-value="${value}"]`).click();
                                cy.get(`.label[value="${value}"]`).should('exist');
                            });
                        });
                });
            }
        }

        function populateFilterRuleRow(rule: ExtendedFilterRule) {
            const ruleRowType =
                rule.type === FilterRuleType.Label ? FilterRuleRowType.Label : (rule.key as FilterRuleRowType);

            selectRuleRowType(ruleRowType);
            selectRuleOperator(rule.operator);
            if (ruleRowType === FilterRuleRowType.Label) {
                selectRuleLabelKey(rule.key, rule.newKey);
                if (isAnyOperator(rule.operator)) {
                    selectRuleLabelValues(rule.values, rule.newValues);
                }
            } else {
                selectRuleAttributeValues(ruleRowType, rule.values, rule.newValues, !isFreeTextOperator(rule.operator));
            }
        }

        function populateFilterRuleRows(filterId: string, rules: ExtendedFilterRule[]) {
            cy.get('.modal').within(() => {
                cy.contains('.field', 'Filter ID').find('input').type(filterId);
                rules.forEach((rule, index) => {
                    if (index > 0) addNewRule();
                    populateFilterRuleRow(rule);
                });
            });
        }

        function saveAndVerifyFilter(filterId: string, testRules: ExtendedFilterRule[]) {
            cy.interceptSp('PUT', `/filters/deployments/${filterId}`).as('createRequest');
            saveFilter();

            cy.log('Filter creation request verification');
            cy.wait('@createRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.have.length(testRules.length);
                testRules.forEach((_rule, index: number) => {
                    expect(requestRules[index]).to.deep.equal(_.omit(testRules[index], ['newKey', 'newValues']));
                });
            });

            cy.log('Filter rules form population verification');
            cy.getSearchInput().clear().type(filterId);
            cy.get('.loading').should('not.exist');
            openEditFilterModal();
            cy.get('.modal').within(() => {
                testRules.forEach((rule, ruleIndex) => {
                    withinNthRuleRow(ruleIndex, () => {
                        cy.get(
                            `div[name="ruleRowType"] [option-value="${
                                rule.type === FilterRuleType.Label ? FilterRuleType.Label : rule.key
                            }"][aria-selected="true"]`
                        ).should('exist');
                        cy.get(
                            `div[name="ruleOperator"] [option-value="${rule.operator}"][aria-selected="true"]`
                        ).should('exist');

                        if (rule.type === FilterRuleType.Label) {
                            cy.get(`div[name="labelKey"] [option-value="${rule.key}"][aria-selected="true"]`).should(
                                'exist'
                            );
                        }
                        rule.values.forEach(value => {
                            cy.get(
                                `div[name="${
                                    rule.type === FilterRuleType.Label ? 'labelValue' : 'ruleValue'
                                }"] .label[value="${value}"]`
                            ).should('exist');
                        });
                    });
                });
            });
        }

        interface ExtendedFilterRule extends FilterRule {
            newKey?: boolean;
            newValues?: string[];
        }
        type RuleRowTest = {
            name: string;
            testFilterName: string;
            testFilterRules: ExtendedFilterRule[];
        };

        const ruleRowTests: RuleRowTest[] = [
            {
                name: 'of type "label" with operators "any_of" and "not_any_of"',
                testFilterName: `${filterName}_label_1`,
                testFilterRules: [
                    {
                        type: FilterRuleType.Label,
                        key: 'os',
                        values: ['windows', 'linux', 'mac'],
                        operator: FilterRuleOperators.AnyOf,
                        newValues: ['mac']
                    },

                    {
                        type: FilterRuleType.Label,
                        key: 'edition',
                        values: ['silver'],
                        operator: FilterRuleOperators.NotAnyOf,
                        newKey: true,
                        newValues: ['silver']
                    }
                ]
            },
            {
                name: 'of type "label" with operators "is_null" and "is_not_null"',
                testFilterName: `${filterName}_label_2`,
                testFilterRules: [
                    {
                        type: FilterRuleType.Label,
                        key: 'os',
                        values: [],
                        operator: FilterRuleOperators.IsNull
                    },

                    {
                        type: FilterRuleType.Label,
                        key: 'infra',
                        values: [],
                        operator: FilterRuleOperators.IsNotNull
                    }
                ]
            },
            {
                name: 'of type "attribute" with operators "any_of" and "not_any_of"',
                testFilterName: `${filterName}_attribute_1`,
                testFilterRules: [
                    {
                        type: FilterRuleType.Attribute,
                        key: 'blueprint_id',
                        values: [blueprintId, `${testPrefix}_new`],
                        operator: FilterRuleOperators.AnyOf,
                        newValues: [`${testPrefix}_new`]
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'blueprint_id',
                        values: [blueprintId],
                        operator: FilterRuleOperators.NotAnyOf
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'site_name',
                        values: [`${testPrefix}_Warsaw`, `${testPrefix}_Cracow`],
                        operator: FilterRuleOperators.AnyOf
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'site_name',
                        values: [`${testPrefix}_TelAviv`, `${testPrefix}_Paris`],
                        operator: FilterRuleOperators.NotAnyOf,
                        newValues: [`${testPrefix}_Paris`]
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'created_by',
                        values: [`${testPrefix}_user`],
                        operator: FilterRuleOperators.AnyOf,
                        newValues: [`${testPrefix}_user`]
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'created_by',
                        values: ['admin'],
                        operator: FilterRuleOperators.NotAnyOf
                    }
                ]
            },
            {
                name: 'of type "attribute" with operators "contains", "not_contains", "starts_with" and "ends_with"',
                testFilterName: `${filterName}_attribute_2`,
                testFilterRules: [
                    {
                        type: FilterRuleType.Attribute,
                        key: 'blueprint_id',
                        values: ['blu', 'test'],
                        operator: FilterRuleOperators.Contains,
                        newValues: ['blu', 'test']
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'site_name',
                        values: ['site', 'test'],
                        operator: FilterRuleOperators.NotContains,
                        newValues: ['site', 'test']
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'created_by',
                        values: ['user', 'test'],
                        operator: FilterRuleOperators.StartsWith,
                        newValues: ['user', 'test']
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'created_by',
                        values: ['operator'],
                        operator: FilterRuleOperators.EndsWith,
                        newValues: ['operator']
                    }
                ]
            }
        ];

        ruleRowTests.map(ruleRowTest => {
            const { name, testFilterName, testFilterRules } = ruleRowTest;
            return it(name, () => {
                openAddFilterModal();
                populateFilterRuleRows(testFilterName, testFilterRules);
                saveAndVerifyFilter(testFilterName, testFilterRules);
            });
        });
    });
});

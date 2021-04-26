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

    function typeAttributeRuleValue(value: string) {
        cy.get('[name=ruleValue]').click().find('input').type(`${value}{enter}`).blur();
    }

    function getFilterIdInput() {
        return cy.contains('.field', 'Filter ID').find('input');
    }

    function checkExistingRules() {
        cy.get('.fields:eq(0)').within(() => {
            cy.contains('Blueprint');
            cy.contains('is one of');
            cy.contains('bpid');
        });

        cy.get('.fields:eq(1)').within(() => {
            cy.contains('Label');
            cy.contains('is one of');
            cy.contains('precious');
            cy.contains('yes');
        });
    }

    const newBlueprintRuleValue = 'newBlueprintId';
    function modifyBlueprintRule() {
        cy.get('.fields:eq(0)').within(() => {
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
        cy.contains('Add').click();

        cy.get('.modal').within(() => {
            cy.contains('Save').click();
            cy.contains('Please provide the filter ID');

            getFilterIdInput().type('csys-invalid');
            cy.contains('Save').click();
            cy.contains('All filters with a `csys-` prefix are reserved for internal use');

            getFilterIdInput().clear().type(newFilterName);

            cy.get('.fields:eq(0)').within(() => typeAttributeRuleValue(blueprintId));
            cy.contains('Add new rule').click();
            cy.get('.fields:eq(1)').within(() => {
                cy.get('[name=ruleRowType]').click();
                cy.contains('Label').click();
                cy.get('[name=ruleOperator]').click();
                cy.contains('key is not').click();
                cy.get('[name=labelKey]').click();
                cy.get(`[option-value=${labelKey}]`).click();
            });

            cy.interceptSp('PUT', `/filters/deployments/${newFilterName}`).as('createRequest');
            cy.contains('Save').click();
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
        cy.get('.edit').click();

        cy.get('.modal').within(() => {
            cy.contains(`Edit filter '${filterName}'`);

            checkExistingRules();
            modifyBlueprintRule();

            cy.interceptSp('PATCH', `/filters/deployments/${filterName}`).as('rulesRequest');
            cy.interceptSp('GET', `/filters/deployments`).as('filtersRequest');
            cy.contains('Save').click();
            checkRequestRules();
        });

        cy.get('.modal').should('not.exist');
        cy.log('Verify filters list is refetched immediatelly');
        cy.wait('@filtersRequest', { requestTimeout: 1000 });
    });

    it('should allow to clone existing filter', () => {
        cy.get('.clone').click();

        cy.get('.modal').within(() => {
            cy.contains(`Clone filter '${filterName}'`);

            getFilterIdInput().should('have.value', `${filterName}_clone`);

            getFilterIdInput().clear().type('csys-invalid');
            cy.contains('Save').click();
            cy.contains('All filters with a `csys-` prefix are reserved for internal use');

            getFilterIdInput().clear().type(`${filterName}_2`);

            checkExistingRules();
            modifyBlueprintRule();

            cy.interceptSp('PUT', `/filters/deployments/${filterName}_2`).as('rulesRequest');
            cy.contains('Save').click();
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

    describe('should allow to define filter rules', () => {
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

        function withinTheLastRuleRow(fn: (currentSubject: JQuery<HTMLElement>) => void) {
            cy.get('.fields:last-of-type').within(fn);
        }

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
                cy.get('div[name="ruleValue"]').click();
                values.forEach(value => {
                    if (withAutocomplete)
                        cy.interceptSp('GET', RegExp(`${endpoint}.*_search=${value}`)).as(`value_${value}_Search`);
                    cy.get('div[name="ruleValue"] input').type(`${value}`);
                    if (withAutocomplete) cy.wait(`@value_${value}_Search`);
                    if (newValues.includes(value)) cy.get('[data-additional="true"]').click();
                    else cy.get(`div[name="ruleValue"] div[option-value="${value}"]`).click();
                    cy.get(`.label[value="${value}"]`).should('exist');
                });
            });
        }

        function selectRuleLabelKey(key: string, newKey = false) {
            withinTheLastRuleRow(() => {
                cy.interceptSp('GET', `/labels/deployments?_search=${key}`).as('keySearch');
                cy.get('div[name="labelKey"] input').type(key);
                cy.wait('@keySearch');
                if (newKey) cy.get('[data-additional="true"]').click();
                else cy.get(`div[name="labelKey"] div[option-value="${key}"]`).click();
                cy.get(`input.search`).should('not.have.value');
            });
        }

        function selectRuleLabelValues(values: string[], newValues = [] as string[]) {
            if (values.length > 0) {
                withinTheLastRuleRow(() => {
                    cy.get('div[name="labelValue"]').click();
                    values.forEach(value => {
                        cy.interceptSp('GET', RegExp(`/labels/deployments/.*?_search=${value}`)).as(
                            `value_${value}_Search`
                        );
                        cy.get('div[name="labelValue"] input').type(`${value}`);
                        cy.wait(`@value_${value}_Search`);
                        if (newValues.includes(value)) cy.get('[data-additional="true"]').click();
                        else cy.get(`div[name="labelValue"] div[option-value="${value}"]`).click();
                        cy.get(`.label[value="${value}"]`).should('exist');
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
                if (isAnyOperator(rule.operator)) {
                    selectRuleLabelKey(rule.key, rule.newKey);
                    selectRuleLabelValues(rule.values, rule.newValues);
                } else {
                    selectRuleLabelKey(rule.key, rule.newKey);
                }
            } else {
                selectRuleAttributeValues(ruleRowType, rule.values, rule.newValues, !isFreeTextOperator(rule.operator));
            }
        }

        function populateFilterRuleRows(filterId: string, rules: ExtendedFilterRule[]) {
            cy.contains('Add').click();
            cy.get('.modal').within(() => {
                cy.contains('.field', 'Filter ID').find('input').type(filterId);
                rules.forEach((rule, index) => {
                    if (index > 0) cy.contains('Add new rule').click();
                    populateFilterRuleRow(rule);
                });
            });
        }

        function saveAndVerifyFilter(filterId: string, testRules: ExtendedFilterRule[]) {
            cy.interceptSp('PUT', `/filters/deployments/${filterId}`).as('createRequest');
            cy.contains('Save').click();
            cy.wait('@createRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.have.length(testRules.length);
                testRules.forEach((_rule, index: number) => {
                    expect(requestRules[index]).to.deep.equal(_.omit(testRules[index], ['newKey', 'newValues']));
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
                populateFilterRuleRows(testFilterName, testFilterRules);
                saveAndVerifyFilter(testFilterName, testFilterRules);
                // TODO: Optional verify that filter rule rows get populated properly
            });
        });
    });
});

import {
    FilterRule,
    FilterRuleOperator,
    FilterRuleOperators,
    FilterRuleRowType,
    FilterRuleType
} from '../../../../widgets/common/src/filters/types';
import { isAnyOfOrNotAnyOfOperator } from '../../../../widgets/common/src/filters/inputs/common';

describe('Filters widget', () => {
    before(() => {
        cy.usePageMock('filters').activate().mockLogin();
    });

    const filterName = 'filters_test_filter';
    const filterRules: Stage.Common.Filters.Rule[] = [
        { type: FilterRuleType.Attribute, key: 'blueprint_id', values: ['bpid'], operator: FilterRuleOperators.AnyOf },
        { type: FilterRuleType.Label, key: 'precious', values: ['yes'], operator: FilterRuleOperators.AnyOf }
    ];

    beforeEach(() => {
        cy.deleteDeploymentsFilters(filterName).createDeploymentsFilter(filterName, filterRules).refreshPage();
        cy.get('input[placeholder="Search..."]').type(filterName);
        cy.get('.loading').should('not.exist');
    });

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
            cy.get('.input input').type(newBlueprintRuleValue);
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

        cy.contains('Add').click();

        cy.contains('Save').click();
        cy.contains('Please provide the filter ID');

        const newFilterName = `${filterName}_added`;

        cy.get('.modal').within(() => {
            cy.contains('.field', 'Filter ID').find('input').type(newFilterName);
            cy.get('.fields:eq(0) .input input').type(blueprintId);
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
    });

    it('should allow to edit existing filter', () => {
        cy.get('.edit').click();

        cy.get('.modal').within(() => {
            cy.contains(`Edit filter '${filterName}'`);

            checkExistingRules();
            modifyBlueprintRule();

            cy.interceptSp('PATCH', `/filters/deployments/${filterName}`).as('rulesRequest');
            cy.contains('Save').click();
            checkRequestRules();
        });

        cy.get('.modal').should('not.exist');
    });

    it('should allow to clone existing filter', () => {
        cy.get('.clone').click();

        cy.get('.modal').within(() => {
            cy.contains(`Clone filter '${filterName}'`);

            checkExistingRules();
            modifyBlueprintRule();

            cy.interceptSp('PUT', `/filters/deployments/${filterName}_clone`).as('rulesRequest');
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

    describe('should allow to define filter rules', () => {
        before(() => {
            const blueprintId = 'filters_test_form_blueprint';
            const deploymentId = 'filters_test_form_deployment';

            cy.deleteDeployments(deploymentId)
                .deleteBlueprints(blueprintId)
                .uploadBlueprint('blueprints/empty.zip', blueprintId)
                .deployBlueprint(blueprintId, deploymentId)
                .setLabels(deploymentId, [
                    { os: 'linux' },
                    { os: 'windows' },
                    { infra: 'aws' },
                    { infra: 'gcp' },
                    { infra: 'azure' }
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
        function selectRuleAttributeValues(values: string[]) {
            withinTheLastRuleRow(() => {
                cy.get('div[name="ruleValue"]').click();
                values.forEach(value => {
                    cy.get('div[name="ruleValue"] input').type(`${value}{enter}`);
                });
            });
        }
        function selectRuleLabelKey(value: string) {
            withinTheLastRuleRow(() => {
                cy.get('div[name="labelKey"] input').type(value);
                cy.get(`div[name="labelKey"] div[option-value="${value}"]`).click();
            });
        }
        function selectRuleLabelValues(values: string[]) {
            withinTheLastRuleRow(() => {
                cy.get('div[name="labelValue"]').click();
                values.forEach(value => {
                    cy.get('div[name="labelValue"] input').type(`${value}`);
                    cy.get(`div[option-value="${value}"]`).click();
                });
            });
        }

        function populateFilterRuleRow(rule: FilterRule) {
            const ruleRowType =
                rule.type === FilterRuleType.Label ? FilterRuleRowType.Label : (rule.key as FilterRuleRowType);

            selectRuleRowType(ruleRowType);
            selectRuleOperator(rule.operator);
            if (ruleRowType === FilterRuleRowType.Label) {
                if (isAnyOfOrNotAnyOfOperator(rule.operator)) {
                    selectRuleLabelKey(rule.key);
                    selectRuleLabelValues(rule.values);
                } else {
                    selectRuleLabelKey(rule.key);
                }
            } else {
                selectRuleAttributeValues(rule.values);
            }
        }

        function populateFilterRuleRows(filterId: string, rules: FilterRule[]) {
            cy.contains('Add').click();
            cy.get('.modal').within(() => {
                cy.contains('.field', 'Filter ID').find('input').type(filterId);
                rules.forEach((rule, index) => {
                    if (index > 0) cy.contains('Add new rule').click();
                    populateFilterRuleRow(rule);
                });
            });
        }

        function saveAndVerifyFilter(filterId: string, testRules: FilterRule[]) {
            cy.interceptSp('PUT', `/filters/deployments/${filterId}`).as('createRequest');
            cy.contains('Save').click();
            cy.wait('@createRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.have.length(testRules.length);
                testRules.forEach((_rule, index: number) => {
                    expect(requestRules[index]).to.deep.equal(testRules[index]);
                });
            });
        }

        type RuleRowTest = {
            name: string;
            testFilterName: string;
            testFilterRules: FilterRule[];
        };

        const ruleRowTests: RuleRowTest[] = [
            {
                name: 'of type "label" with operators "any_of" and "not_any_of"',
                testFilterName: `${filterName}_label_1`,
                testFilterRules: [
                    {
                        type: FilterRuleType.Label,
                        key: 'os',
                        values: ['windows', 'linux'],
                        operator: FilterRuleOperators.AnyOf
                    },

                    {
                        type: FilterRuleType.Label,
                        key: 'infra',
                        values: ['aws'],
                        operator: FilterRuleOperators.NotAnyOf
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
                testFilterRules: [] // TODO: Add rules
            },
            {
                name: 'of type "attribute" with operators "contains", "not_contains", "starts_with" and "ends_with"',
                testFilterName: `${filterName}_attribute_2`,
                testFilterRules: [] // TODO: Add rules
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

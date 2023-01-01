import { without } from 'lodash';
import type { CyHttpMessages, RouteMatcherOptions } from 'cypress/types/net-stubbing';
import Consts from 'app/utils/consts';
import type { FilterRule, FilterRuleOperator } from 'app/widgets/common/filters/types';
import {
    AttributesFilterRuleOperators,
    FilterRuleAttribute,
    FilterRuleOperators,
    FilterRuleRowType,
    FilterRuleType,
    LabelsFilterRuleOperators
} from 'app/widgets/common/filters/types';

describe('Filters widget', () => {
    const widgetId = 'filters';

    before(() => {
        cy.usePageMock([widgetId, 'onlyMyResources']).activate().mockLogin();
    });

    const filterName = 'filters_test_filter';
    const filterRules: FilterRule[] = [
        { type: FilterRuleType.Attribute, key: 'blueprint_id', values: ['bpid'], operator: FilterRuleOperators.AnyOf },
        { type: FilterRuleType.Label, key: 'precious', values: ['yes'], operator: FilterRuleOperators.AnyOf }
    ];

    function openAddFilterModal() {
        cy.contains('Add').click();
    }

    function openCloneFilterModal() {
        cy.get('[title="Clone filter"]').click();
    }

    function openEditFilterModal() {
        cy.get('[title="Edit filter"]').click();
    }

    function deleteFilter() {
        cy.get('[title="Delete filter"]').click();
        cy.contains('Yes').click();
    }

    function saveFilter() {
        cy.contains('Save').click();
    }

    function closeFilterModal() {
        cy.contains('Cancel').click();
    }

    function addNewRule() {
        cy.contains('Add new rule').click();
    }

    type FilterRuleDropdownName = 'ruleRowType' | 'ruleOperator' | 'ruleValue' | 'labelKey' | 'labelValue';
    function openDropdown(divName: FilterRuleDropdownName) {
        return cy.get(`div[name="${divName}"]`).click();
    }

    function typeAttributeRuleValue(value: string) {
        openDropdown('ruleValue').find('input').type(`${value}{enter}`).blur();
    }

    function getFilterIdInput() {
        return cy.getField('Filter ID').find('input');
    }

    function withinLastRuleRow(fn: (currentSubject: JQuery<HTMLElement>) => void) {
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

    function searchFilter(name: string) {
        cy.getSearchInput().clear().type(name);
        cy.get('.loading').should('not.exist');
        cy.contains('table', name).should('be.visible');
    }

    describe('should provide basic functionality:', () => {
        beforeEach(() => {
            cy.deleteDeploymentsFilters(filterName).createDeploymentsFilter(filterName, filterRules).refreshPage();
            searchFilter(filterName);
        });

        it('list existing filters', () => {
            cy.getWidget(widgetId).within(() => {
                cy.get('table')
                    .getTable()
                    .should(tableData => {
                        expect(tableData).to.have.length(1);
                        expect(tableData[0]['Filter name']).to.eq(filterName);
                        expect(tableData[0].Creator).to.eq('admin');
                        expect(tableData[0].Created).not.to.be.null;
                    });
                cy.get('.checkbox:not(.checked)');

                const systemFilterName = 'csys-environment-filter';
                searchFilter(systemFilterName);

                cy.get('table')
                    .getTable()
                    .should(tableData => {
                        expect(tableData).to.have.length(1);
                        expect(tableData[0]['Filter name']).to.eq(systemFilterName);
                        expect(tableData[0].Creator).to.eq('admin');
                        expect(tableData[0].Created).not.to.be.null;
                    });

                cy.get('.checkbox.checked');

                const disabledIconTitle = "System filter can't be edited or deleted";
                cy.get('.edit').should('have.class', 'disabled');
                cy.get('.edit').should('have.prop', 'title', disabledIconTitle);
                cy.get('.trash').should('have.class', 'disabled');
                cy.get('.trash').should('have.prop', 'title', disabledIconTitle);
                cy.get('.clone').should('not.have.class', 'disabled');
            });
        });

        it('allow to add new filter', () => {
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
                withinLastRuleRow(() => typeAttributeRuleValue(blueprintId));
                addNewRule();
                withinLastRuleRow(() => {
                    openDropdown('ruleRowType').contains('Label').click();
                    openDropdown('ruleOperator').contains('key is not').click();
                    openDropdown('labelKey').within(() => {
                        cy.get('input').type(labelKey);
                        cy.get(`[option-value=${labelKey}]`).click();
                    });
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

            cy.getWidget(widgetId).within(() => {
                cy.contains(newFilterName);

                cy.get('table')
                    .getTable()
                    .should(tableData => {
                        expect(tableData).to.have.length(2);
                        expect(tableData[1]['Filter name']).to.eq(newFilterName);
                        expect(tableData[1].Creator).to.eq('admin');
                        expect(tableData[1].Created).not.to.be.null;
                    });

                cy.get('.checkbox:not(.checked)').should('have.length', 2);
            });
        });

        it('allow to edit existing filter', () => {
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

        it('allow to clone existing filter', () => {
            openCloneFilterModal();

            cy.get('.modal').within(() => {
                cy.contains(`Clone filter '${filterName}'`);

                getFilterIdInput().should('have.value', `${filterName}_clone`);
                getFilterIdInput().clear().type(`${filterName}_2`);

                checkExistingRules();
                modifyBlueprintRule();

                cy.interceptSp('PUT', `/filters/deployments/${filterName}_2`).as('rulesRequest');
                saveFilter();
                checkRequestRules();
            });

            cy.get('.modal').should('not.exist');
        });

        it('allow to remove existing filter', () => {
            deleteFilter();

            cy.contains('There are no filters defined');
        });

        it('prevent filter used as default from being removed', () => {
            cy.intercept('GET', `/console/filters/usage/${filterName}`, [
                { pageName: 'Dashboard', widgetName: 'Deployments View', username: 'admin' }
            ]).as('usageRequest');

            deleteFilter();

            cy.wait('@usageRequest');

            cy.contains("Filter 'filters_test_filter' cannot be removed");
            cy.contains("Used as default filter in 'Deployments View' widget in 'Dashboard' page by user 'admin'");

            cy.contains('OK').click();
            cy.get('.modal').should('not.exist');
        });
    });

    it('should support "Only my resources" setting', () => {
        cy.interceptSp('GET', { pathname: '/filters/deployments', query: { created_by: 'admin' } }).as('getRequest');

        // NOTE: Wait until Filters widget is fully loaded
        cy.contains('Filter name');

        cy.contains('Show only my resources').click();

        cy.wait('@getRequest');
    });

    describe('should handle errors', () => {
        const missingFilterIdAndValuesTestName = 'detects missing filter ID and filter rule values';
        const missingValuesTestName = 'detects missing filter rule values';
        const invalidFilterIdTestName = 'detects invalid filter ID';

        function verifyMissingFilterIdError() {
            cy.contains('Please provide the filter ID');
        }
        function verifyMissingValuesError() {
            cy.contains('Please provide all the values in filter rules section');
            withinLastRuleRow(() => cy.get('[name="ruleValue"]').parent().should('have.class', 'error'));
        }
        function verifyInvalidFilterIdError() {
            cy.contains('All filters with a `csys-` prefix are reserved for internal use');
        }

        describe('when adding new filter', () => {
            beforeEach(openAddFilterModal);
            afterEach(closeFilterModal);

            it(missingFilterIdAndValuesTestName, () => {
                saveFilter();

                verifyMissingFilterIdError();
                verifyMissingValuesError();
            });

            it(missingValuesTestName, () => {
                getFilterIdInput().type('valid-id');
                saveFilter();

                verifyMissingValuesError();
            });

            it(invalidFilterIdTestName, () => {
                getFilterIdInput().type('csys-invalid');
                typeAttributeRuleValue('value');
                saveFilter();

                verifyInvalidFilterIdError();
            });
        });

        describe('when editing existing filter', () => {
            before(() => searchFilter(filterName));

            beforeEach(openEditFilterModal);
            afterEach(closeFilterModal);

            it(missingValuesTestName, () => {
                addNewRule();
                saveFilter();

                verifyMissingValuesError();
            });
        });

        describe('when cloning existing filter', () => {
            before(() => searchFilter(filterName));

            beforeEach(openCloneFilterModal);
            afterEach(closeFilterModal);

            it(missingFilterIdAndValuesTestName, () => {
                getFilterIdInput().clear();
                addNewRule();
                saveFilter();

                verifyMissingFilterIdError();
                verifyMissingValuesError();
            });

            it(missingValuesTestName, () => {
                addNewRule();
                saveFilter();

                verifyMissingValuesError();
            });

            it(invalidFilterIdTestName, () => {
                getFilterIdInput().clear().type('csys-invalid');
                saveFilter();

                verifyInvalidFilterIdError();
            });
        });
    });

    describe('should allow to define a filter rule', () => {
        const testPrefix = 'filters_test_form';
        const blueprintId = `${testPrefix}_blueprint`;
        const deploymentId = `${testPrefix}_deployment`;

        before(() => {
            cy.deleteDeploymentsFilters(filterName)
                .deleteDeployments(testPrefix)
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

        beforeEach(openAddFilterModal);
        afterEach(closeFilterModal);

        function openDropdownAndSetValue(divName: FilterRuleDropdownName, optionValue: string) {
            openDropdown(divName).find(`div[option-value="${optionValue}"]`).click();
        }

        type RuleValueObject = { value: string; key?: string; isNew: boolean };
        function searchAndSetDropdownValue(
            { value, isNew }: RuleValueObject,
            additionLabel: string,
            isMultiple: boolean,
            searchEndpoint?: RouteMatcherOptions
        ) {
            if (searchEndpoint) cy.interceptSp('GET', searchEndpoint).as(`search_${value}`);
            cy.get('input.search').type(value);
            if (searchEndpoint) cy.wait(`@search_${value}`);

            // Workaround for RD-2664
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000);

            if (isNew) cy.contains('[role="option"]', `${additionLabel} ${value}`).click();
            else cy.get(`div[option-value="${value}"]`).click();

            if (isMultiple) cy.get(`.label[value="${value}"]`).should('exist');
            cy.get('input.search').should('not.have.value');
        }

        function selectRuleRowType(ruleRowType: FilterRuleRowType) {
            withinLastRuleRow(() => openDropdownAndSetValue('ruleRowType', ruleRowType));
        }

        function selectRuleOperator(operator: FilterRuleOperator) {
            withinLastRuleRow(() => openDropdownAndSetValue('ruleOperator', operator));
        }

        interface SelectRuleAttributeValuesOptions {
            withAutocomplete?: boolean;
            multipleValues?: boolean;
        }

        function selectRuleAttributeValues(
            ruleRowType: FilterRuleRowType,
            values: RuleValueObject[],
            options: SelectRuleAttributeValuesOptions = {
                withAutocomplete: false,
                multipleValues: true
            }
        ) {
            if (values.length === 0) return;
            withinLastRuleRow(() => {
                const searchEndpoint: Record<FilterRuleRowType, string> = {
                    blueprint_id: 'blueprints',
                    created_by: 'users',
                    display_name: 'deployments',
                    site_name: 'sites',
                    tenant_name: 'tenants',
                    installation_status: '',
                    label: '' // NOTE: Only endpoints for attribute rules are necessary
                };

                openDropdown('ruleValue').within(() =>
                    values.forEach(ruleValue => {
                        searchAndSetDropdownValue(
                            ruleValue,
                            'Add',
                            !!options.multipleValues,
                            options.withAutocomplete
                                ? { pathname: `/${searchEndpoint[ruleRowType]}`, query: { _search: ruleValue.value } }
                                : undefined
                        );
                    })
                );
            });
        }

        function selectRuleLabelKey(key: string, isNew = false) {
            withinLastRuleRow(() => {
                openDropdown('labelKey').within(() => {
                    searchAndSetDropdownValue({ value: key, isNew }, 'New key', false, {
                        pathname: `/labels/deployments`,
                        query: { _search: key }
                    });
                });
            });
        }

        function selectRuleLabelValues(values: RuleValueObject[]) {
            if (values.length === 0) return;

            withinLastRuleRow(() => {
                openDropdown('labelValue').within(() => {
                    values.forEach(ruleValue => {
                        searchAndSetDropdownValue(ruleValue, 'New value', true, {
                            pathname: `/labels/deployments/${ruleValue.key}`,
                            query: { _search: ruleValue.value }
                        });
                    });
                });
            });
        }

        function isLabelValueOperator(operator: FilterRuleOperator) {
            return (
                [
                    FilterRuleOperators.AnyOf,
                    FilterRuleOperators.NotAnyOf,
                    FilterRuleOperators.IsNot
                ] as FilterRuleOperator[]
            ).includes(operator);
        }
        function isFreeTextValueOperator(operator: FilterRuleOperator) {
            return (
                [
                    FilterRuleOperators.Contains,
                    FilterRuleOperators.NotContains,
                    FilterRuleOperators.StartsWith,
                    FilterRuleOperators.EndsWith
                ] as FilterRuleOperator[]
            ).includes(operator);
        }
        function populateFilterRuleRow(rule: ExtendedFilterRule) {
            const ruleRowType =
                rule.type === FilterRuleType.Label ? FilterRuleRowType.Label : (rule.key as FilterRuleRowType);

            selectRuleRowType(ruleRowType);
            selectRuleOperator(rule.operator);
            const valuesObjectList = rule.values.map(value => ({
                value,
                key: rule.key,
                isNew: rule.newValues?.includes(value) || false
            }));
            if (ruleRowType === FilterRuleRowType.Label) {
                selectRuleLabelKey(rule.key, rule.newKey);
                if (isLabelValueOperator(rule.operator)) {
                    selectRuleLabelValues(valuesObjectList);
                }
            } else {
                const useAutocomplete = rule.useStaticDropdown ? false : !isFreeTextValueOperator(rule.operator);

                selectRuleAttributeValues(ruleRowType, valuesObjectList, {
                    withAutocomplete: useAutocomplete,
                    multipleValues: !rule.useStaticDropdown
                });
            }
        }

        function populateFilterRuleRows(filterId: string, rules: ExtendedFilterRule[]) {
            cy.get('.modal').within(() => {
                cy.getField('Filter ID').find('input').type(filterId);
                rules.forEach((rule, index) => {
                    if (index > 0) addNewRule();
                    populateFilterRuleRow(rule);
                });
            });
        }

        function verifyRequestRules(request: CyHttpMessages.IncomingRequest, testRules: ExtendedFilterRule[]) {
            const requestRules = request.body.filter_rules;
            expect(requestRules).to.have.length(testRules.length);

            testRules.forEach((_rule, index: number) => {
                expect(requestRules[index]).to.deep.equal(
                    _.omit(testRules[index], ['newKey', 'newValues', 'useStaticDropdown'])
                );
            });
        }

        function verifyRulesForm(testRules: ExtendedFilterRule[]) {
            const verifySingleValueDropdown = (name: string, value: string) =>
                cy.get(`div[name="${name}"] [option-value="${value}"][aria-selected="true"]`).should('exist');

            const verifyMultipleValuesDropdown = (name: string, values: string[]) =>
                values.forEach(value => {
                    cy.get(`div[name="${name}"] .label[value="${value}"]`).should('exist');
                });

            testRules.forEach((rule, ruleIndex) => {
                withinNthRuleRow(ruleIndex, () => {
                    const ruleRowType = rule.type === FilterRuleType.Label ? FilterRuleType.Label : rule.key;
                    verifySingleValueDropdown('ruleRowType', ruleRowType);

                    verifySingleValueDropdown('ruleOperator', rule.operator);

                    if (rule.type === FilterRuleType.Label) verifySingleValueDropdown('labelKey', rule.key);

                    const ruleValuesDropdownName = rule.type === FilterRuleType.Label ? 'labelValue' : 'ruleValue';

                    if (rule.useStaticDropdown) {
                        const lastDropdownValue = rule.values[rule.values.length - 1];
                        verifySingleValueDropdown(ruleValuesDropdownName, lastDropdownValue);
                    } else {
                        verifyMultipleValuesDropdown(ruleValuesDropdownName, rule.values);
                    }
                });
            });
        }
        function saveAndVerifyFilter(filterId: string, testRules: ExtendedFilterRule[]) {
            cy.interceptSp('PUT', `/filters/deployments/${filterId}`).as('createRequest');
            saveFilter();

            cy.log('Filter creation request verification');
            cy.wait('@createRequest').then(({ request }) => verifyRequestRules(request, testRules));

            cy.log('Filter rules form population verification');
            searchFilter(filterId);
            openEditFilterModal();

            cy.get('.modal').within(() => verifyRulesForm(testRules));
        }

        interface ExtendedFilterRule extends FilterRule {
            newKey?: boolean;
            newValues?: string[];
            useStaticDropdown?: boolean;
        }

        type RuleRowTest = {
            name: string;
            testFilterName: string;
            testFilterRules: ExtendedFilterRule[];
        };

        const ruleRowTests: RuleRowTest[] = [
            {
                name: 'of type "label" with operators "any_of", "not_any_of" and "is_not"',
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
                    },

                    {
                        type: FilterRuleType.Label,
                        key: 'infra',
                        values: ['aws', 'gcp'],
                        operator: FilterRuleOperators.IsNot,
                        newKey: false
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
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'tenant_name',
                        values: [`${testPrefix}_tenant`],
                        operator: FilterRuleOperators.AnyOf,
                        newValues: [`${testPrefix}_tenant`]
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'tenant_name',
                        values: [Consts.DEFAULT_TENANT],
                        operator: FilterRuleOperators.NotAnyOf
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'installation_status',
                        values: ['active'],
                        operator: FilterRuleOperators.AnyOf,
                        useStaticDropdown: true
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'installation_status',
                        values: ['inactive'],
                        operator: FilterRuleOperators.NotAnyOf,
                        useStaticDropdown: true
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
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'display_name',
                        values: ['deployment'],
                        operator: FilterRuleOperators.Contains,
                        newValues: ['deployment']
                    },
                    {
                        type: FilterRuleType.Attribute,
                        key: 'display_name',
                        values: ['prefix'],
                        operator: FilterRuleOperators.StartsWith,
                        newValues: ['prefix']
                    }
                ]
            }
        ];

        ruleRowTests.map(ruleRowTest => {
            const { name, testFilterName, testFilterRules } = ruleRowTest;
            return it(name, () => {
                populateFilterRuleRows(testFilterName, testFilterRules);
                saveAndVerifyFilter(testFilterName, testFilterRules);
            });
        });
    });

    it('should use only filter parameters supported by the API', () => {
        cy.cfyRequest('/searches/deployments.help.json').then(response => {
            const {
                operations: [operations]
            } = response.body;

            function verifyValuesAreSupported(
                valuesSupportedByUi: Record<string, any>,
                valuesAvailableInAPI: string[]
            ) {
                expect(Object.values(valuesSupportedByUi)).to.include.all.members(valuesAvailableInAPI);
            }

            verifyValuesAreSupported(FilterRuleAttribute, without(operations.allowed_filter_rules_attrs, 'schedules'));
            verifyValuesAreSupported(
                AttributesFilterRuleOperators,
                without(operations.filter_rules_attributes_operators, 'is_not_empty')
            );
            verifyValuesAreSupported(LabelsFilterRuleOperators, operations.filter_rules_labels_operators);
            verifyValuesAreSupported(FilterRuleType, operations.filter_rules_types);
        });
    });
});

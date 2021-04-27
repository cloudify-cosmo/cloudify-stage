import { FilterRuleOperators, FilterRuleType } from '../../../../widgets/common/src/filters/types';

describe('Filters widget', () => {
    before(() => {
        cy.disableGettingStarted().usePageMock(['filters', 'onlyMyResources']).activate().mockLogin();
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
});

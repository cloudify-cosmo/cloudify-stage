import type { FilterRule } from '../../../../widgets/common/src/filters/types';
import { FilterRuleOperators, FilterRuleType } from '../../../../widgets/common/src/filters/types';

describe('Filters widget', () => {
    before(() => {
        cy.usePageMock('filters').activate().mockLogin();
    });

    const filterName = 'filters_test_filter';
    const filterRules: FilterRule[] = [
        { type: FilterRuleType.Attribute, key: 'blueprint_id', values: ['bpid'], operator: FilterRuleOperators.AnyOf },
        { type: FilterRuleType.Label, key: 'precious', values: ['yes'], operator: FilterRuleOperators.AnyOf }
    ];

    beforeEach(() => {
        cy.deleteDeploymentsFilters(filterName).createDeploymentsFilter(filterName, filterRules).refreshPage();
        cy.get('input[placeholder="Search..."]').type(filterName);
        cy.get('.loading').should('not.exist');
    });

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

            const newBlueprintId = 'newBlueprintId';
            cy.get('.fields:eq(0)').within(() => {
                cy.contains('Blueprint');
                cy.contains('bpid');
                cy.contains('is one of').click();
                cy.contains('contains').click();
                cy.get('.input input').type(newBlueprintId);
            });

            cy.get('.fields:eq(1)').within(() => {
                cy.contains('Label');
                cy.contains('is one of');
                cy.contains('precious');
                cy.contains('yes');
            });

            cy.interceptSp('PATCH', `/filters/deployments/${filterName}`).as('updateRequest');
            cy.contains('Save').click();
            cy.wait('@updateRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.have.length(2);
                expect(requestRules[0]).to.deep.equal({
                    type: FilterRuleType.Attribute,
                    key: 'blueprint_id',
                    values: [newBlueprintId],
                    operator: FilterRuleOperators.Contains
                });
                expect(requestRules[1]).to.deep.equal(filterRules[1]);
            });
        });

        cy.get('.modal').should('not.exist');
    });

    it('should allow to clone existing filter', () => {
        cy.get('.clone').click();

        cy.get('.modal').within(() => {
            cy.contains(`Clone filter '${filterName}'`);

            const newBlueprintId = 'newBlueprintId';
            cy.get('.fields:eq(0)').within(() => {
                cy.contains('Blueprint');
                cy.contains('bpid');
                cy.contains('is one of').click();
                cy.contains('contains').click();
                cy.get('.input input').type(newBlueprintId);
            });

            cy.get('.fields:eq(1)').within(() => {
                cy.contains('Label');
                cy.contains('is one of');
                cy.contains('precious');
                cy.contains('yes');
            });

            cy.interceptSp('PUT', `/filters/deployments/${filterName}_clone`).as('createRequest');
            cy.contains('Save').click();
            cy.wait('@createRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.have.length(2);
                expect(requestRules[0]).to.deep.equal({
                    type: FilterRuleType.Attribute,
                    key: 'blueprint_id',
                    values: [newBlueprintId],
                    operator: FilterRuleOperators.Contains
                });
                expect(requestRules[1]).to.deep.equal(filterRules[1]);
            });
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
});

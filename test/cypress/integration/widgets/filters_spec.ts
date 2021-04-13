import { FilterRuleOperators, FilterRuleType } from '../../../../widgets/common/src/filters/types';

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
        cy.contains('Add').click();

        cy.contains('Save').click();
        cy.contains('Please provide the filter ID');

        const newFilterName = `${filterName}_added`;
        cy.contains('.field', 'Filter ID').find('input').type(newFilterName);
        // TODO: RD-1985 Define some filter rules once rules form is available here
        cy.interceptSp('PUT', `/filters/deployments/${newFilterName}`).as('createRequest');
        cy.contains('Save').click();
        cy.wait('@createRequest').then(({ request }) => {
            expect(request.body).to.deep.equal({
                filter_rules: []
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
        cy.contains(`Edit filter '${filterName}'`);

        // TODO: RD-1985 Change some filter rules once rules form is available here
        cy.interceptSp('PATCH', `/filters/deployments/${filterName}`).as('updateRequest');
        cy.contains('Save').click();
        cy.wait('@updateRequest').then(({ request }) => {
            expect(request.body).to.deep.equal({
                filter_rules: filterRules
            });
        });

        cy.get('.modal').should('not.exist');
    });

    it('should allow to clone existing filter', () => {
        cy.get('.clone').click();
        cy.contains(`Clone filter '${filterName}'`);

        // TODO: RD-1985 Change some filter rules once rules form is available here
        cy.interceptSp('PUT', `/filters/deployments/${filterName}_clone`).as('updateRequest');
        cy.contains('Save').click();
        cy.wait('@updateRequest').then(({ request }) => {
            expect(request.body).to.deep.equal({
                filter_rules: filterRules
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

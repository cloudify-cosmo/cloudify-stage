describe('Page groups segment', () => {
    before(() => {
        cy.intercept('GET', '/console/templates/page-groups', [
            {
                id: 'mockGroup',
                name: 'Mock group',
                updatedBy: 'Manager',
                updatedAt: '2021-10-21T12:39:50+02:00',
                custom: false
            }
        ]);
        cy.intercept('GET', '/console/appData/templates/page-groups/mockGroup.json', {
            id: 'mockGroup',
            name: 'Mock group',
            pages: ['page1', 'page2']
        });

        cy.activate().mockLogin();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();
    });

    it('lists available page groups', () => {
        cy.contains('.header', 'Page groups')
            .parent()
            .within(() => {
                cy.get('tbody tr').should('have.length', 1);
                cy.get('table')
                    .getTable()
                    .should(tableData => {
                        const firstRow = tableData[0];
                        expect(firstRow['Group id']).to.equal('mockGroup');
                        expect(firstRow['Group name']).to.equal('Mock group');
                        expect(firstRow.Pages).to.equal('page1, page2');
                        expect(firstRow.Templates).to.equal('0');
                        expect(firstRow['Updated at']).to.match(/21-10-2021 \d{2}:39/);
                        expect(firstRow['Updated by']).to.equal('Manager');
                    });
                cy.contains('tr', 'Mock group').contains('.label:not(.blue)', 0);
                cy.contains('Mock group').click();
                cy.contains('.segment', 'Pages').within(() => {
                    cy.contains('page1');
                    cy.contains('page2');
                });
                cy.contains('Used in templates').contains('Page group not used by any template');
            });
    });
});

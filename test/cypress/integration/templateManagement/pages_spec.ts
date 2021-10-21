describe('Pages segment', () => {
    before(() => {
        cy.activate().removeUserPages().removeUserTemplates().mockLogin();
        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();
    });

    it('lists available pages', () => {
        cy.getPages().then(pagesData => {
            const pages = pagesData.body.filter((page: { custom: boolean }) => !page.custom);
            cy.contains('.segment', 'Pages').within(() => {
                cy.get('tbody tr').should('have.length', pages.length);
                cy.get('table')
                    .getTable()
                    .should(tableData => {
                        const firstRow = tableData[0];
                        expect(firstRow['Page id']).to.equal('adminDash');
                        expect(firstRow['Page name']).to.equal('Dashboard');
                        expect(firstRow.Templates).to.equal('2');
                        expect(firstRow['Page groups']).to.equal('0');
                        expect(firstRow['Updated at']).to.equal('');
                        expect(firstRow['Updated by']).to.equal('Manager');
                    });
                cy.contains('tr', 'Dashboard').contains('.label.blue', 2);
                cy.contains('tr', 'Dashboard').contains('.label:not(.blue)', 0);
                cy.contains('Dashboard').click();
                cy.contains('Used in templates').contains('main-default');
                cy.contains('Used in templates').contains('main-sys_admin');
                cy.contains('Used in page groups').contains('Page not used by any page group');
            });
        });
    });
});

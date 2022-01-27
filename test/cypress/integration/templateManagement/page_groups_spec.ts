describe('Page groups segment', () => {
    before(() => {
        cy.activate();
    });

    function createPageGroup() {
        cy.stageRequest('/console/templates/page-groups', 'POST', {
            body: {
                id: 'test_group',
                name: 'Test group',
                pages: ['adminDash', 'blueprint']
            }
        });
    }

    it('lists available page groups', () => {
        cy.intercept('GET', '/console/templates/page-groups', [
            {
                id: 'mockGroup1',
                name: 'Mock group 1',
                updatedBy: 'Manager',
                updatedAt: '2021-10-21T12:39:50+02:00',
                custom: false
            },
            {
                id: 'mockGroup2',
                name: 'Mock group 2',
                updatedBy: 'Manager',
                updatedAt: '2021-10-21T12:39:50+02:00',
                custom: true
            }
        ]);
        cy.intercept('GET', '/console/appData/templates/page-groups/mockGroup1.json', {
            id: 'mockGroup1',
            name: 'Mock group 1',
            icon: 'rocket',
            pages: ['page1', 'page2']
        });
        cy.intercept('GET', '/console/userData/templates/page-groups/mockGroup2.json', {
            id: 'mockGroup2',
            name: 'Mock group 2',
            pages: ['page3', 'page4']
        });

        cy.mockLogin();
        cy.goToTemplateManagement();

        cy.contains('.header', 'Page groups')
            .parent()
            .within(() => {
                cy.get('tbody tr').should('have.length', 2);

                cy.get('table')
                    .getTable()
                    .should(tableData => {
                        const [firstRow, secondRow] = tableData;

                        expect(firstRow['Group id']).to.equal('mockGroup1');
                        expect(firstRow['Group name']).to.equal('Mock group 1');
                        expect(firstRow.Templates).to.equal('0');
                        expect(firstRow['Updated at']).to.match(/21-10-2021 \d{2}:39/);
                        expect(firstRow['Updated by']).to.equal('Manager');

                        expect(secondRow['Group id']).to.equal('mockGroup2');
                        expect(secondRow['Group name']).to.equal('Mock group 2');
                        expect(secondRow.Templates).to.equal('0');
                        expect(secondRow['Updated at']).to.match(/21-10-2021 \d{2}:39/);
                        expect(secondRow['Updated by']).to.equal('Manager');
                    });

                cy.contains('tr', 'Mock group 1').contains('.label:not(.blue)', 0);
                cy.contains('tr', 'Mock group 2').contains('.label:not(.blue)', 0);

                cy.contains('tr', 'Mock group 1').find('.rocket').scrollIntoView().should('be.visible');

                cy.contains('tr', 'Mock group 1').find('.edit, .remove').should('not.exist');
                cy.contains('tr', 'Mock group 2').find('.edit').scrollIntoView().should('be.visible');
                cy.contains('tr', 'Mock group 2').find('.remove').should('be.visible');

                cy.contains('Mock group 1').click();
                cy.contains('.segment', 'Pages').within(() => {
                    cy.contains('page1');
                    cy.contains('page2');
                    cy.get('.remove').should('not.exist');
                });
                cy.contains('Used in templates').contains('Page group not used by any template');

                cy.contains('Mock group 2').click();
                cy.contains('.segment', 'Pages').within(() => {
                    cy.contains('page3').find('.remove').should('be.visible');
                    cy.contains('page4').find('.remove').should('be.visible');
                });
                cy.contains('Used in templates').contains('Page group not used by any template');
            });
    });

    it('removes page from within the table', () => {
        cy.removeUserPageGroups();
        createPageGroup();
        cy.mockLogin();
        cy.goToTemplateManagement();

        cy.contains('.header', 'Page groups')
            .parent()
            .within(() => {
                cy.contains('Test group').click();
                cy.contains('.segment', 'Pages').contains('adminDash').find('.remove').click();
            });

        cy.contains('button', 'Ok').click();

        cy.contains('.header', 'Page groups')
            .parent()
            .contains('.segment', 'Pages')
            .within(() => {
                cy.contains('adminDash').should('not.exist');
                cy.contains('blueprint');
            });
    });

    it('removes page group', () => {
        cy.removeUserPageGroups();
        createPageGroup();
        cy.mockLogin();
        cy.goToTemplateManagement();

        cy.contains('.header', 'Page groups').parent().contains('tr', 'Test group').find('.remove').click();
        cy.contains('button', 'Ok').click();

        cy.contains('.header', 'Page groups').parent().contains('tr', 'Test group').should('not.exist');
    });

    it('edits page group', () => {
        cy.removeUserPageGroups();
        createPageGroup();
        cy.mockLogin();
        cy.goToTemplateManagement();

        cy.contains('.header', 'Page groups').parent().contains('tr', 'Test group').find('.edit').click();
        cy.get('.modal').within(() => {
            cy.getField('Group name').find('input').type(' renamed');
            cy.get('.dropdown input').type('rocket{enter}');
            cy.contains('logs').find('.add').click();
            cy.contains('adminDash').find('.minus').click();
            cy.contains('button', 'Update').click();
        });

        cy.contains('.header', 'Page groups')
            .parent()
            .within(() => {
                cy.contains('tr', 'test_group_renamed').find('.rocket').should('be.visible');
                cy.contains('Test group renamed').click();
                cy.contains('.segment', 'Pages').within(() => {
                    cy.contains('logs');
                    cy.contains('adminDash').should('not.exist');
                });
            });
    });

    it('creates new page group', () => {
        cy.removeUserPageGroups();
        cy.mockLogin();
        cy.goToTemplateManagement();

        cy.contains('Create page group').click();
        cy.get('.modal').within(() => {
            cy.typeToFieldInput('Group name', 'New group');
            cy.get('.dropdown input').type('rocket{enter}');
            cy.contains('adminDash').find('.add').click();
            cy.contains('button', 'Create').click();
        });

        cy.contains('.header', 'Page groups')
            .parent()
            .within(() => {
                cy.contains('tr', 'New group').find('.rocket').should('be.visible').click();
                cy.contains('.segment', 'Pages').contains('adminDash');
            });
    });
});

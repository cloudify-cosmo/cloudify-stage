describe('Page preview', () => {
    before(() => {
        cy.activate('valid_trial_license').goToTemplateManagement();
    });

    it('should allow to switch tabs and maximize widgets', () => {
        cy.get('.segment:contains(Pages)').contains('tr', 'deployment').find('.search').click();

        // Verify tabs switching works
        cy.contains('History').click();
        cy.contains('.widgetName', 'Execution Task Graph').should('not.exist');
        cy.contains('.widgetName', 'Deployment Executions').should('be.visible');

        cy.contains('Last Execution').click();

        // Verify widget maximize button works for widgets inside tabs
        cy.getWidget('executions').find('.expand').click({ force: true });

        cy.getWidget('eventsFilter').should('not.be.visible');
        cy.getWidget('events').should('not.be.visible');

        // Verify widget collapse button works
        cy.getWidget('executions').find('.compress').click({ force: true });
        cy.getWidget('eventsFilter').should('be.visible');
        cy.getWidget('events').should('be.visible');
        cy.contains('Last Execution').should('be.visible');
        cy.contains('History').should('be.visible');
    });
});

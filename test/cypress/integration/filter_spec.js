describe('Filter', () => {
    before(() => {
        cy.activate('valid_spire_license');
        cy.login();
        cy.server();
        cy.route(/console\/sp\/\?su=\/blueprints/, 'fixture:filter/blueprints.json');
        cy.route(/console\/sp\/\?su=\/deployments.*offset=0/, 'fixture:filter/deployments0.json');
        cy.route(/console\/sp\/\?su=\/deployments.*offset=20/, 'fixture:filter/deployments1.json');
        cy.route(/console\/sp\/\?su=\/executions/, 'fixture:filter/executions.json');
    });

    it('fills dropdowns with correct data', () => {
        cy.get('#dynamicDropdown1').click();
        cy.contains('app2.2-clickme').click();
        cy.get('#dynamicDropdown1 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown2').click();
        cy.get('#dynamicDropdown2 .menu > *:eq(0)').should('have.text', 'app2.2');
        cy.get('#dynamicDropdown2 .menu > *:eq(1)').should('have.text', 'uuu');
        cy.get('#dynamicDropdown2 .menu > *').should('have.length', 2);
        cy.contains('uuu').click();
        cy.get('#dynamicDropdown2 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown3').click();
        cy.get('#dynamicDropdown3 .menu > *')
            .should('have.text', 'uuustatus')
            .should('have.length', 1)
            .click();
        cy.get('#dynamicDropdown3 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown1 > .label .delete').click();
        cy.get('#dynamicDropdown1 > .label').should('have.length', 0);

        cy.get('#dynamicDropdown2 > .label').should('have.length', 0);
        cy.get('#dynamicDropdown2').click();
        cy.get('#dynamicDropdown2 .menu > *').should('have.length', 24);

        cy.get('#dynamicDropdown3 > .label').should('have.length', 1);
        cy.get('#dynamicDropdown3').click();
        cy.get('#dynamicDropdown3 .menu > *').should('have.length', 2);
    });
});

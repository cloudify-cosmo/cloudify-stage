describe('Cluster Status', () => {
    before(() => {
        cy.activate('valid_spire_license');
    });

    beforeEach(() => {
        cy.server();
        cy.fixture('cluster_status/degraded.json').then(data => {
            cy.route({
                method: 'GET',
                url: /cluster-status/,
                response: data
            });
        });
        cy.login();
    });

    it('is presented on hovering status icon in header', () => {
        cy.get('i.heartbeat.statusIcon').trigger('mouseover');
        cy.get('table.servicesData').within(() => {
            cy.get('button.refreshButton').should('not.have.class', 'loading');
            cy.get('tbody tr:nth-child(1)').should('have.text', ' Manager');
            cy.get('tbody tr:nth-child(1)').should('have.attr', 'style', 'background-color: rgb(251, 189, 8);');
            cy.get('tbody tr:nth-child(2)').should('have.text', ' Database');
            cy.get('tbody tr:nth-child(2)').should('have.attr', 'style', 'background-color: rgb(33, 186, 69);');
            cy.get('tbody tr:nth-child(3)').should('have.text', ' Message Broker');
            cy.get('tbody tr:nth-child(3)').should('have.attr', 'style', 'background-color: rgb(33, 186, 69);');

            cy.get('tbody tr:nth-child(1)').click();
        });

        cy.location('pathname').should('be.equal', '/console/page/admin_operations');
    });

    it('is presented in Cluster Status widget on Admin Operations page', () => {
        cy.visit('/console/page/admin_operations').waitUntilLoaded();

        cy.get('div.widget.highAvailabilityWidget').within(() => {
            cy.get('tbody tr:nth-child(1) td:nth-child(1)').should('have.text', ' Manager');
            cy.get('tbody tr:nth-child(1) td:nth-child(1)').should(
                'have.attr',
                'style',
                'background-color: rgb(251, 189, 8);'
            );
            cy.get('tbody tr:nth-child(4) td:nth-child(1)').should('have.text', ' Database');
            cy.get('tbody tr:nth-child(4) td:nth-child(1)').should(
                'have.attr',
                'style',
                'background-color: rgb(33, 186, 69);'
            );
            cy.get('tbody tr:nth-child(7) td:nth-child(1)').should('have.text', ' Message Broker');
            cy.get('tbody tr:nth-child(7) td:nth-child(1)').should(
                'have.attr',
                'style',
                'background-color: rgb(33, 186, 69);'
            );
        });
    });
});

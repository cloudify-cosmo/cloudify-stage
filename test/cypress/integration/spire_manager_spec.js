describe('Spire Manager widget', () => {
    before(() => {
        cy.activate('valid_spire_license');

        cy.server();
        cy.fixture(`spire_deployments/3_deployments.json`).then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_spire_deployments',
                response: data
            });
        });
        cy.fixture('cluster_status/ok.json').then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_cluster_status?deploymentId=rome',
                response: data
            });
        });
        cy.fixture('cluster_status/degraded.json').then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_cluster_status?deploymentId=london',
                response: data
            });
        });
        cy.fixture('cluster_status/fail.json').then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_cluster_status?deploymentId=new-york',
                response: data
            });
        });

    });

    it('is available in widgets list and presents data properly', () => {
        cy.login();

        // Add Spire Manager widget
        cy.get('.usersMenu').click();
        cy.get('div#editModeMenuItem').click();
        cy.get('button.addPageBtn').click();
        cy.get('button.addWidgetBtn').click();
        cy.get('[option-value="Spire"]').click();
        cy.get('[data-id="managers"] > .content > .header').click();
        cy.get('#addWidgetsBtn').click();

        // Check Spire Manager widget
        cy.wait(10000);
    });
});

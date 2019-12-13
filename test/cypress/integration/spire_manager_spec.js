import { styles } from '../support/cluster_status_commons';

describe('Spire Manager widget', () => {
    before(() => {
        cy.activate('valid_spire_license');
        cy.login();

        // Add Spire Manager widget
        cy.get('.usersMenu').click();
        cy.get('div#editModeMenuItem').click();
        cy.get('button.addPageBtn').click();
        cy.get('button.addWidgetBtn').click();

        cy.get('[option-value="Spire"]').click();
        cy.get('[data-id="managers"] > .content > .header').click();
        cy.get('#addWidgetsBtn').click();
        cy.get('button i.icon.sign.out').click();
    });

    beforeEach(() => {
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
        cy.route({
            method: 'POST',
            url: '/console/sp/?su=/executions',
            response: {}
        }).as('postExecutions');

        cy.get('.pageMenuItem.active').click(); // to refresh widget data
    });

    it('presents data properly', () => {
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'rome');
        cy.get('tbody > :nth-child(1) > :nth-child(3)').should('have.text', '10.239.0.50');
        cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', 'install completed');
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'green');
        cy.get('tbody > :nth-child(1) > :nth-child(6) i.computer.icon').should('have.class', 'link');
        cy.get('tbody > :nth-child(1) > :nth-child(6) i.refresh.icon').should('have.class', 'link');
        cy.get('tbody > :nth-child(1) > :nth-child(6) i.cogs.icon').should('have.class', 'link');

        cy.get('tbody > :nth-child(2) > :nth-child(2)').should('have.text', 'london');
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('have.text', '10.239.10.56');
        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('have.text', 'get_status completed');
        cy.get('tbody > :nth-child(2) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'yellow');
        cy.get('tbody > :nth-child(2) > :nth-child(6) i.computer.icon').should('have.class', 'link');
        cy.get('tbody > :nth-child(2) > :nth-child(6) i.refresh.icon').should('have.class', 'link');
        cy.get('tbody > :nth-child(2) > :nth-child(6) i.cogs.icon').should('have.class', 'link');

        cy.get('tbody > :nth-child(3) > :nth-child(2)').should('have.text', 'new-york');
        cy.get('tbody > :nth-child(3) > :nth-child(3)').should('have.text', '10.239.5.160');
        cy.get('tbody > :nth-child(3) > :nth-child(4)').should('have.text', 'heal started');
        cy.get('tbody > :nth-child(3) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'red');
        cy.get('tbody > :nth-child(3) > :nth-child(6) i.computer.icon').should('have.class', 'link');
        cy.get('tbody > :nth-child(3) > :nth-child(6) i.refresh.icon').should('have.class', 'link');
        cy.get('tbody > :nth-child(3) > :nth-child(6) i.cogs.icon').should('have.class', 'link');
    });

    it('allows checking last execution status details', () => {
        cy.get('tbody > :nth-child(1) > :nth-child(4) div.label').trigger('mouseover');
        cy.get('.popup .header').should('have.text', 'Last Execution');
        cy.get('tbody > :nth-child(1) > :nth-child(4) div.label').trigger('mouseout');

        cy.get('tbody > :nth-child(2) > :nth-child(4) div.label').trigger('mouseover');
        cy.get('.popup .header').should('have.text', 'Last Execution');
        cy.get('tbody > :nth-child(2) > :nth-child(4) div.label').trigger('mouseout');

        cy.get('tbody > :nth-child(3) > :nth-child(4) div.label').trigger('mouseover');
        cy.get('.popup .header').should('have.text', 'Last Execution');
        cy.get('tbody > :nth-child(3) > :nth-child(4) div.label').trigger('mouseout');
    });

    it('allows checking deployment cluster status details', () => {
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon').trigger('mouseover');
        cy.get('table.servicesData').should('be.visible');
        cy.get('table.servicesData').within(() => {
            cy.get('tbody tr:nth-child(1)').should('have.text', ' Manager');
            cy.get('tbody tr:nth-child(1)').should('have.attr', 'style', styles.ok);
            cy.get('tbody tr:nth-child(2)').should('have.text', ' Database');
            cy.get('tbody tr:nth-child(2)').should('have.attr', 'style', styles.ok);
            cy.get('tbody tr:nth-child(3)').should('have.text', ' Message Broker');
            cy.get('tbody tr:nth-child(3)').should('have.attr', 'style', styles.ok);
        });
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon').trigger('mouseout');

        cy.get('tbody > :nth-child(2) > :nth-child(5) i.statusIcon').trigger('mouseover');
        cy.get('table.servicesData').should('be.visible');
        cy.get('table.servicesData').within(() => {
            cy.get('tbody tr:nth-child(1)').should('have.text', ' Manager');
            cy.get('tbody tr:nth-child(1)').should('have.attr', 'style', styles.degraded);
            cy.get('tbody tr:nth-child(2)').should('have.text', ' Database');
            cy.get('tbody tr:nth-child(2)').should('have.attr', 'style', styles.ok);
            cy.get('tbody tr:nth-child(3)').should('have.text', ' Message Broker');
            cy.get('tbody tr:nth-child(3)').should('have.attr', 'style', styles.ok);
        });
        cy.get('tbody > :nth-child(2) > :nth-child(5) i.statusIcon').trigger('mouseout');

        cy.get('tbody > :nth-child(3) > :nth-child(5) i.statusIcon').trigger('mouseover');
        cy.get('table.servicesData').should('be.visible');
        cy.get('table.servicesData').within(() => {
            cy.get('tbody tr:nth-child(1)').should('have.text', ' Manager');
            cy.get('tbody tr:nth-child(1)').should('have.attr', 'style', styles.ok);
            cy.get('tbody tr:nth-child(2)').should('have.text', ' Database');
            cy.get('tbody tr:nth-child(2)').should('have.attr', 'style', styles.ok);
            cy.get('tbody tr:nth-child(3)').should('have.text', ' Message Broker');
            cy.get('tbody tr:nth-child(3)').should('have.attr', 'style', styles.fail);
        });
        cy.get('tbody > :nth-child(3) > :nth-child(5) i.statusIcon').trigger('mouseout');
    });

    it('allows to do status refresh of selected spire deployment', () => {
        cy.get('tbody > :nth-child(1) > :nth-child(6) i.refresh.icon').click();
        cy.get('tbody > :nth-child(1) > :nth-child(5) i').should('have.class', 'loading');
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'green');
    });

    it('allows to do bulk status refresh of spire deployments', () => {
        cy.get('th > div.checkbox').click();
        cy.get('div.actionField > div:nth-child(1) > button').click();
        cy.get('tbody > :nth-child(1) > :nth-child(5) i').should('have.class', 'loading');
        cy.get('tbody > :nth-child(2) > :nth-child(5) i').should('have.class', 'loading');
        cy.get('tbody > :nth-child(3) > :nth-child(5) i').should('have.class', 'loading');
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'green');
        cy.get('tbody > :nth-child(2) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'yellow');
        cy.get('tbody > :nth-child(3) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'red');
    });

    it('allows to execute workflow on spire deployment', () => {
        cy.get(':nth-child(2) > :nth-child(6) > span > .cogs').click();
        cy.get('.popupMenu').should('be.visible');
        cy.get('[option-value="install"]').click();
        cy.get('.modal').should('be.visible');
        cy.get('.actions > .green').click();
        cy.wait('@postExecutions')
            .its('request.body')
            .should('contain', {
                deployment_id: 'london',
                workflow_id: 'install'
            });
        cy.get('.modal').should('not.be.visible');
    });

    it('allows to do bulk workflow execution on spire deployments', () => {
        cy.get('th > div.checkbox').click();
        cy.get('div.actionField > div:nth-child(2) > button').click();
        cy.get('.popupMenu').should('be.visible');
        cy.get('[option-value="install"]').click();
        cy.get('.modal').should('be.visible');
        cy.get('.actions > .green').click();
        cy.wait('@postExecutions')
            .its('request.body')
            .should('contain', {
                deployment_id: 'rome',
                workflow_id: 'install'
            });
        cy.wait('@postExecutions')
            .its('request.body')
            .should('contain', {
                deployment_id: 'london',
                workflow_id: 'install'
            });
        cy.wait('@postExecutions')
            .its('request.body')
            .should('contain', {
                deployment_id: 'new-york',
                workflow_id: 'install'
            });
        cy.get('.modal').should('not.be.visible');
    });
});

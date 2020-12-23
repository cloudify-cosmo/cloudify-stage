import { styles } from '../../support/cluster_status_commons';

describe('Spire Manager widget', () => {
    before(() => {
        cy.activate('valid_spire_license')
            .usePageMock('managers', {
                // pollingTime: 5,
                fieldsToShow: ['Deployment', 'IP', 'Last Execution', 'Status', 'Actions']
            })
            .mockLogin();
    });

    beforeEach(() => {
        cy.server();
        cy.fixture(`spire_deployments/3_deployments.json`).then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_spire_deployments',
                response: data
            }).as('getSpireDeployments');
        });
        cy.fixture('cluster_status/ok.json').then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_cluster_status?deploymentId=rome',
                response: data,
                delay: 500
            }).as('getClusterStatusForRome');
        });
        cy.fixture('cluster_status/degraded.json').then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_cluster_status?deploymentId=london',
                response: data,
                delay: 500
            }).as('getClusterStatusForLondon');
        });
        cy.fixture('cluster_status/fail.json').then(data => {
            cy.route({
                method: 'GET',
                url: '/console/wb/get_cluster_status?deploymentId=new-york',
                response: data,
                delay: 500
            }).as('getClusterStatusForNewYork');
        });
        cy.route({
            method: 'POST',
            url: '/console/sp?su=/executions',
            response: {}
        }).as('postExecutions');

        cy.refreshPage();

        // Wait to load Spire Manager widget
        cy.wait('@getSpireDeployments');
        cy.get('.managersWidget .loadingSegment').should('not.be.visible');

        // Wait to load Spire Deployments status
        const waitToLoadStatus = rowNumber => {
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i`).should('not.have.class', 'loading');
        };
        cy.wait('@getClusterStatusForRome');
        cy.wait('@getClusterStatusForLondon');
        cy.wait('@getClusterStatusForNewYork');
        waitToLoadStatus(1);
        waitToLoadStatus(2);
        waitToLoadStatus(3);
    });

    it('presents data properly', () => {
        const checkData = (rowNumber, id, ip, executionStatus, statusColor) => {
            cy.get(`tbody > tr:nth-child(${rowNumber})`).within(() => {
                cy.get('td:nth-child(2)').should('have.text', id);
                cy.get('td:nth-child(3)').should('have.text', ip);
                cy.get('td:nth-child(4)').should('have.text', executionStatus);
                cy.get('td:nth-child(5) i.statusIcon.heartbeat').should('have.class', statusColor);
                cy.get('td:nth-child(6) i.computer.icon').should('have.class', 'link');
                cy.get('td:nth-child(6) i.refresh.icon').should('have.class', 'link');
                cy.get('td:nth-child(6) i.cogs.icon').should('have.class', 'link');
            });
        };

        checkData(1, 'rome', '10.239.0.50', 'install completed', 'green');
        checkData(2, 'london', '10.239.10.56', 'get_status completed', 'yellow');
        checkData(3, 'new-york', '10.239.5.160', 'heal started', 'red');
    });

    it('allows checking last execution status details', () => {
        const checkLastExecution = rowNumber => {
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(4) div.label`).trigger('mouseover');
            cy.get('.popup .header').should('have.text', 'Last Execution');
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(4) div.label`).trigger('mouseout');
        };

        checkLastExecution(1);
        checkLastExecution(2);
        checkLastExecution(3);
    });

    it('allows checking deployment cluster status details', () => {
        const checkServiceRow = (rowNumber, managerStatus, databaseStatus, brokerStatus) => {
            cy.get('table.servicesData').should('not.be.visible');
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i.statusIcon`).trigger('mouseover');
            cy.get('table.servicesData').should('be.visible');
            cy.get('table.servicesData').within(() => {
                cy.get('tbody tr:nth-child(1)').should('have.text', ' Manager');
                cy.get('tbody tr:nth-child(1)').should('have.attr', 'style', styles[managerStatus]);
                cy.get('tbody tr:nth-child(2)').should('have.text', ' Database');
                cy.get('tbody tr:nth-child(2)').should('have.attr', 'style', styles[databaseStatus]);
                cy.get('tbody tr:nth-child(3)').should('have.text', ' Message Broker');
                cy.get('tbody tr:nth-child(3)').should('have.attr', 'style', styles[brokerStatus]);
            });
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i.statusIcon`).trigger('mouseout');
            cy.get('table.servicesData').should('not.be.visible');
        };

        checkServiceRow(1, 'OK', 'OK', 'OK');
        checkServiceRow(2, 'Degraded', 'OK', 'OK');
        checkServiceRow(3, 'Fail', 'OK', 'Fail');
    });

    it('allows to do status refresh of selected spire deployment', () => {
        cy.get('tbody > :nth-child(1) > :nth-child(6) i.refresh.icon').click();
        cy.get('tbody > :nth-child(1) > :nth-child(5) i').should('have.class', 'loading');
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'green');
    });

    it('allows to do bulk status refresh of spire deployments', () => {
        const checkLoading = rowNumber =>
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i`).should('have.class', 'loading');
        const checkStatus = (rowNumber, expectedColor) =>
            cy
                .get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i.statusIcon.heartbeat`)
                .should('have.class', expectedColor);

        cy.get('th > div.checkbox').click();
        cy.get('div.actionField > div:nth-child(1) > button').click();

        checkLoading(1);
        checkLoading(2);
        checkLoading(3);

        checkStatus(1, 'green');
        checkStatus(2, 'yellow');
        checkStatus(3, 'red');
    });

    it('allows to execute workflow on spire deployment', () => {
        cy.get(':nth-child(2) > :nth-child(6) > span > .cogs').click();
        cy.get('.popupMenu').should('be.visible');
        cy.get('[option-value="install"]').click();
        cy.get('.modal').should('be.visible');
        cy.get('.actions > .green').click();
        cy.wait('@postExecutions').its('request.body').should('contain', {
            deployment_id: 'london',
            workflow_id: 'install'
        });
        cy.get('.modal').should('not.be.visible');
    });

    it('allows to do bulk workflow execution on spire deployments', () => {
        const waitForExecutionsRequest = id =>
            cy.wait('@postExecutions').its('request.body').should('contain', {
                deployment_id: id,
                workflow_id: 'install'
            });

        cy.get('th > div.checkbox').click();
        cy.get('div.actionField > div:nth-child(2) > button').click();
        cy.get('.popupMenu').should('be.visible');
        cy.get('[option-value="install"]').click();
        cy.get('.modal').should('be.visible');
        cy.get('.actions > .green').click();

        waitForExecutionsRequest('rome');
        waitForExecutionsRequest('london');
        waitForExecutionsRequest('new-york');

        cy.get('.modal').should('not.be.visible');
    });
});

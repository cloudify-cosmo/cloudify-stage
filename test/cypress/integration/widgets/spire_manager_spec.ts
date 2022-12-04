import { ClusterServiceStatus } from 'app/components/shared/cluster/types';
import { styles } from '../../support/cluster_status_commons';
import type { StatusColor } from './cluster_status_spec';

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
        const delay = 500;
        cy.intercept('GET', '/console/wb/get_spire_deployments', {
            fixture: `spire_deployments/3_deployments.json`
        }).as('getSpireDeployments');
        cy.intercept('GET', '/console/wb/get_cluster_status?deploymentId=rome', {
            fixture: 'cluster_status/ok.json',
            delay
        }).as('getClusterStatusForRome');
        cy.intercept('GET', '/console/wb/get_cluster_status?deploymentId=london', {
            fixture: 'cluster_status/degraded.json',
            delay
        }).as('getClusterStatusForLondon');
        cy.intercept('GET', '/console/wb/get_cluster_status?deploymentId=new-york', {
            fixture: 'cluster_status/fail.json',
            delay
        }).as('getClusterStatusForNewYork');

        cy.refreshPage();

        // Wait to load Spire Manager widget
        cy.wait('@getSpireDeployments');
        cy.get('.managersWidget .loadingSegment').should('not.exist');

        // Wait to load Spire Deployments status
        const waitToLoadStatus = (rowNumber: number) => {
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
        const checkData = (
            rowNumber: number,
            id: string,
            ip: string,
            executionStatus: string,
            statusColor: StatusColor
        ) => {
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
        const checkLastExecution = (rowNumber: number) => {
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(4) div.label`).trigger('mouseover');
            cy.get('.popup .header').should('have.text', 'Last Execution');
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(4) div.label`).trigger('mouseout');
        };

        checkLastExecution(1);
        checkLastExecution(2);
        checkLastExecution(3);
    });

    it('allows checking deployment cluster status details', () => {
        const checkServiceRow = (
            rowNumber: number,
            managerStatus: ClusterServiceStatus,
            databaseStatus: ClusterServiceStatus,
            brokerStatus: ClusterServiceStatus
        ) => {
            cy.get('.popup table.servicesData').should('not.exist');
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i.statusIcon`).trigger('mouseover');
            cy.get('.popup table.servicesData')
                .should('be.visible')
                .within(() => {
                    cy.get('tbody tr:nth-child(1)').should('have.text', ' Manager');
                    cy.get('tbody tr:nth-child(1)').should('have.attr', 'style', styles[managerStatus]);
                    cy.get('tbody tr:nth-child(2)').should('have.text', ' Database');
                    cy.get('tbody tr:nth-child(2)').should('have.attr', 'style', styles[databaseStatus]);
                    cy.get('tbody tr:nth-child(3)').should('have.text', ' Message Broker');
                    cy.get('tbody tr:nth-child(3)').should('have.attr', 'style', styles[brokerStatus]);
                });
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i.statusIcon`).trigger('mouseout');
            cy.get('.popup table.servicesData').should('not.exist');
        };

        checkServiceRow(1, ClusterServiceStatus.OK, ClusterServiceStatus.OK, ClusterServiceStatus.OK);
        checkServiceRow(2, ClusterServiceStatus.Degraded, ClusterServiceStatus.OK, ClusterServiceStatus.OK);
        checkServiceRow(3, ClusterServiceStatus.Fail, ClusterServiceStatus.OK, ClusterServiceStatus.Fail);
    });

    it('allows to do status refresh of selected spire deployment', () => {
        cy.get('tbody > :nth-child(1) > :nth-child(6) i.refresh.icon').click();
        cy.get('tbody > :nth-child(1) > :nth-child(5) i').should('have.class', 'loading');
        cy.get('tbody > :nth-child(1) > :nth-child(5) i.statusIcon.heartbeat').should('have.class', 'green');
    });

    it('allows to do bulk status refresh of spire deployments', () => {
        const checkLoading = (rowNumber: number) =>
            cy.get(`tbody > :nth-child(${rowNumber}) > :nth-child(5) i`).should('have.class', 'loading');
        const checkStatus = (rowNumber: number, expectedColor: StatusColor) =>
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
        cy.interceptSp('POST', '/executions', {}).as('postExecutions');

        cy.get(':nth-child(2) > :nth-child(6) > span > .cogs').click();
        cy.get('.popupMenu').should('be.visible');
        cy.get('[option-value="install"]').click();
        cy.get('.modal').within(() => {
            cy.clickButton('Execute');
        });
        cy.wait('@postExecutions').its('request.body').should('contain', {
            deployment_id: 'london',
            workflow_id: 'install'
        });
        cy.get('.modal').should('not.exist');
    });

    it('allows to do bulk workflow execution on spire deployments', () => {
        cy.interceptSp('POST', '/executions', request => {
            request.alias = `postExecutions-${request.body.deployment_id}`;
            request.reply({});
        });

        const waitForExecutionsRequest = (id: string) =>
            cy.wait(`@postExecutions-${id}`).its('request.body').should('contain', {
                workflow_id: 'install'
            });

        cy.get('th > div.checkbox').click();
        cy.get('div.actionField > div:nth-child(2) > button').click();
        cy.get('.popupMenu').should('be.visible');
        cy.get('[option-value="install"]').click();
        cy.get('.modal').within(() => {
            cy.clickButton('Execute');
        });

        waitForExecutionsRequest('new-york');
        waitForExecutionsRequest('london');
        waitForExecutionsRequest('rome');

        cy.get('.modal').should('not.exist');
    });
});

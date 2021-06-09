// @ts-nocheck File not migrated fully to TS
import { styles } from '../support/cluster_status_commons';

describe('Cluster Status', () => {
    before(() => {
        cy.activate('valid_trial_license').usePageMock().mockLogin();
    });

    beforeEach(() => {
        cy.interceptSp('GET', '/cluster-status?summary=true', { fixture: 'cluster_status/summary-degraded.json' }).as(
            'clusterStatusSummary'
        );
    });

    function interceptFullStatus(responseFixtures) {
        const responses = responseFixtures.map(fixture => ({ fixture }));
        cy.interceptSp('GET', '/cluster-status?summary=false', req => req.reply(responses.shift())).as(
            'clusterStatusFull'
        );
    }

    const clusterStatusFetchTimeout = { timeout: 12000 };

    const checkServicesStatus = (expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
        const managerCell = 'tbody tr:nth-child(1)';
        const databaseCell = 'tbody tr:nth-child(2)';
        const brokerCell = 'tbody tr:nth-child(3)';

        cy.get(managerCell).should('have.text', ' Manager');
        cy.get(managerCell).should('have.attr', 'style', styles[expectedManagerStatus]);
        cy.get(databaseCell).should('have.text', ' Database');
        cy.get(databaseCell).should('have.attr', 'style', styles[expectedDbStatus]);
        cy.get(brokerCell).should('have.text', ' Message Broker');
        cy.get(brokerCell).should('have.attr', 'style', styles[expectedBrokerStatus]);
    };

    it('is fetched periodically', () => {
        cy.log(
            'Check if periodic status check fetches only summary when no Cluster Status widget is present on active page'
        );
        cy.wait('@clusterStatusSummary', clusterStatusFetchTimeout);
    });

    it('is presented on hovering status icon in header', () => {
        interceptFullStatus(['cluster_status/degraded.json']);

        cy.wait('@clusterStatusSummary', clusterStatusFetchTimeout);
        cy.get('.menu i.heartbeat.statusIcon').should('have.class', 'yellow');

        cy.get('.menu i.heartbeat.statusIcon').trigger('mouseover');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);

        cy.get('table.servicesData').within(() => {
            cy.get('button.refreshButton').should('not.have.class', 'loading');
            checkServicesStatus('Degraded', 'OK', 'OK');
        });
    });

    it('shows correct data', () => {
        const checkOverallStatus = (overallStatus, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
            cy.get('.menu i.heartbeat.statusIcon').trigger('mouseover');
            cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);

            cy.log('Check system status icon');
            let iconColor = 'gray';
            if (overallStatus === 'OK') {
                iconColor = 'green';
            } else if (overallStatus === 'Degraded') {
                iconColor = 'yellow';
            } else if (overallStatus === 'Fail') {
                iconColor = 'red';
            }
            cy.get('.menu i.heartbeat.statusIcon').should('have.class', iconColor);

            cy.log('Check system status popup content');
            cy.get('table.servicesData').within(() => {
                cy.get('button.refreshButton').should('not.have.class', 'loading');
                checkServicesStatus(expectedManagerStatus, expectedDbStatus, expectedBrokerStatus);
            });

            cy.get('.menu i.heartbeat.statusIcon').trigger('mouseout');
        };

        interceptFullStatus(['cluster_status/degraded.json', 'cluster_status/ok.json', 'cluster_status/fail.json']);

        checkOverallStatus('Degraded', 'Degraded', 'OK', 'OK');

        checkOverallStatus('OK', 'OK', 'OK', 'OK');

        checkOverallStatus('Fail', 'Fail', 'OK', 'Fail');
    });
});

import { styles } from '../support/cluster_status_commons';

describe('Cluster Status', () => {
    before(() => {
        cy.activate('valid_spire_license');
        cy.login();
    });

    beforeEach(() => {
        cy.server();
        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/degraded.json').as('clusterStatusFull');
        cy.route(/cluster-status\?summary=true/, 'fixture:cluster_status/summary-degraded.json').as(
            'clusterStatusSummary'
        );

        cy.get('.dashboardPageMenuItem').click();
        cy.location('pathname').should('be.equal', '/console/page/dashboard');
    });

    const clusterStatusFetchTimeout = { timeout: 12000 };
    const checkServicesStatus = (inWidget, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
        let managerCell = 'tbody tr:nth-child(1)';
        let databaseCell = 'tbody tr:nth-child(2)';
        let brokerCell = 'tbody tr:nth-child(3)';
        if (inWidget) {
            managerCell = 'tbody tr:nth-child(1) td:nth-child(1)';
            databaseCell = 'tbody tr:nth-child(4) td:nth-child(1)';
            brokerCell = 'tbody tr:nth-child(7) td:nth-child(1)';
        }

        cy.get(managerCell).should('have.text', ' Manager');
        cy.get(managerCell).should('have.attr', 'style', styles[expectedManagerStatus]);
        cy.get(databaseCell).should('have.text', ' Database');
        cy.get(databaseCell).should('have.attr', 'style', styles[expectedDbStatus]);
        cy.get(brokerCell).should('have.text', ' Message Broker');
        cy.get(brokerCell).should('have.attr', 'style', styles[expectedBrokerStatus]);
    };

    it('is fetched periodically', () => {
        // Check if periodic status check fetches only summary when no Cluster Status widget is present on active page
        cy.get('.dashboardPageMenuItem').click();
        cy.location('pathname').should('be.equal', '/console/page/dashboard');
        cy.wait('@clusterStatusSummary', clusterStatusFetchTimeout);

        // Check if periodic status check fetches full status when Cluster Status widget is present on active page
        cy.get('.admin_operationsPageMenuItem').click();
        cy.location('pathname').should('be.equal', '/console/page/admin_operations');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
    });

    it('is presented on hovering status icon in header', () => {
        cy.wait('@clusterStatusSummary', clusterStatusFetchTimeout);
        cy.get('i.heartbeat.statusIcon').should('have.class', 'yellow');

        cy.get('i.heartbeat.statusIcon').trigger('mouseover');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);

        cy.get('table.servicesData').within(() => {
            cy.get('button.refreshButton').should('not.have.class', 'loading');
            checkServicesStatus(false, 'Degraded', 'OK', 'OK');

            cy.get('tbody tr:nth-child(1)').click();
        });

        cy.location('pathname').should('be.equal', '/console/page/admin_operations');
    });

    it('is presented in Cluster Status widget on Admin Operations page', () => {
        cy.get('.admin_operationsPageMenuItem').click();
        cy.location('pathname').should('be.equal', '/console/page/admin_operations');

        cy.get('div.widget.highAvailabilityWidget').within(() => {
            checkServicesStatus(true, 'Degraded', 'OK', 'OK');
        });
    });

    it('is in sync between Cluster Status widget and system status icon', () => {
        const checkStatus = (overallStatus, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
            // Check system status icon and Cluster Status widget
            let iconColor = 'gray';
            if (overallStatus === 'OK') {
                iconColor = 'green';
            } else if (overallStatus === 'Degraded') {
                iconColor = 'yellow';
            } else if (overallStatus === 'Fail') {
                iconColor = 'red';
            }
            cy.get('i.heartbeat.statusIcon').should('have.class', iconColor);
            cy.get('div.widget.highAvailabilityWidget').within(() => {
                checkServicesStatus(true, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus);
            });

            // Check system status popup content
            cy.get('.headerBar i.heartbeat.statusIcon').trigger('mouseover');
            cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
            cy.get('table.servicesData').within(() => {
                cy.get('button.refreshButton').should('not.have.class', 'loading');
                checkServicesStatus(false, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus);
            });
            cy.get('.headerBar i.heartbeat.statusIcon').trigger('mouseout');
            cy.get('.popup').should('not.exist');
        };

        cy.get('.admin_operationsPageMenuItem').click();
        cy.location('pathname').should('be.equal', '/console/page/admin_operations');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkStatus('Degraded', 'Degraded', 'OK', 'OK');

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/ok.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkStatus('OK', 'OK', 'OK', 'OK');

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/fail.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkStatus('Fail', 'Fail', 'OK', 'Fail');
    });
});

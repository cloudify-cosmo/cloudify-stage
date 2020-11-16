import { className, styles } from '../../support/cluster_status_commons';

describe('Cluster Status', () => {
    before(() => {
        cy.activate('valid_trial_license');
        cy.login();
    });

    beforeEach(() => {
        cy.server();
        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/degraded.json').as('clusterStatusFull');
        cy.route(/cluster-status\?summary=true/, 'fixture:cluster_status/summary-degraded.json').as(
            'clusterStatusSummary'
        );

        cy.visitPage('Dashboard');
        cy.location('pathname').should('be.equal', '/console/page/dashboard');
    });

    const clusterStatusFetchTimeout = { timeout: 12000 };

    const rowNumber = {
        manager: 1,
        database: 4,
        broker: 7
    };

    const checkServicesStatus = (inWidget, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
        let managerCell = 'tbody tr:nth-child(1)';
        let databaseCell = 'tbody tr:nth-child(2)';
        let brokerCell = 'tbody tr:nth-child(3)';
        if (inWidget) {
            managerCell = `tbody tr:nth-child(${rowNumber.manager}) td:nth-child(1)`;
            databaseCell = `tbody tr:nth-child(${rowNumber.database}) td:nth-child(1)`;
            brokerCell = `tbody tr:nth-child(${rowNumber.broker}) td:nth-child(1)`;
        }

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

        cy.log(
            'Check if periodic status check fetches full status when Cluster Status widget is present on active page'
        );
        cy.visitPage('Admin Operations', 'admin_operations');
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
        cy.visitPage('Admin Operations', 'admin_operations');

        cy.get('div.widget.highAvailabilityWidget').within(() => {
            checkServicesStatus(true, 'Degraded', 'OK', 'OK');
        });
    });

    it('is in sync between Cluster Status widget and system status icon', () => {
        const checkOverallStatus = (overallStatus, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
            cy.log('Check system status icon and Cluster Status widget');
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

            cy.log('Check system status popup content');
            cy.get('i.heartbeat.statusIcon').trigger('mouseover');
            cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
            cy.get('table.servicesData').within(() => {
                cy.get('button.refreshButton').should('not.have.class', 'loading');
                checkServicesStatus(false, expectedManagerStatus, expectedDbStatus, expectedBrokerStatus);
            });
            cy.get('i.heartbeat.statusIcon').trigger('mouseout');
            cy.get('.popup').should('not.exist');
        };

        const checkNodesStatus = (
            service,
            expectedFirstNodeStatus,
            expectedSecondNodeStatus,
            expectedThirdNodeStatus
        ) => {
            const checkStatusIcon = (nodeStatusIcon, expectedNodeStatus) => {
                cy.get(nodeStatusIcon).should('have.class', className[expectedNodeStatus]);

                cy.get(nodeStatusIcon).trigger('mouseover');
                cy.get('.popup').should('exist');
                cy.get(nodeStatusIcon).trigger('mouseout');
                cy.get('.popup').should('not.exist');
            };

            const firstNodeCell = `tbody tr:nth-child(${rowNumber[service]}) > td:nth-child(3) > i.icon`;
            const secondNodeCell = `tbody tr:nth-child(${rowNumber[service] + 1}) > td:nth-child(2) > i.icon`;
            const thirdNodeCell = `tbody tr:nth-child(${rowNumber[service] + 2}) > td:nth-child(2) > i.icon`;

            checkStatusIcon(firstNodeCell, expectedFirstNodeStatus);
            checkStatusIcon(secondNodeCell, expectedSecondNodeStatus);
            checkStatusIcon(thirdNodeCell, expectedThirdNodeStatus);
        };

        cy.visitPage('Admin Operations', 'admin_operations');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkOverallStatus('Degraded', 'Degraded', 'OK', 'OK');
        checkNodesStatus('manager', 'OK', 'OK', 'OK');
        checkNodesStatus('database', 'OK', 'OK', 'OK');
        checkNodesStatus('broker', 'OK', 'OK', 'OK');

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/ok.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkOverallStatus('OK', 'OK', 'OK', 'OK');
        checkNodesStatus('manager', 'OK', 'OK', 'OK');
        checkNodesStatus('database', 'OK', 'OK', 'OK');
        checkNodesStatus('broker', 'OK', 'OK', 'OK');

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/fail.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkOverallStatus('Fail', 'Fail', 'OK', 'Fail');
        checkNodesStatus('manager', 'OK', 'OK', 'Fail');
        checkNodesStatus('database', 'OK', 'OK', 'OK');
        checkNodesStatus('broker', 'OK', 'OK', 'Fail');
    });

    it('is providing node services status details in popup', () => {
        const rowNumberAIO = {
            database: 1,
            manager: 2,
            broker: 3
        };

        const checkService = (service, nodeStatus, nodeServices) => {
            const nodeStatusIcon = `tbody tr:nth-child(${rowNumberAIO[service]}) > td:nth-child(3) > i.icon`;

            cy.log(`Checking ${service} node status. Expected: ${nodeStatus}`);
            cy.get(nodeStatusIcon).should('have.class', className[nodeStatus]);

            cy.log(`Checking ${service} node services status.`);
            cy.get(nodeStatusIcon).trigger('mouseover');
            cy.get('.popup').should('exist');

            cy.get('.popup table.servicesData tbody').within(() => {
                nodeServices.forEach((nodeService, index) => {
                    cy.log(`Checking '${nodeService.name}' status.`);
                    cy.get(`tr:nth-child(${index + 1})`)
                        .should('be.visible')
                        .within(() => {
                            cy.get('td:nth-child(1) > div.header > .content').should('contain.text', nodeService.name);
                            cy.get('td:nth-child(1) > div.header > .content > .sub').should(
                                'have.text',
                                nodeService.description
                            );
                            cy.get('td:nth-child(2)').should('have.text', nodeService.active ? ' Active' : ' Inactive');
                            cy.get('td:nth-child(2) > i').should(
                                'have.class',
                                nodeService.active ? 'checkmark' : 'remove'
                            );
                        });
                });
            });

            cy.get(nodeStatusIcon).trigger('mouseout');
            cy.get('.popup').should('not.exist');
        };

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/fail_with_services.json').as(
            'clusterStatusFailWithServices'
        );
        cy.visitPage('Admin Operations', 'admin_operations');
        cy.wait('@clusterStatusFailWithServices', clusterStatusFetchTimeout);

        cy.log('Trigger Cluster Status table re-render before starting verification.');
        cy.visitPage('Dashboard');
        cy.visitPage('Admin Operations');

        checkService('database', 'OK', [
            { name: 'PostgreSQL 9.5 database server', description: 'PostgreSQL 9.5 database server', active: true }
        ]);

        checkService('manager', 'Fail', [
            { name: 'AMQP-Postgres', description: 'Cloudify AMQP PostgreSQL Broker service', active: true },
            {
                name: 'Blackbox Exporter',
                description: 'Prometheus blackbox exporter (HTTP/HTTPS/TCP pings)',
                active: true
            },
            { name: 'Cloudify Composer', description: 'Cloudify Composer service', active: false },
            { name: 'Cloudify Console', description: 'Cloudify Console service', active: true },
            { name: 'Management Worker', description: 'Cloudify Management Worker service', active: false },
            { name: 'Manager REST', description: 'Cloudify REST service', active: true },
            { name: 'Node Exporter', description: 'Prometheus exporter for hardware and OS metrics', active: true },
            { name: 'PostgreSQL 9.5 database server', description: 'PostgreSQL 9.5 database server', active: true },
            { name: 'Prometheus', description: 'Prometheus monitoring service', active: true },
            {
                name: 'Prometheus exporter for PostgreSQL',
                description: 'Prometheus exporter for PostgreSQL service',
                active: true
            },
            { name: 'RabbitMQ Broker', description: 'RabbitMQ Broker service', active: true },
            { name: 'Webserver', description: 'nginx - high performance web server', active: true }
        ]);

        checkService('broker', 'OK', [
            { name: 'RabbitMQ Broker', description: 'RabbitMQ Broker service', active: true }
        ]);
    });
});

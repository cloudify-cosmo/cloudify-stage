import { className, styles } from '../../support/cluster_status_commons';

describe('Cluster Status widget', () => {
    before(() => cy.activate('valid_trial_license').usePageMock('highAvailability').login());

    beforeEach(cy.server);

    const clusterStatusFetchTimeout = { timeout: 12000 };

    const rowNumber = {
        manager: 1,
        database: 4,
        broker: 7
    };

    const checkServicesStatus = (expectedManagerStatus, expectedDbStatus, expectedBrokerStatus) => {
        const managerCell = `tbody tr:nth-child(${rowNumber.manager}) td:nth-child(1)`;
        const databaseCell = `tbody tr:nth-child(${rowNumber.database}) td:nth-child(1)`;
        const brokerCell = `tbody tr:nth-child(${rowNumber.broker}) td:nth-child(1)`;

        cy.get(managerCell).should('have.text', ' Manager');
        cy.get(managerCell).should('have.attr', 'style', styles[expectedManagerStatus]);
        cy.get(databaseCell).should('have.text', ' Database');
        cy.get(databaseCell).should('have.attr', 'style', styles[expectedDbStatus]);
        cy.get(brokerCell).should('have.text', ' Message Broker');
        cy.get(brokerCell).should('have.attr', 'style', styles[expectedBrokerStatus]);
    };

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
        cy.wait('@clusterStatusFailWithServices', clusterStatusFetchTimeout);

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

    it('shows correct status', () => {
        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/degraded.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkServicesStatus('Degraded', 'OK', 'OK');

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/ok.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkServicesStatus('OK', 'OK', 'OK');

        cy.route(/cluster-status\?summary=false/, 'fixture:cluster_status/fail.json').as('clusterStatusFull');
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkServicesStatus('Fail', 'OK', 'Fail');
    });
});

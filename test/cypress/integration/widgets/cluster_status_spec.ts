import type { SemanticICONS } from 'semantic-ui-react';
import type { ClusterNodeStatus, ClusterService } from 'app/components/common/status/cluster/types';
import { ClusterServiceStatus } from 'app/components/common/status/cluster/types';
import { styles } from '../../support/cluster_status_commons';

export type StatusColor = 'green' | 'yellow' | 'red';
export type NodeService = { name: string; description: string; active: boolean };

describe('Cluster Status widget', () => {
    const widgetId = 'highAvailability';

    before(() => cy.activate('valid_trial_license').usePageMock(widgetId).mockLogin());

    const clusterStatusFetchTimeout = { timeout: 12000 };

    const rowNumber: Record<ClusterService, number> = {
        manager: 1,
        db: 4,
        broker: 7
    };

    const checkServicesStatus = (
        expectedManagerStatus: ClusterServiceStatus,
        expectedDbStatus: ClusterServiceStatus,
        expectedBrokerStatus: ClusterServiceStatus
    ) => {
        const managerCell = `tbody tr:nth-child(${rowNumber.manager}) td:nth-child(1)`;
        const databaseCell = `tbody tr:nth-child(${rowNumber.db}) td:nth-child(1)`;
        const brokerCell = `tbody tr:nth-child(${rowNumber.broker}) td:nth-child(1)`;

        cy.getWidget(widgetId).within(() => {
            cy.get(managerCell).should('have.text', ' Manager');
            cy.get(managerCell).should('have.attr', 'style', styles[expectedManagerStatus]);
            cy.get(databaseCell).should('have.text', ' Database');
            cy.get(databaseCell).should('have.attr', 'style', styles[expectedDbStatus]);
            cy.get(brokerCell).should('have.text', ' Message Broker');
            cy.get(brokerCell).should('have.attr', 'style', styles[expectedBrokerStatus]);
        });
    };

    it('is providing node services status details in popup', () => {
        const nodeStatusIconClassName: Record<ClusterNodeStatus, SemanticICONS> = {
            OK: 'checkmark',
            Fail: 'remove'
        };
        const rowNumberAIO: Record<ClusterService, number> = {
            db: 1,
            manager: 2,
            broker: 3
        };
        const nodeName = 'cloudify';
        const privateIp = '10.110.0.39';
        const version = '5.2.0';

        const checkService = (service: ClusterService, nodeStatus: ClusterNodeStatus, nodeServices: NodeService[]) => {
            const nodeRow = `tbody tr:nth-child(${rowNumberAIO[service]})`;
            const nodeNameCell = `${nodeRow} > td:nth-child(2)`;
            const nodeStatusIcon = `${nodeRow} > td:nth-child(3) > i.icon`;
            const privateIpCell = `${nodeRow} > td:nth-child(4)`;
            const versionCell = `${nodeRow} > td:nth-child(6)`;

            cy.log(`Checking ${service} node name, private IP and version.`);
            cy.get(nodeNameCell).should('have.text', nodeName);
            cy.get(privateIpCell).should('have.text', privateIp);
            cy.get(versionCell).should('have.text', version);

            cy.log(`Checking ${service} node status. Expected: ${nodeStatus}`);
            cy.get(nodeStatusIcon).should('have.class', nodeStatusIconClassName[nodeStatus]);

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

        cy.interceptSp(
            'GET',
            { path: '/cluster-status?summary=false' },
            { fixture: 'cluster_status/fail_with_services.json' }
        ).as('clusterStatusFailWithServices');
        cy.wait('@clusterStatusFailWithServices', clusterStatusFetchTimeout);

        checkService('db', 'OK', [
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
        const responses = ['cluster_status/degraded.json', 'cluster_status/ok.json', 'cluster_status/fail.json'].map(
            fixture => ({ fixture })
        );
        cy.interceptSp('GET', { path: '/cluster-status?summary=false' }, req => req.reply(responses.shift())).as(
            'clusterStatusFull'
        );
        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkServicesStatus(ClusterServiceStatus.Degraded, ClusterServiceStatus.OK, ClusterServiceStatus.OK);

        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkServicesStatus(ClusterServiceStatus.OK, ClusterServiceStatus.OK, ClusterServiceStatus.OK);

        cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);
        checkServicesStatus(ClusterServiceStatus.Fail, ClusterServiceStatus.OK, ClusterServiceStatus.Fail);
    });
});

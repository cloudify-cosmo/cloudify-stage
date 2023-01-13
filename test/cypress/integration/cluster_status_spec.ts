import { ClusterServiceStatus } from 'app/components/misc/status/cluster/types';
import { styles } from '../support/cluster_status_commons';

describe('Cluster Status', () => {
    before(() => {
        cy.activate('valid_trial_license').usePageMock().mockLoginWithoutWaiting();
    });

    beforeEach(() => {
        cy.interceptSp(
            'GET',
            { path: '/cluster-status?summary=true' },
            { fixture: 'cluster_status/summary-degraded.json' }
        ).as('clusterStatusSummary');
    });

    function interceptFullStatus(responseFixtures: string[]) {
        const responses = responseFixtures.map(fixture => ({ fixture }));
        cy.interceptSp('GET', { path: '/cluster-status?summary=false' }, req => req.reply(responses.shift())).as(
            'clusterStatusFull'
        );
    }

    const clusterStatusFetchTimeout = { timeout: 12000 };

    const checkServicesStatus = (
        expectedManagerStatus: keyof typeof styles,
        expectedDbStatus: keyof typeof styles,
        expectedBrokerStatus: keyof typeof styles
    ) => {
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

    it('shows correct data', () => {
        const checkStatus = (
            expectedManagerStatus: keyof typeof styles,
            expectedDbStatus: keyof typeof styles,
            expectedBrokerStatus: keyof typeof styles,
            expectedStatusIndicatorColor?: string
        ) => {
            cy.contains('Health').click({ force: true });
            cy.wait('@clusterStatusFull', clusterStatusFetchTimeout);

            cy.log('Check system status icon');
            if (expectedStatusIndicatorColor) {
                cy.contains('.item', 'Health').find('.circle').should('have.class', expectedStatusIndicatorColor);
            } else {
                cy.contains('.item', 'Health').find('.circle').should('not.exist');
            }

            cy.log('Check system status popup content');

            cy.contains('.dropdown', 'Health').within(() => {
                cy.get('button.refreshButton').should('not.have.class', 'loading');
                checkServicesStatus(expectedManagerStatus, expectedDbStatus, expectedBrokerStatus);
            });

            cy.contains('Health').click();
        };

        interceptFullStatus(['cluster_status/degraded.json', 'cluster_status/ok.json', 'cluster_status/fail.json']);

        const { OK, Degraded, Fail } = ClusterServiceStatus;

        checkStatus(Degraded, OK, OK, 'yellow');

        checkStatus(OK, OK, OK);

        checkStatus(Fail, OK, Fail, 'red');
    });
});

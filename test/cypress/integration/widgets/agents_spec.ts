import { camelCase, snakeCase, upperFirst } from 'lodash';
import { secondsToMs } from '../../support/resource_commons';

describe('Agents widget', () => {
    const pollingTimeSeconds = 5;
    const deploymentName = 'agents_test_deployment';
    const deploymentDisplayName = 'Agents Test Deployment';
    const nodeName = 'host';
    const nodeInstanceName = 'host_qz2p8t';

    before(() => {
        cy.usePageMock('agents', {
            fieldsToShow: ['Id', 'Node', 'Deployment', 'IP', 'Install Method', 'System', 'Version', 'Actions'],
            pageSize: 15,
            pollingTime: pollingTimeSeconds
        })
            .activate()
            .mockLogin();
    });

    describe('should allow to', () => {
        beforeEach(() => {
            function interceptResourceFetching(resourceName: string, resourceId: string) {
                cy.interceptSp('GET', `/${resourceName}?_include=id`, {
                    metadata: {
                        pagination: { total: 1, size: 1000, offset: 0 },
                        filtered: null
                    },
                    items: [{ id: resourceId }]
                }).as(`fetch${upperFirst(camelCase(resourceName))}`);
            }

            cy.interceptSp('GET', '/agents', {
                metadata: { pagination: { total: 1, size: 15, offset: 0 }, filtered: null },
                items: [
                    {
                        id: 'host_qz2p8t_1cc7dac9-e9c4-492e-ba36-6f5146ed1bd5',
                        host_id: nodeInstanceName,
                        ip: '10.239.2.130',
                        install_method: 'remote',
                        system: 'centos core',
                        version: '6.1.0-.dev1',
                        node: nodeName,
                        deployment: deploymentName,
                        tenant_name: 'default_tenant'
                    }
                ]
            }).as('fetchAgents');

            cy.interceptSp('POST', '/executions', { body: { id: '0060e00c-ffbf-4d9b-bc4e-c490760bdf01' } }).as(
                'postExecution'
            );

            cy.interceptSp('GET', `/deployments?_include=id%2Cdisplay_name`, {
                metadata: {
                    pagination: { total: 1, size: 1000, offset: 0 },
                    filtered: null
                },
                items: [{ id: deploymentName, display_name: deploymentDisplayName }]
            }).as('fetchDeployments');

            interceptResourceFetching('nodes', nodeName);
            interceptResourceFetching('node-instances', nodeInstanceName);

            cy.wait('@fetchAgents', { requestTimeout: secondsToMs(pollingTimeSeconds + 1) });
            cy.contains(deploymentName);
        });

        function fillNodesFilter() {
            cy.wait('@fetchDeployments');
            cy.wait('@fetchNodes');
            cy.wait('@fetchNodeInstances');

            cy.setSearchableDropdownValue('Deployment', deploymentName);
            cy.setSearchableDropdownValue('Node', nodeName);
            cy.setSearchableDropdownValue('Node Instance', nodeInstanceName);
        }

        type InstallMethod = 'Remote' | 'Plugin' | 'Init Script' | 'Provided';
        function selectInstallMethod(installMethods: InstallMethod[]) {
            cy.setDropdownValues('Install Methods filter', installMethods);
        }

        function verifyExecution(
            executionPayload: Record<string, any>,
            expectedWorkflowId: string,
            expectedInstallMethods: InstallMethod[],
            expectedAdditionalParameters: Record<string, any> = {}
        ) {
            expect(executionPayload).to.deep.equal({
                deployment_id: deploymentName,
                workflow_id: expectedWorkflowId,
                dry_run: false,
                force: false,
                queue: false,
                parameters: {
                    node_ids: [nodeName],
                    node_instance_ids: [nodeInstanceName],
                    install_methods: expectedInstallMethods.map(installMethod => snakeCase(installMethod)),
                    ...expectedAdditionalParameters
                }
            });
        }

        it('validate agent', () => {
            const installMethods: InstallMethod[] = ['Init Script', 'Provided'];
            cy.contains('Validate').click();
            cy.get('.modal').within(() => {
                fillNodesFilter();
                cy.contains(`${deploymentDisplayName} (${deploymentName})`).should('be.visible');
                selectInstallMethod(installMethods);
                cy.contains('button', 'Validate').click();
            });

            cy.wait('@postExecution').then(({ request }) => {
                verifyExecution(request.body, 'validate_agents', installMethods);
            });
            cy.contains('Execution started').should('be.visible');
            cy.contains('Close').click();
        });

        it('install new agent', () => {
            const installMethods: InstallMethod[] = ['Remote', 'Plugin'];
            cy.contains('Install').click();
            cy.get('.modal').within(() => {
                fillNodesFilter();
                selectInstallMethod(installMethods);
                cy.contains('button', 'Install').click();
            });

            cy.wait('@postExecution').then(({ request }) => {
                verifyExecution(request.body, 'install_new_agents', installMethods, { stop_old_agent: false });
            });

            cy.contains('Execution started').should('be.visible');
            cy.contains('Close').click();
        });
    });

    it('should display agents that match the search phrase', () => {
        const checkCell = (tr: JQuery<HTMLElement>, number: number, value: string) => {
            cy.wrap(tr)
                .find(`td:nth-child(${number})`)
                .then(td => expect(td.text()).to.equal(value));
        };
        const items = Array.from({ length: 15 }).map((_v, i) => ({
            id: `id-${i + 1}`,
            ip: `127.0.0.${i + 1}`,
            deployment: `9f13b1a1798277648adb544a2dd14fb7-${i + 1}`,
            node: `node-${i + 1}`,
            system: `centos core-${i + 1}`,
            version: `1.0.${i + 1}`,
            install_method: `remote-${i + 1}`
        }));
        cy.interceptSp('GET', RegExp(`^/agents\\b.*\\b_search=test\\b`), {
            metadata: {
                pagination: {
                    total: 1000,
                    size: items.length,
                    offset: 0
                },
                filtered: null
            },
            items
        }).as('search');
        cy.getSearchInput().type('test');
        cy.wait('@search');
        cy.get('table.agentsTable tbody tr').should('have.length', items.length);
        cy.get('table.agentsTable tbody tr').each((tr, i) => {
            const item = items[i];
            checkCell(tr, 1, item.id);
            checkCell(tr, 2, item.ip);
            checkCell(tr, 3, item.deployment);
            checkCell(tr, 4, item.node);
            checkCell(tr, 5, item.system);
            checkCell(tr, 6, item.version);
            checkCell(tr, 7, item.install_method);
        });
        cy.get('div.gridPagination').contains('1 to 15 of 1000 entries');
        cy.get('div#pageSizeField').contains(String(items.length));
    });
});

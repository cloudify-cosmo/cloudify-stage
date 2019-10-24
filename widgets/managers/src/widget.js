/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import ManagersTable from './ManagersTable';

Stage.defineWidget({
    id: 'managers',
    name: 'Spire Manager',
    description: 'This widget allows to manage Cloudify Managers created using Cloudify Spire plugin',
    initialWidth: 12,
    initialHeight: 24,
    color: 'black',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('managers'),
    categories: [Stage.GenericConfig.CATEGORY.SPIRE],
    supportedEditions: [Stage.Common.Consts.licenseEdition.spire],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'fieldsToShow',
            name: 'List of fields to show in the table',
            placeHolder: 'Select fields from the list',
            items: ['Deployment', 'IP', 'Last Execution', 'Status', 'Actions'],
            default: 'Deployment,IP,Last Execution,Status,Actions',
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        }
    ],

    fetchData(widget, toolbox) {
        let momDeployments = [];

        return toolbox
            .getManager()
            .doGetFull('/deployments', {
                _include: 'id,workflows,capabilities,description',
                description: 'Cloudify Spire Management Cluster'
            })
            .then(deployments => {
                // FIXME: Do we need that??
                const capabilitiesPromises = _.map(deployments, deployment =>
                    toolbox.getManager().doGet(`/deployments/${deployment.id}/capabilities`)
                );

                const executionsPromise = toolbox.getManager().doGet('/executions', {
                    _sort: '-ended_at',
                    deployment_id: _.map(momDeployments, deployment => deployment.id)
                });

                return Promise.all([executionsPromise, ...capabilitiesPromises]);
            })
            .then(([executions, ...spireDeploymentsCapabilities]) => {
                const executionsData = _.groupBy(executions.items, 'deployment_id');

                return Promise.resolve({
                    items: _.sortBy(
                        _.map(spireDeploymentsCapabilities, deploymentCapabilities => {
                            const managerId = deploymentCapabilities.deployment_id;
                            const managerIp = _.get(deploymentCapabilities.capabilities, 'endpoint', '');
                            const deployment = _.find(
                                momDeployments,
                                deployment => deployment.id === deploymentCapabilities.deployment_id
                            );
                            const workflows = _.get(deployment, 'workflows', []);

                            return {
                                id: managerId,
                                ip: managerIp,
                                status: _.find(
                                    _.get(deploymentCapabilities.outputs.cluster_status, 'cluster_status', []),
                                    clusterStatusItem => clusterStatusItem.name === managerIp
                                ),
                                servicesStatus: 'TODO', // _.get(deploymentCapabilities.capabilities.cluster_status, 'leader_status', []),
                                error: 'TODO', // _.get(deploymentCapabilities.capabilities.cluster_status, 'error', ''),

                                workflows,
                                lastExecution: _.first(executionsData[managerId])
                            };
                        }),
                        'id'
                    ),
                    total: _.size(spireDeploymentsCapabilities)
                });
            });
    },

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        return <ManagersTable widget={widget} data={data} toolbox={toolbox} />;
    }
});

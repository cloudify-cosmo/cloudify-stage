/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import ManagersTable from './ManagersTable';

Stage.defineWidget({
    id: 'managers',
    name: 'Cloudify Managers Management',
    description: 'This widget allows to manage Cloudify Managers created using Cloudify Manager of Managers plugin',
    initialWidth: 12,
    initialHeight: 24,
    color : 'black',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('managers'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration:
        [
            Stage.GenericConfig.POLLING_TIME_CONFIG(15),
            {
                id: 'fieldsToShow', name: 'List of fields to show in the table',
                placeHolder: 'Select fields from the list',
                items: ['Deployment','IP','Status','Actions'],
                default: 'Deployment,IP,Status,Actions',
                type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
            }
        ],


    fetchData: function(widget, toolbox) {


        return toolbox.getManager().doGet('/deployments', {_include: 'id,outputs'})
            .then((deployments) => {
                const momDeployments = _.filter(_.get(deployments, 'items', []), (deployment) =>
                    !!deployment.outputs.cluster_ips && !!deployment.outputs.cluster_status);

                let outputsPromises = _.map(momDeployments, (deployment) =>
                    toolbox.getManager().doGet(`/deployments/${deployment.id}/outputs`));

                return Promise.all(outputsPromises);
            })
            .then((momDeploymentsOutputs) => {
                return Promise.resolve({
                    items: _.map(momDeploymentsOutputs, (deploymentOutputs) => {
                        const managerId = deploymentOutputs.deployment_id;
                        const managerIp = _.get(deploymentOutputs.outputs.cluster_ips, 'Master', '');

                        return {
                            id: managerId,
                            ip: managerIp,
                            status: _.find(_.get(deploymentOutputs.outputs.cluster_status, 'cluster_status', []),
                                (clusterStatusItem) => clusterStatusItem.name === managerIp),
                            servicesStatus: _.get(deploymentOutputs.outputs.cluster_status, 'leader_status', []),
                            error: _.get(deploymentOutputs.outputs.cluster_status, 'error', ''),

                            slaves: _.map(_.get(deploymentOutputs.outputs.cluster_ips, 'Slaves', []), (slaveIp) => ({
                                ip: slaveIp,
                                status: _.find(_.get(deploymentOutputs.outputs.cluster_status, 'cluster_status', []),
                                    (clusterStatusItem) => clusterStatusItem.name === slaveIp)
                            }))
                        }
                    }),
                    total: _.size(momDeploymentsOutputs)
                });
            });
    },

    render: function(widget, data, error, toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        return (
            <ManagersTable widget={widget} data={data} toolbox={toolbox} />
        );
    }
});

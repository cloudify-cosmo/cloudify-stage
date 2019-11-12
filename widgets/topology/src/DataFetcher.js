/**
 * Created by kinneretzin on 07/11/2016.
 */

export default class DataFetcher {
    static fetch(toolbox, blueprintId, deploymentId) {
        if (_.isEmpty(deploymentId) && _.isEmpty(blueprintId)) {
            return Promise.resolve({ data: {} });
        }

        if (deploymentId) {
            let fetchDeployment = Promise.resolve({ blueprint_id: blueprintId });
            if (!blueprintId) {
                fetchDeployment = toolbox
                    .getManager()
                    .doGet(`/deployments?id=${deploymentId}&_include=id,blueprint_id`)
                    .then(deployments => {
                        const deployment = _.get(deployments, 'items[0]', null);
                        if (!deployment) {
                            return Promise.reject(new Error('Cannot find deployment'));
                        }
                        return Promise.resolve(deployment);
                    });
            }

            return fetchDeployment.then(deployment => {
                return Promise.all([
                    toolbox.getManager().doGet(`/blueprints?id=${deployment.blueprint_id}`),
                    toolbox.getManager().doGet(`/nodes?deployment_id=${deploymentId}`),
                    toolbox.getManager().doGet(`/node-instances?deployment_id=${deploymentId}`),
                    toolbox
                        .getManager()
                        .doGet(
                            `/executions?_include=id,workflow_id,status&deployment_id=${deploymentId}&status=pending&status=started&status=cancelling&status=force_cancelling`
                        )
                        .then(executions => Promise.resolve(_.first(executions.items)))
                ]).then(data => {
                    const blueprint = data[0].items && data[0].items.length === 1 ? data[0].items[0] : {};
                    const blueprintPlan = blueprint.plan || {};
                    let nodes = data[1].items ? data[1].items : [];
                    const nodeInstances = data[2].items ? data[2].items : [];
                    const execution = data[3];

                    blueprintPlan.nodes = this.sortNodesById(blueprintPlan.nodes);
                    nodes = this.sortNodesById(nodes);
                    nodes = nodes.map(node => {
                        return Object.assign(node, {
                            name: node.id,
                            instances: {}
                        });
                    });

                    blueprint.plan = { ...blueprintPlan, nodes };

                    const topologyData = {
                        data: blueprint,
                        instances: nodeInstances,
                        executions: execution
                    };

                    return Promise.resolve(topologyData);
                });
            });
        }
        if (blueprintId) {
            return toolbox
                .getManager()
                .doGet(`/blueprints/${blueprintId}`)
                .then(blueprint => {
                    return Promise.resolve({ data: blueprint });
                });
        }
    }

    static sortNodesById(nodes) {
        nodes.sort(function(node1, node2) {
            if (node1.id < node2.id) {
                return -1;
            }
            if (node1.id > node2.id) {
                return 1;
            }
            return 0;
        });
        return nodes;
    }
}

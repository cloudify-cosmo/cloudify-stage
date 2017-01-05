/**
 * Created by kinneretzin on 07/11/2016.
 */

export default class DataFetcher{
    static fetch(toolbox,blueprintId,deploymentId) {
        if (_.isEmpty(deploymentId) && _.isEmpty(blueprintId)) {
            return Promise.resolve({});
        }

        if (deploymentId) {
            var fetchDeployment = Promise.resolve({blueprint_id: blueprintId});
            if (!blueprintId) {
                fetchDeployment = toolbox.getManager().doGet(`/deployments?id=${deploymentId}&_include=id,blueprint_id`)
                                            .then((deployments)=>{
                                                var deployment = _.get(deployments,'items[0]',null);
                                                if (!deployment) {
                                                    return Promise.reject(new Error('Cannot find deployment'));
                                                } else {
                                                    return Promise.resolve(deployment);
                                                }
                                            });
            }

            return fetchDeployment.then((deployment)=>{
                return Promise.all([
                    toolbox.getManager().doGet(`/blueprints?id=${deployment.blueprint_id}`),
                    toolbox.getManager().doGet(`/nodes?deployment_id=${deploymentId}`),
                    toolbox.getManager().doGet(`/node-instances?deployment_id=${deploymentId}`),
                    toolbox.getManager().doGet(`/executions?_include=id,workflow_id,status&deployment_id=${deploymentId}&status=pending&status=started&status=cancelling&status=force_cancelling`)
                        .then(executions=>Promise.resolve(_.first(executions.items))),
                ]).then( data=>{


                    var blueprint = data[0].items && data[0].items.length === 1 ? data[0].items[0]: {};
                    var blueprintPlan = blueprint.plan || {};
                    var nodes = data[1].items ? data[1].items : [];
                    var nodeInstances = data[2].items ? data[2].items : [];
                    var execution = data[3];

                    blueprintPlan.nodes = this.sortNodesById(blueprintPlan.nodes);
                    nodes = this.sortNodesById(nodes);
                    nodes = nodes.map((node)=>{
                        return Object.assign(node,{
                            name: node.id,
                            instances: {}
                        });
                    });

                    blueprint.plan = Object.assign({},blueprintPlan,{
                        nodes: nodes
                    });


                    var topologyData = {
                        data: blueprint,
                        instances: nodeInstances,
                        executions:execution
                    };

                    return Promise.resolve(topologyData);
                })
            })

        } else if (blueprintId) {
            return toolbox.getManager().doGet(`/blueprints?id=${blueprintId}`).then((blueprint)=>{
                return Promise.resolve({data:_.get(blueprint,'items[0]',{})});
            })
        }

    }

    static sortNodesById (nodes) {
        nodes.sort(function(node1, node2) {
            if (node1.id < node2.id) {
                return -1;
            } else if (node1.id > node2.id) {
                return 1;
            }
            return 0;
        });
        return nodes;
    }
}

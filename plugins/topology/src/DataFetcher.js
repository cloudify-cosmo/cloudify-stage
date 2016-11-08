/**
 * Created by kinneretzin on 07/11/2016.
 */

export default class DataFetcher{
    static fetch(managerUrl,blueprintId,deploymentId) {
        if (_.isEmpty(deploymentId) && _.isEmpty(blueprintId)) {
            return Promise.resolve({});
        }

        // TODO show current execution if one exists
        if (deploymentId) {
            var fetchDeployment = Promise.resolve({blueprint_id: blueprintId});
            if (!blueprintId) {
                fetchDeployment = this.fetchDeployment(managerUrl,deploymentId);
            }

            return fetchDeployment.then((deployment)=>{
                return Promise.all([
                    this.fetchBlueprint(managerUrl,deployment.blueprint_id),
                    this.fetchNodes(managerUrl,deploymentId),
                    this.fetchNodeInstances(managerUrl,deploymentId),
                    this.fetchRunningExecution(managerUrl,deploymentId)
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
            return this.fetchBlueprint(managerUrl,blueprintId).then((blueprint)=>{
                return Promise.resolve(
                    {
                        data: blueprint && blueprint.items && blueprint.items[0] ? blueprint.items[0] : {}
                    });
            })
        }

    }

    static fetchBlueprint(managerUrl,blueprintId) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: managerUrl + '/api/v2.1/blueprints?id='+blueprintId,
                dataType: 'json'
            }).done(resolve).fail(reject);
        });
    }
    static fetchNodes(managerUrl,deploymentId) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: managerUrl + '/api/v2.1/nodes?deployment_id='+deploymentId,
                dataType: 'json'
            }).done(resolve).fail(reject);
        });
    }
    static fetchNodeInstances(managerUrl,deploymentId) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: managerUrl + '/api/v2.1/node-instances?deployment_id='+deploymentId,
                dataType: 'json'
            }).done(resolve).fail(reject);
        });
    }

    static fetchDeployment(managerUrl,deploymentId) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: managerUrl + '/api/v2.1/deployments?id='+deploymentId+'&_include=id,blueprint_id',
                dataType: 'json'
            }).done((deployments)=>{
                if (!deployments || !deployments.items || deployments.items.length !== 1) {
                    reject(new Error('Cannot find deployment'));
                } else {
                    resolve(deployments.items[0]);
                }
            }).fail(reject)
        });
    }

    static fetchRunningExecution(managerUrl,deploymentId) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: managerUrl + '/api/v2.1/executions?_include=id,workflow_id,status&deployment_id='+deploymentId+
                                '&status=pending&status=started&status=cancelling&status=force_cancelling',
                dataType: 'json'
            }).done((executions)=>{
                resolve(_.first(executions.items));
            }).fail(reject)
        });
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

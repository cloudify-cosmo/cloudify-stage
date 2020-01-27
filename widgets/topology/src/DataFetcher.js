import yaml from 'js-yaml';

export default class DataFetcher {
    static fetch(toolbox, blueprintId, deploymentId, fetchLayout) {
        if (_.isEmpty(deploymentId) && _.isEmpty(blueprintId)) {
            return Promise.resolve({ data: {} });
        }

        function getLayoutPromise(layoutBlueprintId) {
            return toolbox
                .getInternal()
                .doGet(`/bud/layout/${layoutBlueprintId}`)
                .catch(() =>
                    toolbox
                        .getInternal()
                        .doGet(`/source/browse/${layoutBlueprintId}/archive`)
                        .then(data =>
                            _.chain(data)
                                .get('children[0].children')
                                .find({ title: 'info.yaml' })
                                .get('key')
                                .value()
                        )
                        .then(path =>
                            path
                                ? toolbox
                                      .getInternal()
                                      .doGet('/source/browse/file', { path })
                                      .then(yaml.safeLoad)
                                : null
                        )
                );
        }

        if (deploymentId) {
            let getBlueprintId;
            if (blueprintId) {
                getBlueprintId = Promise.resolve(blueprintId);
            } else {
                getBlueprintId = toolbox
                    .getManager()
                    .doGet(`/deployments?id=${deploymentId}&_include=id,blueprint_id`)
                    .then(deployments => {
                        const deployment = _.get(deployments, 'items[0]', null);
                        if (!deployment) {
                            return Promise.reject(new Error('Cannot find deployment'));
                        }
                        return Promise.resolve(deployment.blueprint_id);
                    });
            }

            return getBlueprintId.then(resolvedBlueprintId => {
                const promises = [
                    toolbox.getManager().doGet(`/blueprints?id=${resolvedBlueprintId}`),
                    toolbox.getManager().doGet(`/nodes?deployment_id=${deploymentId}`),
                    toolbox.getManager().doGet(`/node-instances?deployment_id=${deploymentId}`),
                    toolbox
                        .getManager()
                        .doGet(
                            `/executions?_include=id,workflow_id,status&deployment_id=${deploymentId}&status=pending&status=started&status=cancelling&status=force_cancelling`
                        )
                        .then(executions => Promise.resolve(_.first(executions.items)))
                ];

                if (fetchLayout) {
                    promises.push(getLayoutPromise(resolvedBlueprintId));
                }

                return Promise.all(promises).then(data => {
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
                        executions: execution,
                        layout: _.nth(data, 4)
                    };

                    return Promise.resolve(topologyData);
                });
            });
        }
        if (blueprintId) {
            return Promise.all([
                toolbox.getManager().doGet(`/blueprints/${blueprintId}`),
                getLayoutPromise(blueprintId)
            ]).then(data => ({
                data: data[0],
                layout: data[1]
            }));
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

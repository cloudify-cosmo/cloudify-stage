import _ from 'lodash';
import type { GetBlueprintUserDataLayoutResponse } from 'backend/routes/BlueprintUserData.types';
import type { WidgetlessToolbox } from 'app/utils/StageAPI';
import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';
import type { ManagerData } from './widget.types';

interface Node {
    id: string;
}

export default class DataFetcher {
    static fetch(
        toolbox: WidgetlessToolbox,
        deploymentId?: string,
        blueprintId?: string,
        fetchLayout?: boolean
    ): Promise<ManagerData | undefined> {
        if (!deploymentId && !blueprintId) {
            return Promise.resolve(undefined);
        }

        function getLayoutPromise(layoutBlueprintId?: string) {
            return toolbox
                .getInternal()
                .doGet<GetBlueprintUserDataLayoutResponse>(`/bud/layout/${layoutBlueprintId}`)
                .catch(_.constant(null));
        }

        const blueprintActions = new Stage.Common.Blueprints.Actions(toolbox);

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
                    blueprintActions.doGetFullBlueprintData(resolvedBlueprintId),
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
                    const blueprint: FullBlueprintData = data[0] || {};
                    const blueprintPlan = blueprint.plan || {};
                    let nodes = data[1].items ? data[1].items : [];
                    const nodeInstances = data[2].items ? data[2].items : [];

                    this.sortNodesById(blueprintPlan.nodes);
                    nodes = this.sortNodesById(nodes);
                    nodes = nodes.map((node: Node) => {
                        return Object.assign(node, {
                            name: node.id,
                            instances: {}
                        });
                    });

                    blueprint.plan = { ...blueprintPlan, nodes };

                    const topologyData = {
                        data: blueprint,
                        instances: nodeInstances,
                        inProgress: data[3],
                        layout: _.nth(data, 4)
                    };

                    return Promise.resolve(topologyData);
                });
            });
        }

        return Promise.all([blueprintActions.doGetFullBlueprintData(blueprintId!), getLayoutPromise(blueprintId)]).then(
            data => ({
                data: data[0],
                layout: data[1]
            })
        );
    }

    static sortNodesById(nodes: Node[]) {
        nodes.sort((node1, node2) => {
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

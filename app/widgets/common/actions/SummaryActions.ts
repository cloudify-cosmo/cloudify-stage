type ResourceName = 'blueprints' | 'deployments' | 'executions' | 'nodes' | 'node_instances';
type Params = Record<string, any>;

export default class SummaryActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    private doGet(resourceName: ResourceName, targetField: string, params?: Params) {
        return this.toolbox.getManager().doGet(`/summary/${resourceName}`, {
            params: {
                _target_field: targetField,
                ...params
            }
        });
    }

    doGetDeployments(targetField: string, params?: Params) {
        return this.doGet('deployments', targetField, params);
    }

    doGetNodeInstances(targetField: string, params?: Params) {
        return this.doGet('node_instances', targetField, params);
    }
}

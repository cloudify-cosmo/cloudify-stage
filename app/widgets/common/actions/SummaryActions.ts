import type { PaginatedResponse } from 'backend/types';

type ResourceName = 'blueprints' | 'deployments' | 'executions' | 'nodes' | 'node_instances';
type Params = Record<string, any>;

type DeploymentsTargetField = 'blueprint_id' | 'tenant_name' | 'visibility' | 'site_name' | 'deployment_status';
type NodeInstancesTargetField = 'deployment_id' | 'node_id' | 'host_id' | 'state' | 'tenant_name' | 'visibility';
type TargetField = DeploymentsTargetField | NodeInstancesTargetField;

type SubTargetObject<Resource extends ResourceName, SubTarget extends TargetField, SubTargetType> = {
    [sub in `by ${SubTarget}`]: ({ [name in SubTarget]: SubTargetType } & { [resource in Resource]: number })[];
};

export default class SummaryActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    private doGet<
        Resource extends ResourceName,
        Target extends TargetField,
        TargetType,
        SubTarget extends TargetField,
        SubTargetType
    >(resourceName: ResourceName, targetField: string, params?: Params) {
        return this.toolbox
            .getManager()
            .doGet<
                PaginatedResponse<
                    { [resource in Resource]: number } & { [target in Target]: TargetType } & ([SubTarget] extends [
                            never
                        ]
                            ? unknown
                            : SubTargetObject<Resource, SubTarget, SubTargetType>)
                >
            >(`/summary/${resourceName}`, {
                params: {
                    _target_field: targetField,
                    ...params
                }
            });
    }

    doGetDeployments<
        Target extends DeploymentsTargetField,
        TargetType,
        SubTarget extends DeploymentsTargetField = never,
        SubTargetType = never
    >(targetField: DeploymentsTargetField, params?: Params) {
        return this.doGet<'deployments', Target, TargetType, SubTarget, SubTargetType>(
            'deployments',
            targetField,
            params
        );
    }

    doGetNodeInstances<
        Target extends NodeInstancesTargetField,
        TargetType,
        SubTarget extends NodeInstancesTargetField = never,
        SubTargetType = never
    >(targetField: NodeInstancesTargetField, params?: Params) {
        return this.doGet<'node_instances', Target, TargetType, SubTarget, SubTargetType>(
            'node_instances',
            targetField,
            params
        );
    }
}

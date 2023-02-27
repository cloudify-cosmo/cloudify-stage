import type { PaginatedResponse } from 'backend/types';

type ResourceName = 'blueprints' | 'deployments' | 'executions' | 'nodes' | 'node_instances';
type Params = Record<string, any>;

type DeploymentsTargetField = 'blueprint_id' | 'tenant_name' | 'visibility' | 'site_name' | 'deployment_status';
type NodeInstancesTargetField = 'deployment_id' | 'node_id' | 'host_id' | 'state' | 'tenant_name' | 'visibility';
type TargetField = DeploymentsTargetField | NodeInstancesTargetField;

type ResourceCount<Name extends string> = { [name in Name]: number };
type TargetValue<Name extends string, Type> = { [name in Name]: Type };

type SubTargetObject<Resource extends ResourceName, SubTarget extends TargetField, SubTargetType> = {
    [sub in `by ${SubTarget}`]: (TargetValue<SubTarget, SubTargetType> & ResourceCount<Resource>)[];
};

type SummaryItem<
    Resource extends ResourceName,
    Target extends TargetField,
    TargetType,
    SubTarget extends TargetField,
    SubTargetType
> = ResourceCount<Resource> &
    TargetValue<Target, TargetType> &
    ([SubTarget] extends [never] ? unknown : SubTargetObject<Resource, SubTarget, SubTargetType>);

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
            .doGet<PaginatedResponse<SummaryItem<Resource, Target, TargetType, SubTarget, SubTargetType>>>(
                `/summary/${resourceName}`,
                {
                    params: {
                        _target_field: targetField,
                        ...params
                    }
                }
            );
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

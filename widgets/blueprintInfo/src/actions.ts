import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';
import type { FullDeploymentData } from 'app/widgets/common/deployments/DeploymentActions';

// TODO(RD-5879): Use Awaited (introduced in TS 4.5) instead of creating custom utility type
type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
export type BlueprintDetails = Unpromise<ReturnType<Actions['doGetBlueprintDetails']>>;

export default class Actions {
    constructor(private readonly toolbox: Stage.Types.Toolbox) {}

    doGetBlueprintId(deploymentId: string) {
        const deploymentKeys = ['id', 'blueprint_id'] as const;
        type DeploymentKeys = typeof deploymentKeys[number];

        return this.toolbox
            .getManager()
            .doGet<Pick<FullDeploymentData, DeploymentKeys>>(`/deployments/${deploymentId}`, {
                params: { _include: deploymentKeys.join(',') }
            });
    }

    doGetBlueprintDetails(blueprintId: string) {
        const blueprintKeys = [
            'id',
            'updated_at',
            'created_at',
            'description',
            'created_by',
            'visibility',
            'main_file_name',
            'state'
        ] as const;
        type BlueprintKeys = typeof blueprintKeys[number];

        return this.toolbox.getManager().doGet<Pick<FullBlueprintData, BlueprintKeys>>(`/blueprints/${blueprintId}`, {
            params: { _include: blueprintKeys.join(',') }
        });
    }

    doGetBlueprintDeployments(blueprintId: string) {
        return new Stage.Common.Actions.Summary(this.toolbox).doGetDeployments<'blueprint_id', string>('blueprint_id', {
            blueprint_id: blueprintId
        });
    }
}

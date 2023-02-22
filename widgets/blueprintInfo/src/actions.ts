import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';
import type { Deployment } from 'app/widgets/common/deploymentsView/types';

export default class Actions {
    constructor(private readonly toolbox: Stage.Types.Toolbox) {
        this.toolbox = toolbox;
    }

    doGetBlueprintId(deploymentId: string) {
        const deploymentKeys = ['id', 'blueprint_id'] as const;
        type DeploymentKeys = typeof deploymentKeys[number];

        return this.toolbox.getManager().doGet<Pick<Deployment, DeploymentKeys>>(`/deployments/${deploymentId}`, {
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

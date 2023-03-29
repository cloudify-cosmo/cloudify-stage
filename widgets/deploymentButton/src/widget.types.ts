import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';
import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';
import type { FilterRule } from 'app/widgets/common/filters/types';

export declare namespace DeploymentButtonWidget {
    export type DataItem = Pick<FullBlueprintData, 'id'>;

    interface Configuration extends ButtonConfiguration {
        toolbox: Stage.Types.Toolbox;
        blueprintFilterRules: FilterRule[];
    }

    export type Data = Stage.Types.WidgetData<Stage.Types.PaginatedResponse<DataItem>>;
}

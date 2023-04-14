import type { Label } from 'app/widgets/common/labels/types';
import type { PostEnvironmentBlueprintRequestBody } from 'backend/routes/blueprints/Environment.types';
import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';

export interface DefaultableLabel extends Label {
    blueprintDefault: boolean;
}

export type Capability = PostEnvironmentBlueprintRequestBody['capabilities'][number];

export namespace EnvironmentButtonWidget {
    type DataItem = Pick<FullBlueprintData, 'id'>;

    export type Data = Stage.Types.WidgetData<Stage.Types.PaginatedResponse<DataItem>>;
}

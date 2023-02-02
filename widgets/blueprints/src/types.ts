import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';
import type { FilterRule } from 'app/widgets/common/filters/types';
import type { DataTableConfiguration, PollingTimeConfiguration } from 'app/utils/GenericConfig';
import type { FetchParams } from 'app/widgets/common/types';

export interface BlueprintsWidgetConfiguration extends PollingTimeConfiguration, DataTableConfiguration {
    clickToDrillDown: boolean;
    displayStyle: 'table' | 'catalog';
    hideFailedBlueprints: boolean;
    showComposerOptions: boolean;
    filterRules: FilterRule[];
    fieldsToShow: string;
}

export type Blueprint = Pick<
    FullBlueprintData,
    | 'created_at'
    | 'created_by'
    | 'description'
    | 'id'
    | 'main_file_name'
    | 'updated_at'
    | 'visibility'
    | 'state'
    | 'error'
>;

/** Blueprint extended with frontend-only fields */
export interface ExtendedBlueprint extends Blueprint {
    isSelected: boolean;
    depCount: number;
}

export interface BlueprintDataResponse {
    items: ExtendedBlueprint[];
    total: number;
}

export interface BlueprintsViewProps {
    data: BlueprintDataResponse;
    widget: Stage.Types.Widget<BlueprintsWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
    fetchData: (params: FetchParams) => void;
    onSelectBlueprint: (blueprint: ExtendedBlueprint) => void;
    onDeleteBlueprint: (blueprint: ExtendedBlueprint) => void;
    onCreateDeployment: (blueprint: ExtendedBlueprint) => void;
    onSetVisibility: (blueprintId: string, visibility: string) => void;
    noDataMessage?: string;
}

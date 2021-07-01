export interface BlueprintsWidgetConfiguration {
    pollingTime: number;
    pageSize: number;
    sortColumn: string;
    sortAscending: string;
    clickToDrillDown: boolean;
    displayStyle: 'table' | 'catalog';
    hideFailedBlueprints: boolean;
    showEditCopyInComposerButton: boolean;
}

interface Blueprint {
    // NOTE: properties come from backend
    /* eslint-disable camelcase */
    created_at: string;
    created_by: string;
    description: string | null;
    id: string;
    main_file_name: string;
    updated_at: string;
    visibility: string;
    state: string;
    error: string | null;
    /* eslint-enable camelcase */
}

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
    fetchData: (params: Stage.Types.GridParams) => void;
    onSelectBlueprint: (blueprint: ExtendedBlueprint) => void;
    onDeleteBlueprint: (blueprint: ExtendedBlueprint) => void;
    onCreateDeployment: (blueprint: ExtendedBlueprint) => void;
    onSetVisibility: (blueprintId: string, visibility: string) => void;
    noDataMessage?: string;
}

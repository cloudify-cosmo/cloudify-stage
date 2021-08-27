export interface BlueprintCatalogWidgetConfiguration {
    jsonPath: string;
    username: string;
    password: string;
    filter: string;
    displayStyle: 'table' | 'catalog';
    sortByName: boolean;
    pageSize: number;
    sortColumn: string;
    sortAscending: boolean;
}

export interface BlueprintDescription {
    id: string;
    name: string;
    description: string;
    url: string;
    // eslint-disable-next-line camelcase
    created_at: string;
    // eslint-disable-next-line camelcase
    updated_at: string;
    // eslint-disable-next-line camelcase
    image_url: string;
    // eslint-disable-next-line camelcase
    html_url: string;
    // eslint-disable-next-line camelcase
    readme_url: string;
    // eslint-disable-next-line camelcase
    zip_url: string;
    // eslint-disable-next-line camelcase
    main_blueprint: string;
    isSelected: boolean;
}

export interface BlueprintCatalogPayload {
    items: BlueprintDescription[];
    total: number;
    source: string;
    uploadedBlueprints: string[];
    isAuthenticated?: boolean;
}

export interface RepositoryViewProps {
    data: BlueprintCatalogPayload;
    fetchData: (fetchParams: any) => void;
    uploadingInProgress?: string[];
    noDataMessage: string;
    onReadme: (name: string, url: string) => void;
    onSelect: (item: BlueprintDescription) => void;
    onUpload: (name: string, zipUrl: string, imageUrl: string, mainBlueprint: string) => void;
    readmeLoading: string | null;
    widget: Stage.Types.Widget<BlueprintCatalogWidgetConfiguration>;
}

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
    fieldsToShow: string[];
}

export interface Blueprint {
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
    state: string;
}

export interface BlueprintCatalogPayload {
    items: Blueprint[];
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
    onSelect: (item: Blueprint) => void;
    onUpload: (name: string, zipUrl: string, imageUrl: string, mainBlueprint: string) => Promise<unknown>;
    readmeLoading: string | null;
    widget: Stage.Types.Widget<BlueprintCatalogWidgetConfiguration>;
}

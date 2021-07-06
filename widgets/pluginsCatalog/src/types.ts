export interface PluginWagon {
    name: string;
    url: string;
    md5url: string;
}

export interface PluginDescription {
    name: string;
    title: string;
    version: string;
    link: string;
    icon: string;
    description: string;
    releases: string;
    wagons: PluginWagon[];
}

export interface PluginsCatalogWidgetConfiguration {
    jsonPath: string;
    sortByName: boolean;
}

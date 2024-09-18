import type { PluginCatalogEntry } from 'backend/routes/Plugins.types';

export type PluginDescription = PluginCatalogEntry;

export interface PluginDescriptionWithVersion {
    pluginDescription: PluginDescription;
    uploadedVersion: string | undefined;
}

export interface PluginsCatalogWidgetConfiguration {
    jsonPath: string;
    sortByName: boolean;
}

export interface PluginUploadData {
    title: string;
    url: string;
    yamlUrls: string[];
    icon: string;
}

import type { PluginCatalogEntry, PluginEntry } from 'backend/routes/Plugins.types';

export type URLString = string;

// from REST API

export type CatalogPluginResponse = PluginCatalogEntry;
export type ManagerPluginResponse = PluginEntry;
export type ManagerPluginsResponse = Stage.Types.PaginatedResponse<ManagerPluginResponse>;

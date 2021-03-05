import type { PageMetadataData } from '../model';

export type URLString = string;

export type WagonData = {
    name: string;
    url: URLString;
    md5url: URLString;
};

export type AvailablePluginData = {
    description: string;
    releases: URLString;
    title: string;
    version: string;
    link: URLString;
    wagons: WagonData[];
    icon: URLString;
    name: string;
};

export type InstalledPluginData = {
    visibility: string;
    distribution: string;
    package_name: string;
    package_version: string;
};

export type InstalledPluginsData = {
    metadata: PageMetadataData;
    items: InstalledPluginData[];
};

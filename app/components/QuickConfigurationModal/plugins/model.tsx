type URLString = string;

type PaginationData = {
    offset: number;
    size: number;
    total: number;
};

type PageMetadataData = {
    pagination: PaginationData;
    filtered: unknown;
};

type WagonData = {
    name: string;
    url: URLString;
    md5url: URLString;
};

type AvailablePluginData = {
    description: string;
    releases: URLString;
    title: string;
    version: string;
    link: URLString;
    wagons: WagonData[];
    icon: URLString;
    name: string;
};

type InstalledPluginData = {
    todo: unknown;
};

type InstalledPluginsData = {
    metadata: PageMetadataData;
    items: InstalledPluginData[];
};

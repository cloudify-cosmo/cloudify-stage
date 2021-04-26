export type URLString = string;

// from REST API

export type WagonResponse = {
    name: string;
    url: URLString;
    md5url: URLString;
};

export type CatalogPluginResponse = {
    description: string;
    releases: URLString;
    title: string;
    version: string;
    link: URLString;
    wagons: WagonResponse[];
    icon: URLString;
    name: string;
};

export type ManagerPluginResponse = {
    visibility: string;
    distribution: string;
    // eslint-disable-next-line camelcase
    package_name: string;
    // eslint-disable-next-line camelcase
    package_version: string;
};

export type ManagerPluginsResponse = Stage.Types.PaginatedResponse<ManagerPluginResponse>;

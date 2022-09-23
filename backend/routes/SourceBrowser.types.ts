export interface ScanningItem {
    key: string;
    title: string;
    isDir: boolean;
    children?: ScanningItem[];
}

export type GetSourceBrowseBlueprintFileResponse = string;

export interface GetSourceBrowseBlueprintArchiveResponse extends Partial<ScanningItem> {
    timestamp?: string;
}

export interface PutSourceListYamlQueryParams {
    includeFilename?: string;
    url?: string;
}

export type PutSourceListYamlResponse = string[];

import type { ScanningItem } from '../handler/SourceHandler.types';

export type GetSourceBrowseBlueprintFileResponse = string;

export interface GetSourceBrowseBlueprintArchiveResponse extends ScanningItem {
    timestamp: string;
}

export interface PutSourceListYamlQueryParams {
    includeFilename?: string;
    url?: string;
}

export type PutSourceListYamlResponse = string[];

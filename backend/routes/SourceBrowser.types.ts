import type { ScanningItem } from '../handler/SourceHandler.types';

export type GetSourceBrowseBlueprintFileResponse = string;

export type GetSourceBrowseBlueprintArchiveResponse = ScanningItem & {
    timestamp: string;
};

export interface PutSourceListYamlQueryParams {
    includeFilename?: string;
    url?: string;
}

export type PutSourceListYamlResponse = string[];

import type { ScanningDir } from '../handler/SourceHandler.types';

export type GetSourceBrowseBlueprintFileResponse = string;

export type GetSourceBrowseBlueprintArchiveResponse = ScanningDir & {
    timestamp: string;
};

export interface PutSourceListYamlQueryParams {
    includeFilename?: string;
    url?: string;
}

export type PutSourceListYamlResponse = string[];

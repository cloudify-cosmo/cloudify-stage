import type { ScanningDir } from '../handler/SourceHandler.types';

export type GetSourceBrowseBlueprintFileResponse = string;

interface ScanningDirWithTimestamp extends ScanningDir {
    timestamp: string;
}

export type GetSourceBrowseBlueprintArchiveResponse = ScanningDirWithTimestamp | null;

export interface PutSourceListYamlQueryParams {
    includeFilename?: string;
    url?: string;
}

export type PutSourceListYamlResponse = string[];

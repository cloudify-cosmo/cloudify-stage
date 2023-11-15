import type { TerraformBlueprintData, TerraformParserResult } from '../../handler/TerraformHandler.types';

export type PostTerraformResourcesResponse = string[];

export interface PostTerraformResourcesQueryParams {
    templateUrl: string;
}

export type PostTerraformResourcesFileResponse = PostTerraformResourcesResponse;

export interface PostTerraformFetchDataRequestBody {
    templateUrl: string;
    resourceLocation: string;
}

export type PostTerraformFetchDataResponse = TerraformParserResult;

export interface PostTerraformFetchDataFileRequestBody {
    file: Buffer;
    resourceLocation: string;
}

export type PostTerraformFetchDataFileResponse = TerraformParserResult;

export type PostTerraformBlueprintRequestBody = TerraformBlueprintData;

export type PostTerraformBlueprintResponse = string;

export interface PostTerraformBlueprintArchiveRequestBody
    extends Omit<PostTerraformBlueprintRequestBody, 'terraformTemplate'> {
    file?: string;
}

export type PostTerraformBlueprintArchiveResponse = Buffer;

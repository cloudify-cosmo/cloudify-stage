import type {
    CreatePageData,
    CreatePageGroupData,
    CreateTemplateData,
    Page,
    PageGroup,
    Template,
    UpdatePageData,
    UpdatePageGroupData,
    UpdateTemplateData
} from '../handler/templates/types';

export type GetTemplatesResponse = Template[];

export type PostTemplatesRequestBody = CreateTemplateData;

export type PutTemplatesRequestBody = UpdateTemplateData;

export type GetSelectTemplateResponse = string;

export interface GetSelectTemplateQueryParams {
    tenant: string;
}

export type GetPageGroupsResponse = PageGroup[];

export type PostPageGroupsRequestBody = CreatePageGroupData;

export type PutPageGroupsRequestBody = UpdatePageGroupData;

export type GetPagesResponse = (Page | null)[];

export type PostPagesRequestBody = CreatePageData;

export type PutPagesRequestBody = UpdatePageData;

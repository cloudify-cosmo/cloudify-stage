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

export type GetInitialTemplateIdResponse = string;

export type GetPageGroupsResponse = PageGroup[];

export type PostPageGroupsRequestBody = CreatePageGroupData;

export type PutPageGroupsRequestBody = UpdatePageGroupData;

export type GetPagesResponse = Page[];

export type PostPagesRequestBody = Pick<CreatePageData, 'id' | 'name'>;

export type PutPagesRequestBody = UpdatePageData;

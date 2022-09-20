export interface WidgetDefinition {
    definition: string;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    configuration: Record<string, any>;
}

export interface WidgetsSection {
    type: 'widgets';
    content: WidgetDefinition[];
}

export interface TabContent {
    name: string;
    widgets: WidgetDefinition[];
    isDefault?: boolean;
}

export interface TabsSection {
    type: 'tabs';
    content: TabContent[];
}

export type LayoutSectionType = 'tabs' | 'widgets';

export type LayoutSection = WidgetsSection | TabsSection;

export interface PageItem {
    id: string;
    type: 'page' | 'pageGroup';
}

export interface CommonFileContent {
    updatedBy?: string;
    updatedAt?: string;
}

export interface CommonIdentityData {
    id: string;
    custom: boolean;
}

export interface TemplateFileContent extends CommonFileContent {
    roles: string[];
    tenants: string[];
    pages: PageItem[];
}

export interface TemplateData {
    roles: TemplateFileContent['roles'];
    tenants: TemplateFileContent['tenants'];
}

export interface Template extends Required<CommonFileContent>, CommonIdentityData {
    data: TemplateData & {
        pages: TemplateFileContent['pages'];
    };
}

export interface PageGroupFileContent extends CommonFileContent {
    name: string;
    icon: string;
    pages: string[];
}

export type PageGroup = Required<PageGroupFileContent>;

export interface PageFileContent extends CommonFileContent {
    name: string;
    icon?: string;
    layout: LayoutSection[];
}

export interface Page extends Required<CommonFileContent>, CommonIdentityData {
    data: {
        icon: PageFileContent['icon'];
        layout: PageFileContent['layout'];
    };
}

export interface TemplatesGenericReponse {
    status: 'ok';
}

export type GetTemplatesResponse = Template[];

export interface PostTemplatesRequestBody {
    id: string;
    data: TemplateData;
    pages: PageItem[];
}

export interface PutTemplatesRequestBody extends PostTemplatesRequestBody {
    oldId: string;
}

export type GetSelectTemplateResponse = string;

export interface GetSelectTemplateQueryParams {
    tenant: string;
}

export type GetPageGroupsResponse = PageGroup[];

export interface PostPageGroupsRequestBody {
    id: string;
    icon: string;
    name: string;
    pages: string[];
}

export type PutPageGroupsRequestBody = PostPageGroupsRequestBody;

export type GetPagesResponse = (Page | null)[];

export interface PostPagesRequestBody {
    id: string;
    name: string;
    layout: [];
}

export interface PutPagesRequestBody extends Omit<PostPagesRequestBody, 'layout'> {
    oldId: string;
    icon?: string;
    layout: LayoutSection[];
}

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
    name: string;
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

export interface CreateTemplateData {
    id: string;
    data: TemplateData;
    pages: PageItem[];
}

export interface UpdateTemplateData extends CreateTemplateData {
    oldId: string;
}

export interface PageGroupFileContent extends CommonFileContent {
    name: string;
    icon: string;
    pages: string[];
}

export type PageGroup = Required<PageGroupFileContent>;

export interface CreatePageGroupData {
    id: string;
    icon: string;
    name: string;
    pages: string[];
}

export type UpdatePageGroupData = CreatePageGroupData;

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

export interface CreatePageData {
    id: string;
    name: string;
    layout: [];
}

export interface UpdatePageData extends Omit<CreatePageData, 'layout'> {
    oldId: string;
    icon?: string;
    layout: LayoutSection[];
}

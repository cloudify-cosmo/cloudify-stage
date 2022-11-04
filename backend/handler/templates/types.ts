export interface WidgetDefinition {
    definition: string;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    configuration: Record<string, any>;
}

export interface WidgetsSection<WD = WidgetDefinition> {
    type: 'widgets';
    content: WD[];
}

export interface TabContent<WD = WidgetDefinition> {
    name: string;
    widgets: WD[];
    isDefault?: boolean;
}

export interface TabsSection<WD = WidgetDefinition> {
    type: 'tabs';
    content: TabContent<WD>[];
}

export type LayoutSectionType = 'tabs' | 'widgets';

export type LayoutSection<WD = WidgetDefinition> = WidgetsSection<WD> | TabsSection<WD>;

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

export interface PageGroupFileContent<I = string> extends CommonFileContent {
    name: string;
    icon: I;
    pages: string[];
}

export type PageGroup<I = string> = Required<PageGroupFileContent<I>>;

export interface CreatePageGroupData {
    id: string;
    icon: string;
    name: string;
    pages: string[];
}

export type UpdatePageGroupData = CreatePageGroupData;

export interface PageFileContent<WD = WidgetDefinition, I = string> extends CommonFileContent {
    name: string;
    icon?: I;
    layout: LayoutSection<WD>[];
}

export interface Page<WD = WidgetDefinition, I = string> extends Required<CommonFileContent>, CommonIdentityData {
    data: {
        icon?: PageFileContent<WD, I>['icon'];
        layout: PageFileContent<WD, I>['layout'];
    };
}

export interface CreatePageData {
    id: string;
    name: string;
    layout: [];
}

export interface UpdatePageData<WD = WidgetDefinition> extends Omit<CreatePageData, 'layout'> {
    oldId: string;
    icon?: string;
    layout: LayoutSection<WD>[];
}

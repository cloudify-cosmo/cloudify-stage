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

export interface PageGroupFileContent<Icon = string> extends CommonFileContent {
    name: string;
    icon: Icon;
    pages: string[];
}

export interface PageGroup<Icon = string> extends Required<PageGroupFileContent<Icon>>, CommonIdentityData {}

export interface CreatePageGroupData {
    id: string;
    icon: string;
    name: string;
    pages: string[];
}

export type UpdatePageGroupData = CreatePageGroupData;

export interface PageFileContent<WD = WidgetDefinition, Icon = string> extends CommonFileContent {
    name: string;
    icon?: Icon;
    layout: LayoutSection<WD>[];
}

export interface Page<WD = WidgetDefinition, Icon = string> extends Required<CommonFileContent>, CommonIdentityData {
    data: {
        icon?: PageFileContent<WD, Icon>['icon'];
        layout: PageFileContent<WD, Icon>['layout'];
    };
}

export interface CreatePageData {
    id: string;
    name: string;
    layout: LayoutSection[];
    icon?: string;
}

export interface UpdatePageData<WD = WidgetDefinition> extends Omit<CreatePageData, 'layout'> {
    oldId?: string;
    icon?: string;
    layout: LayoutSection<WD>[];
}

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

export interface PageFileDefinition {
    id: string;
    name: string;
    type: 'page';
    icon?: string;
    description?: string;
    layout: LayoutSection[];
}

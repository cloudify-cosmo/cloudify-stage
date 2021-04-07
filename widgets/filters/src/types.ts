export interface Filter {
    id: string;
    // eslint-disable-next-line camelcase
    created_by: string;
    // eslint-disable-next-line camelcase
    created_at: string;
    // eslint-disable-next-line camelcase
    labels_filter_rules: [];
    // eslint-disable-next-line camelcase
    attrs_filter_rules: [];
}

export interface FilterUsage {
    pageName: string;
    widgetName: string;
    username: string;
}

export interface FilterWidgetConfiguration {
    pageSize: number;
}

export type FilterWidget = Stage.Types.Widget<FilterWidgetConfiguration>;

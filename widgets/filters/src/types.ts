export interface Filter {
    id: string;
    // eslint-disable-next-line camelcase
    created_by: string;
    // eslint-disable-next-line camelcase
    created_at: string;
}

export interface FilterWidgetConfiguration {
    pageSize: number;
}

export type FilterWidget = Stage.Types.Widget<FilterWidgetConfiguration>;

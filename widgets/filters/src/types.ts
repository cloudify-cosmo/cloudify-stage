export interface Filter {
    id: string;
    // eslint-disable-next-line camelcase
    created_by: string;
    // eslint-disable-next-line camelcase
    created_at: string;
}

export interface WidgetConfiguration {
    pageSize: number;
}

export type Widget = Stage.Types.Widget<WidgetConfiguration>;

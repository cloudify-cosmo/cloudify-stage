import type { CommonAttributes } from './types';

export interface WidgetBackendsData {
    widgetId: string;
    serviceName: string;
    method: string;
    script: string;
}

export type WidgetBackendsAttributes = CommonAttributes & WidgetBackendsData;

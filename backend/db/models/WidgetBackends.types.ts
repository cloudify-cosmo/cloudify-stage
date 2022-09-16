import type { CommonAttributes } from './types';

export interface WidgetBackendsData {
    widgetId: string;
    serviceName: string;
    method: string;
    script: string;
}

export interface WidgetBackendsAttributes extends CommonAttributes, WidgetBackendsData {}

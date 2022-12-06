import Internal from './Internal';
import consts from './consts';
import type { ManagerData } from '../reducers/managerReducer';

export default class WidgetBackend extends Internal {
    constructor(private widgetId: string, data: ManagerData) {
        super(data);
    }

    buildHeaders(): ReturnType<Internal['buildHeaders']> {
        const headers = super.buildHeaders();
        headers[consts.WIDGET_ID_HEADER] = this.widgetId;
        return headers;
    }

    buildActualUrl(path: string, data: Record<string, any>): ReturnType<Internal['buildActualUrl']> {
        return super.buildActualUrl(`/wb/${path}`, data);
    }
}

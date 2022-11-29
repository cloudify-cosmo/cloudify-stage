import Internal from './Internal';
import consts from './consts';
import type { ManagerData } from '../reducers/managerReducer';

export default class WidgetBackend extends Internal {
    widgetId: string;

    constructor(widgetId: string, data: ManagerData) {
        super(data);
        this.widgetId = widgetId;
    }

    buildHeaders() {
        const headers = super.buildHeaders() as Record<string, unknown>;
        headers[consts.WIDGET_ID_HEADER] = this.widgetId;
        return headers;
    }

    buildActualUrl: Internal['buildActualUrl'] = (path, data) => {
        return super.buildActualUrl(`/wb/${path}`, data);
    };
}

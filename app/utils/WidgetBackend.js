/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import Internal from './Internal';
import consts from './consts';

export default class WidgetBackend extends Internal {
    constructor(widgetId, data) {
        super(data);
        this.widgetId = widgetId;
    }

    buildHeaders() {
        const headers = super.buildHeaders();
        headers[consts.WIDGET_ID_HEADER] = this.widgetId;
        return headers;
    }

    buildActualUrl(path, data) {
        return super.buildActualUrl(`/wb/${path}`, data);
    }
}

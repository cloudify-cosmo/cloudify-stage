/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import Internal from './Internal';
import consts from '../utils/consts';

export default class WidgetBackend extends Internal {

    constructor(widgetId, data) {
        super(data);
        this.widgetId = widgetId;
    }

    _buildHeaders() {
        var headers = super._buildHeaders();
        headers[consts.WIDGET_ID_HEADER] = this.widgetId;
        return headers;
    }
    _buildActualUrl(path, data) {
        return super._buildActualUrl(`/wb/${path}`, data);
    }
}

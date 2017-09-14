/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import Internal from './Internal';

export default class WidgetBackend extends Internal {

    constructor(widget, data) {
        super(data);
        this.widget = widget;
    }

    _buildHeaders() {
        var headers = super._buildHeaders();
        headers.widgetName = this.widget.id;
        return headers;
    }
    _buildActualUrl(path, data) {
        return super._buildActualUrl(`/wb/${path}`, data);
    }
}

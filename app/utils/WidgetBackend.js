/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import Internal from './Internal';

export default class WidgetBackend extends Internal {

    constructor(data) {
        super(data);
    }

    _buildActualUrl(path, data) {
        return super._buildActualUrl(`/wb/${path}`, data);
    }
}

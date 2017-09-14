/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import Internal from './Internal';
import Consts from './consts';
import Cookies from 'js-cookie';

export default class WidgetBackend extends Internal {

    constructor(context, data) {
        super(data);
        this.context = context;
    }

    _buildHeaders() {
        if (!this._data) {
            return {};
        }

        var headers = {
            tenant: _.get(this._data,'tenants.selected', Consts.DEFAULT_TENANT),
            widgetName: this.context.id
        };

        //read token from cookies
        var token = Cookies.get('XSRF-TOKEN');
        if (token) {
            headers['Authentication-Token'] = token;
        }

        return headers;
    }
    _buildActualUrl(path, data) {
        return super._buildActualUrl(`/wb/${path}`, data);
    }
}

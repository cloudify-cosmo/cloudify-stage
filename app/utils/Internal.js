/**
 * Created by pposel on 09/02/2017.
 */

import External from './External';
import Consts from './consts';

export default class Internal extends External {

    constructor(data) {
        super(data);
    }

    _buildHeaders() {
        if (!this._data) {
            return {};
        }

        var headers = {tenant: _.get(this._data,'tenants.selected', Consts.DEFAULT_TENANT)};

        var auth = this._data.auth || {};
        if (auth.isSecured && auth.token) {
            headers['Authentication-Token'] = auth.token;
        }

        return headers;
    }


}

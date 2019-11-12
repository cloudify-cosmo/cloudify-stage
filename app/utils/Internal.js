/**
 * Created by pposel on 09/02/2017.
 */

import Cookies from 'js-cookie';
import External from './External';
import Consts from './consts';
import StageUtils from './stageUtils';

export default class Internal extends External {
    constructor(data) {
        super(data);
    }

    _buildHeaders() {
        if (!this._data) {
            return {};
        }

        const headers = { tenant: _.get(this._data, 'tenants.selected', Consts.DEFAULT_TENANT) };

        // read token from cookies
        const token = Cookies.get(Consts.TOKEN_COOKIE_NAME);
        if (token) {
            headers['Authentication-Token'] = token;
        }

        return headers;
    }

    _buildActualUrl(path, data) {
        return super._buildActualUrl(StageUtils.Url.url(path), data);
    }

    _isUnauthorized(response) {
        return response.status === 401;
    }

    _isLicenseError(response, body) {
        return (
            response.status === 400 &&
            (body.error_code === Consts.NO_LICENSE_ERROR_CODE || body.error_code === Consts.EXPIRED_LICENSE_ERROR_CODE)
        );
    }
}

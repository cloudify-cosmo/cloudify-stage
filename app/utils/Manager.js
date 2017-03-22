/**
 * Created by kinneretzin on 22/11/2016.
 */

import 'isomorphic-fetch';

import log from 'loglevel';
let logger = log.getLogger("Manager");

import Consts from './consts';
import External from './External';

export default class Manager extends External {

    constructor(managerData) {
        super(managerData);
    }

    getSelectedTenant() {
        return _.get(this,'_data.tenants.selected', null);
    }

    getIp() {
        return _.get(this,'_data.ip', null);
    }

    getManagerUrl(url,data) {
        return this._buildActualUrl(url,data);
    }

    _buildActualUrl(url,data) {
        let index = url.indexOf('[manager]');
        if (index >= 0) {
            let managerUrl = url.substring(index + '[manager]'.length);
            var urlInServer = `${this._data.version?'/api/'+this._data.version:''}${managerUrl}`;
            let su = encodeURIComponent(`http://${this._data.ip}${urlInServer}`);

            url = url.substring(0, index);

            data = Object.assign({}, data, {su});
            var queryString =  (url.indexOf("?") > 0?(_.endsWith(url, "?")?"":"&"):"?") + $.param(data, true);

            return url + queryString;
        } else {
            var queryString =  data ? (url.indexOf("?") > 0?"&":"?") + $.param(data, true) : '';
            var urlInServer = `${this._data.version?'/api/'+this._data.version:''}${url}${queryString}`;

            let su = encodeURIComponent(`http://${this._data.ip}${urlInServer}`);
            return `/sp/?su=${su}`;
        }
    }

    _buildSecurityHeader(){
        var auth = this._data.auth;
        return (auth.isSecured && auth.token ? {"Authentication-Token": auth.token} : undefined);
    }

    _buildHeaders() {
        var securityHeaders = this._buildSecurityHeader();

        var headers = Object.assign({
            tenant: _.get(this._data,'tenants.selected',Consts.DEFAULT_TENANT)
        },securityHeaders);

        return headers;
    }

}

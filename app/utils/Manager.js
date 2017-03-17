/**
 * Created by kinneretzin on 22/11/2016.
 */

import 'isomorphic-fetch';
import {saveAs} from 'file-saver';

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

    doUpload(url,params,files,method) {
        var actualUrl = this._buildActualUrl(url,params);
        var securityHeaders = this._buildSecurityHeader();

        logger.debug('Uploading file for url: '+url);

        return new Promise((resolve,reject)=>{
            // Call upload method
            var xhr = new XMLHttpRequest();
            (xhr.upload || xhr).addEventListener('progress', function(e) {
                var done = e.position || e.loaded;
                var total = e.totalSize || e.total;
                logger.debug('xhr progress: ' + Math.round(done/total*100) + '%');
            });
            xhr.addEventListener("error", function(e){
                logger.error('xhr upload error', e, this.responseText);

                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        reject({message: response.message});
                    } else {
                        reject({message: e.message});
                    }

                } catch (err) {
                    logger.error('Cannot parse upload response',err);
                    reject({message: err.message});
                }
            });
            xhr.addEventListener('load', function(e) {
                logger.debug('xhr upload complete', e, this.responseText);

                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        reject({message: response.message});
                        return;
                    }

                } catch (err) {
                    let errorMessage = `Cannot parse upload response: ${err}`;
                    logger.error(errorMessage);
                    reject({message: errorMessage});
                }
                resolve();
            });

            xhr.open(method || 'put',actualUrl);
            if (securityHeaders) {
                xhr.setRequestHeader("Authentication-Token", securityHeaders["Authentication-Token"]);
            }

            var selectedTenant = _.get(this._data,'tenants.selected',Consts.DEFAULT_TENANT);
            if (selectedTenant) {
                xhr.setRequestHeader("tenant",selectedTenant);
            }

            var formData = new FormData();

            if (files) {
                if (_.isArray(files)) {
                    _.forEach(files, function (value, key) {
                        formData.append(key, value);
                    });
                } else {
                    formData = files; // Single file, simply pass it
                }
            }

            xhr.send(formData);
        });
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
            "Content-Type": "application/json",
            tenant: _.get(this._data,'tenants.selected',Consts.DEFAULT_TENANT)
        },securityHeaders);

        return headers;
    }

}

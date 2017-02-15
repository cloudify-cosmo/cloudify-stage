/**
 * Created by kinneretzin on 22/11/2016.
 */

import 'isomorphic-fetch';
import {saveAs} from 'file-saver';

import log from 'loglevel';
let logger = log.getLogger("Manager");

import Consts from './consts';

export default class Manager {

    constructor(managerData) {
        this._data = managerData;
    }

    getSelectedTenant() {
        return _.get(this,'_data.tenants.selected', null);
    }

    doGet(url,params) {
        return this._ajaxCall(url,'get',params) ;
    }

    doPost(url,params,data){
        return this._ajaxCall(url,'post',params,data) ;
    }

    doDelete(url,params,data){
        return this._ajaxCall(url,'delete',params,data) ;
    }

    doPut(url,params,data) {
        return this._ajaxCall(url,'put',params,data) ;
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

    doDownload(url,fileName) {
        return this._ajaxCall(url,'get',null,null,fileName);
    }

    _ajaxCall(url,method,params,data,fileName) {
        var actualUrl = this._buildActualUrl(url,params);
        var securityHeaders = this._buildSecurityHeader();

        logger.debug(method+' data. URL: '+url);

        var headers = Object.assign({
            "Content-Type": "application/json",
            tenant: _.get(this._data,'tenants.selected',Consts.DEFAULT_TENANT)
        },securityHeaders);

        var options = {
            method: method,
            headers: headers
        };

        if (data) {
            try {
                options.body = JSON.stringify(data)
            } catch (e) {
                logger.error('Error stringifying data. URL: '+actualUrl+' data ',data);
            }
        }

        if (fileName) {
            return fetch(actualUrl,options)
                .then(this._checkStatus)
                .then(response => response.blob())
                .then(blob => saveAs(blob, fileName));
        } else {
            return fetch(actualUrl,options)
                .then(this._checkStatus)
                .then(response => response.json());
        }
    }

    _checkStatus(response) {
        if (response.ok) {
            return response;
        }

        let isJsonContentType = (response) => _.isEqual(_.toLower(response.headers.get('content-type')), 'application/json');
        if (isJsonContentType(response)) {
            return response.json()
                .then(resJson => Promise.reject({message: resJson.message || response.statusText}))
        } else {
            return Promise.reject({message: response.statusText});
        }
    }

    _buildActualUrl(url,data) {
        var queryString =  data ? (url.indexOf("?") > 0?"&":"?") + $.param(data, true) : '';
        var urlInServer = `${this._data.version?'/api/'+this._data.version:''}${url}${queryString}`;

        let su = encodeURIComponent(`http://${this._data.ip}${urlInServer}`);
        return `/sp/?su=${su}`;
    }

    getManagerUrl(url,data) {
        return this._buildActualUrl(url,data);
    }

    _buildSecurityHeader(){
        var auth = this._data.auth;
        return (auth.isSecured && auth.token ? {"Authentication-Token": auth.token} : undefined);
    }
}

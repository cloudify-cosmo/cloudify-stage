/**
 * Created by kinneretzin on 22/11/2016.
 */

import fetch from 'isomorphic-fetch';
import StageUtils from './stageUtils';

import log from 'loglevel';

let logger = log.getLogger("Manager");

export default class Manager {

    constructor(managerData) {
        this._data = managerData;
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

    doUpload(url,params,file,method) {
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
                        reject({error: response.message});
                    } else {
                        reject({error: e.message});
                    }

                } catch (err) {
                    logger.error('Cannot parse upload response',err);
                    reject({error: e.message});
                }
            });
            xhr.addEventListener('load', function(e) {
                logger.debug('xhr upload complete', e, this.responseText);

                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        reject({error: response.message});
                        return;
                    }

                } catch (err) {
                    logger.error('Cannot parse upload response',err);
                }
                resolve();
            });

            xhr.open(method || 'put',actualUrl);
            if (securityHeaders) {
                xhr.setRequestHeader("Authentication-Token", securityHeaders["Authentication-Token"]);
            }
            var selectedTenant = _.get(this._data,'tenants.selected',null);
            if (selectedTenant) {
                xhr.setRequestHeader("tenant","selectedTenant");
            }

            xhr.send(file);
        });
    }

    _ajaxCall(url,method,params,data) {
        var actualUrl = this._buildActualUrl(url,params);
        var securityHeaders = this._buildSecurityHeader();

        logger.debug(method+' data. URL: '+url);

        var headers = Object.assign({
            "Content-Type": "application/json"
        },securityHeaders);
        var selectedTenant = _.get(this._data,'tenants.selected',null);
        if (selectedTenant) {
            headers.tenant = selectedTenant;
        }

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
        return fetch(actualUrl,options)
            .then(this._checkStatus)
            .then(response=>response.json());
    }


    _checkStatus(response) {
        if (response.ok) {
            return response;
        }

        return response.json().then((resJson)=>{
            if (resJson.message) {
                return Promise.reject({error: resJson.message});
            }
            return Promise.reject({error:response.statusText});
        });
    }

    _buildActualUrl(url,data) {
        var queryString = data ? '?'+$.param(data) : '';
        var urlInServer = `${this._data.version?'/api/'+this._data.version:''}${url}${queryString}`;

        let su = encodeURIComponent(`http://${this._data.ip}${urlInServer}`);
        return `http://${window.location.hostname}:8088/sp/?su=${su}`;
    }

    getManagerUrl(url,data) {
        return this._buildActualUrl(url,data);
    }

    _buildSecurityHeader(){
        var auth = this._data.auth;
        return (auth.isSecured && auth.token ? {"Authentication-Token": auth.token} : undefined);
    }
}

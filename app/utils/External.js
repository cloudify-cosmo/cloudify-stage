/**
 * Created by pposel on 09/02/2017.
 */

import 'isomorphic-fetch';
import {saveAs} from 'file-saver';
import MessageResolver from "./MessageResolver";

import log from 'loglevel';
let logger = log.getLogger("External");

export default class External {

    constructor(data) {
        this._data = data;
    }

    doGet(url,params,parseResponse,headers) {
        return this._ajaxCall(url,'get',params,null,parseResponse,headers) ;
    }

    doPost(url,params,data,parseResponse,headers){
        return this._ajaxCall(url,'post',params,data,parseResponse,headers) ;
    }

    doDelete(url,params,data,parseResponse,headers){
        return this._ajaxCall(url,'delete',params,data,parseResponse,headers) ;
    }

    doPut(url,params,data,parseResponse,headers) {
        return this._ajaxCall(url,'put',params,data,parseResponse,headers) ;
    }

    doPatch(url,params,data,parseResponse) {
        return this._ajaxCall(url,'PATCH',params,data,parseResponse) ;
    }

    doDownload(url,fileName) {
        return this._ajaxCall(url,'get',null,null,null,null,fileName);
    }

    doUpload(url,params,files,method) {
        var actualUrl = this._buildActualUrl(url,params);

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

            var headers = this._buildHeaders();
            _.forIn(headers, function(value, key) {
                xhr.setRequestHeader(key, value);
            });

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

    _ajaxCall(url,method,params,data,parseResponse=true,userHeaders={},fileName=null) {
        var actualUrl = this._buildActualUrl(url, params);
        logger.debug(method + ' data. URL: ' + url);

        var headers = Object.assign(this._buildHeaders(), this._contentType(),userHeaders);

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
            return fetch(actualUrl, options)
                .then(this._checkStatus)
                .then(response => response.blob())
                .then(blob => saveAs(blob, fileName));
        } else {
            return fetch(actualUrl, options)
                .then(this._checkStatus)
                .then(response => {
                    if (parseResponse) {              
                      var contentType = _.toLower(response.headers.get('content-type'));
                      return contentType.indexOf('application/json') >= 0 ? response.json() : response.text();
                    } else {
                      return response;
                    }
                });
        }
    }

    _checkStatus(response) {
        if (response.ok) {
            return response;
        }

        // Ignoreing content type and trying to parse the json response. Some errors do send json body but not the right content type (like 400 bad request)
        return response.text()
            .then(resText=>{
                try {
                    var resJson = JSON.parse(resText);

                    var message = MessageResolver.resolve(resJson.message);

                    return Promise.reject({message: message || response.statusText});
                } catch (e) {
                    logger.error(e);
                    return Promise.reject({message: response.statusText});
                }
            });
    }

    _buildActualUrl(url, data) {
        var queryString =  data ? (url.indexOf("?") > 0?"&":"?") + $.param(data, true) : '';
        return `${url}${queryString}`;
    }

    _contentType() {
        return {"content-type": "application/json"};
    }

    _buildHeaders() {
        var headers = {};
        if (this._data && this._data.basicAuth) {
            headers = Object.assign(headers, {"Authorization": `Basic ${this._data.basicAuth}`});
        };

        return headers;
    }
}

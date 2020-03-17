/**
 * Created by pposel on 09/02/2017.
 */

import 'isomorphic-fetch';
import { saveAs } from 'file-saver';
import log from 'loglevel';
import StageUtils from './stageUtils';
import Interceptor from './Interceptor';
import { LICENSE_ERR, UNAUTHORIZED_ERR } from './ErrorCodes';

const logger = log.getLogger('External');

/*
Text form of class hierarchy diagram to be used at: https://yuml.me/diagram/nofunky/class/draw

[External|doDelete();doDownload();doGet();doPatch();doPost();doPut();doUpload()]<-[Internal|]
[Internal]<-[WidgetBackend|]
[Internal]<-[Manager|doGetFull();getCurrentUsername();getCurrentUserRole();getIp();getManagerUrl();getSelectedTenant();getSystemRoles()]

*/

export default class External {
    constructor(data) {
        this._data = data;
    }

    doGet(url, params, parseResponse, headers) {
        return this._ajaxCall(url, 'get', params, null, parseResponse, headers);
    }

    doPost(url, params, data, parseResponse, headers, withCredentials) {
        return this._ajaxCall(url, 'post', params, data, parseResponse, headers, null, withCredentials);
    }

    doDelete(url, params, data, parseResponse, headers) {
        return this._ajaxCall(url, 'delete', params, data, parseResponse, headers);
    }

    doPut(url, params, data, parseResponse, headers) {
        return this._ajaxCall(url, 'put', params, data, parseResponse, headers);
    }

    doPatch(url, params, data, parseResponse, headers) {
        return this._ajaxCall(url, 'PATCH', params, data, parseResponse, headers);
    }

    doDownload(url, fileName) {
        return this._ajaxCall(url, 'get', null, null, null, null, fileName);
    }

    isReachable(url) {
        return fetch(url)
            .then(response => {
                return response.status === 200;
            })
            .catch(() => {
                return false;
            });
    }

    doUpload(url, params, files, method, parseResponse = true, compressFile = false) {
        const actualUrl = this._buildActualUrl(url, params);

        logger.debug(`Uploading file for url: ${url}`);

        return new Promise((resolve, reject) => {
            // Call upload method
            const xhr = new XMLHttpRequest();
            (xhr.upload || xhr).addEventListener('progress', function(e) {
                const done = e.position || e.loaded;
                const total = e.totalSize || e.total;
                logger.debug(`xhr progress: ${Math.round((done / total) * 100)}%`);
            });
            xhr.addEventListener('error', function(e) {
                logger.error('xhr upload error', e, xhr.responseText);

                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        reject({ message: StageUtils.resolveMessage(response.message) });
                    } else {
                        reject({ message: e.message });
                    }
                } catch (err) {
                    logger.error('Cannot parse upload error', err, xhr.responseText);
                    reject({ message: xhr.responseText || err.message });
                }
            });
            xhr.addEventListener('load', function(e) {
                logger.debug('xhr upload complete', e, xhr.responseText);

                const isSuccess = xhr.status >= 200 && xhr.status < 300;
                try {
                    var response = parseResponse || !isSuccess ? JSON.parse(xhr.responseText) : xhr.responseText;
                    if (response.message) {
                        logger.error('xhr upload error', e, xhr.responseText);

                        reject({ message: StageUtils.resolveMessage(response.message) });
                        return;
                    }
                } catch (err) {
                    logger.error('Cannot parse upload response', err, xhr.responseText);
                    reject({ message: xhr.responseText || err.message });
                }

                resolve(response);
            });

            xhr.open(method || 'put', actualUrl);

            const headers = this._buildHeaders();
            _.forIn(headers, function(value, key) {
                xhr.setRequestHeader(key, value);
            });

            let formData = new FormData();

            if (files) {
                if (files instanceof File) {
                    // Single file
                    if (compressFile) {
                        const JSZip = require('jszip');
                        const reader = new FileReader();
                        const zip = new JSZip();

                        reader.onload = function(event) {
                            const fileContent = event.target.result;
                            zip.folder(files.name).file(files.name, fileContent);
                            zip.generateAsync({
                                type: 'blob',
                                compression: 'DEFLATE',
                                compressionOptions: {
                                    level: 6
                                }
                            }).then(
                                function success(blob) {
                                    formData = new File([blob], `${files.name}.zip`);
                                    xhr.send(formData);
                                },
                                function error(error) {
                                    const errorMessage = `Cannot compress file. Error: ${error}`;
                                    logger.error(errorMessage);
                                    reject({ message: errorMessage });
                                }
                            );
                        };

                        reader.onerror = function(event) {
                            const errorMessage = `Cannot read file. Error code: ${event.target.error.code}`;
                            logger.error(errorMessage);
                            reject({ message: errorMessage });
                        };

                        reader.readAsText(files);
                    } else {
                        formData = files;
                        xhr.send(formData);
                    }
                } else {
                    _.forEach(files, function(value, key) {
                        formData.append(key, value);
                    });
                    xhr.send(formData);
                }
            } else {
                xhr.send(formData);
            }
        });
    }

    _ajaxCall(url, method, params, data, parseResponse = true, userHeaders = {}, fileName = null, withCredentials) {
        const actualUrl = this._buildActualUrl(url, params);
        logger.debug(`${method} data. URL: ${url}`);

        const headers = Object.assign(this._buildHeaders(), this._contentType(), userHeaders);

        const options = {
            method,
            headers
        };

        if (data) {
            try {
                if (_.isString(data)) {
                    options.body = data;
                    _.merge(options.headers, this._contentType('text/plain'));
                } else {
                    options.body = JSON.stringify(data);
                }
            } catch (e) {
                logger.error(`Error stringifying data. URL: ${actualUrl} data `, data);
            }
        }

        // this allows the server to set a cookie
        if (withCredentials) {
            options.credentials = 'include';
        }

        if (fileName) {
            return fetch(actualUrl, options)
                .then(this._checkStatus.bind(this))
                .then(response => response.blob())
                .then(blob => saveAs(blob, fileName));
        }
        return fetch(actualUrl, options)
            .then(this._checkStatus.bind(this))
            .then(response => {
                if (parseResponse) {
                    const contentType = _.toLower(response.headers.get('content-type'));
                    return contentType.indexOf('application/json') >= 0 ? response.json() : response.text();
                }
                return response;
            });
    }

    _isUnauthorized(response) {
        return false;
    }

    _isLicenseError(response, body) {
        return false;
    }

    _checkStatus(response) {
        if (response.ok) {
            return response;
        }

        if (this._isUnauthorized(response)) {
            const interceptor = Interceptor.getInterceptor();
            interceptor.handle401();
            return Promise.reject(UNAUTHORIZED_ERR);
        }

        // Ignoring content type and trying to parse the json response.
        // Some errors do send json body but not the right content type (like 400 bad request)
        return response.text().then(resText => {
            try {
                const resJson = JSON.parse(resText);
                const message = StageUtils.resolveMessage(resJson.message);

                if (this._isLicenseError(response, resJson)) {
                    const interceptor = Interceptor.getInterceptor();
                    interceptor.handleLicenseError(resJson.error_code);
                    return Promise.reject(LICENSE_ERR);
                }
                return Promise.reject({
                    message: message || response.statusText,
                    status: response.status,
                    code: resJson.error_code
                });
            } catch (e) {
                logger.error(e);
                return Promise.reject({ message: response.statusText, status: response.status });
            }
        });
    }

    _buildActualUrl(url, data) {
        const queryString = data ? (url.indexOf('?') > 0 ? '&' : '?') + $.param(data, true) : '';
        return `${url}${queryString}`;
    }

    _contentType(type) {
        return { 'content-type': type || 'application/json' };
    }

    _buildHeaders() {
        if (!this._data) {
            return {};
        }

        const headers = {};
        if (this._data.basicAuth) {
            headers.Authorization = `Basic ${this._data.basicAuth}`;
        }

        return headers;
    }
}

/**
 * Created by jakubniezgoda on 18/07/2017.
 */

const _ = require('lodash');
const fs = require('fs-extra');
const config = require('../config').get();
const logger = require('./LoggerHandler').getLogger('ManagerHandler');
const RequestHandler = require('./RequestHandler');

module.exports = (() => {
    let caFile = null;
    try {
        caFile = _.get(config, 'app.ssl.ca') ? fs.readFileSync(config.app.ssl.ca) : null;
    } catch (e) {
        logger.error('Could not setup ssl ca, error loading file.', e);
        process.exit(1);
    }

    function getManagerUrl() {
        return config.managerUrl;
    }

    function getApiUrl() {
        return `${config.managerUrl}/api/${config.manager.apiVersion}`;
    }

    function updateOptions(options, method, timeout, headers, data) {
        if (caFile) {
            logger.debug('Adding CA file to Agent Options');
            options.agentOptions = {
                ca: caFile
            };
        }

        options.timeout = timeout || config.app.proxy.timeouts[method.toLowerCase()];

        if (headers) {
            options.headers = _.omit(headers, 'host');
        }

        if (data) {
            options.json = data;
            try {
                const strData = JSON.stringify(data);
                options.headers = { ...options.headers, 'content-length': Buffer.byteLength(strData) };
            } catch (error) {
                logger.error('Invalid payload data. Error:', error);
            }
        }
    }

    function request(method, url, headers, data, onSuccess, onError, timeout) {
        const requestUrl = this.getApiUrl() + (_.startsWith(url, '/') ? url : `/${url}`);
        const requestOptions = {};
        this.updateOptions(requestOptions, method, timeout, headers, data);

        logger.debug(`Preparing ${method} request to manager: ${requestUrl}`);
        return RequestHandler.request(method, requestUrl, requestOptions, onSuccess, onError);
    }

    // the request assumes the response is JSON
    function jsonRequest(method, url, headers, data, timeout) {
        return new Promise((resolve, reject) => {
            this.request(
                method,
                url,
                headers,
                data,
                res => {
                    const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

                    RequestHandler.getResponseJson(res)
                        .then(json => (isSuccess ? resolve(json) : reject(json)))
                        .catch(e =>
                            isSuccess
                                ? reject(`response data could not be parsed to JSON: ${e}`)
                                : reject(res.statusMessage)
                        );
                },
                err => reject(err),
                timeout
            );
        });
    }

    return {
        getApiUrl,
        getManagerUrl,
        updateOptions,
        request,
        jsonRequest
    };
})();

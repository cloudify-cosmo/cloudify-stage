/**
 * Created by kinneretzin on 05/12/2016.
 */

const express = require('express');
const request = require('request');
const _ = require('lodash');
const config = require('../config').get();

const router = express.Router();
const AuthHandler = require('../handler/AuthHandler');
const ManagerHandler = require('../handler/ManagerHandler');

const logger = require('../handler/LoggerHandler').getLogger('ServerProxy');

function _errorHandler(url, res, err) {
    const isTimeout = err.code === 'ETIMEDOUT';
    const isConnTimeout = err.connect;

    const urlMsg = `Requested URL: ${url}.`;
    const exMsg = isConnTimeout
        ? 'Manager is not available'
        : isTimeout
        ? 'Request timed out'
        : `An unexpected error has occurred: ${err.message}`;

    logger.error(`${urlMsg} ${exMsg}`, err);
    res.status(500).send({ message: `${urlMsg} ${exMsg}` });
}

function buildManagerUrl(req, res, next) {
    const serverUrl = req.query.su;
    if (serverUrl) {
        req.su = ManagerHandler.getApiUrl() + serverUrl;
        logger.debug(`Proxying ${req.method} request to server with url: ${req.su}`);
        next();
    } else {
        next('no server url passed');
    }
}

async function proxyRequest(req, res, next) {
    const options = {};
    let timeout;

    // if is a blueprint upload request = set higher timeout
    if (!!req.query.su.match(/\/blueprints/) && req.method === 'PUT') {
        timeout = config.app.proxy.timeouts.blueprintUpload;
    }
    // if is a maintenance status fetch then update RBAC cache if empty
    else if (!!req.query.su.match(/^\/maintenance$/) && req.method === 'GET' && !AuthHandler.isRbacInCache()) {
        await AuthHandler.getAndCacheConfig(req.headers['authentication-token']);
    }

    ManagerHandler.updateOptions(options, req.method, timeout);

    req.pipe(
        request(req.su, options).on('error', function(err) {
            _errorHandler(req.su, res, err);
        })
    ).pipe(res);
}

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - is the manager path
 */
router.all('/', buildManagerUrl, proxyRequest);

module.exports = router;

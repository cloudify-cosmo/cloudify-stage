/**
 * Created by kinneretzin on 05/12/2016.
 */

const express = require('express');
const request = require('request');

const router = express.Router();
const AuthHandler = require('../handler/AuthHandler');
const ManagerHandler = require('../handler/ManagerHandler');

const logger = require('../handler/LoggerHandler').getLogger('ServerProxy');

function errorHandler(url, res, err) {
    const isTimeout = err.code === 'ETIMEDOUT';
    const isConnTimeout = err.connect;

    const urlMsg = `Requested URL: ${url}.`;
    let exMsg;
    if (isConnTimeout) {
        exMsg = 'Manager is not available';
    } else if (isTimeout) {
        exMsg = 'Request timed out';
    } else {
        exMsg = `An unexpected error has occurred: ${err.message}`;
    }

    logger.error(`${urlMsg} ${exMsg}`, err);
    if (!res.headersSent) {
        res.status(500).send({ message: `${urlMsg} ${exMsg}` });
    }
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

async function proxyRequest(req, res) {
    const options = {};

    // if is a maintenance status fetch then update RBAC cache if empty
    if (!!req.query.su.match(/^\/maintenance$/) && req.method === 'GET' && !AuthHandler.isRbacInCache()) {
        await AuthHandler.getAndCacheConfig(req.headers['authentication-token']);
    }

    ManagerHandler.updateOptions(options, req.method);

    req.pipe(
        request(req.su, options).on('error', err => {
            errorHandler(req.su, res, err);
        })
    ).pipe(res);
}

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - is the manager path
 */
router.all('/', buildManagerUrl, proxyRequest);

module.exports = router;

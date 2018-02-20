'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */


var express = require('express');
var request = require('request');
var config = require('../config').get();
var router = express.Router();
var ManagerHandler = require('../handler/ManagerHandler');

var logger = require('log4js').getLogger('ServerProxy');
var fs = require('fs');

function _errorHandler(res,err) {
    var isTimeout = err.code === 'ETIMEDOUT';
    var isConnTimeout = err.connect;

    var exMsg = isConnTimeout ?
                'Manager is not available' :
                ( isTimeout ? 'Request timed out' : 'An unexpected error has occurred: ' + err.message);

    logger.error(exMsg, err);
    res.status(500).send({message: exMsg});
}

function buildManagerUrl(req,res,next) {
    var serverUrl = req.query.su;
    if (serverUrl) {
        req.su = ManagerHandler.getUrl() + serverUrl;
        logger.debug('Proxying '+req.method+' request to server with url: '+req.su);
        next();
    } else {
        next('no server url passed');
    }
}

function proxyRequest(req,res,next) {
    var options = {};
    var timeout;

    //if is a blueprint upload request = set higher timeout
    if(!!req.query.su.match(/\/blueprints/) &&  req.method === 'PUT'){
        timeout = config.app.proxy.timeouts.blueprintUpload;
    }

    ManagerHandler.updateOptions(options, req.method, timeout);

    req.pipe(request(
            req.su,
            options
        )
        .on('error',function(err){_errorHandler(res,err)}))
        .pipe(res);
}

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - is the manager path
 */
router.all('/',buildManagerUrl,proxyRequest);

module.exports = router;

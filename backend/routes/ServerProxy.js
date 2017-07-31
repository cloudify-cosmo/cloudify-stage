'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */


var express = require('express');
var request = require('request');
var config = require('../config').get();
var router = express.Router();

var logger = require('log4js').getLogger('ServerProxy');
var fs = require('fs');
var _ = require('lodash');

var caFile =  null;

try {
    caFile = _.get(config,'app.ssl.ca') ? fs.readFileSync(config.app.ssl.ca) : null;
} catch (e) {
    console.error('Could not setup ssl ca, error loading file.', e);
    process.exit(1);
}


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
        req.su = config.managerUrl + serverUrl;
        logger.debug('Proxying '+req.method+' request to server with url: '+req.su);
        next();
    } else {
        next('no server url passed');
    }
}

function proxyRequest(req,res,next) {
    var options = {
        timeout: config.app.proxy.timeouts[req.method.toLowerCase()]
    };

    if (caFile) {
        options.agentOptions = {
            ca: caFile
        };
    }

    req.pipe(request[req.method.toLowerCase()](
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

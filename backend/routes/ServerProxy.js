'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */


var express = require('express');
var request = require('request');
var config = require('../config').get();

var router = express.Router();

var logger = require('log4js').getLogger('ServerProxy');

function _errorHandler(res,err) {
    var isTimeout = err.code === 'ETIMEDOUT';
    var isConnTimeout = err.connect;

    logger.error(isConnTimeout ? 'Manager is not available' : ( isTimeout ? 'Request timed out' : err.message), err);
    if (isConnTimeout) {
        res.status(500).send({message: isConnTimeout ? 'Manager is not available' : ( isTimeout ? 'Request timed out' : err.message)});
    } else { // If its not a connection timeout, then headers might have already been sent, so cannot send body. Just set the status code and end the request.
        res.status(500).end();
    }
}

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/',function (req, res,next) {


    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying get request to server with url: '+serverUrl);
        req.pipe(request.get(serverUrl,{timeout: config.app.proxy.timeouts.get}).on('error',function(err){_errorHandler(res,err)})).pipe(res);
    } else {
        next('no server url passed');
    }
});

router.put('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying put request to server with url: '+serverUrl);

        req.pipe(request.put(serverUrl,{timeout: config.app.proxy.timeouts.put}).on('error',function(err){_errorHandler(res,err)})).pipe(res);
    } else {
        next('no server url passed');
    }

});

router.delete('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying delete request to server with url: '+serverUrl);

        req.pipe(request.delete(serverUrl,{timeout: config.app.proxy.timeouts.delete}).on('error',function(err){_errorHandler(res,err)})).pipe(res);
    } else {
        next('no server url passed');
    }

});
router.post('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying post request to server with url: '+serverUrl);

        req.pipe(request.post(serverUrl,{timeout: config.app.proxy.timeouts.post}).on('error',function(err){_errorHandler(res,err)})).pipe(res);
    } else {
        next('no server url passed');
    }

});
router.patch('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying patch request to server with url: '+serverUrl);

        req.pipe(request.patch(serverUrl,{timeout: config.app.proxy.timeouts.post}).on('error',function(err){_errorHandler(res,err)})).pipe(res);
    } else {
        next('no server url passed');
    }

});

module.exports = router;

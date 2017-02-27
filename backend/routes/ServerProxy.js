'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */


var express = require('express');
var request = require('request');

var router = express.Router();

var logger = require('log4js').getLogger('ServerProxy');

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/',function (req, res,next) {


    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying get request to server with url: '+serverUrl);
        req.pipe(request.get(serverUrl))
            .on('error', function(err) {
                logger.error('Error has occured ',err);
                next(err);
            }).pipe(res);
    } else {
        res.status(404).send({message: 'no server url passed'});
    }
});

router.put('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying put request to server with url: '+serverUrl);

        req.pipe(request.put(serverUrl))
            .on('error', function(err) {
                logger.error('Error has occured ',err);
                next(err);
            }).pipe(res);
    } else {
        res.status(404).send({message: 'no server url passed'});
    }

});

router.delete('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying delete request to server with url: '+serverUrl);

        req.pipe(request.delete(serverUrl))
            .on('error', function(err) {
                logger.error('Error has occured ',err);
                next(err);
            }).pipe(res);
    } else {
        res.status(404).send({message: 'no server url passed'});
    }

});
router.post('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        logger.debug('Proxying post request to server with url: '+serverUrl);

        req.pipe(request.post(serverUrl))
            .on('error', function(err) {
                logger.error('Error has occured ',err);
                next(err);
            }).pipe(res);
    } else {
        res.status(404).send({message: 'no server url passed'});
    }

});

module.exports = router;

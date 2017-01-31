'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */


var express = require('express');
var request = require('request');

var router = express.Router();

var logger = require('log4js').getLogger('ServerProxy');

let  allowAccessOrigin = (req,res,next) => {
    // Setting access control allow origin headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,authentication-token,tenant');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
};

router.use(allowAccessOrigin);
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

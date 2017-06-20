/**
 * Created by pposel on 07/04/2017.
 */
var request = require('request');
var config = require('../config').get();

module.exports = function(req,res,next) {
    request.get({
        url: config.managerUrl + "/api/version",
        headers: {
            'authentication-token': req.headers['authentication-token'],
            'tenant' : req.headers['tenant'],
            'authorization': req.headers['authorization']
        },
        timeout: config.app.proxy.timeouts.get
    }).on('response', function(response) {
            if (response.statusCode === 401 /*UNAUTHORIZED*/) {
                next({status: response.statusCode, message: response.statusMessage});
            } else {
                next();
            }
        })
        .on('error',function(err){
            next(err)
        });
}
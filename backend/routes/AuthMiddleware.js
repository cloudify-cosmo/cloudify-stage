/**
 * Created by pposel on 07/04/2017.
 */
var request = require('request');
var config = require('../config').get();

var fs = require('fs');
var _ = require('lodash');

var caFile =  null;

try {
    caFile = _.get(config,'app.ssl.ca') ? fs.readFileSync(config.app.ssl.ca) : null;
} catch (e) {
    console.error('Could not setup ssl ca, error loading file.', e);
    process.exit(1);
}


module.exports = function(req,res,next) {
    var options = {
        url: config.managerUrl + '/api/version',
        headers: {
            'authentication-token': req.headers['authentication-token'],
            'tenant' : req.headers['tenant'],
            'authorization': req.headers['authorization']
        },
        timeout: config.app.proxy.timeouts.get
    };

    if (caFile) {
        options.agentOptions = {
            ca: caFile
        };
    }

    request.get(options).on('response', function(response) {
            if (response.statusCode === 401 /*UNAUTHORIZED*/) {
                next({status: response.statusCode, message: response.statusMessage});
            } else {
                next();
            }
        })
        .on('error',function(err){
            next(err)
        });
};
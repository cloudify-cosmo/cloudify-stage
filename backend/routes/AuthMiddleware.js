/**
 * Created by pposel on 07/04/2017.
 */
var config = require('../config').get();
var ManagerHandler = require('../handler/ManagerHandler');

module.exports = function(req,res,next) {
    var HTTP_UNAUTHORIZED_CODE = 401;

    var header = {
        'authentication-token': req.headers['authentication-token'],
        'tenant' : req.headers['tenant'],
        'authorization': req.headers['authorization']
    };
    var timeout = config.app.proxy.timeouts.get;
    var onSuccess = function(response) {
        if (response.statusCode === HTTP_UNAUTHORIZED_CODE) {
            next({status: response.statusCode, message: response.statusMessage});
        } else {
            next();
        }
    };
    var onError = function(err) {
        next(err)
    };

    ManagerHandler.getRequest('/version', header, onSuccess, onError, timeout)
};
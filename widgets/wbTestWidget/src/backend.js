module.exports = function(r) {

    r.register('manager', 'POST', (req, res, next, helper) => {
        var _ = require('lodash');
        var jsonBody = require('body/json');
        var url = req.query.endpoint;
        var params = _.omit(req.query, 'endpoint');
        var headers = req.headers;

        jsonBody(req, res, function (error, body) {
            helper.Manager.doPost(url, params, body, headers)
                .then((data) => res.send(data))
                .catch(next);
        })
    });

    r.register('manager', (req, res, next, helper) => {
        var _ = require('lodash');
        var url = req.query.endpoint;
        var params = _.omit(req.query, 'endpoint');
        var headers = req.headers;
        helper.Manager.doGet(url, params, headers)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('manager', 'PUT', (req, res, next, helper) => {
        var _ = require('lodash');
        var jsonBody = require('body/json');
        var url = req.query.endpoint;
        var params = _.omit(req.query, 'endpoint');
        var headers = req.headers;

        jsonBody(req, res, function (error, body) {
            helper.Manager.doPut(url, params, body, headers)
                .then((data) => res.send(data))
                .catch(next);
        })
    });

    r.register('manager', 'DELETE', (req, res, next, helper) => {
        var _ = require('lodash');
        var url = req.query.endpoint;
        var params = _.omit(req.query, 'endpoint');
        var headers = req.headers;
        helper.Manager.doDelete(url, params, null, headers)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('request', 'POST', (req, res, next, helper) => {
        var _ = require('lodash');
        var jsonBody = require('body/json');
        var url = req.query.url;
        var params = _.omit(req.query, 'url');

        jsonBody(req, res, function (error, body) {
            helper.Request.doPost(url, params, body)
                .then((data) => res.send(data))
                .catch(next);
        });
    });

    r.register('request', (req, res, next, helper) => {
        var _ = require('lodash');
        var url = req.query.url;
        var params = _.omit(req.query, 'url');
        helper.Request.doGet(url, params)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('request', 'PUT', (req, res, next, helper) => {
        var _ = require('lodash');
        var jsonBody = require('body/json');
        var url = req.query.url;
        var params = _.omit(req.query, 'url');

        jsonBody(req, res, function (error, body) {
            helper.Request.doPut(url, params, body)
                .then((data) => res.send(data))
                .catch(next);
        });
    });

    r.register('request', 'DELETE', (req, res, next, helper) => {
        var _ = require('lodash');
        var url = req.query.url;
        var params = _.omit(req.query, 'url');
        helper.Request.doDelete(url, params)
            .then((data) => res.send(data))
            .catch(next);
    });
}
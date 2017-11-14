module.exports = function(r) {

    r.register('manager', 'POST', (req, res, next, helper) => {
        var _ = require('lodash');
        var body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            var url = req.query.endpoint;
            var params = _.omit(req.query, 'endpoint');
            var json = JSON.parse(body);
            var headers = req.headers;
            helper.Manager.doPost(url, params, json, headers)
                .then((data) => res.send(data))
                .catch(next);
        });
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
        var body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            var url = req.query.endpoint;
            var params = _.omit(req.query, 'endpoint');
            var json = JSON.parse(body);
            var headers = req.headers;
            helper.Manager.doPut(url, params, json, headers)
                .then((data) => res.send(data))
                .catch(next);
        });
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
        var body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            var url = req.query.url;
            var params = _.omit(req.query, 'url');
            var json = JSON.parse(body);
            helper.Request.doPost(url, params, json)
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
        var body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            var url = req.query.url;
            var params = _.omit(req.query, 'url');
            var json = JSON.parse(body);
            helper.Request.doPut(url, params, json)
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


    r.register('database', 'POST', (req, res, next, helper) => {
        helper.Database.create(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

    r.register('database', (req, res, next, helper) => {
        helper.Database.readAll(req, res, next)
            .then((data) => res.send({items: data}))
            .catch(next);
    });

    r.register('database', 'PUT', (req, res, next, helper) => {
        helper.Database.update(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

    r.register('database', 'DELETE', (req, res, next, helper) => {
        helper.Database.remove(req.query.id, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

}
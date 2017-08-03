'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var express = require('express');
var SourceHandler = require('../handler/SourceHandler');
var AuthMiddleware = require('./AuthMiddleware');

var logger = require('log4js').getLogger('sourceBrowser');
var router = express.Router();

router.use(AuthMiddleware);

router.get('/browse/file', function(req, res, next) {
    var path = req.query.path;

    if (!path) {
        return next('no file path passed [path]');
    }

    SourceHandler.browseArchiveFile(path)
        .then(content => res.contentType('application/text').send(content))
        .catch(next);
});

router.get('/browse/:blueprintId/archive', function(req, res, next) {
    SourceHandler.browseArchiveTree(req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/yaml', function (req, res, next) {
    SourceHandler.listYamlFiles(req.query.url, req)
        .then(data => res.send(data))
        .catch(next);
});

module.exports = router;

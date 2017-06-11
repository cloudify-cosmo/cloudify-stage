'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var express = require('express');
var request = require('request');
var SourceHandler = require('../handler/SourceHandler');

var logger = require('log4js').getLogger('sourceBrowser');
var router = express.Router();

router.get('/browse/file', function(req, res, next) {
    var path = req.query.path;

    if (!path) {
        return next('no file path passed [path]');
    }

    SourceHandler.browseArchiveFile(path)
        .then(content => res.contentType('application/text').send(content))
        .catch(next);
});

router.get('/browse', function(req, res, next) {
    var su = req.query.su;

    var errors = [];
    if (!su) {
        errors.push('no server url passed [su]');
    }
    if (errors.length > 0) {
        return next(errors.join());
    }

    SourceHandler.browseArchiveTree(req, su)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/yaml', function (req, res, next) {
    SourceHandler.listYamlFiles(req.query.url, req)
        .then(data => res.send(data))
        .catch(next);
});

module.exports = router;

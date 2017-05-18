'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var express = require('express');
var request = require('request');
var SourceHandler = require('../source/SourceHandler');

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
    var lastUpdate = req.query.last_update;

    var errors = [];
    if (!su) {
        errors.push('no server url passed [su]');
    }
    if (!lastUpdate) {
        errors.push('no last update passed [last_update]');
    }

    if (errors.length > 0) {
        return next(errors.join());
    }

    SourceHandler.browseArchiveTree(req, su, lastUpdate)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/yaml', function (req, res, next) {
    var promise = req.query.url ?
        SourceHandler.saveDataFromUrl(req.query.url)
        :
        SourceHandler.saveMultipartData(req);

    promise.then(data => SourceHandler.listYamlFiles(data.archiveFolder, data.archiveFile))
        .then(data => res.send(data))
        .catch(next);
});

module.exports = router;

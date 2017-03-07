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

    try {
        SourceHandler.browseArchiveFile(path, function (err, content) {
            if (err) {
                next(err);
            } else {
                res.contentType('application/text').send(content);
            }
        });
    } catch(err) {
        next(err);
    }
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

    try {
        var archiveUrl = decodeURIComponent(su);
        logger.debug('download archive from url', archiveUrl);

        req.pipe(request.get(archiveUrl)).on('error', next).on('response', function (response) {
                var cd = response.headers['content-disposition'];

                var stream = SourceHandler.browseArchiveTree(lastUpdate, cd, function (err, tree) {
                    if (err) {
                        next(err);
                    } else {
                        res.contentType('application/json').send(tree);
                    }
                });

                response.pipe(stream);
        });
    } catch(err) {
        return next(err);
    }
});

module.exports = router;

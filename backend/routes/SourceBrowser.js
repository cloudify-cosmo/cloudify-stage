/**
 * Created by pposel on 24/02/2017.
 */

const express = require('express');
const passport = require('passport');
const SourceHandler = require('../handler/SourceHandler');

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));

router.get('/browse/file', (req, res, next) => {
    const { path } = req.query;

    if (!path) {
        return next('no file path passed [path]');
    }

    SourceHandler.browseArchiveFile(path)
        .then(content => res.contentType('application/text').send(content))
        .catch(next);
});

router.get('/browse/:blueprintId/archive', (req, res, next) => {
    SourceHandler.browseArchiveTree(req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/yaml', (req, res, next) => {
    SourceHandler.listYamlFiles(req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/resources', (req, res, next) => {
    SourceHandler.getBlueprintResources(req)
        .then(data => res.send(data))
        .catch(next);
});

module.exports = router;

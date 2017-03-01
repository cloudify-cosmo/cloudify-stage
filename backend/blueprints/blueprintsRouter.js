'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var express = require('express');
var BlueprintHandler = require('./browseBlueprintHandler');

var router = express.Router();

router.get('/browse/file', BlueprintHandler.browseArchiveFile);
router.get('/browse', BlueprintHandler.browseArchiveTree);

module.exports = router;

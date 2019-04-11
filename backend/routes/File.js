/**
 * Created by jakubniezgoda on 24/11/2017.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer  = require('multer');
var upload = multer({limits: {fileSize: 50000}});
var logger = require('log4js').getLogger('File');
var yaml = require('js-yaml');

function checkIfFileUploaded(req, res, next) {
    if (!req.file) {
        var errorMessage = 'No file uploaded.';
        logger.error(errorMessage);
        res.status(400).send({message: errorMessage})
    } else {
        next();
    }
}

router.post('/text', passport.authenticate('token', {session: false}), upload.single('file'), checkIfFileUploaded, function (req, res, next) {
    logger.debug(`Text file uploaded, name: ${req.file.originalname}, size: ${req.file.size}`);
    var data = req.file.buffer.toString();
    res.contentType('application/text').send(data);
});

router.post('/yaml', passport.authenticate('token', {session: false}), upload.single('file'), checkIfFileUploaded, function (req, res, next) {
    logger.debug(`YAML file uploaded, name: ${req.file.originalname}, size: ${req.file.size}`);
    var yamlString = req.file.buffer.toString();
    try {
        var json = yaml.safeLoad(yamlString);
    } catch (error) {
        var errorMessage = `Cannot parse YAML file. Error: ${error}`;
        logger.error(errorMessage);
        res.status(400).send({message: errorMessage});
        return;
    }
    res.contentType('application/json').send(json);
});

module.exports = router;
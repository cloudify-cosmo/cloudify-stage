/**
 * Created by jakubniezgoda on 24/11/2017.
 */

const express = require('express');

const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const yaml = require('js-yaml');

const upload = multer({ limits: { fileSize: 50000 } });
const logger = require('../handler/LoggerHandler').getLogger('File');

function checkIfFileUploaded(req, res, next) {
    if (!req.file) {
        const errorMessage = 'No file uploaded.';
        logger.error(errorMessage);
        res.status(400).send({ message: errorMessage });
    } else {
        next();
    }
}

router.post(
    '/text',
    passport.authenticate('token', { session: false }),
    upload.single('file'),
    checkIfFileUploaded,
    (req, res) => {
        logger.debug(`Text file uploaded, name: ${req.file.originalname}, size: ${req.file.size}`);
        const data = req.file.buffer.toString();
        res.contentType('application/text').send(data);
    }
);

router.post(
    '/yaml',
    passport.authenticate('token', { session: false }),
    upload.single('file'),
    checkIfFileUploaded,
    (req, res) => {
        logger.debug(`YAML file uploaded, name: ${req.file.originalname}, size: ${req.file.size}`);
        const yamlString = req.file.buffer.toString();
        let json;
        try {
            json = yaml.safeLoad(yamlString);
        } catch (error) {
            const errorMessage = `Cannot parse YAML file. Error: ${error}`;
            logger.error(errorMessage);
            res.status(400).send({ message: errorMessage });
            return;
        }
        res.contentType('application/json').send(json);
    }
);

module.exports = router;

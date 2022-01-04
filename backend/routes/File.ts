// @ts-nocheck File not migrated fully to TS

import express from 'express';
import passport from 'passport';
import multer from 'multer';
import yaml from 'js-yaml';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const upload = multer({ limits: { fileSize: 50000 } });
const logger = getLogger('File');

function checkIfFileUploaded(req, res, next) {
    if (!req.file) {
        const errorMessage = 'No file uploaded.';
        logger.error(errorMessage);
        res.status(400).send({ message: errorMessage });
    } else {
        next();
    }
}

router.post('/text', upload.single('file'), checkIfFileUploaded, (req, res) => {
    logger.debug(`Text file uploaded, name: ${req.file.originalname}, size: ${req.file.size}`);
    const data = req.file.buffer.toString();
    res.contentType('application/text').send(data);
});

router.post('/yaml', upload.single('file'), checkIfFileUploaded, (req, res) => {
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
});

export default router;

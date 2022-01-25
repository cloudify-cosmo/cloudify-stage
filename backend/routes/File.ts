import express from 'express';
import multer from 'multer';
import yaml from 'js-yaml';
import type { Request, Response, NextFunction } from 'express';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const upload = multer({ limits: { fileSize: 50000 } });
const logger = getLogger('File');

function checkIfFileUploaded(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
        const errorMessage = 'No file uploaded.';
        logger.error(errorMessage);
        res.status(400).send({ message: errorMessage });
    } else {
        next();
    }
}

router.post('/text', upload.single('file'), checkIfFileUploaded, (req, res) => {
    const file = req.file as Express.Multer.File;
    logger.debug(`Text file uploaded, name: ${file.originalname}, size: ${file.size}`);
    const data = file.buffer.toString();
    res.contentType('application/text').send(data);
});

router.post('/yaml', upload.single('file'), checkIfFileUploaded, (req, res) => {
    const file = req.file as Express.Multer.File;
    logger.debug(`YAML file uploaded, name: ${file.originalname}, size: ${file.size}`);
    const yamlString = file.buffer.toString();
    let json;
    try {
        json = yaml.load(yamlString);
    } catch (error) {
        const errorMessage = `Cannot parse YAML file. Error: ${error}`;
        logger.error(errorMessage);
        res.status(400).send({ message: errorMessage });
        return;
    }
    res.contentType('application/json').send(json);
});

export default router;

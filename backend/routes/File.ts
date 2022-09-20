import express from 'express';
import type { Response } from 'express';
import multer from 'multer';
import yaml from 'js-yaml';
import { getLogger } from '../handler/LoggerHandler';
import checkIfFileUploaded from '../middleware/checkIfFileUploadedMiddleware';
import type { PostFileTextResponse, PostFileYamlResponse } from './File.types';

const router = express.Router();
const upload = multer({ limits: { fileSize: 1024 * 50 } }); // 1024 bytes * 50 = 50 kB
const logger = getLogger('File');

router.post('/text', upload.single('file'), checkIfFileUploaded(logger), (req, res: Response<PostFileTextResponse>) => {
    const file = req.file as Express.Multer.File;
    logger.debug(`Text file uploaded, name: ${file.originalname}, size: ${file.size}`);
    const data = file.buffer.toString();
    res.contentType('application/text').send(data);
});

router.post('/yaml', upload.single('file'), checkIfFileUploaded(logger), (req, res: Response<PostFileYamlResponse>) => {
    const file = req.file as Express.Multer.File;
    logger.debug(`YAML file uploaded, name: ${file.originalname}, size: ${file.size}`);
    const yamlString = file.buffer.toString();
    let json;
    try {
        json = yaml.load(yamlString);
        res.contentType('application/json').send(json);
    } catch (error) {
        const errorMessage = `Cannot parse YAML file. Error: ${error}`;
        logger.error(errorMessage);
        res.status(400).send({ message: errorMessage });
    }
});

export default router;

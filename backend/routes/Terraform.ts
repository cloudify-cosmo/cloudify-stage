import _ from 'lodash';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import express from 'express';
import fs from 'fs';
import passport from 'passport';
import path from 'path';
import { getLogger } from '../handler/LoggerHandler';
import type { RequestBody } from './Terraform.types';

const logger = getLogger('Terraform');
const router = express.Router();
const templatePath = path.resolve(__dirname, '../templates/terraform');
const template = fs.readFileSync(path.resolve(templatePath, 'blueprint.ejs'), 'utf8');

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.post('/blueprint', (req, res) => {
    const {
        terraformVersion = '',
        terraformTemplate = '',
        resourceLocation = '',
        variables = [],
        environmentVariables = [],
        outputs = []
    }: RequestBody = req.body;

    logger.debug(
        `Generating Terraform blueprint using: version=${terraformVersion}, template=${terraformTemplate}, location=${resourceLocation}.`
    );

    let result;
    try {
        result = ejs.render(
            template,
            {
                terraformVersion,
                terraformTemplate,
                resourceLocation,
                variables,
                environmentVariables,
                outputs
            },
            {
                views: [templatePath]
            }
        );
    } catch (err) {
        logger.error(err);
        res.status(500).send({ message: `Error when generating blueprint` });
    }

    res.setHeader('content-type', 'text/x-yaml');
    res.send(result);
});

export default router;

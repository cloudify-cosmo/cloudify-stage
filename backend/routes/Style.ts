// @ts-nocheck File not migrated fully to TS

import express from 'express';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import _ from 'lodash';

import { getConfig } from '../config';
import { getResourcePath } from '../utils';

import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('Style');

const styleTemplateFile = path.resolve(__dirname, '../templates', 'style.ejs');

router.get('/', (req, res) => {
    const { whiteLabel } = getConfig().app;
    const stylesheetTemplate = fs.readFileSync(styleTemplateFile, 'utf8');

    let stylesheet = ejs.render(stylesheetTemplate, {
        logoUrl: whiteLabel.logoUrl,
        mainColor: whiteLabel.mainColor,
        headerTextColor: whiteLabel.headerTextColor
    });

    if (!_.isEmpty(whiteLabel.customCssPath)) {
        const customCssPath = getResourcePath(whiteLabel.customCssPath, true);
        try {
            const customCss = fs.readFileSync(customCssPath, 'utf8');
            logger.log('Adding CSS content from', customCssPath);
            stylesheet += '\n/* START - CUSTOM CSS */\n';
            stylesheet += customCss;
            stylesheet += '\n/* END - CUSTOM CSS */\n';
        } catch (e) {
            logger.error('Custom CSS file cannot be found in', customCssPath);
        }
    }

    res.header('content-type', 'text/css');
    res.send(stylesheet);
});

export default router;

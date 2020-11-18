/**
 * Created by jakubniezgoda on 03/04/2017.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const _ = require('lodash');

const config = require('../config').get();

const router = express.Router();
const Utils = require('../utils');
const logger = require('../handler/LoggerHandler').getLogger('Style');

const styleTemplateFile = path.resolve(__dirname, '../templates', 'style.ejs');

router.get('/', (req, res) => {
    const { whiteLabel } = config.app;
    const stylesheetTemplate = fs.readFileSync(styleTemplateFile, 'utf8');

    let stylesheet = ejs.render(stylesheetTemplate, {
        logoUrl: whiteLabel.logoUrl,
        mainColor: whiteLabel.mainColor,
        headerTextColor: whiteLabel.headerTextColor
    });

    if (!_.isEmpty(whiteLabel.customCssPath)) {
        const customCssPath = Utils.getResourcePath(whiteLabel.customCssPath, true);
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

module.exports = router;

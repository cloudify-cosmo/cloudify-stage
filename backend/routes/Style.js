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

function shadeColor(color, percent) {
    const num = parseInt(color.slice(1), 16); // Remove the '#'
    const t = percent > 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    /* eslint-disable no-bitwise */
    const R = num >> 16;
    const G = (num >> 8) & 0x00ff;
    const B = num & 0x0000ff; // extract the RGB
    /* eslint-enable no-bitwise */
    const newR = Math.round((t - R) * p) + R;
    const newG = Math.round((t - G) * p) + G;
    const newB = Math.round((t - B) * p) + B;
    return `#${(0x1000000 + newR * 0x10000 + newG * 0x100 + newB).toString(16).slice(1)}`;
}

router.get('/', (req, res) => {
    const { whiteLabel } = config.app;
    const stylesheetTemplate = fs.readFileSync(styleTemplateFile, 'utf8');

    let stylesheet = ejs.render(stylesheetTemplate, {
        logoUrl: whiteLabel.logoUrl,
        mainColor: whiteLabel.mainColor,
        headerTextColor: whiteLabel.headerTextColor,
        sidebarColor: whiteLabel.sidebarColor,
        sideBarHoverActiveColor: shadeColor(whiteLabel.sidebarColor, 0.1),
        sidebarTextColor: whiteLabel.sidebarTextColor
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

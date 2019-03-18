/**
 * Created by jakubniezgoda on 03/04/2017.
 */

let express = require('express');
let path = require('path');
let fs = require('fs');
let ejs = require('ejs');
let _ = require('lodash');

let config = require('../config').get();
let router = express.Router();
const Utils = require('../utils');
var logger = require('log4js').getLogger('Style');

let styleTemplateFile = path.resolve(__dirname, '../templates', 'style.ejs');

function shadeColor(color, percent) {
    var num=parseInt(color.slice(1),16); // Remove the '#'
    var t=percent>0?0:255;
    var p=percent<0?percent*-1:percent;
    var R=num>>16,G=num>>8&0x00FF,B=num&0x0000FF; // extract the RGB
    var newR = Math.round((t-R)*p)+R,newG = Math.round((t-G)*p)+G,newB = Math.round((t-B)*p)+B;
    return '#'+(0x1000000+(newR)*0x10000+(newG)*0x100+(newB)).toString(16).slice(1);
}

router.get('/', function(req, res, next) {
    const whiteLabel = config.app.whiteLabel;
    let stylesheetTemplate = fs.readFileSync(styleTemplateFile, 'utf8');

    let stylesheet = ejs.render(stylesheetTemplate, {
        logoUrl: whiteLabel.logoUrl,
        mainColor: whiteLabel.mainColor,
        headerTextColor: whiteLabel.headerTextColor,
        sidebarColor: whiteLabel.sidebarColor,
        sideBarHoverActiveColor: shadeColor(whiteLabel.sidebarColor,0.1),
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
/**
 * Created by jakubniezgoda on 03/04/2017.
 */

var express = require('express');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');

var router = express.Router();

var configuration = require('../../conf/app.json');
var styleTemplateFile = path.resolve(__dirname, '../templates', 'style.ejs');

router.get('/', function(req, res, next) {
    var whiteLabel = configuration.whiteLabel;
    var stylesheetTemplate = fs.readFileSync(styleTemplateFile, 'utf8');

    var stylesheet = ejs.render(stylesheetTemplate, {
        logoUrl: whiteLabel.enabled && whiteLabel.logoUrl || '/app/images/Cloudify-logo.png',
        mainColor: whiteLabel.enabled && whiteLabel.mainColor || '#39b9d4',
        headerTextColor: whiteLabel.enabled && whiteLabel.headerTextColor || '#ffffff'
    });

    res.header("content-type", "text/css");
    res.send(stylesheet);
});

module.exports = router;
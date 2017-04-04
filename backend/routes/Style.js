/**
 * Created by jakubniezgoda on 03/04/2017.
 */

let express = require('express');
let path = require('path');
let fs = require('fs');
let ejs = require('ejs');

let router = express.Router();

let configurationFile = path.resolve(__dirname, '../../conf', 'app.json');
let styleTemplateFile = path.resolve(__dirname, '../templates', 'style.ejs');

router.get('/', function(req, res, next) {
    let configuration = JSON.parse(fs.readFileSync(configurationFile, "utf8"));
    let whiteLabel = configuration.whiteLabel;
    let stylesheetTemplate = fs.readFileSync(styleTemplateFile, "utf8");

    let stylesheet = ejs.render(stylesheetTemplate, {
        logoUrl: whiteLabel.enabled && whiteLabel.logoUrl || '/app/images/Cloudify-logo.png',
        mainColor: whiteLabel.enabled && whiteLabel.mainColor || '#39b9d4',
        headerTextColor: whiteLabel.enabled && whiteLabel.headerTextColor || '#ffffff'
    });

    res.header("content-type", "text/css");
    res.send(stylesheet);
});

module.exports = router;
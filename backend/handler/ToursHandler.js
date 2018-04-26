'use strict';
/**
 * Created by edenp on 15/04/2018.
 */

var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var TemplateHandler = require('./TemplateHandler');
var logger = require('log4js').getLogger('ToursHandler');

var builtInToursFolder = pathlib.resolve('../tours');
if (!fs.existsSync(builtInToursFolder)) {
    builtInToursFolder = pathlib.resolve('../dist/tours');
}

var tours = {};

function getTemplateTours(templateId) {
    var templateTour = tours[templateId+'.json'];
    if(templateTour){
        return Promise.resolve(templateTour);
    }
    return Promise.resolve();
}

class ToursHandler {
    static listTours(systemRole, groupSystemRoles, tenantsRoles, tenant) {
        return TemplateHandler.selectTemplate(systemRole, groupSystemRoles, tenantsRoles, tenant).then(templateId => {
                return getTemplateTours(templateId);
            });
    }

    static init() {
        fs.readdirSync(builtInToursFolder).forEach(filename => {
            try{
                tours[filename] = JSON.parse(fs.readFileSync(pathlib.resolve(builtInToursFolder, filename), 'utf8'));
            }
            catch (err){
                logger.error(`Failed to load tour - ${filename}: ${err.message}`);
                process.exit(1);
            }
        });
        return Promise.resolve();
    }
}

module.exports = ToursHandler;
/**
 * Created by edenp on 15/04/2018.
 */

const fs = require('fs-extra');
const pathlib = require('path');

const Utils = require('./../utils');
const TemplateHandler = require('./TemplateHandler');
const logger = require('log4js').getLogger('ToursHandler');

const builtInToursFolder = Utils.getResourcePath('tours', false);

let tours = {};

function getTemplateTours(templateId) {
    const templateTour = tours[templateId+'.json'];
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
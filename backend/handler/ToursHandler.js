/**
 * Created by edenp on 15/04/2018.
 */

const fs = require('fs-extra');
const pathlib = require('path');

const Utils = require('../utils');
const TemplateHandler = require('./TemplateHandler');
const logger = require('./LoggerHandler').getLogger('ToursHandler');

const builtInToursFolder = Utils.getResourcePath('tours', false);

const tours = {};

function getTemplateTours(templateId) {
    const templateTour = tours[`${templateId}.json`];
    if (templateTour) {
        return Promise.resolve(templateTour);
    }
    return Promise.resolve();
}

class ToursHandler {
    static listTours(systemRole, groupSystemRoles, tenantsRoles, tenant, token) {
        return TemplateHandler.selectTemplate(systemRole, groupSystemRoles, tenantsRoles, tenant, token).then(
            getTemplateTours
        );
    }

    static init() {
        return new Promise((resolve, reject) => {
            fs.readdirSync(builtInToursFolder).forEach(filename => {
                try {
                    tours[filename] = JSON.parse(
                        fs.readFileSync(pathlib.resolve(builtInToursFolder, filename), 'utf8')
                    );
                } catch (err) {
                    logger.error(`Failed to load tour - ${filename}: ${err.message}`);
                    return reject(`Failed to load tour - ${filename}: ${err.message}`);
                }
            });
            return resolve();
        });
    }
}

module.exports = ToursHandler;

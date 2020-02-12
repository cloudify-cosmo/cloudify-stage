const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');

const ResourceTypes = require('../db/types/ResourceTypes');
const ResourcesModel = require('../db/ResourcesModel');
const Utils = require('../utils');

const userTemplatesFolder = Utils.getResourcePath('templates', true);

module.exports = {
    up: (queryInterface, Sequelize, logger) => {
        return ResourcesModel(queryInterface.sequelize, Sequelize)
            .findAll({
                where: { type: ResourceTypes.TEMPLATE },
                attributes: [['resourceId', 'id'], 'createdAt', 'updatedAt', 'creator', 'data'],
                raw: true
            })
            .then(results => {
                logger.info(`Found ${results.length} template rows to migrate.`);
                for (const templateRow of results) {
                    const templateFilePath = path.resolve(userTemplatesFolder, `${templateRow.id}.json`);
                    const { data } = templateRow;
                    const { roles } = data;
                    const { tenants } = data;

                    logger.info(`Updating ${templateFilePath}`);
                    let templateFileContent = {};
                    let pages = null;

                    try {
                        pages = fs.readJsonSync(templateFilePath);
                        logger.info('File exists. Updating it...');
                    } catch (error) {
                        pages = [];
                        logger.info('File does not exist. Creating new one...');
                    }

                    templateFileContent = {
                        name: templateRow.id,
                        updatedBy: templateRow.creator,
                        updatedAt: moment(templateRow.updatedAt).format(),
                        roles,
                        tenants,
                        pages
                    };

                    fs.writeJsonSync(templateFilePath, templateFileContent, { spaces: 2, EOL: '\n' });
                }

                logger.info('Removing template rows from DB.');
                return queryInterface.bulkDelete('Resources', { type: ResourceTypes.TEMPLATE });
            });
    },

    down: () => Promise.resolve()
};

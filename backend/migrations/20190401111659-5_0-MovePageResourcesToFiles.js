const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');

const ResourceTypes = require('../db/types/ResourceTypes');
const ResourcesModel = require('../db/ResourcesModel');
const Utils = require('../utils');

const userTemplatesFolder = Utils.getResourcePath('templates', true);
const userPagesFolder = path.resolve(userTemplatesFolder, 'pages');

module.exports = {
    up: (queryInterface, Sequelize, logger) => {
        return ResourcesModel(queryInterface.sequelize, Sequelize)
            .findAll({
                where: { type: ResourceTypes.PAGE },
                attributes: [['resourceId', 'id'], 'createdAt', 'updatedAt', 'creator'],
                raw: true
            })
            .then(results => {
                logger.info(`Found ${results.length} page rows to migrate.`);
                for (const pageRow of results) {
                    const pageFilePath = path.resolve(userPagesFolder, `${pageRow.id}.json`);

                    logger.info(`Updating ${pageFilePath}`);
                    let pageFileContent = {};
                    try {
                        pageFileContent = fs.readJsonSync(pageFilePath);
                        logger.info('File exists. Updating it...');
                        pageFileContent.updatedBy = pageRow.creator;
                        pageFileContent.updatedAt = moment(pageRow.updatedAt).format();
                    } catch (error) {
                        logger.info('File does not exist. Creating new one...');
                        pageFileContent = {
                            name: pageRow.id,
                            updatedBy: pageRow.creator,
                            updatedAt: moment(pageRow.updatedAt).format(),
                            widgets: []
                        };
                    }

                    fs.writeJsonSync(pageFilePath, pageFileContent, { spaces: 2, EOL: '\n' });
                }

                logger.info('Removing page rows from DB.');
                return queryInterface.bulkDelete('Resources', { type: ResourceTypes.PAGE });
            });
    },

    down: () => Promise.resolve()
};

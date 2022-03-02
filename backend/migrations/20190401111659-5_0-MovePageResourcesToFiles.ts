import _ from 'lodash';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';

import ResourceTypes from '../db/types/ResourceTypes';
import ResourcesModel from '../db/models/ResourcesModel';
import { getResourcePath } from '../utils';
import type { MigrationObject } from './types';

const userTemplatesFolder = getResourcePath('templates', true);
const userPagesFolder = path.resolve(userTemplatesFolder, 'pages');

export const { up, down }: MigrationObject = {
    up: (queryInterface, Sequelize, logger) => {
        return ResourcesModel(queryInterface.sequelize, Sequelize)
            .findAll({
                where: { type: ResourceTypes.PAGE },
                attributes: ['resourceId', 'createdAt', 'updatedAt', 'creator'],
                raw: true
            })
            .then(results => {
                logger.info(`Found ${results.length} page rows to migrate.`);
                _.forEach(results, pageRow => {
                    const pageFilePath = path.resolve(userPagesFolder, `${pageRow.resourceId}.json`);

                    logger.info(`Updating ${pageFilePath}`);
                    let pageFileContent: { name?: string; updatedBy?: string; updatedAt?: string; widgets?: any } = {};
                    try {
                        pageFileContent = fs.readJsonSync(pageFilePath);
                        logger.info('File exists. Updating it...');
                        pageFileContent.updatedBy = pageRow.creator;
                        pageFileContent.updatedAt = moment(pageRow.updatedAt).format();
                    } catch (error) {
                        logger.info('File does not exist. Creating new one...');
                        pageFileContent = {
                            name: pageRow.resourceId,
                            updatedBy: pageRow.creator,
                            updatedAt: moment(pageRow.updatedAt).format(),
                            widgets: []
                        };
                        fs.mkdirSync(path.dirname(pageFilePath), { recursive: true });
                    }

                    fs.writeJsonSync(pageFilePath, pageFileContent, { spaces: 2, EOL: '\n' });
                });

                logger.info('Removing page rows from DB.');
                return queryInterface.bulkDelete('Resources', { type: ResourceTypes.PAGE });
            });
    },

    down: () => Promise.resolve()
};

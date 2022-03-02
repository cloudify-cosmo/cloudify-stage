import _ from 'lodash';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';

import ResourceTypes from '../db/types/ResourceTypes';
import ResourcesModel from '../db/models/ResourcesModel';
import { getResourcePath } from '../utils';
import { MigrationObject } from './types';

const userTemplatesFolder = getResourcePath('templates', true);

export const { up, down }: MigrationObject = {
    up: (queryInterface, Sequelize, logger) => {
        return ResourcesModel(queryInterface.sequelize, Sequelize)
            .findAll({
                where: { type: ResourceTypes.TEMPLATE },
                attributes: ['resourceId', 'createdAt', 'updatedAt', 'creator', 'data'],
                raw: true
            })
            .then(results => {
                logger.info(`Found ${results.length} template rows to migrate.`);
                _.forEach(results, templateRow => {
                    const templateFilePath = path.resolve(userTemplatesFolder, `${templateRow.resourceId}.json`);
                    const { data } = templateRow;
                    const { roles } = data;
                    const { tenants } = data;

                    logger.info(`Updating ${templateFilePath}`);
                    let templateFileContent = {};
                    let pages = null;

                    try {
                        const fileContents = fs.readJsonSync(templateFilePath);
                        logger.info('File exists. Updating it...');
                        if (Array.isArray(fileContents.pages)) {
                            pages = fileContents.pages;
                            logger.info('File followed the new template format. Retrieving only the pages');
                        } else if (Array.isArray(fileContents)) {
                            pages = fileContents;
                        } else {
                            logger.error('Unexpected template file contents', fileContents);
                            throw new Error(
                                `Unexpected template file at ${templateFilePath}. Expected a whole template or just the pages array`
                            );
                        }
                    } catch (error) {
                        if (error.code === 'ENOENT') {
                            pages = [];
                            logger.info('File does not exist. Creating new one...');
                            fs.mkdirSync(path.dirname(templateFilePath), { recursive: true });
                        } else {
                            throw error;
                        }
                    }

                    templateFileContent = {
                        name: templateRow.resourceId,
                        updatedBy: templateRow.creator,
                        updatedAt: moment(templateRow.updatedAt).format(),
                        roles,
                        tenants,
                        pages
                    };

                    fs.writeJsonSync(templateFilePath, templateFileContent, { spaces: 2, EOL: '\n' });
                });

                logger.info('Removing template rows from DB.');
                return queryInterface.bulkDelete('Resources', { type: ResourceTypes.TEMPLATE });
            });
    },

    down: () => Promise.resolve()
};

const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');
const _ = require('lodash');

const ResourceTypes = require('../db/types/ResourceTypes');
const ResourcesModel = require('../db/ResourcesModel');
const Utils = require('../utils');

const userTemplatesFolder = Utils.getResourcePath('templates', true);

module.exports = {
  up: (queryInterface, Sequelize, logger) => {
    return ResourcesModel(queryInterface.sequelize, Sequelize)
        .findAll({
          where: { type: ResourceTypes.TEMPLATE },
          attributes: [ ['resourceId','id'], 'createdAt', 'updatedAt', 'creator', 'data' ],
          raw: true
        }).then((results) => {
          logger.info('Found ' + results.length + ' template rows to migrate.');
          for (const templateRow of results) {
            const templateFilePath = path.resolve(userTemplatesFolder, templateRow.id + '.json');
            const data = templateRow.data;
            const roles = data.roles;
            const tenants = data.tenants;

            logger.info('Updating ' + templateFilePath);
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

            fs.writeJsonSync(templateFilePath, templateFileContent, {spaces: 2, EOL: '\n'});
          }

          logger.info('Removing template rows from DB.');
          return queryInterface.bulkDelete('Resources', { type: ResourceTypes.TEMPLATE })
        });
  },

  down: (queryInterface, Sequelize, logger) => {
    const templateFiles = fs.readdirSync(userTemplatesFolder)
        .filter(fileName => fs.lstatSync(path.resolve(userTemplatesFolder, fileName)).isFile());
    logger.info(`Found ${templateFiles.length} templates files: ${_.join(templateFiles, ', ')}`);

    let records = [];
    for (const templateFile of templateFiles) {
      const templateFilePath = path.resolve(userTemplatesFolder, templateFile);
      try {
        const templateFileContent = fs.readJsonSync(templateFilePath);
        const data = { roles: templateFileContent.roles || [], tenants: templateFileContent.tenants };
        const pages = templateFileContent.pages;

        records.push({
          resourceId: templateFile.replace('.json', ''),
          type: ResourceTypes.TEMPLATE,
          createdAt: templateFileContent.updatedAt || new Date(),
          updatedAt: templateFileContent.updatedAt || new Date(),
          creator: templateFileContent.updatedBy || 'admin',
          data: JSON.stringify(data)
        });

        logger.info(`Updating file ${templateFile} with pages data:`, pages);
        fs.writeJsonSync(templateFilePath, pages, {spaces: 2, EOL: '\n'});

      } catch (error) {
        logger.error(`Cannot process ${templateFile}. Error: ${error}.`);
      }
    }

    logger.info('Records to be inserted:', records);
    if (!_.isEmpty(records)){
      return queryInterface.bulkInsert('Resources', records);
    }
  }
};

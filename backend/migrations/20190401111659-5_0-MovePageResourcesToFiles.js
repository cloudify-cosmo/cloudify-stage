const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');
const _ = require('lodash');

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
              attributes: [ ['resourceId','id'], 'createdAt', 'updatedAt', 'creator' ],
              raw: true
          }).then((results) => {
              logger.info('Found ' + results.length + ' page rows to migrate.');
              for (const pageRow of results) {
                  const pageFilePath = path.resolve(userPagesFolder, pageRow.id + '.json');

                  logger.info('Updating ' + pageFilePath);
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

                  fs.writeJsonSync(pageFilePath, pageFileContent, {spaces: 2, EOL: '\n'});
              }

              logger.info('Removing page rows from DB.');
              return queryInterface.bulkDelete('Resources', { type: ResourceTypes.PAGE })
          });
  },

  down: (queryInterface, Sequelize, logger) => {
      const pageFiles = fs.readdirSync(userPagesFolder)
          .filter(fileName => fs.lstatSync(path.resolve(userPagesFolder, fileName)).isFile());
      logger.info(`Found ${pageFiles.length} page files: ${_.join(pageFiles, ', ')}`);

      let records = [];
      for (const pageFile of pageFiles) {
          const pageFilePath = path.resolve(userPagesFolder, pageFile);
          try {
              const pageFileContent = fs.readJsonSync(pageFilePath);

              records.push({
                  resourceId: pageFile.replace('.json', ''),
                  type: ResourceTypes.PAGE,
                  createdAt: pageFileContent.updatedAt || new Date(),
                  updatedAt: pageFileContent.updatedAt || new Date(),
                  creator: pageFileContent.updatedBy || 'admin'
              });

              logger.info(`Removing unnecessary parts from file ${pageFile}.`);
              const newPageFileContent = {
                  name: pageFileContent.name || pageFile,
                  widgets: pageFileContent.widgets
              };
              fs.writeJsonSync(pageFilePath, newPageFileContent, {spaces: 2, EOL: '\n'});

          } catch (error) {
              logger.error(`Cannot process ${pageFile}. Error: ${error}.`);
          }
      }

      logger.info('Records to be inserted:', records);
      return queryInterface.bulkInsert('Resources', records);
  }
};

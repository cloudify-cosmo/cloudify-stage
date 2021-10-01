const { each, map } = require('lodash');
const fs = require('fs-extra');
const path = require('path');

const UserApp = require('../db/models/UserAppModel');
const { userTemplatesFolder } = require('../handler/templates/TemplatesHandler');

module.exports = {
    up: (queryInterface, Sequelize, logger) => {
        UserApp(queryInterface.sequelize, Sequelize)
            .findAll()
            .then(results =>
                Sequelize.Promise.each(results, userAppRow => {
                    each(userAppRow.appData.pages, page => {
                        page.type = 'page';
                    });
                    userAppRow.appData = { ...userAppRow.appData };
                    return userAppRow.save();
                })
            );

        if (fs.existsSync(userTemplatesFolder))
            each(fs.readdirSync(userTemplatesFolder), templateFile => {
                const templateFilePath = path.resolve(userTemplatesFolder, templateFile);
                if (!fs.lstatSync(templateFilePath).isFile()) return;
                let templateFileContent;
                try {
                    templateFileContent = fs.readJsonSync(templateFilePath);
                } catch (e) {
                    logger.warn(`Could not migrate ${templateFile} - skipping`, e);
                    return;
                }
                templateFileContent.pages = map(templateFileContent.pages, pageItem => ({
                    id: pageItem,
                    type: 'page'
                }));
                fs.writeJsonSync(templateFilePath, templateFileContent, { spaces: 2, EOL: '\n' });
            });
    },

    down: (queryInterface, Sequelize, logger) => {
        if (fs.existsSync(userTemplatesFolder))
            each(fs.readdirSync(userTemplatesFolder), templateFile => {
                const templateFilePath = path.resolve(userTemplatesFolder, templateFile);
                if (!fs.lstatSync(templateFilePath).isFile()) return;
                let templateFileContent;
                try {
                    templateFileContent = fs.readJsonSync(templateFilePath);
                } catch (e) {
                    logger.warn(`Could not migrate ${templateFile} - skipping`, e);
                    return;
                }
                templateFileContent.pages = map(templateFileContent.pages, 'id');
                fs.writeJsonSync(templateFilePath, templateFileContent, { spaces: 2, EOL: '\n' });
            });
    }
};

const { each, map } = require('lodash');
const fs = require('fs-extra');
const path = require('path');

const UserApp = require('../db/models/UserAppsModel');
const { userTemplatesFolder } = require('../handler/templates/TemplatesHandler');

module.exports = {
    up: (queryInterface, Sequelize, logger) => {
        UserApp(queryInterface.sequelize, Sequelize)
            .findAll()
            .then(async results => {
                for (let i = 0; i < results.length; i += 1) {
                    const userAppRow = results[i];
                    each(userAppRow.appData.pages, page => {
                        page.type = 'page';
                    });
                    userAppRow.appData = { ...userAppRow.appData };
                    // eslint-disable-next-line no-await-in-loop
                    await userAppRow.save();
                }
            });

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

const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { LAYOUT } = require('../consts');
const Utils = require('../utils');

const userTemplatesFolder = Utils.getResourcePath('templates', true);
const userPagesFolder = path.resolve(userTemplatesFolder, 'pages');

const UserApp = require('../db/UserAppModel');

function migrate(queryInterface, Sequelize, pageProcessor) {
    UserApp(queryInterface.sequelize, Sequelize)
        .findAll()
        .then(results =>
            Sequelize.Promise.each(results, userAppRow => {
                _.each(userAppRow.appData.pages, pageProcessor);
                userAppRow.appData = { ...userAppRow.appData };
                return userAppRow.save();
            })
        );
    if (fs.existsSync(userPagesFolder))
        _.each(fs.readdirSync(userPagesFolder), pageFile => {
            const pageFilePath = path.resolve(userPagesFolder, pageFile);
            const pageFileContent = fs.readJsonSync(pageFilePath);
            pageProcessor(pageFileContent);
            fs.writeJsonSync(pageFilePath, pageFileContent, { spaces: 2, EOL: '\n' });
        });
}

module.exports = {
    up: (queryInterface, Sequelize) =>
        migrate(queryInterface, Sequelize, pageData => {
            function migrateLayoutSection(layoutSection) {
                if (pageData[layoutSection]) {
                    if (!_.isEmpty(pageData[layoutSection])) {
                        pageData.layout.push({ type: layoutSection, content: pageData[layoutSection] });
                    }
                    delete pageData[layoutSection];
                }
            }

            pageData.layout = [];

            migrateLayoutSection(LAYOUT.WIDGETS);
            migrateLayoutSection(LAYOUT.TABS);
        }),
    down: (queryInterface, Sequelize) =>
        migrate(queryInterface, Sequelize, pageData => {
            if (!_.isEmpty(pageData.layout)) {
                let layoutSection = pageData.layout[0];
                pageData[layoutSection.type] = layoutSection.content;

                if (layoutSection.type === LAYOUT.WIDGETS) {
                    layoutSection = _.nth(pageData.layout, 1) || {};
                    if (layoutSection.type === LAYOUT.TABS) pageData[layoutSection.type] = layoutSection.content;
                }
            }

            delete pageData.layout;
        })
};

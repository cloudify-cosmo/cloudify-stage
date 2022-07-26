import fs from 'fs-extra';
import { each, map } from 'lodash';
import path from 'path';
import UserApp from '../db/models/UserAppsModel';
import { userTemplatesFolder } from '../handler/templates/TemplatesHandler';
import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up: (queryInterface, Sequelize, logger) => {
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

        return UserApp(queryInterface.sequelize, Sequelize)
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
    },

    down: (_queryInterface, _Sequelize, logger) => {
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

        return Promise.resolve();
    }
};

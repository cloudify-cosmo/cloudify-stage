import sequelize, { QueryInterface, QueryInterfaceIndexOptions } from 'sequelize';
import { Logger } from 'cloudify-ui-common/backend/logger';
import { each, map } from 'lodash';

import fs from 'fs-extra';
import path from 'path';
import UserApp from '../db/models/UserAppsModel';
import { userTemplatesFolder } from '../handler/templates/TemplatesHandler';

export const { up, down } = {
    up: (queryInterface: QueryInterface, Sequelize: typeof sequelize, logger: Logger) => {
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

    down: (queryInterface: QueryInterface, Sequelize: typeof sequelize, logger: Logger) => {
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

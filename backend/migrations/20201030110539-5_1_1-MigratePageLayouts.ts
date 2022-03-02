import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import { LAYOUT } from '../consts';
import { getResourcePath } from '../utils';
import UserApps from '../db/models/UserAppsModel';
import type { DataTypes, MigrationObject, QueryInterface } from './common/types';

type LayoutSectionType = typeof LAYOUT.TABS | typeof LAYOUT.WIDGETS;
type LayoutSection = { type: LayoutSectionType; content: any };
type NewPageData = { layout: LayoutSection[] };
type OldPageData = Record<LayoutSectionType, any>;
type PageData = OldPageData & NewPageData;

const userTemplatesFolder = getResourcePath('templates', true);
const userPagesFolder = path.resolve(userTemplatesFolder, 'pages');

function migrate(queryInterface: QueryInterface, Sequelize: DataTypes, pageProcessor: (pageData: PageData) => void) {
    UserApps(queryInterface.sequelize, Sequelize)
        .findAll()
        .then(async results => {
            for (let i = 0; i < results.length; i += 1) {
                const userAppRow = results[i];
                _.each(userAppRow.appData.pages, pageProcessor);
                userAppRow.appData = { ...userAppRow.appData };
                // NOTE: It's intentional to await before processing next row
                //       to not open too many connections (see RD-1150)
                // eslint-disable-next-line no-await-in-loop
                await userAppRow.save();
            }
        });
    if (fs.existsSync(userPagesFolder))
        _.each(fs.readdirSync(userPagesFolder), pageFile => {
            const pageFilePath = path.resolve(userPagesFolder, pageFile);
            const pageFileContent = fs.readJsonSync(pageFilePath);
            pageProcessor(pageFileContent);
            fs.writeJsonSync(pageFilePath, pageFileContent, { spaces: 2, EOL: '\n' });
        });
}

export const { up, down }: MigrationObject = {
    // @ts-ignore TODO: Function returns void instead of Promise<any>
    up: (queryInterface, Sequelize) => {
        migrate(queryInterface, Sequelize, (pageData: PageData) => {
            function migrateLayoutSection(type: LayoutSectionType) {
                if (pageData[type]) {
                    if (!_.isEmpty(pageData[type])) {
                        pageData.layout.push({ type, content: pageData[type] });
                    }
                    delete pageData[type];
                }
            }

            pageData.layout = [];

            migrateLayoutSection(LAYOUT.WIDGETS);
            migrateLayoutSection(LAYOUT.TABS);
        });
    },
    // @ts-ignore TODO: Function returns void instead of Promise<any>
    down: (queryInterface, Sequelize) => {
        migrate(queryInterface, Sequelize, (pageData: PageData) => {
            if (pageData.layout && pageData.layout.length > 0) {
                let layoutSection = pageData.layout[0];
                pageData[layoutSection.type] = layoutSection.content;

                if (layoutSection.type === LAYOUT.WIDGETS) {
                    layoutSection = _.nth(pageData.layout, 1) || { type: LAYOUT.WIDGETS, content: [] };
                    if (layoutSection.type === LAYOUT.TABS) pageData[layoutSection.type] = layoutSection.content;
                }
            }

            // @ts-ignore Intentionally removing layout to convert pageData into OldPageData type
            delete pageData.layout;
        });
    }
};

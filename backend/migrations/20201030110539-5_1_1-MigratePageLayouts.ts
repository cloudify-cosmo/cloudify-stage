import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import { getResourcePath } from '../utils';
import UserApps from '../db/models/UserAppsModel';
import type { DataTypes, MigrationObject, QueryInterface } from './common/types';
import type { LayoutSection, LayoutSectionType, PageFileDefinition } from '../routes/Templates.types';

type NewPageData = Partial<PageFileDefinition>;
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
                // @ts-ignore Not possible to handle types properly as UserApps model is already in the migrated shape
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
                        pageData?.layout?.push({ type, content: pageData[type] });
                    }
                    delete pageData[type];
                }
            }

            pageData.layout = [];

            migrateLayoutSection('widgets');
            migrateLayoutSection('tabs');
        });
    },
    // @ts-ignore TODO: Function returns void instead of Promise<any>
    down: (queryInterface, Sequelize) => {
        migrate(queryInterface, Sequelize, (pageData: PageData) => {
            if (pageData?.layout?.length) {
                let layoutSection: LayoutSection | Record<string, never> = pageData.layout![0];
                pageData[layoutSection.type] = layoutSection.content;

                if (layoutSection.type === 'widgets') {
                    layoutSection = _.nth(pageData.layout, 1) || {};
                    if (layoutSection.type === 'tabs') pageData[layoutSection.type] = layoutSection.content;
                }
            }

            delete pageData.layout;
        });
    }
};

import pathlib from 'path';
import _ from 'lodash';
import { readJsonSync, readdirSync } from 'fs-extra';

import { builtInTemplatesFolder } from './TemplatesHandler';
import { getLogger } from '../LoggerHandler';

const logger = getLogger('PageGroupsHandler');

const builtInPageGroupsDir = pathlib.resolve(builtInTemplatesFolder, 'page-groups');

// eslint-disable-next-line import/prefer-default-export
export function listPageGroups() {
    return _(readdirSync(pathlib.resolve(builtInPageGroupsDir)))
        .map(pageGroupFile => {
            const pageGroupFilePath = pathlib.resolve(builtInPageGroupsDir, pageGroupFile);

            try {
                const pageGroupFileContent = readJsonSync(pageGroupFilePath);

                return {
                    id: pathlib.basename(pageGroupFile, '.json'),
                    name: pageGroupFileContent.name,
                    custom: false,
                    updatedBy: 'Manager',
                    updatedAt: ''
                };
            } catch (error) {
                logger.error(`Error while trying to parse ${pageGroupFilePath} file`, error);
                return null;
            }
        })
        .compact()
        .value();
}

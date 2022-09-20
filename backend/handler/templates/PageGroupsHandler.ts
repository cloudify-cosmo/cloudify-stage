import pathlib from 'path';
import _ from 'lodash';
import fs, { readdirSync, readJsonSync } from 'fs-extra';

import moment from 'moment';
import { builtInTemplatesFolder, userTemplatesFolder } from './TemplatesHandler';
import { getLogger } from '../LoggerHandler';
import type {
    PageGroup,
    PageGroupFileContent,
    PostPageGroupsRequestBody,
    PutPageGroupsRequestBody
} from '../../routes/Templates.types';

const logger = getLogger('PageGroupsHandler');

const builtInPageGroupsDir = pathlib.resolve(builtInTemplatesFolder, 'page-groups');
export const userPageGroupsFolder = pathlib.resolve(userTemplatesFolder, 'page-groups');

function getPageGroups(path: string, custom: boolean) {
    return _(readdirSync(pathlib.resolve(path)))
        .map(pageGroupFile => {
            const pageGroupFilePath = pathlib.resolve(path, pageGroupFile);

            try {
                const pageGroupFileContent: PageGroupFileContent = readJsonSync(pageGroupFilePath);

                return {
                    id: pathlib.basename(pageGroupFile, '.json'),
                    custom,
                    updatedBy: 'Manager',
                    updatedAt: '',
                    ...pageGroupFileContent
                } as PageGroup;
            } catch (error) {
                logger.error(`Error while trying to parse ${pageGroupFilePath} file`, error);
                return null;
            }
        })
        .compact()
        .value();
}

export function listPageGroups() {
    return [...getPageGroups(builtInPageGroupsDir, false), ...getPageGroups(userPageGroupsFolder, true)];
}

export function createPageGroup(username: string, pageGroup: PostPageGroupsRequestBody) {
    const path = pathlib.resolve(userPageGroupsFolder, `${pageGroup.id}.json`);
    if (fs.existsSync(path)) {
        return Promise.reject(`Page group id "${pageGroup.id}" already exists`);
    }

    const content: PageGroupFileContent = {
        ..._.omit(pageGroup, 'id'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return fs.writeJson(path, content, { spaces: '  ' });
}

export function deletePageGroup(pageGroupId: string) {
    const path = pathlib.resolve(userPageGroupsFolder, `${pageGroupId}.json`);

    return fs.remove(path);
}

export function updatePageGroup(username: string, id: string, pageGroup: PutPageGroupsRequestBody) {
    const existingFilePath = pathlib.resolve(userPageGroupsFolder, `${id}.json`);
    const newFilePath = pathlib.resolve(userPageGroupsFolder, `${pageGroup.id}.json`);

    const content: PageGroupFileContent = {
        ..._.omit(pageGroup, 'id'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return fs.remove(existingFilePath).then(() => fs.writeJson(newFilePath, content, { spaces: '  ' }));
}

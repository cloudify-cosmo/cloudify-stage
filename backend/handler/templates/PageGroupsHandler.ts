import pathlib from 'path';
import _ from 'lodash';
import fs, { readdirSync, readJsonSync } from 'fs-extra';

import moment from 'moment';
import sanitizeFilename from 'sanitize-filename';
import { builtInTemplatesFolder, userTemplatesFolder } from './TemplatesHandler';
import { getLogger } from '../LoggerHandler';
import type { CreatePageGroupData, PageGroup, PageGroupFileContent } from './types';

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

export function getUserPageGroups() {
    return getPageGroups(userPageGroupsFolder, true);
}

export function listPageGroups() {
    return [...getPageGroups(builtInPageGroupsDir, false), ...getUserPageGroups()];
}

function getUserPageGroupPath(id: string) {
    return pathlib.resolve(userPageGroupsFolder, `${sanitizeFilename(id)}.json`);
}

export function checkPageGroupExists(pageGroup: CreatePageGroupData) {
    const path = getUserPageGroupPath(pageGroup.id);
    if (fs.existsSync(path)) {
        return Promise.reject(`Page group id "${pageGroup.id}" already exists`);
    }
    return Promise.resolve();
}

export function createPageGroup(pageGroup: CreatePageGroupData, updatedBy: string, updatedAt = moment().format()) {
    const path = getUserPageGroupPath(pageGroup.id);
    const content: PageGroupFileContent = {
        ..._.omit(pageGroup, 'id'),
        updatedBy,
        updatedAt
    };

    return fs.writeJson(path, content, { spaces: '  ' });
}

export function validateAndCreatePageGroup(username: string, pageGroup: CreatePageGroupData) {
    return checkPageGroupExists(pageGroup).then(() => createPageGroup(pageGroup, username));
}

export function deletePageGroup(pageGroupId: string) {
    const path = getUserPageGroupPath(pageGroupId);

    return fs.remove(path);
}

export function updatePageGroup(username: string, id: string, pageGroup: CreatePageGroupData) {
    const existingFilePath = getUserPageGroupPath(id);
    const newFilePath = getUserPageGroupPath(pageGroup.id);

    const content: PageGroupFileContent = {
        ..._.omit(pageGroup, 'id'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return fs.remove(existingFilePath).then(() => fs.writeJson(newFilePath, content, { spaces: '  ' }));
}

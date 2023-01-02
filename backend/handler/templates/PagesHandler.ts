import fs from 'fs-extra';
import _ from 'lodash';
import moment from 'moment';
import pathlib from 'path';

import { getLogger } from '../LoggerHandler';
import { defaultUpdater } from './consts';
import { builtInTemplatesFolder, userTemplatesFolder } from './TemplatesHandler';
import type { CreatePageData, Page, PageFileContent, UpdatePageData } from './types';

const logger = getLogger('TemplateHandler');

const builtInPagesFolder = pathlib.resolve(builtInTemplatesFolder, 'pages');
export const userPagesFolder = pathlib.resolve(userTemplatesFolder, 'pages');

function getPages(folder: string, custom: boolean) {
    return _.chain(fs.readdirSync(pathlib.resolve(folder)))
        .map(pageFile => {
            const pageFilePath = pathlib.resolve(folder, pageFile);

            try {
                const pageFileContent = fs.readJsonSync(pageFilePath);
                const id = pathlib.basename(pageFile, '.json');

                const {
                    name = id,
                    updatedBy = custom ? '' : defaultUpdater,
                    updatedAt = '',
                    ...data
                } = pageFileContent;

                const page: Page = { id, name, custom, updatedBy, updatedAt, data };
                return page;
            } catch (error) {
                logger.error(`Error when trying to parse ${pageFilePath} file to JSON.`, error);

                return null;
            }
        })
        .compact()
        .value();
}

export function getUserPages() {
    return getPages(userPagesFolder, true);
}

function getBuiltInPages() {
    return getPages(builtInPagesFolder, false);
}

function getUserPagePath(id: string) {
    return pathlib.resolve(userPagesFolder, `${id}.json`);
}

export function checkPageExists({ id }: { id: string }) {
    const path = getUserPagePath(id);
    if (fs.existsSync(path)) {
        return Promise.reject(`Page id "${id}" already exists`);
    }
    return Promise.resolve();
}

export function createPage(page: CreatePageData, updatedBy: string, updatedAt = moment().format()) {
    const path = getUserPagePath(page.id);
    const content: PageFileContent = {
        ..._.pick(page, 'name', 'layout', 'icon'),
        updatedBy,
        updatedAt
    };

    return fs.writeJson(path, content, { spaces: '  ' });
}

export function validateAndCreatePage(username: string, page: CreatePageData) {
    return checkPageExists(page).then(() => createPage(page, username));
}

export function updatePage(username: string, page: UpdatePageData) {
    const path = getUserPagePath(page.id);

    const content: PageFileContent = {
        ..._.omit(page, 'id'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return new Promise<void>((resolve, reject) => {
        if (page.oldId && page.id !== page.oldId) {
            if (fs.existsSync(path)) {
                reject(`Page name "${page.id}" already exists`);
            } else {
                deletePage(page.oldId)
                    .then(() => resolve())
                    .catch(error => reject(error));
            }
        } else {
            resolve();
        }
    }).then(() => fs.writeJson(path, content, { spaces: '  ' }));
}

export function deletePage(pageId: string) {
    const path = getUserPagePath(pageId);

    return new Promise<void>((resolve, reject) => {
        fs.remove(path, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function listPages() {
    return Promise.resolve(_.concat(getBuiltInPages(), getUserPages()));
}

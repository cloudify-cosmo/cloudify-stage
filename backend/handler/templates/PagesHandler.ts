import fs from 'fs-extra';
import _ from 'lodash';
import moment from 'moment';
import pathlib from 'path';

import { getLogger } from '../LoggerHandler';
import { defaultUpdater } from './consts';
import { builtInTemplatesFolder, userTemplatesFolder } from './TemplatesHandler';
import type { Page, PageFileContent, PostPagesRequestBody, PutPagesRequestBody } from '../../routes/Templates.types';

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

                return { id, name, custom, updatedBy, updatedAt, data } as Page;
            } catch (error) {
                logger.error(`Error when trying to parse ${pageFilePath} file to JSON.`, error);

                return null;
            }
        })
        .reject(_.isNull)
        .value();
}

function getUserPages() {
    return getPages(userPagesFolder, true);
}

function getBuiltInPages() {
    return getPages(builtInPagesFolder, false);
}

export function createPage(username: string, page: PostPagesRequestBody) {
    const path = pathlib.resolve(userPagesFolder, `${page.id}.json`);
    if (fs.existsSync(path)) {
        return Promise.reject(`Page id "${page.id}" already exists`);
    }

    const content: PageFileContent = {
        ..._.pick(page, 'name', 'layout'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return fs.writeJson(path, content, { spaces: '  ' });
}

export function updatePage(username: string, page: PutPagesRequestBody) {
    const path = pathlib.resolve(userPagesFolder, `${page.id}.json`);

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
    const path = pathlib.resolve(userPagesFolder, `${pageId}.json`);

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

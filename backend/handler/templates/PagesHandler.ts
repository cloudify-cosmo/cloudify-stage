import pathlib from 'path';
import _ from 'lodash';
import moment from 'moment';
import fs from 'fs-extra';

import { getLogger } from '../LoggerHandler';
import { builtInTemplatesFolder, userTemplatesFolder } from './TemplatesHandler';

const logger = getLogger('TemplateHandler');

const builtInPagesFolder = pathlib.resolve(builtInTemplatesFolder, 'pages');
export const userPagesFolder = pathlib.resolve(userTemplatesFolder, 'pages');

function getPages(folder: string, isCustom: boolean) {
    return _.chain(fs.readdirSync(pathlib.resolve(folder)))
        .map(pageFile => {
            const pageFilePath = pathlib.resolve(folder, pageFile);

            try {
                const pageFileContent = fs.readJsonSync(pageFilePath);
                const id = pathlib.basename(pageFile, '.json');

                const name = _.get(pageFileContent, 'name', id);
                const updatedBy = _.get(pageFileContent, 'updatedBy', isCustom ? '' : 'Manager');
                const updatedAt = _.get(pageFileContent, 'updatedAt', '');

                return { id, name, custom: isCustom, updatedBy, updatedAt };
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

export function createPage(username: string, page: Record<string, any>) {
    const path = pathlib.resolve(userPagesFolder, `${page.id}.json`);
    if (fs.existsSync(path)) {
        return Promise.reject(`Page id "${page.id}" already exists`);
    }

    const content = {
        ..._.pick(page, 'name', 'layout'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return fs.writeJson(path, content, { spaces: '  ' });
}

export function updatePage(username: string, page: Record<string, any>) {
    const path = pathlib.resolve(userPagesFolder, `${page.id}.json`);

    const content = {
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

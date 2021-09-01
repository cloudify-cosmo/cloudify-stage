// @ts-nocheck File not migrated fully to TS

import fs from 'fs-extra';
import pathlib from 'path';
import mkdirp from 'mkdirp';
import _ from 'lodash';
import moment from 'moment';

import { getMode, MODE_MAIN } from '../serverSettings';
import { getResourcePath } from '../utils';
import { getRBAC } from './AuthHandler';

import { getLogger } from './LoggerHandler';

const logger = getLogger('TemplateHandler');

const builtInTemplatesFolder = getResourcePath('templates', false);
const userTemplatesFolder = getResourcePath('templates', true);
const builtInPagesFolder = pathlib.resolve(builtInTemplatesFolder, 'pages');
const userPagesFolder = pathlib.resolve(userTemplatesFolder, 'pages');

const allTenants = '*';

function getTemplates(folder, isCustom, filter) {
    const compareTemplates = (templateA, templateB) => {
        const conflictingTemplates =
            !_.isEmpty(_.intersection(templateA.data.roles, templateB.data.roles)) &&
            !_.isEmpty(_.intersection(templateA.data.tenants, templateB.data.tenants));
        if (conflictingTemplates) {
            logger.warn(
                `Templates '${templateA.id}' and '${templateB.id}' are in conflict (roles and tenants). ` +
                    `Not including '${templateA.id}'.`
            );
        }
        return conflictingTemplates;
    };

    return _.chain(fs.readdirSync(pathlib.resolve(folder)))
        .filter(fileName => fs.lstatSync(pathlib.resolve(folder, fileName)).isFile() && filter(fileName))
        .map(templateFile => {
            const templateFilePath = pathlib.resolve(folder, templateFile);

            try {
                const pageFileContent = fs.readJsonSync(templateFilePath);
                const id = pathlib.basename(templateFile, '.json');

                const name = _.get(pageFileContent, 'name', id);
                const updatedBy = _.get(pageFileContent, 'updatedBy', isCustom ? '' : 'Manager');
                const updatedAt = _.get(pageFileContent, 'updatedAt', '');
                const data = {
                    roles: _.get(pageFileContent, 'roles', []),
                    tenants: _.get(pageFileContent, 'tenants', [])
                };

                return { id, name, custom: isCustom, data, updatedBy, updatedAt };
            } catch (error) {
                logger.error(`Error when trying to parse ${templateFilePath} file to JSON.`, error);

                return null;
            }
        })
        .uniqWith(compareTemplates)
        .value();
}

function getUserTemplates() {
    return getTemplates(userTemplatesFolder, true, () => true);
}

function getBuiltInTemplates() {
    const mode = getMode();
    return getTemplates(builtInTemplatesFolder, false, fileName => _.startsWith(pathlib.basename(fileName), mode));
}

export function listTemplates() {
    return Promise.resolve(_.concat(getBuiltInTemplates(), getUserTemplates()));
}

function getPages(folder, isCustom) {
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

function getHighestRole(userRoles, allRoles) {
    return _.get(
        _.find(allRoles, role => _.includes(userRoles, role.name)),
        'name',
        null
    );
}

async function getRole(userSystemRole, groupSystemRoles, tenantsRoles, tenant, token) {
    const rbac = await getRBAC(token);
    const { roles } = rbac;
    const userRoles = _.compact(
        _.concat(_.get(tenantsRoles[tenant], 'roles', []), userSystemRole, _.keys(groupSystemRoles))
    );

    logger.debug(
        `Inputs for role calculation: systemRole=${userSystemRole}, tenant=${tenant}, tenantsRoles=${JSON.stringify(
            tenantsRoles
        )}, userRoles=${JSON.stringify(userRoles)}`
    );

    const role = getHighestRole(userRoles, roles);
    logger.debug(`Calculated role: ${role}`);
    return role;
}

async function getSystemRole(userSystemRole, groupSystemRoles, token) {
    const rbac = await getRBAC(token);
    const { roles } = rbac;
    const systemRoles = [userSystemRole, ..._.keys(groupSystemRoles)];

    logger.debug(
        `Inputs for system role calculation: userSystemRole=${userSystemRole}, groupSystemRoles=${JSON.stringify(
            groupSystemRoles
        )}`
    );

    const systemRole = getHighestRole(systemRoles, roles);
    logger.debug(`Calculated system role: ${systemRole}`);
    return systemRole;
}

export function listPages() {
    return Promise.resolve(_.concat(getBuiltInPages(), getUserPages()));
}

function checkTemplateExistence(data, excludeTemplateId) {
    const { roles } = data;
    const { tenants } = data;
    const getTenantString = tenant => (tenant === allTenants ? 'all tenants' : `tenant=${tenant}`);

    const userTemplates = _.filter(getUserTemplates(), template => template.id !== excludeTemplateId);

    logger.debug(
        `Checking template existence for roles=${roles} and ${getTenantString(tenants)}.` +
            `${excludeTemplateId ? ` Excluding: '${excludeTemplateId}' template.` : ''}`
    );

    const conflictingTemplate = _.filter(
        userTemplates,
        userTemplate =>
            !_.isEmpty(_.intersection(roles, userTemplate.data.roles)) &&
            !_.isEmpty(_.intersection(tenants, userTemplate.data.tenants))
    );

    if (!_.isEmpty(conflictingTemplate)) {
        return Promise.reject(
            `Template for specified role(s) and tenant(s) already exists: '${conflictingTemplate[0].id}'.`
        );
    }
    return Promise.resolve();
}

export function createTemplate(username, template) {
    const path = pathlib.resolve(userTemplatesFolder, `${template.id}.json`);
    if (fs.existsSync(path)) {
        return Promise.reject(`Template name "${template.id}" already exists`);
    }

    const content = {
        updatedBy: username,
        updatedAt: moment().format(),
        roles: template.data.roles,
        tenants: template.data.tenants,
        pages: template.pages
    };

    return checkTemplateExistence(template.data).then(() => fs.writeJson(path, content, { spaces: '  ' }));
}

export function deleteTemplate(templateId) {
    const path = pathlib.resolve(userTemplatesFolder, `${templateId}.json`);

    return new Promise((resolve, reject) => {
        fs.remove(path, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function updateTemplate(username, template) {
    const path = pathlib.resolve(userTemplatesFolder, `${template.id}.json`);

    const content = {
        updatedBy: username,
        updatedAt: moment().format(),
        roles: template.data.roles,
        tenants: template.data.tenants,
        pages: template.pages
    };

    return checkTemplateExistence(template.data, template.oldId)
        .then(
            () =>
                new Promise((resolve, reject) => {
                    if (template.oldId && template.id !== template.oldId) {
                        if (fs.existsSync(path)) {
                            reject(`Template name "${template.id}" already exists`);
                        } else {
                            deleteTemplate(template.oldId)
                                .then(() => resolve())
                                .catch(error => reject(error));
                        }
                    } else {
                        resolve();
                    }
                })
        )
        .then(() => fs.writeJson(path, content, { spaces: '  ' }));
}

export function createPage(username, page) {
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

export function deletePage(pageId) {
    const path = pathlib.resolve(userPagesFolder, `${pageId}.json`);

    return new Promise((resolve, reject) => {
        fs.remove(path, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function updatePage(username, page) {
    const path = pathlib.resolve(userPagesFolder, `${page.id}.json`);

    const content = {
        ..._.omit(page, 'id'),
        updatedBy: username,
        updatedAt: moment().format()
    };

    return new Promise((resolve, reject) => {
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

export async function selectTemplate(userSystemRole, groupSystemRoles, tenantsRoles, tenant, token) {
    const role = await getRole(userSystemRole, groupSystemRoles, tenantsRoles, tenant, token);
    const systemRole = await getSystemRole(userSystemRole, groupSystemRoles, token);
    const mode = getMode();
    let templateId = null;

    logger.debug(`Template inputs: mode=${mode}, role=${role}, systemRole=${systemRole}, tenant=${tenant}`);

    // Search user template
    if (mode === MODE_MAIN) {
        const userTemplates = getUserTemplates();
        const matchingTemplateForSpecificTenant = _.find(
            userTemplates,
            template => _.includes(template.data.roles, role) && _.includes(template.data.tenants, tenant)
        );

        if (!matchingTemplateForSpecificTenant) {
            const matchingTemplateForAllTenants = _.find(
                userTemplates,
                template => _.includes(template.data.roles, role) && _.includes(template.data.tenants, allTenants)
            );
            templateId = _.get(matchingTemplateForAllTenants, 'id', null);
        } else {
            templateId = matchingTemplateForSpecificTenant.id;
        }
    }

    // Search built-in template
    if (!templateId) {
        if (mode === MODE_MAIN) {
            templateId = `${mode}-${systemRole}`;
        } else {
            templateId = mode;
        }
        logger.debug(`No user template found. Using: ${templateId}`);
    } else {
        logger.debug(`User template found: ${templateId}`);
    }

    return templateId;
}

export function init() {
    return new Promise((resolve, reject) => {
        try {
            logger.info('Setting up user templates directory:', userTemplatesFolder);
            mkdirp.sync(userTemplatesFolder);
            logger.info('Setting up user pages directory:', userPagesFolder);
            mkdirp.sync(userPagesFolder);
            return resolve();
        } catch (e) {
            logger.error('Could not set up directories for templates and pages, error was:', e);
            return reject(`Could not set up directories for templates and pages, error was: ${e}`);
        }
    });
}

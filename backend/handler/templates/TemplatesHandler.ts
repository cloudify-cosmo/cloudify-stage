import fs from 'fs-extra';
import _ from 'lodash';
import moment from 'moment';
import pathlib from 'path';

import { getMode, MODE_MAIN } from '../../serverSettings';
import type { TenantsRoles } from '../../types';
import { getResourcePath } from '../../utils';
import { getRBAC } from '../AuthHandler';

import { getLogger } from '../LoggerHandler';
import { defaultUpdater } from './consts';
import type { CreateTemplateData, Template, TemplateData, TemplateFileContent, UpdateTemplateData } from './types';

const logger = getLogger('TemplateHandler');

export const builtInTemplatesFolder = getResourcePath('templates', false);
export const userTemplatesFolder = getResourcePath('templates', true);

const allTenants = '*';

function getTemplates(folder: string, custom: boolean, filter: (fileName: string) => boolean) {
    const compareTemplates = (templateA: Template, templateB: Template) => {
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
                const templateFileContent: TemplateFileContent = fs.readJsonSync(templateFilePath);
                const id = pathlib.basename(templateFile, '.json');

                const name = id;
                const { updatedBy = custom ? '' : defaultUpdater, updatedAt = '', ...data } = templateFileContent;

                const template: Template = {
                    id,
                    name,
                    custom,
                    data,
                    updatedBy,
                    updatedAt
                };
                return template;
            } catch (error) {
                logger.error(`Error when trying to parse ${templateFilePath} file to JSON.`, error);

                return null;
            }
        })
        .compact()
        .uniqWith(compareTemplates)
        .value();
}

export function getUserTemplates() {
    return getTemplates(userTemplatesFolder, true, () => true);
}

function getBuiltInTemplates() {
    const mode = getMode();
    return getTemplates(builtInTemplatesFolder, false, fileName => _.startsWith(pathlib.basename(fileName), mode));
}

export function listTemplates() {
    return Promise.resolve(_.concat(getBuiltInTemplates(), getUserTemplates()));
}

function getHighestRole(userRoles: string[], allRoles: { name: string }[]) {
    return _.get(
        _.find(allRoles, role => _.includes(userRoles, role.name)),
        'name',
        null
    );
}

async function getRole(
    userSystemRole: string,
    groupSystemRoles: Record<string, any>,
    tenantsRoles: TenantsRoles,
    tenant: string,
    token: string
) {
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

async function getSystemRole(userSystemRole: string, groupSystemRoles: Record<string, any>, token: string) {
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

function checkTemplateConflict(data: TemplateData, excludeTemplateId?: string) {
    const { tenants, roles } = data;
    const getTenantString = (listOfTenants: string[]) =>
        listOfTenants.includes(allTenants) ? 'all tenants' : `tenants="${listOfTenants.join(', ')}"`;

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

function getUserTemplatePath(id: string) {
    return pathlib.resolve(userTemplatesFolder, `${id}.json`);
}

export function checkTemplateExists(template: Pick<CreateTemplateData, 'id' | 'data'>) {
    const path = getUserTemplatePath(template.id);
    if (fs.existsSync(path)) {
        return Promise.reject(`Template name "${template.id}" already exists`);
    }

    return checkTemplateConflict(template.data);
}

export function createTemplate(template: CreateTemplateData, updatedBy: string, updatedAt = moment().format()) {
    const path = getUserTemplatePath(template.id);
    const content: TemplateFileContent = {
        updatedBy,
        updatedAt,
        roles: template.data.roles,
        tenants: template.data.tenants,
        pages: template.pages
    };
    return fs.writeJson(path, content, { spaces: '  ' });
}

export function validateAndCreateTemplate(username: string, template: CreateTemplateData) {
    return checkTemplateExists(template).then(() => createTemplate(template, username));
}

export function deleteTemplate(templateId: string) {
    const path = getUserTemplatePath(templateId);

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

export function updateTemplate(username: string, templateUpdate: UpdateTemplateData) {
    const path = getUserTemplatePath(templateUpdate.id);

    const content: TemplateFileContent = {
        updatedBy: username,
        updatedAt: moment().format(),
        roles: templateUpdate.data.roles,
        tenants: templateUpdate.data.tenants,
        pages: templateUpdate.pages
    };

    return checkTemplateConflict(templateUpdate.data, templateUpdate.oldId)
        .then(
            () =>
                new Promise<void>((resolve, reject) => {
                    if (templateUpdate.oldId && templateUpdate.id !== templateUpdate.oldId) {
                        if (fs.existsSync(path)) {
                            reject(`Template name "${templateUpdate.id}" already exists`);
                        } else {
                            deleteTemplate(templateUpdate.oldId)
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

export async function getInitialTemplateId(
    userSystemRole: string,
    groupSystemRoles: Record<string, any>,
    tenantsRoles: TenantsRoles,
    tenant: string,
    token: string
) {
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

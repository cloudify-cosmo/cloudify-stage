import fs from 'fs-extra';
import pathlib from 'path';
import _ from 'lodash';
import moment from 'moment';

import { getMode, MODE_MAIN } from '../../serverSettings';
import { getResourcePath } from '../../utils';
import { getRBAC } from '../AuthHandler';

import { getLogger } from '../LoggerHandler';
import type { TenantsRoles } from '../../types';

const logger = getLogger('TemplateHandler');

export const builtInTemplatesFolder = getResourcePath('templates', false);
export const userTemplatesFolder = getResourcePath('templates', true);

const allTenants = '*';

interface Template {
    id: string;
    name: string;
    data: { roles: any; tenants: any };
    pages?: any;
    updatedBy: string;
    updatedAt: string;
    custom: boolean;
}

interface TemplateUpdate extends Pick<Template, 'id' | 'data' | 'pages'> {
    oldId: string;
}

function getTemplates(folder: string, isCustom: boolean, filter: (fileName: string) => boolean) {
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
                const templateFileContent = fs.readJsonSync(templateFilePath);
                const id = pathlib.basename(templateFile, '.json');

                const name = _.get(templateFileContent, 'name', id) as string;
                const updatedBy = _.get(templateFileContent, 'updatedBy', isCustom ? '' : 'Manager') as string;
                const updatedAt = _.get(templateFileContent, 'updatedAt', '') as string;
                const data = {
                    roles: _.get(templateFileContent, 'roles', []),
                    tenants: _.get(templateFileContent, 'tenants', [])
                };

                return { id, name, custom: isCustom, data, updatedBy, updatedAt };
            } catch (error) {
                logger.error(`Error when trying to parse ${templateFilePath} file to JSON.`, error);

                return null;
            }
        })
        .compact()
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

function checkTemplateExistence(data: Template['data'], excludeTemplateId?: string) {
    const { roles } = data;
    const { tenants } = data;
    const getTenantString = (tenant: string) => (tenant === allTenants ? 'all tenants' : `tenant=${tenant}`);

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

export function createTemplate(username: string, template: Template) {
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

export function deleteTemplate(templateId: string) {
    const path = pathlib.resolve(userTemplatesFolder, `${templateId}.json`);

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

export function updateTemplate(username: string, templateUpdate: TemplateUpdate) {
    const path = pathlib.resolve(userTemplatesFolder, `${templateUpdate.id}.json`);

    const content = {
        updatedBy: username,
        updatedAt: moment().format(),
        roles: templateUpdate.data.roles,
        tenants: templateUpdate.data.tenants,
        pages: templateUpdate.pages
    };

    return checkTemplateExistence(templateUpdate.data, templateUpdate.oldId)
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

export async function selectTemplate(
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

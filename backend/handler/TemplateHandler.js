/**
 * Created by pposel on 24/02/2017.
 */

const fs = require('fs-extra');
const pathlib = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const moment = require('moment');

const ServerSettings = require('../serverSettings');
const Utils = require('../utils');
const AuthHandler = require('./AuthHandler');

const logger = require('./LoggerHandler').getLogger('TemplateHandler');

const builtInTemplatesFolder = Utils.getResourcePath('templates', false);
const userTemplatesFolder = Utils.getResourcePath('templates', true);
const builtInPagesFolder = pathlib.resolve(builtInTemplatesFolder, 'pages');
const userPagesFolder = pathlib.resolve(userTemplatesFolder, 'pages');

const allTenants = '*';

module.exports = (() => {
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
                    const updatedBy = _.get(pageFileContent, 'updatedBy', isCustom ? '' : 'Cloudify');
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
        const { mode } = ServerSettings.settings;
        return getTemplates(builtInTemplatesFolder, false, fileName => _.startsWith(pathlib.basename(fileName), mode));
    }

    function listTemplates() {
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
                    const updatedBy = _.get(pageFileContent, 'updatedBy', isCustom ? '' : 'Cloudify');
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

    async function getRole(systemRole, groupSystemRoles, tenantsRoles, tenant, token) {
        const rbac = await AuthHandler.getRBAC(token);
        const { roles } = rbac;

        logger.debug(
            `${'Inputs for role calculation: systemRole='}${systemRole}, tenant=${tenant}, tenantsRoles=${JSON.stringify(
                tenantsRoles
            )}`
        );

        const userRoles = _.compact(
            _.concat(_.get(tenantsRoles[tenant], 'roles', []), systemRole, _.keys(groupSystemRoles))
        );

        let result = null;
        for (let i = 0; i < roles.length; i += 1) {
            const role = roles[i].name;
            if (_.includes(userRoles, role)) {
                result = role;
                break;
            }
        }

        logger.debug(`Calculated role: ${result}`);
        return result;
    }

    function listPages() {
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

    function createTemplate(username, template) {
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

    function deleteTemplate(templateId) {
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

    function updateTemplate(username, template) {
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

    function createPage(username, page) {
        const path = pathlib.resolve(userPagesFolder, `${page.id}.json`);
        if (fs.existsSync(path)) {
            return Promise.reject(`Page id "${page.id}" already exists`);
        }

        const content = {
            name: page.name,
            updatedBy: username,
            updatedAt: moment().format(),
            widgets: page.widgets
        };

        return fs.writeJson(path, content, { spaces: '  ' });
    }

    function deletePage(pageId) {
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

    function updatePage(username, page) {
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

    async function selectTemplate(systemRole, groupSystemRoles, tenantsRoles, tenant, token) {
        const role = await getRole(systemRole, groupSystemRoles, tenantsRoles, tenant, token);
        const { mode } = ServerSettings.settings;
        let templateId = null;

        logger.debug(`Template inputs: mode=${mode}, role=${role}, tenant=${tenant}`);

        // Search user template
        if (mode === ServerSettings.MODE_MAIN) {
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
            if (mode === ServerSettings.MODE_MAIN) {
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

    function init() {
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

    return {
        init,
        listTemplates,
        listPages,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        selectTemplate,
        createPage,
        updatePage,
        deletePage
    };
})();

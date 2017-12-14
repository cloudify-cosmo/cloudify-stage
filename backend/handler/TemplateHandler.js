'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var db = require('../db/Connection');
var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var ServerSettings = require('../serverSettings');
var ResourceTypes = require('../db/types/ResourceTypes');
var AuthHandler = require('./AuthHandler');

var logger = require('log4js').getLogger('templates');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var templatesFolder = '../templates';
if (!fs.existsSync(templatesFolder)) {
    templatesFolder = '../dist/templates';
}
const pagesFolder = pathlib.resolve(templatesFolder, 'pages');

module.exports = (function() {

    function _getTemplates() {
        var initials = [];
        if (ServerSettings.settings.mode === ServerSettings.MODE_MAIN) {
            initials = _.pick(config.app.initialTemplate, [ServerSettings.MODE_COMMUNITY, ServerSettings.MODE_CUSTOMER]);
        } else {
            initials = _.omit(config.app.initialTemplate, ServerSettings.settings.mode);
        }

        var excludes = _.reduce(initials, (result, value) => _.concat(result, _.isObject(value) ? _.values(value) : value), []);

        return fs.readdirSync(pathlib.resolve(templatesFolder))
            .filter(item => fs.lstatSync(pathlib.resolve(templatesFolder, item)).isFile()
                && !_.includes(excludes, pathlib.basename(item, '.json')));
    }

    function _getInitialTemplateConfig() {
        var data = {};
        _.forOwn(config.app.initialTemplate, function(value, role) {
            if (_.isObject(value)) {
                _.forOwn(value, function(template, tenant) {
                    var item = data[template] || {roles: [], tenants: []};
                    item.tenants.push(tenant);
                    if (_.indexOf(item.roles, role) < 0) {
                        item.roles.push(role);
                    }
                    data[template] = item;
                });
            } else {
                var item = data[value] || {roles: [], tenants: []};
                item.roles.push(role);
                data[value] = item;
            }
        });

        return data;
    }

    function listTemplates() {
        var templates = _getTemplates();
        var initial = _getInitialTemplateConfig();

        return db.Resources
            .findAll({where: {type: ResourceTypes.TEMPLATE},
                      attributes: [['resourceId','id'], 'createdAt', 'creator', 'data'], raw: true})
            .then(items => templates.map(name => {
                var id = pathlib.parse(name).name;
                var item = _.find(items, {id});
                return item ? _.extend(item,{custom: true}) : {id, data: initial[id], custom: false};
            }));
    }

    function _getPages() {
        return fs.readdirSync(pathlib.resolve(pagesFolder));
    }

    function _getRole(systemRole, tenantsRoles, tenant) {
        var rbac = AuthHandler.getRBAC();
        var roles = rbac.roles;

        logger.debug('Inputs for role calculation: ' + 'systemRole=' + systemRole +
                     ', tenant=' + tenant + ', tenantsRoles=' + JSON.stringify(tenantsRoles));

        var userRoles = _.compact(_.concat(_.get(tenantsRoles[tenant], 'roles', []), systemRole));

        var result = null;
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i].name;
            if (_.includes(userRoles, role)) {
                result = role;
                break;
            }
        }

        logger.debug('Calculated role: ' + result);
        return result;
    }

    function listPages() {
        var pages = _getPages();

        return db.Resources
            .findAll({where: {type: ResourceTypes.PAGE}, attributes: [['resourceId','id'], 'createdAt', 'creator'], raw: true})
            .then(items => pages.map(name => {
                var id = pathlib.parse(name).name;
                var item = _.find(items, {id});
                return item ? _.extend(item,{custom: true}) : {id, custom: false};
            }));
    }

    function createTemplate(username, template) {
        var path = pathlib.resolve(templatesFolder, template.id + '.json');
        if (fs.existsSync(path)) {
            return Promise.reject('Template name "' + template.id + '" already exists');
        }

        return checkTemplateExistence(template.data)
            .then(() => fs.writeJson(path, template.pages, {spaces: '  '}))
            .then(() => db.Resources.destroy({where: {resourceId: template.id, type:ResourceTypes.TEMPLATE}}))
            .then(() => db.Resources.create({resourceId:template.id, type:ResourceTypes.TEMPLATE, creator: username, data: template.data}));
    }

    function updateTemplate(username, template) {
        var path = pathlib.resolve(templatesFolder, template.id + '.json');

        return checkTemplateExistence(template.data, template.oldId)
        .then(() =>
            new Promise((resolve, reject) => {
                if (template.oldId && template.id !== template.oldId) {
                    if (fs.existsSync(path)) {
                        reject('Template name "' + template.id + '" already exists');
                    } else {
                        deleteTemplate(template.oldId)
                            .then(() => resolve())
                            .catch(error => reject(error));
                    }
                } else {
                    resolve();
                }
            }))
        .then(() => fs.writeJson(path, template.pages, {spaces: '  '}))
        .then(() => db.Resources.findOne({ where: {resourceId:template.id, type:ResourceTypes.TEMPLATE} }))
        .then(entity => {
            if(entity) {
                return entity.update({resourceId:template.id, data: template.data});
            } else {
                return db.Resources.create({resourceId:template.id, type:ResourceTypes.TEMPLATE, creator: username, data: template.data});
            }
        });
    }

    function checkTemplateExistence(data, excludeTemplateId) {
        var incomingAllTenants =  _.indexOf(data.tenants, '*') >= 0;
        var textRoles = _.replace(JSON.stringify(data.roles), /"/g, "'");
        var textTenants = _.replace(JSON.stringify(_.concat(data.tenants, '*')), /"/g, "'");

        var where = {
            type: ResourceTypes.TEMPLATE,
            data: incomingAllTenants ?
                db.sequelize.literal(`data->'roles' ?| array${textRoles}`)
                :
                db.sequelize.literal(`data->'roles' ?| array${textRoles} and data->'tenants' ?| array${textTenants}`)
        };

        if (excludeTemplateId) {
            where.resourceId = {ne: excludeTemplateId};
        }

        return new Promise((resolve, reject) => {
            db.Resources
                .findOne({where, attributes: ['data'], raw: true})
                .then(entity => {
                    if (entity) {
                        var commonRoles = _.join(_.intersection(data.roles, entity.data.roles), ', ');
                        var allTenantsExists = _.indexOf(entity.data.tenants, '*') >= 0;

                        if (incomingAllTenants) {
                            var existingTenants = entity.data.tenants;
                            reject(`Template cannot be created for all tenants because there is already template for roles [${commonRoles}] and tenants [${existingTenants}]`);
                        } else if (allTenantsExists) {
                            var incomingTenants = _.join(data.tenants, ', ');
                            reject(`Template cannot be created for roles [${commonRoles}] and tenants [${incomingTenants}] because there is already template for these roles and all tenants`);
                        } else {
                            var commonTenants = _.join(_.intersection(data.tenants, entity.data.tenants), ', ');
                            reject(`Template for roles [${commonRoles}] and tenants [${commonTenants}] already exists`);
                        }
                    } else {
                        resolve();
                    }
                })
        });
    }

    function deleteTemplate(templateId) {
        var path = pathlib.resolve(templatesFolder, templateId + '.json');

        return new Promise((resolve,reject) => {
            fs.remove(path, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        }).then(() => db.Resources.destroy({ where: {resourceId: templateId, type:ResourceTypes.TEMPLATE}}));
    }

    function createPage(username, page) {
        var path = pathlib.resolve(pagesFolder, page.id + '.json');
        if (fs.existsSync(path)) {
            return Promise.reject('Page id "' + page.id + '" already exists');
        }

        var content = {
            'name': page.name,
            'widgets': page.widgets
        }

        return fs.writeJson(path, content, {spaces: '  '})
            .then(() => db.Resources.destroy({ where:{resourceId: page.id, type:ResourceTypes.PAGE}}))
            .then(() => db.Resources.create({resourceId:page.id, type:ResourceTypes.PAGE, creator: username}));
    }

    function updatePage(username, page) {
        var path = pathlib.resolve(pagesFolder, page.id + '.json');

        var content = {
            'name': page.name,
            'widgets': page.widgets
        }

        return new Promise((resolve, reject) => {
            if (page.oldId && page.id !== page.oldId) {
                if (fs.existsSync(path)) {
                    reject('Page name "' + page.id + '" already exists');
                } else {
                    deletePage(page.oldId)
                        .then(() => resolve())
                        .catch(error => reject(error));
                }
            } else {
                resolve();
            }
        })
        .then(() => fs.writeJson(path, content, {spaces: '  '}))
        .then(() => db.Resources.findOne({ where: {resourceId:page.id, type:ResourceTypes.PAGE} }))
        .then(entity => {
            if(entity) {
                return Promise.resolve();
            } else {
                return db.Resources.create({resourceId:page.id, type:ResourceTypes.PAGE, creator: username});
            }
        });
    }

    function deletePage(pageId) {
        var path = pathlib.resolve(pagesFolder, pageId + '.json');

        return new Promise((resolve,reject) => {
            fs.remove(path, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        }).then(() => db.Resources.destroy({ where: {resourceId: pageId, type:ResourceTypes.PAGE}}));
    }

    function selectTemplate(systemRole, tenantsRoles, tenant) {
        var DEFAULT_KEY = '*';

        var initialTemplateObj = config.app.initialTemplate;
        var role = _getRole(systemRole, tenantsRoles, tenant);
        var mode = ServerSettings.settings.mode;

        logger.debug('Template inputs: mode=' + mode + ', role=' + role + ', tenant=' + tenant);

        var promise;
        if (mode === ServerSettings.MODE_MAIN) {
            promise = db.Resources
                .findOne({where: {type: ResourceTypes.TEMPLATE,
                    data: db.sequelize.literal(`data->'roles' ? '${role}' and (data->'tenants' ? '${tenant}' or data->'tenants' ? '${DEFAULT_KEY}')`)},
                          attributes: ['resourceId'], raw: true})
                .then(entity => entity ? entity.resourceId : null);
        } else {
            promise = Promise.resolve();
        }

        return promise.then(templateId => {
            logger.debug('Custom template: ' + templateId);

            if (!templateId) {
                var initialTemplateModeRole = (initialTemplateObj[mode === ServerSettings.MODE_MAIN ? role : mode]) || initialTemplateObj[DEFAULT_KEY];

                if (_.isObject(initialTemplateModeRole)) {
                    templateId = _.get(
                        initialTemplateModeRole,
                        tenant,
                        initialTemplateModeRole[DEFAULT_KEY] || initialTemplateObj[DEFAULT_KEY]
                    );
                } else if (_.isString(initialTemplateModeRole)) {
                    templateId = initialTemplateModeRole;
                } else {
                    throw `Error in configuration. Initial template for (mode=${mode}, role=${role}, tenant=${tenant}) invalid.`;
                }
            }

            return templateId;
        });
    }

    return {
        listTemplates,
        listPages,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        selectTemplate,
        createPage,
        updatePage,
        deletePage
    }
})();

'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var os = require('os');
var db = require('../db/Connection');
var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var ArchiveHelper = require('./ArchiveHelper');
var ResourceTypes = require('../db/types/ResourceTypes');

var logger = require('log4js').getLogger('templates');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var templatesFolder = '../templates';
if (!fs.existsSync(templatesFolder)) {
    templatesFolder = '../dist/templates';
}
const pagesFolder = pathlib.resolve(templatesFolder, 'pages');

module.exports = (function() {

    function _getTemplates() {
        return fs.readdirSync(pathlib.resolve(templatesFolder))
            .filter(item => fs.lstatSync(pathlib.resolve(templatesFolder, item)).isFile());
    }

    function _getInitialTemplateConfig() {

        function asterixReplacement(value) {
            return value === '*' ? 'all' : value;
        }


        var data = {};
        _.forOwn(config.app.initialTemplate, function(value, role) {
            if (_.isObject(value)) {
                _.forOwn(value, function(template, tenant) {
                    var item = data[template] || {roles: [], tenants: []};
                    item.tenants.push(asterixReplacement(tenant));
                    if (_.indexOf(item.roles, role) < 0) {
                        item.roles.push(asterixReplacement(role));
                    }
                    data[template] = item;
                });
            } else {
                var item = data[value] || {roles: [], tenants: []};
                item.roles.push(asterixReplacement(role));
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

        return fs.writeJson(path, template.pages, {spaces: '  '})
            .then(() => db.Resources.create({resourceId:template.id, type:ResourceTypes.TEMPLATE, creator: username, data: template.data}));
    }

    function updateTemplate(username, template) {
        var path = pathlib.resolve(templatesFolder, template.id + '.json');

        return new Promise((resolve, reject) => {
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
        })
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
            .then(() => db.Resources.create({resourceId:page.id, type:ResourceTypes.PAGE, creator: username}));
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

    function selectTemplates(role, tenant) {
        return db.Resources
            .findAll({where: {type: ResourceTypes.TEMPLATE, data: db.sequelize.literal(`data->'roles' ? '${role}' and data->'tenants' ? '${tenant}'`)},
                      attributes: ['resourceId'], raw: true});
    }

    return {
        listTemplates,
        listPages,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        selectTemplates,
        createPage,
        deletePage
    }
})();

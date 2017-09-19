/**
 * Created by pposel on 11/09/2017.
 */

import * as types from './types';
import {addTemplate, editTemplate, removeTemplate, addPage, removePage} from '../actions/templates';
import Internal from '../utils/Internal';

export function reqTemplateManagement() {
    return {
        type: types.TEMPLATE_MANAGEMENT_LOADING
    }
}

function errorTemplateManagement(err) {
    return {
        type: types.TEMPLATE_MANAGEMENT_ERROR,
        error: err,
        receivedAt: Date.now()
    }
}

export function fetchTemplateManagement(templates, pages) {
    return {
        type: types.TEMPLATE_MANAGEMENT_FETCH,
        templates,
        pages
    }
}

export function fetchTemplates() {
    return function (dispatch, getState) {
        var state = getState();
        var internal = new Internal(state.manager);
        var storeTemplates = state.templates;
        var storeTemplateManagement = state.templateManagement;

        return Promise.all([internal.doGet('/templates'), internal.doGet('/templates/pages')])
            .then(data => {
                var selectedTemplate = _.find(storeTemplateManagement.templates, {'selected': true});
                var selectedPage = _.find(storeTemplateManagement.pages, {'selected': true});

                var templateList = data[0];
                var pageList = data[1];

                var templates = _.map(templateList, template => {
                    return {...template, pages: storeTemplates[template.id]}
                });
                if (selectedTemplate) {
                    (_.find(templates, {'id': selectedTemplate.id}) || {}).selected = true;
                }


                var pages = _.map(pageList, page => {
                    return {...page, name: (storeTemplates[page.id] || {}).name,
                            templates: _.map(_.filter(templates, template => _.indexOf(template.pages, page.id) >= 0), 'id')
                    }
                });
                if (selectedPage) {
                    (_.find(pages, {'id': selectedPage.id}) || {}).selected = true;
                }

                return dispatch(fetchTemplateManagement(templates, pages));
            });
    }
}

export function getTemplates() {
    return function (dispatch) {
        dispatch(reqTemplateManagement());

        dispatch(fetchTemplates())
            .catch(err => dispatch(errorTemplateManagement(err.message)));
    }
}

export function createTemplate(template) {
    return function (dispatch, getState) {
        var internal = new Internal(getState().manager);
        return internal.doPost('/templates', {}, template)
            .then(() => dispatch(addTemplate(template.id, template.pages)))
            .then(() => dispatch(fetchTemplates()));
    }
}

export function updateTemplate(template) {
    return function (dispatch, getState) {
        var internal = new Internal(getState().manager);
        return internal.doPut('/templates', {}, template)
            .then(() => {
                dispatch(editTemplate(template.id, template.pages));
                if (template.oldId && template.oldId !== template.id) {
                    dispatch(removeTemplate(template.oldId));
                }
            })
            .then(() => dispatch(fetchTemplates()));
    }
}

export function deleteTemplate(templateId) {
    return function (dispatch, getState) {
        dispatch(reqTemplateManagement());

        var internal = new Internal(getState().manager);
        return internal.doDelete(`/templates/${templateId}`)
            .then(() => dispatch(removeTemplate(templateId)))
            .then(() => dispatch(fetchTemplates()))
            .catch(err => dispatch(errorTemplateManagement(err.message)));
    }
}

export function createPage(page) {
    return function (dispatch, getState) {
        var internal = new Internal(getState().manager);
        return internal.doPost('/templates/pages', {}, page)
            .then(() => dispatch(addPage(page.id, page.name, page.widgets)))
            .then(() => dispatch(fetchTemplates()));
    }
}

export function deletePage(pageId) {
    return function (dispatch, getState) {
        dispatch(reqTemplateManagement());

        var internal = new Internal(getState().manager);
        return internal.doDelete(`/templates/pages/${pageId}`)
            .then(() => dispatch(removePage(pageId)))
            .then(() => dispatch(fetchTemplates()))
            .catch(err => dispatch(errorTemplateManagement(err.message)));
    }
}

export function selectTemplate(templateId) {
    return {
        type: types.TEMPLATE_MANAGEMENT_SEL_TEMPLATE,
        templateId
    }
}

export function selectPage(pageId) {
    return {
        type: types.TEMPLATE_MANAGEMENT_SEL_PAGE,
        pageId
    }
}

export function clear() {
    return {
        type: types.TEMPLATE_MANAGEMENT_CLEAR
    }
}

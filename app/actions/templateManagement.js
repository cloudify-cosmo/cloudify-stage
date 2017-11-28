/**
 * Created by pposel on 11/09/2017.
 */

import * as types from './types';
import { push } from 'react-router-redux';
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
                    return {...template, pages: storeTemplates.templatesDef[template.id]}
                });
                if (selectedTemplate) {
                    (_.find(templates, {'id': selectedTemplate.id}) || {}).selected = true;
                }


                var pages = _.map(pageList, page => {
                    return {...page, name: (storeTemplates.pagesDef[page.id] || {}).name,
                            templates: _.map(_.filter(templates, template => _.indexOf(template.pages, page.id) >= 0), 'id')
                    }
                });
                if (selectedPage) {
                    (_.find(pages, {'id': selectedPage.id}) || {}).selected = true;
                }

                return dispatch(fetchTemplateManagement(templates, pages));
            })
            .catch(err => dispatch(errorTemplateManagement(err.message)));
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
            .then(() => dispatch(fetchTemplates()))
            .catch(err => dispatch(errorTemplateManagement(err.message)));
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
            .then(() => dispatch(fetchTemplates()))
            .catch(err => dispatch(errorTemplateManagement(err.message)));
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

export function selectTemplate(templateId) {
    return {
        type: types.TEMPLATE_MANAGEMENT_SELECT,
        templateId
    }
}

function createPageId(name, pages) {
    var ids = _.keysIn(pages);

    //Add suffix to make URL unique if same page name already exists
    var newPageId = _.snakeCase(name.trim());

    var suffix = 1;
    _.each(ids,(id)=>{
        if (id.startsWith(newPageId)) {
            var index = parseInt(id.substring(newPageId.length)) || suffix;
            suffix = Math.max(index + 1, suffix + 1);
        }
    });

    if (suffix > 1) {
        newPageId = newPageId + suffix;
    }

    return newPageId;
}

export function createPage(pageName) {
    return function (dispatch, getState) {
        let pageId = createPageId(pageName, getState().templates.pagesDef);
        var page = {
            id: pageId,
            name: pageName,
            widgets: []
        };

        var internal = new Internal(getState().manager);
        return internal.doPost('/templates/pages', {}, page)
            .then(() => dispatch(addPage(page.id, page.name, page.widgets)))
            .then(() => dispatch(fetchTemplates()))
            .then(() => dispatch(showPage(pageId, pageName, true)))
            .catch(err => dispatch(errorTemplateManagement(err.message)));
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

export function addPageWidget(pageId,name,widgetDefinition,width,height,x,y,configuration) {
    return {
        type: types.PAGE_MANAGEMENT_ADD_WIDGET,
        pageId,
        name,
        widgetDefinition,
        width,
        height,
        x,
        y,
        configuration
    };
}

export function changePageWidgetGridData(widgetId,gridData) {
    return {
        type: types.PAGE_MANAGEMENT_CHANGE_WIDGET,
        widgetId,
        gridData
    }
}

export function setPageShow(pageId, pageName, isPageEditMode) {
    return {
        type: types.PAGE_MANAGEMENT_SHOW,
        pageId,
        pageName,
        isPageEditMode
    }
}

export function changePageName(pageId, pageName) {
    return {
        type: types.PAGE_MANAGEMENT_CHANGE_NAME,
        pageId,
        pageName
    }
}

export function updatePageName(pageName) {
    return function (dispatch, getState) {
        let pageId = createPageId(pageName, getState().templates.pagesDef);
        dispatch(changePageName(pageId, pageName));
    }
}

export function showPage(pageId, pageName, isPageEditMode) {
    return function (dispatch, getState) {
        dispatch(setPageShow(pageId, pageName, isPageEditMode));

        var pagesDef = getState().templates.pagesDef;
        var widgetDefinitions = getState().widgetDefinitions;
        var page = pagesDef[pageId];

        _.each(page.widgets, (widget) => {
            var widgetDefinition = _.find(widgetDefinitions, {id: widget.definition});
            dispatch(addPageWidget(pageId, widget.name, widgetDefinition, widget.width, widget.height, widget.x, widget.y, widget.configuration));
        });

        dispatch(push('page_management'));
    }
}

export function removePageWidget(widgetId) {
    return {
        type: types.PAGE_MANAGEMENT_REMOVE_WIDGET,
        widgetId
    }
}

export function editPageWidget(pageId, widgetId, configuration) {
    return {
        type: types.PAGE_MANAGEMENT_EDIT_WIDGET,
        pageId,
        widgetId,
        configuration
    }
}

export function persistPage(page) {
    return function (dispatch, getState) {
        var widgets = page.widgets.map(w => {
            return {
                name: w.name,
                definition: w.definition.id,
                width: w.width,
                height: w.height,
                x: w.x,
                y: w.y,
                configuration: w.configuration
            };
        });

        var pageData = {
            id: page.id,
            oldId: page.oldId,
            name: page.name,
            widgets
        };

        var internal = new Internal(getState().manager);
        return internal.doPut('/templates/pages', {}, pageData)
            .then(() => {
                dispatch(removePage(page.id));
                if (page.oldId && page.oldId !== page.id) {
                    dispatch(removePage(page.oldId));
                }
            })
            .then(() => dispatch(addPage(page.id, page.name, pageData.widgets)))
            .then(() => dispatch(fetchTemplates()))
            .catch(err => dispatch(errorTemplateManagement(err.message)));
    }
}

export function savePage(page) {
    return function (dispatch) {
        dispatch(persistPage(page));
        dispatch(push('template_management'));
    };
}

export function selectPage(pageId) {
    return {
        type: types.PAGE_MANAGEMENT_SELECT,
        pageId
    }
}

export function clearTemplateContext() {
    return {
        type: types.TEMPLATE_MANAGEMENT_CLEAR
    }
}

export function clearPageContext() {
    return {
        type: types.PAGE_MANAGEMENT_CLEAR
    }
}

export function maximizePageWidget(pageId,widgetId,maximized) {
    return {
        type: types.PAGE_MANAGEMENT_MAXIMIZE_WIDGET,
        pageId,
        widgetId,
        maximized
    }
}

export function drillDownWarning(show) {
    return {
        type: types.PAGE_MANAGEMENT_DRILLDOWN_WARN,
        show
    }
}

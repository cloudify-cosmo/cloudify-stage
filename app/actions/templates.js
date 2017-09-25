/**
 * Created by pposel on 14/08/2017.
 */


import * as types from './types';
import templatesLoader from '../utils/templatesLoader';

export function storeTemplates(templates) {
    return {
        type: types.STORE_TEMPLATES,
        templates
    }
}

export function loadTemplates() {
    return function (dispatch, getState) {
        return templatesLoader.load(getState().manager)
            .then(result => dispatch(storeTemplates(result)));
    }
}

export function addTemplate(templateId, pages) {
    return {
        type: types.ADD_TEMPLATE,
        templateId,
        pages
    }
}

export function editTemplate(templateId, pages) {
    return {
        type: types.EDIT_TEMPLATE,
        templateId,
        pages
    }
}

export function removeTemplate(templateId) {
    return {
        type: types.REMOVE_TEMPLATE,
        templateId
    }
}

export function addPage(pageId, name, widgets) {
    return {
        type: types.ADD_TEMPLATE_PAGE,
        pageId,
        name,
        widgets
    }
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_TEMPLATE_PAGE,
        pageId
    }
}

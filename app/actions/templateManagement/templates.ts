import * as types from '../types';
import type { ReduxState } from '../../reducers';

type Pages = ReduxState['templates']['templatesDef'][string]['pages'];

export function addTemplate(templateId: string, pages: Pages[string]['pages']) {
    return {
        type: types.ADD_TEMPLATE,
        templateId,
        pages
    };
}

export function editTemplate(templateId: string, pages: Pages) {
    return {
        type: types.EDIT_TEMPLATE,
        templateId,
        pages
    };
}

export function removeTemplate(templateId: string) {
    return {
        type: types.REMOVE_TEMPLATE,
        templateId
    };
}

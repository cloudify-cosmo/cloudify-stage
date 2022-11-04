import { ActionType } from '../types';
import type { ReduxState } from '../../reducers';

type Pages = ReduxState['templates']['templatesDef'][string]['pages'];

export function addTemplate(templateId: string, pages: Pages[string]['pages']) {
    return {
        type: ActionType.ADD_TEMPLATE,
        templateId,
        pages
    };
}

export function editTemplate(templateId: string, pages: Pages) {
    return {
        type: ActionType.EDIT_TEMPLATE,
        templateId,
        pages
    };
}

export function removeTemplate(templateId: string) {
    return {
        type: ActionType.REMOVE_TEMPLATE,
        templateId
    };
}

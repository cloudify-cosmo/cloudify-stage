import type { SemanticICONS } from 'semantic-ui-react';
import { ActionType } from '../types';

export function deletePageGroup(pageGroupId: string) {
    return {
        type: ActionType.REMOVE_TEMPLATE_PAGE_GROUP,
        pageGroupId
    };
}

export function createPageGroup(pageGroupId: string, name: string, pages: string[], icon?: SemanticICONS) {
    return {
        type: ActionType.CREATE_TEMPLATE_PAGE_GROUP,
        pageGroupId,
        name,
        pages,
        icon
    };
}

export function updatePageGroup(
    pageGroupId: string,
    newId: string,
    name: string,
    pages: string[],
    icon?: SemanticICONS
) {
    return {
        type: ActionType.UPDATE_TEMPLATE_PAGE_GROUP,
        pageGroupId,
        newId,
        name,
        pages,
        icon
    };
}

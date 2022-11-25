import type { SemanticICONS } from 'semantic-ui-react';
import type { PayloadAction } from '../types';
import { ActionType } from '../types';

export type DeletePageGroupAction = PayloadAction<string, ActionType.REMOVE_TEMPLATE_PAGE_GROUP>;
export type CreatePageGroupAction = PayloadAction<
    { pageGroupId: string; name: string; pages: string[]; icon?: SemanticICONS },
    ActionType.CREATE_TEMPLATE_PAGE_GROUP
>;
export type UpdatePageGroupAction = PayloadAction<
    { pageGroupId: string; newId: string; name: string; pages: string[]; icon?: SemanticICONS },
    ActionType.UPDATE_TEMPLATE_PAGE_GROUP
>;
export type PageGroupAction = DeletePageGroupAction | CreatePageGroupAction | UpdatePageGroupAction;

export function deletePageGroup(pageGroupId: string): DeletePageGroupAction {
    return {
        type: ActionType.REMOVE_TEMPLATE_PAGE_GROUP,
        payload: pageGroupId
    };
}

export function createPageGroup(
    pageGroupId: string,
    name: string,
    pages: string[],
    icon?: SemanticICONS
): CreatePageGroupAction {
    return {
        type: ActionType.CREATE_TEMPLATE_PAGE_GROUP,
        payload: { pageGroupId, name, pages, icon }
    };
}

export function updatePageGroup(
    pageGroupId: string,
    newId: string,
    name: string,
    pages: string[],
    icon?: SemanticICONS
): UpdatePageGroupAction {
    return {
        type: ActionType.UPDATE_TEMPLATE_PAGE_GROUP,
        payload: { pageGroupId, newId, name, pages, icon }
    };
}

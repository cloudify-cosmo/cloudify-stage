import * as types from '../types';

export function deletePageGroup(pageGroupId: string) {
    return {
        type: types.REMOVE_TEMPLATE_PAGE_GROUP,
        pageGroupId
    };
}

export function createPageGroup(pageGroupId: string, name: string, pages: string[]) {
    return {
        type: types.CREATE_TEMPLATE_PAGE_GROUP,
        pageGroupId,
        name,
        pages
    };
}

export function updatePageGroup(pageGroupId: string, newId: string, name: string, pages: string[]) {
    return {
        type: types.UPDATE_TEMPLATE_PAGE_GROUP,
        pageGroupId,
        newId,
        name,
        pages
    };
}

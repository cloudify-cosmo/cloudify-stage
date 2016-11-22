/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import { push } from 'react-router-redux';
import {v4} from 'node-uuid';
import {clearContext} from './context';

export function createPage(name, newPageId) {
    return {
        type: types.ADD_PAGE,
        name,
        newPageId
    };
}

export function addPage(name) {
    return function (dispatch) {
        var newPageId = v4();
        dispatch(createPage(name, newPageId));
        dispatch(selectPage(newPageId,false))
    }
}

export function createDrilldownPage(data,parentPageId) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        data
    }

}

export function renamePage(pageId,newName) {
    return {
        type: types.RENAME_PAGE,
        pageId,
        name: newName
    }
}

export function updatePageDescription(pageId,newDescription) {
    return {
        type: types.UPDATE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    }

}
export function selectPage(pageId,isDrilldown) {
    return function (dispatch) {

        if (!isDrilldown) {
            dispatch(clearContext());
        }
        dispatch(push('/page/'+pageId));
    }
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId: pageId
        }
}


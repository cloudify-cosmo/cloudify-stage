/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import { push } from 'react-router-redux';
import {v4} from 'node-uuid';

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
        dispatch(selectPage(newPageId))
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

export function selectPage(pageId) {
    return function (dispatch) {
        dispatch(push('/page/'+pageId));
    }
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId: pageId
        }
}


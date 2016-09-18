/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import { push } from 'react-router-redux';

export function addPage(name) {
    return {
        type: types.ADD_PAGE,
        name
    };
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
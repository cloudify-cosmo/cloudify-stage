/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';

export function addPage(name) {
    return {
        type: types.ADD_PAGE,
        name
    };
}

export function selectPage(page) {
    return {
        type: types.SELECT_PAGE,
        page
    };
}

/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';

export function addWidget(pageId,name,plugin) {
    return {
        type: types.ADD_WIDGET,
        pageId,
        name,
        plugin
    };
}

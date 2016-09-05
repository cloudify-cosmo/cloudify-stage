/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';

export function addWidget(name) {
    return {
        type: types.ADD_WIDGET,
        name
    };
}

/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import {v4} from 'node-uuid';

const widget = (state = {}, action) => {
    switch (action.type) {

        case types.ADD_WIDGET:
            return {
                id: v4(),
                name: action.name,
                plugin: action.plugin.name
            };
        default:
            return state;
    }
};

const widgets = (state = [], action) => {
    switch (action.type) {
        case types.ADD_WIDGET:
            return [
                ...state,
                widget(undefined, action)
            ];
        default:
            return state;
    }
};


export default widgets;

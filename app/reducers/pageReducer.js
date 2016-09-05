/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import {v4} from 'node-uuid';

const page = (state = {}, action) => {
    switch (action.type) {

        case types.ADD_PAGE:
            return {
                id: v4(),
                name: action.name,
                widgets: []
            };
        default:
            return state;
    }
};

const pages = (state = [], action) => {
    switch (action.type) {
        case types.ADD_PAGE:
            return [
                ...state,
                page(undefined, action)
            ];
        default:
            return state;
    }
};


export default pages;

/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import {v4} from 'node-uuid';
import widgets from './widgetsReducer';

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
        case types.ADD_WIDGET:
            return state.map( (page) => {
                if (page.id === action.pageId) {
                    return Object.assign({}, page, {
                        widgets: widgets(page.widgets,action)
                    })
                }
                return page
            });
        case types.RENAME_PAGE:
            return state.map( (page) => {
                if (page.id === action.pageId) {
                    return Object.assign({}, page, {
                        name: action.name
                    })
                }
                return page
            });
        case types.RENAME_WIDGET:
            return state.map( (page) => {
                if (page.id === action.pageId) {
                    return Object.assign({}, page, {
                        widgets: widgets(page.widgets,action)
                    })
                }
                return page
            });

        default:
            return state;
    }
};


export default pages;

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
        case types.CREATE_DRILLDOWN_PAGE:
            return Object.assign({
                    isDrillDown: true
                },
                action.data,
                {
                    widgets: action.data.widgets.map((w)=>{
                        return Object.assign({id:v4()},w);
                    })
                });

        case types.SET_DRILLDOWN_PAGE:
            var pageData = Object.assign({},state,{
                widgets: widgets(state.widgets,action)
            });

            if (action.parentPageId && action.drillDownPageId) {
                if (state.id === action.parentPageId) {
                    pageData.children = pageData.children || [];
                    pageData.children.push(action.drillDownPageId);
                } else if (state.id === action.drillDownPageId) {
                    pageData.parent = action.parentPageId;
                }
            }
            return pageData;

        default:
            return state;
    }
};

const pages = (state = [], action) => {
    switch (action.type) {
        case types.ADD_PAGE:
        case types.CREATE_DRILLDOWN_PAGE:
            return [
                ...state,
                page(undefined, action)
            ];
        case types.ADD_WIDGET:
        case types.RENAME_WIDGET:
        case types.CHANGE_WIDGET_GRID_DATA:
        case types.REMOVE_WIDGET:
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
        case types.SET_DRILLDOWN_PAGE:
            // Add drilldown page to children list of this page, and drilldown page parent id
            var parentPageId = null;
            _.each(state,(p)=>{
                _.each(p.widgets,(w)=>{
                    if (w.id === action.widgetId) {
                        parentPageId = p.id;
                    }
                });
            });
            action.parentPageId = parentPageId;

            return state.map( (p) => {
                return page(p,action);
            });
        default:
            return state;
    }
};


export default pages;

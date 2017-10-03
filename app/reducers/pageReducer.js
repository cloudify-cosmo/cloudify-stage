/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import widgets from './widgetsReducer';

const page = (state = {}, action) => {
    switch (action.type) {

        case types.ADD_PAGE:
            return {
                id: action.newPageId,
                name: action.name,
                description: '',
                widgets: []
            };
        case types.CREATE_DRILLDOWN_PAGE:
            return {
                isDrillDown: true,
                id: action.newPageId,
                name: action.name,
                description: '',
                widgets: []
            };

        case types.ADD_DRILLDOWN_PAGE:
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
        case types.UPDATE_PAGE_DESCRIPTION:
            return Object.assign({}, state, {
                description: action.description
            });
        case types.RENAME_PAGE:
            return Object.assign({}, state, {
                name: action.name,
                id: action.newPageId
            });
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
        case types.EDIT_WIDGET:
        case types.MAXIMIZE_WIDGET:
        case types.REMOVE_WIDGET:
            return state.map( (page) => {
                if (page.id === action.pageId) {
                    return Object.assign({}, page, {
                        widgets: widgets(page.widgets,action)
                    })
                }
                return page
            });
        case types.MINIMIZE_WIDGETS:
            return state.map( (page) => {
                return Object.assign({}, page, {
                    widgets: widgets(page.widgets,action)
                })
            });
        case types.REMOVE_PAGE:
            var removeIndex = _.findIndex(state,{id:action.pageId});
            return [
                ...state.slice(0,removeIndex),
                ...state.slice(removeIndex+1)
            ];
        case types.RENAME_PAGE:
        case types.UPDATE_PAGE_DESCRIPTION:

            return state.map( (p) => {
                if (p.id === action.pageId) {
                    return page(p,action);
                }
                return p
            });
        case types.ADD_DRILLDOWN_PAGE:
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
        case types.REORDER_PAGE:
            var pageIndex = action.pageIndex, newPageIndex = action.newPageIndex;
            var realPageIndex = 0, realNewPageIndex = 0;

            state = state.slice(0);

            _.each(state,(p)=>{
                if (!p.isDrillDown) {
                    pageIndex--;
                    newPageIndex--;
                }

                if (pageIndex >= 0) {
                    realPageIndex++;
                }

                if (newPageIndex >= 0) {
                    realNewPageIndex++;
                }
            });

            var removed = state.splice(realPageIndex, 1)[0];
            state.splice(realNewPageIndex, 0, removed);

            return state;
        case types.SET_PAGES:
            // Replace all the pages data (when reading user pages from db)
            return action.pages;
        // Clear the pages when logging in & out (after login we fetch those)
        case types.RES_LOGIN:
        case types.LOGOUT:
            return [];
        default:
            return state;
    }
};


export default pages;

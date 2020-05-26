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
                name: action.page.name,
                description: '',
                tabs: _.map(action.page.tabs, tab => _.omit(tab, 'widgets')),
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

        case types.ADD_DRILLDOWN_PAGE: {
            const pageData = { ...state, widgets: widgets(state.widgets, action) };

            if (action.parentPageId && action.drillDownPageId) {
                if (state.id === action.parentPageId) {
                    pageData.children = pageData.children || [];
                    pageData.children.push(action.drillDownPageId);
                } else if (state.id === action.drillDownPageId) {
                    pageData.parent = action.parentPageId;
                }
            }
            return pageData;
        }
        case types.CHANGE_PAGE_DESCRIPTION:
            return { ...state, description: action.description };
        case types.RENAME_PAGE:
            return { ...state, name: action.name };
        default:
            return state;
    }
};

const pages = (state = [], action) => {
    switch (action.type) {
        case types.ADD_PAGE:
        case types.CREATE_DRILLDOWN_PAGE:
            return [...state, page(undefined, action)];
        case types.ADD_WIDGET:
            return state.map(p => {
                if (p.id === action.pageId) {
                    if (!_.isNil(action.tab)) {
                        const tabs = [...p.tabs];
                        tabs[action.tab] = { ...tabs[action.tab], widgets: widgets(tabs[action.tab].widgets, action) };
                        return { ...p, tabs };
                    }
                    return { ...p, widgets: widgets(p.widgets, action) };
                }
                return p;
            });
        case types.UPDATE_WIDGET:
        case types.REMOVE_WIDGET:
            return state.map(p => {
                if (p.id === action.pageId) {
                    return {
                        ...p,
                        widgets: widgets(p.widgets, action),
                        tabs: _.map(p.tabs, tab => ({
                            ...tab,
                            widgets: widgets(tab.widgets, action)
                        }))
                    };
                }
                return p;
            });
        case types.MINIMIZE_WIDGETS:
            return state.map(p => {
                return { ...p, widgets: widgets(p.widgets, action) };
            });
        case types.REMOVE_PAGE: {
            const removeIndex = _.findIndex(state, { id: action.pageId });
            return [...state.slice(0, removeIndex), ...state.slice(removeIndex + 1)];
        }
        case types.RENAME_PAGE:
        case types.CHANGE_PAGE_DESCRIPTION:
            return state.map(p => {
                if (p.id === action.pageId) {
                    return page(p, action);
                }
                return p;
            });
        case types.ADD_DRILLDOWN_PAGE: {
            // Add drilldown page to children list of this page, and drilldown page parent id
            let parentPageId = null;
            _.each(state, p => {
                _.each(p.widgets, w => {
                    if (w.id === action.widgetId) {
                        parentPageId = p.id;
                    }
                });
            });
            const updatedAction = { ...action, parentPageId };

            return state.map(p => {
                return page(p, updatedAction);
            });
        }
        case types.REORDER_PAGE: {
            let { pageIndex } = action;
            let { newPageIndex } = action;
            let realPageIndex = 0;
            let realNewPageIndex = 0;

            const newState = state.slice(0);

            _.each(newState, p => {
                if (!p.isDrillDown) {
                    pageIndex -= 1;
                    newPageIndex -= 1;
                }

                if (pageIndex >= 0) {
                    realPageIndex += 1;
                }

                if (newPageIndex >= 0) {
                    realNewPageIndex += 1;
                }
            });

            const removed = newState.splice(realPageIndex, 1)[0];
            newState.splice(realNewPageIndex, 0, removed);

            return newState;
        }
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

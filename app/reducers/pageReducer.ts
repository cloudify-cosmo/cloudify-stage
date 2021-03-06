// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import i18n from 'i18next';
import type { AnyAction, Reducer } from 'redux';

import * as types from '../actions/types';
import widgets from './widgetsReducer';
import {
    addTab,
    forAllWidgets,
    forEachWidget,
    isWidgetsSection,
    LayoutSection,
    moveTab,
    PageDefinition,
    removeTab,
    TabContent,
    updateTab
} from '../actions/page';
import Consts from '../utils/consts';

type TabsAction =
    | ReturnType<typeof addTab>
    | ReturnType<typeof removeTab>
    | ReturnType<typeof updateTab>
    | ReturnType<typeof moveTab>;

const tabs: Reducer<TabContent[], TabsAction> = (state = [], action) => {
    switch (action.type) {
        case types.ADD_TAB:
            return [...state, { name: i18n.t('editMode.tabs.newTab'), widgets: [] }];
        case types.REMOVE_TAB:
            return _.without(state, state[action.tabIndex]);
        case types.UPDATE_TAB: {
            let updatedTabs = [...state];
            if (action.isDefault) {
                updatedTabs = _.map(updatedTabs, tab => ({ ...tab, isDefault: false }));
            }
            updatedTabs[action.tabIndex] = { ...updatedTabs[action.tabIndex], ..._.pick(action, 'name', 'isDefault') };
            return updatedTabs;
        }
        case types.MOVE_TAB:
            return arrayMove(state, action.oldTabIndex, action.newTabIndex);

        // NOTE: widgets actions are not in TypeScript
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-expect-error
        case types.ADD_WIDGET: {
            const updatedTabs = [...state];
            // @ts-expect-error
            updatedTabs[action.tab] = {
                // @ts-expect-error
                ...updatedTabs[action.tab],
                // @ts-expect-error
                widgets: widgets(updatedTabs[action.tab].widgets, action)
            };
            return updatedTabs;
        }
        /* eslint-enable @typescript-eslint/ban-ts-comment */
        default:
            return state;
    }
};

const page = (state: PageDefinition, action: AnyAction) => {
    switch (action.type) {
        case types.MINIMIZE_WIDGETS:
        case types.REMOVE_WIDGET:
        case types.UPDATE_WIDGET: {
            const newState = _.cloneDeep(state);
            forAllWidgets(newState, widgetsList => widgets(widgetsList, action));
            return newState;
        }
        case types.ADD_WIDGET:
            return {
                ...state,
                layout: _.map(state.layout, (layoutSection, layoutSectionIdx) => {
                    if (action.layoutSection === layoutSectionIdx) {
                        return {
                            ...layoutSection,
                            content: (_.isNil(action.tab) ? widgets : tabs)(layoutSection.content as any, action as any)
                        };
                    }
                    return layoutSection;
                })
            };
        case types.ADD_LAYOUT_SECTION: {
            const position = _.isNil(action.position) ? _.size(state.layout) : action.position;
            return {
                ...state,
                layout: [
                    ..._.slice(state.layout, 0, position),
                    action.layoutSection,
                    ..._.slice(state.layout, position)
                ]
            };
        }
        case types.REMOVE_LAYOUT_SECTION:
            return { ...state, layout: _.without(state.layout, _.nth(state.layout, action.layoutSection)) };
        case types.ADD_DRILLDOWN_PAGE: {
            const pageData = _.cloneDeep(state);
            forAllWidgets(pageData, layoutSectionWidgets => widgets(layoutSectionWidgets, action));

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
        case types.ADD_TAB:
        case types.REMOVE_TAB:
        case types.UPDATE_TAB:
        case types.MOVE_TAB:
            return {
                ...state,
                layout: _.map(state.layout, (layoutSection, layoutSectionIdx) => {
                    if (layoutSection.type === Consts.LAYOUT_TYPE.TABS && layoutSectionIdx === action.layoutSection)
                        return { ...layoutSection, content: tabs(layoutSection.content, action as TabsAction) };
                    return layoutSection;
                })
            };
        default:
            return state;
    }
};

const pages: Reducer<PageDefinition[]> = (state = [], action) => {
    switch (action.type) {
        case types.ADD_PAGE:
        case types.CREATE_DRILLDOWN_PAGE:
            return [...state, createPage(action as any)];
        case types.MINIMIZE_WIDGETS:
            return state.map(p => page(p, action));
        case types.REMOVE_PAGE: {
            const removeIndex = _.findIndex(state, { id: action.pageId });
            return [...state.slice(0, removeIndex), ...state.slice(removeIndex + 1)];
        }
        case types.UPDATE_WIDGET:
        case types.REMOVE_WIDGET:
        case types.ADD_WIDGET:
        case types.ADD_LAYOUT_SECTION:
        case types.REMOVE_LAYOUT_SECTION:
        case types.RENAME_PAGE:
        case types.CHANGE_PAGE_DESCRIPTION:
        case types.ADD_TAB:
        case types.REMOVE_TAB:
        case types.UPDATE_TAB:
        case types.MOVE_TAB:
            return state.map(p => {
                if (p.id === action.pageId) {
                    return page(p, action);
                }
                return p;
            });
        case types.ADD_DRILLDOWN_PAGE: {
            // Add drilldown page to children list of this page, and drilldown page parent id
            let parentPageId = null;
            _.each(state, p =>
                forEachWidget(p, widget => {
                    if (widget.id === action.widgetId) {
                        parentPageId = p.id;
                    }
                    return widget;
                })
            );
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

function createPage(action: { type: string; page: PageDefinition; newPageId: string }): PageDefinition {
    return {
        id: action.newPageId,
        name: action.page.name,
        description: '',
        layout: _.map(
            action.page.layout,
            layoutSection =>
                ({
                    ...layoutSection,
                    content: isWidgetsSection(layoutSection)
                        ? []
                        : _.map(layoutSection.content, tab => ({ ...tab, widgets: [] }))
                } as LayoutSection)
        ),
        isDrillDown: action.type === types.CREATE_DRILLDOWN_PAGE
    };
}

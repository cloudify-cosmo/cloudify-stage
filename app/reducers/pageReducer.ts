// @ts-nocheck File not migrated fully to TS
import _, { cloneDeep, find, findIndex, includes, pull, remove } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import i18n from 'i18next';
import type { AnyAction, Reducer } from 'redux';

import { ActionType } from '../actions/types';
import widgets from './widgetsReducer';
import type { addTab, LayoutSection, moveTab, PageDefinition, removeTab, TabContent, updateTab } from '../actions/page';
import { forAllWidgets, forEachWidget, isWidgetsSection } from '../actions/page';
import type { PageGroup, PageMenuItem } from '../actions/pageMenu';
import { createPagesMap, InsertPosition } from '../actions/pageMenu';
import Consts from '../utils/consts';

function updateRelationships(page: PageDefinition, parentPageId: string, drillDownPageId: string) {
    if (page.id === parentPageId) {
        page.children = page.children || [];
        page.children.push(drillDownPageId);
    } else if (page.id === drillDownPageId) {
        page.parent = parentPageId;
    }

    return page;
}

type TabsAction =
    | ReturnType<typeof addTab>
    | ReturnType<typeof removeTab>
    | ReturnType<typeof updateTab>
    | ReturnType<typeof moveTab>;

const tabs: Reducer<TabContent[], TabsAction> = (state = [], action) => {
    switch (action.type) {
        case ActionType.ADD_TAB:
            return [...state, { name: i18n.t('editMode.tabs.newTab'), widgets: [] }];
        case ActionType.REMOVE_TAB:
            return _.without(state, state[action.tabIndex]);
        case ActionType.UPDATE_TAB: {
            let updatedTabs = [...state];
            if (action.isDefault) {
                updatedTabs = _.map(updatedTabs, tab => ({ ...tab, isDefault: false }));
            }
            updatedTabs[action.tabIndex] = { ...updatedTabs[action.tabIndex], ..._.pick(action, 'name', 'isDefault') };
            return updatedTabs;
        }
        case ActionType.MOVE_TAB:
            return arrayMove(state, action.oldTabIndex, action.newTabIndex);

        // NOTE: widgets actions are not in TypeScript
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-expect-error
        case ActionType.ADD_WIDGET: {
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

const pageMenuItemReducer = (state: PageMenuItem, action: AnyAction) => {
    switch (action.type) {
        case ActionType.MINIMIZE_TAB_WIDGETS: {
            const newState = _.cloneDeep(state);
            forAllWidgets(newState, (widgetsList, _layoutSectionIdx, tabIdx) =>
                tabIdx !== null ? widgets(widgetsList, action) : widgetsList
            );
            return newState;
        }
        case ActionType.MINIMIZE_WIDGETS:
        case ActionType.REMOVE_WIDGET:
        case ActionType.UPDATE_WIDGET: {
            const newState = _.cloneDeep(state);
            forAllWidgets(newState, widgetsList => widgets(widgetsList, action));
            return newState;
        }
        case ActionType.ADD_WIDGET:
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
        case ActionType.ADD_LAYOUT_SECTION: {
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
        case ActionType.REMOVE_LAYOUT_SECTION:
            return { ...state, layout: _.without(state.layout, _.nth(state.layout, action.layoutSection)) };
        case ActionType.ADD_DRILLDOWN_PAGE: {
            let pageMenuItem = _.cloneDeep(state);

            // Update widget that created drilldown page
            const pagesList: PageDefinition[] = pageMenuItem.type === 'pageGroup' ? pageMenuItem.pages : [pageMenuItem];
            _.each(pagesList, page =>
                forAllWidgets(page, layoutSectionWidgets => widgets(layoutSectionWidgets, action))
            );

            // Update children list in parent page and parent ID in drilldown page
            if (action.parentPageId && action.drillDownPageId) {
                if (pageMenuItem.type === 'pageGroup') {
                    pageMenuItem.pages = _.map(pageMenuItem.pages, page =>
                        updateRelationships(page, action.parentPageId, action.drillDownPageId)
                    );
                } else {
                    pageMenuItem = updateRelationships(pageMenuItem, action.parentPageId, action.drillDownPageId);
                }
            }

            return pageMenuItem;
        }
        case ActionType.CHANGE_PAGE_DESCRIPTION:
            return { ...state, description: action.description };
        case ActionType.RENAME_PAGE_MENU_ITEM:
            return { ...state, name: action.name };
        case ActionType.CHANGE_PAGE_MENU_ITEM_ICON:
            return { ...state, icon: action.icon };
        case ActionType.ADD_TAB:
        case ActionType.REMOVE_TAB:
        case ActionType.UPDATE_TAB:
        case ActionType.MOVE_TAB:
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

const pageMenuItemsReducer: Reducer<PageMenuItem[]> = (state = [], action) => {
    const findContainer = (pageMenuItems: PageMenuItem[], pageMenuItemId: string) => {
        return find(pageMenuItems, { id: pageMenuItemId })
            ? pageMenuItems
            : _(pageMenuItems)
                  .map('pages')
                  .find(pagesList => find(pagesList, { id: pageMenuItemId }));
    };

    const findItem = (pageMenuItems: PageMenuItem[], pageMenuItemId: string) => {
        return (
            find(pageMenuItems, { id: pageMenuItemId }) ??
            _(pageMenuItems).flatMap('pages').find({ id: pageMenuItemId })
        );
    };

    switch (action.type) {
        case ActionType.ADD_PAGE:
        case ActionType.CREATE_DRILLDOWN_PAGE:
            return [...state, createPage(action as any)];
        case ActionType.ADD_PAGE_GROUP:
            return [...state, createPageGroup(action)];
        case ActionType.ADD_PAGE_TO_GROUP: {
            const pageToAdd = _.find(state, { id: action.pageId });
            const newState = _.without(state, pageToAdd);
            _.find(newState, { id: action.pageGroupId }).pages.push(pageToAdd);
            return newState;
        }
        case ActionType.MINIMIZE_WIDGETS:
        case ActionType.MINIMIZE_TAB_WIDGETS: {
            const newState = _.cloneDeep(state);
            const pagesMap = createPagesMap(newState);
            _.each(pagesMap, pageItem => Object.assign(pageItem, pageMenuItemReducer(pageItem, action)));
            return newState;
        }
        case ActionType.REMOVE_PAGE_MENU_ITEM: {
            const id = action.pageMenuItemId;
            const newPageMenuItems = cloneDeep(state);
            const itemContainer = findContainer(newPageMenuItems, id);
            remove(itemContainer, { id });
            return newPageMenuItems;
        }
        case ActionType.CHANGE_PAGE_MENU_ITEM_ICON:
        case ActionType.RENAME_PAGE_MENU_ITEM: {
            const newPageMenuItems = cloneDeep(state);
            const itemToUpdate = findItem(newPageMenuItems, action.pageMenuItemId);
            Object.assign(itemToUpdate, pageMenuItemReducer(itemToUpdate, action));
            return newPageMenuItems;
        }
        case ActionType.UPDATE_WIDGET:
        case ActionType.REMOVE_WIDGET:
        case ActionType.ADD_WIDGET:
        case ActionType.ADD_LAYOUT_SECTION:
        case ActionType.REMOVE_LAYOUT_SECTION:
        case ActionType.CHANGE_PAGE_DESCRIPTION:
        case ActionType.ADD_TAB:
        case ActionType.REMOVE_TAB:
        case ActionType.UPDATE_TAB:
        case ActionType.MOVE_TAB: {
            const newState = _.cloneDeep(state);
            const pageItem = createPagesMap(newState)[action.pageId];
            Object.assign(pageItem, pageMenuItemReducer(pageItem, action));
            return newState;
        }
        case ActionType.ADD_DRILLDOWN_PAGE: {
            // Add drilldown page to children list of this page, and drilldown page parent id
            let parentPageId = null;
            const pagesList: PageDefinition[] = _.flatMap(state, pageMenuItem => pageMenuItem.pages || pageMenuItem);
            _.each(pagesList, p =>
                forEachWidget(p, widget => {
                    if (widget.id === action.widgetId) {
                        parentPageId = p.id;
                    }
                    return widget;
                })
            );
            const updatedAction = { ...action, parentPageId };

            return state.map(p => {
                return pageMenuItemReducer(p, updatedAction);
            });
        }
        case ActionType.REORDER_PAGE_MENU: {
            const { sourceId, targetId, position } = action;
            const newPageMenuItems = cloneDeep(state);

            const sourceItemContainer = findContainer(newPageMenuItems, sourceId);
            const sourceItem = find(sourceItemContainer, { id: sourceId });

            if (position !== InsertPosition.Into) {
                const targetItemContainer = findContainer(newPageMenuItems, targetId);

                let targetIndex = findIndex(targetItemContainer, { id: targetId });
                if (position === InsertPosition.After) targetIndex += 1;
                targetItemContainer.splice(targetIndex, 0, { ...sourceItem });
            } else {
                find(newPageMenuItems, { id: targetId }).pages.splice(0, 0, sourceItem);
            }

            pull(sourceItemContainer, sourceItem);

            return newPageMenuItems;
        }
        case ActionType.SET_PAGES:
            // Replace all the pages data (when reading user pages from db)
            return action.pages;
        // Clear the pages when logging in & out (after login we fetch those)
        case ActionType.LOGIN_SUCCESS:
        case ActionType.LOGOUT:
            return [];
        default:
            return state;
    }
};

export default pageMenuItemsReducer;

function createPage(action: { type: string; page: PageDefinition; newPageId: string }): PageDefinition {
    return {
        id: action.newPageId,
        name: action.page.name,
        type: 'page',
        icon: action.page.icon,
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
        isDrillDown: action.type === ActionType.CREATE_DRILLDOWN_PAGE
    };
}

function createPageGroup({ id, pageGroup }: { id: string; pageGroup: PageGroup }) {
    return { id, name: pageGroup.name, icon: pageGroup.icon, type: 'pageGroup', pages: [] };
}

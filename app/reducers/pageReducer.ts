import _, { cloneDeep, find, findIndex, pull, remove } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import i18n from 'i18next';
import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import widgets from './widgetsReducer';
import type { LayoutSection, PageDefinition, TabAction, TabContent, LayoutSectionAction } from '../actions/page';
import { forAllWidgets, forEachWidget, isWidgetsSection } from '../actions/page';
import type {
    AddPageGroupAction,
    CreateDrilldownPageAction,
    PageMenuItem,
    PageMenuAction,
    PageGroup
} from '../actions/pageMenu';
import { createPagesMap, InsertPosition } from '../actions/pageMenu';
import Consts from '../utils/consts';
import type { AddWidgetAction, WidgetAction } from '../actions/widgets';
import type { DrilldownPageAction } from '../actions/drilldownPage';
import type { SetPagesAction } from '../actions/userApp';
import type { LoginSuccessAction, LogoutAction } from '../actions/manager/auth';

function updateRelationships(page: PageDefinition, parentPageId: string, drillDownPageId: string) {
    if (page.id === parentPageId) {
        page.children = page.children || [];
        page.children.push(drillDownPageId);
    } else if (page.id === drillDownPageId) {
        page.parent = parentPageId;
    }

    return page;
}

const tabs: Reducer<TabContent[], TabAction | AddWidgetAction> = (state = [], action) => {
    switch (action.type) {
        case ActionType.ADD_TAB:
            return [...state, { name: i18n.t('editMode.tabs.newTab'), widgets: [] }];
        case ActionType.REMOVE_TAB:
            return _.without(state, state[action.payload.tabIndex]);
        case ActionType.UPDATE_TAB: {
            let updatedTabs = [...state];
            if (action.payload.isDefault) {
                updatedTabs = _.map(updatedTabs, tab => ({ ...tab, isDefault: false }));
            }
            updatedTabs[action.payload.tabIndex] = {
                ...updatedTabs[action.payload.tabIndex],
                ..._.pick(action, 'name', 'isDefault')
            };
            return updatedTabs;
        }
        case ActionType.MOVE_TAB:
            return arrayMove(state, action.payload.oldTabIndex, action.payload.newTabIndex);

        case ActionType.ADD_WIDGET: {
            const updatedTabs = [...state];
            if (action.payload.tabIndex)
                updatedTabs[action.payload.tabIndex] = {
                    ...updatedTabs[action.payload.tabIndex],
                    widgets: widgets(updatedTabs[action.payload.tabIndex].widgets, action)
                };
            return updatedTabs;
        }

        default:
            return state;
    }
};

const emptyPageMenuItem: PageMenuItem = {
    type: 'page',
    icon: undefined,
    id: '',
    layout: [],
    isDrillDown: false,
    name: ''
};
const pageMenuItemReducer: Reducer<
    PageMenuItem,
    WidgetAction | LayoutSectionAction | DrilldownPageAction | TabAction | PageMenuAction
> = (state = emptyPageMenuItem, action) => {
    switch (action.type) {
        case ActionType.MINIMIZE_TAB_WIDGETS: {
            const newState = _.cloneDeep(state);
            if (newState?.type === 'page')
                forAllWidgets(newState, (widgetsList, _layoutSectionIdx, tabIdx) =>
                    tabIdx !== null ? widgets(widgetsList, action) : widgetsList
                );
            return newState;
        }
        case ActionType.MINIMIZE_WIDGETS:
        case ActionType.REMOVE_WIDGET:
        case ActionType.UPDATE_WIDGET: {
            const newState = _.cloneDeep(state);
            if (newState?.type === 'page') forAllWidgets(newState, widgetsList => widgets(widgetsList, action));
            return newState;
        }
        case ActionType.ADD_WIDGET:
            if (state?.type === 'page') {
                const newState: PageDefinition = {
                    ...state,
                    layout: _.map(state.layout, (layoutSection, layoutSectionIdx) => {
                        if (action.payload.layoutSectionIndex === layoutSectionIdx) {
                            return layoutSection.type === 'widgets'
                                ? {
                                      ...layoutSection,
                                      content: widgets(layoutSection.content, action)
                                  }
                                : {
                                      ...layoutSection,
                                      content: tabs(layoutSection.content, action)
                                  };
                        }
                        return layoutSection;
                    })
                };
                return newState;
            }
            return state;

        case ActionType.ADD_LAYOUT_SECTION: {
            if (state?.type === 'page') {
                const position = _.isNil(action.payload.position) ? _.size(state?.layout) : action.payload.position;
                const page: PageDefinition = {
                    ...state,
                    layout: [
                        ..._.slice(state.layout, 0, position),
                        action.payload.layoutSection,
                        ..._.slice(state.layout, position)
                    ]
                };
                return page;
            }
            return state;
        }
        case ActionType.REMOVE_LAYOUT_SECTION:
            if (state?.type === 'page') {
                const pageMenuItem = _.cloneDeep(state);
                const layoutSectionToRemove = _.nth(state.layout, action.payload.layoutSection);
                if (layoutSectionToRemove) {
                    pageMenuItem.layout = _.without(state.layout, layoutSectionToRemove);
                }
                return pageMenuItem;
            }
            return state;
        case ActionType.ADD_DRILLDOWN_PAGE: {
            let pageMenuItem = _.cloneDeep(state);

            if (pageMenuItem) {
                // Update widget that created drilldown page
                const pagesList: PageDefinition[] =
                    pageMenuItem.type === 'pageGroup' ? pageMenuItem.pages : [pageMenuItem];
                _.each(pagesList, page =>
                    forAllWidgets(page, layoutSectionWidgets => widgets(layoutSectionWidgets, action))
                );

                // Update children list in parent page and parent ID in drilldown page
                if (action.payload.parentPageId) {
                    const { parentPageId, drillDownPageId } = action.payload;
                    if (pageMenuItem.type === 'pageGroup') {
                        pageMenuItem.pages = _.map(pageMenuItem.pages, page =>
                            updateRelationships(page, parentPageId, drillDownPageId)
                        );
                    } else {
                        pageMenuItem = updateRelationships(pageMenuItem, parentPageId, drillDownPageId);
                    }
                }
            }
            return pageMenuItem;
        }
        case ActionType.CHANGE_PAGE_DESCRIPTION:
            return { ...state, description: action.payload.description };
        case ActionType.RENAME_PAGE_MENU_ITEM:
            return { ...state, name: action.payload.newName };
        case ActionType.CHANGE_PAGE_MENU_ITEM_ICON:
            return { ...state, icon: action.payload.icon };
        case ActionType.ADD_TAB:
        case ActionType.REMOVE_TAB:
        case ActionType.UPDATE_TAB:
        case ActionType.MOVE_TAB:
            if (state?.type === 'page') {
                return {
                    ...state,
                    layout: _.map(state?.layout, (layoutSection, layoutSectionIdx: number) => {
                        if (
                            layoutSection.type === Consts.LAYOUT_TYPE.TABS &&
                            layoutSectionIdx === action.payload.layoutSection
                        )
                            return { ...layoutSection, content: tabs(layoutSection.content, action) };
                        return layoutSection;
                    })
                };
            }
            return state;

        default:
            return state;
    }
};

const pageMenuItemsReducer: Reducer<
    PageMenuItem[],
    | WidgetAction
    | LayoutSectionAction
    | DrilldownPageAction
    | TabAction
    | PageMenuAction
    | SetPagesAction
    | LoginSuccessAction
    | LogoutAction
> = (state = [], action) => {
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
            return [...state, createPage(action as CreateDrilldownPageAction)];
        case ActionType.ADD_PAGE_GROUP:
            return [...state, createPageGroup(action as AddPageGroupAction)];
        case ActionType.ADD_PAGE_TO_GROUP: {
            let newState = cloneDeep(state);
            const pageToAdd = _.find(state, { id: action.payload.pageId });
            if (pageToAdd && pageToAdd.type === 'page') {
                newState = _.without(state, pageToAdd);
                const pageGroup = _.find(newState, { id: action.payload.pageGroupId });

                if (pageGroup && pageGroup.type === 'pageGroup') {
                    pageGroup.pages.push(pageToAdd);
                }
            }
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
            const id = action.payload;
            const newPageMenuItems = cloneDeep(state);
            const itemContainer = findContainer(newPageMenuItems, id);
            remove(itemContainer, { id });
            return newPageMenuItems;
        }
        case ActionType.CHANGE_PAGE_MENU_ITEM_ICON:
        case ActionType.RENAME_PAGE_MENU_ITEM: {
            const newPageMenuItems = cloneDeep(state);
            const itemToUpdate = findItem(newPageMenuItems, action.payload.pageMenuItemId);
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
            const pageItem = createPagesMap(newState)[action.payload.pageId];
            Object.assign(pageItem, pageMenuItemReducer(pageItem, action));
            return newState;
        }
        case ActionType.ADD_DRILLDOWN_PAGE: {
            // Add drilldown page to children list of this page, and drilldown page parent id
            let parentPageId: string | undefined;
            const pagesList: PageDefinition[] = _.flatMap(state, pageMenuItem => {
                return pageMenuItem.type === 'pageGroup' ? pageMenuItem.pages : pageMenuItem;
            });
            _.each(pagesList, p =>
                forEachWidget(p, widget => {
                    if (widget.id === action.payload.widgetId) {
                        parentPageId = p.id;
                    }
                    return widget;
                })
            );

            const updatedAction = { ...action, payload: { ...action.payload, parentPageId } };

            return state.map(p => {
                return pageMenuItemReducer(p, updatedAction);
            });
        }
        case ActionType.REORDER_PAGE_MENU: {
            const { sourceId, targetId, position } = action.payload;
            const newPageMenuItems = cloneDeep(state);

            const sourceItemContainer = findContainer(newPageMenuItems, sourceId);
            const sourceItem = find(sourceItemContainer, { id: sourceId });

            if (position !== InsertPosition.Into) {
                const targetItemContainer = findContainer(newPageMenuItems, targetId);

                let targetIndex = findIndex(targetItemContainer, { id: targetId });
                if (position === InsertPosition.After) targetIndex += 1;
                targetItemContainer.splice(targetIndex, 0, { ...sourceItem });
            } else {
                const targetItem = find(newPageMenuItems, { id: targetId });
                if (targetItem && targetItem.type === 'pageGroup') targetItem.pages.splice(0, 0, sourceItem);
            }

            pull(sourceItemContainer, sourceItem);

            return newPageMenuItems;
        }

        case ActionType.SET_PAGES:
            // Replace all the pages data (when reading user pages from db)
            return action.payload.pages as PageMenuItem[];

        case ActionType.LOGIN_SUCCESS:
        case ActionType.LOGOUT:
            // Clear the pages when logging in & out (after login we fetch those)
            return [];
        default:
            return state;
    }
};

export default pageMenuItemsReducer;

function createPage(action: CreateDrilldownPageAction): PageDefinition {
    return {
        id: action.payload.newPageId,
        name: action.payload.page.name,
        type: 'page',
        icon: action.payload.page.icon,
        description: '',
        layout: _.map(
            action.payload.page.layout,
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

function createPageGroup({ payload: { id, pageGroup } }: AddPageGroupAction): PageGroup {
    return { id, name: pageGroup.name, icon: pageGroup.icon, type: 'pageGroup', pages: [] };
}

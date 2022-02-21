import _, { find, includes } from 'lodash';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { LocationDescriptorObject } from 'history';
import { stringify } from 'query-string';
import { push } from 'connected-react-router';
import log from 'loglevel';
import type { SemanticICONS } from 'semantic-ui-react';
import { addLayoutToPage, PageDefinition } from './page';
import * as types from './types';
import { ReduxState } from '../reducers';
import { clearWidgetsData } from './WidgetData';
import { minimizeTabWidgets } from './widgets';
import { clearContext } from './context';
import { DrilldownContext } from '../reducers/drilldownContextReducer';
import Consts from '../utils/consts';
import Internal from '../utils/Internal';
import { NO_PAGES_FOR_TENANT_ERR } from '../utils/ErrorCodes';
import { popDrilldownContext } from './drilldownContext';

export enum InsertPosition {
    Before,
    After,
    Into
}

export interface PageGroup {
    id: string;
    name: string;
    type: 'pageGroup';
    icon?: SemanticICONS;
    pages: PageDefinition[];
}

export type PageMenuItem = PageDefinition | PageGroup;

export function createPage(page: Partial<PageDefinition>, newPageId: string) {
    return {
        type: types.ADD_PAGE,
        page,
        newPageId
    };
}

function createPageGroup(pageGroup: any, id: string) {
    return {
        type: types.ADD_PAGE_GROUP,
        pageGroup,
        id
    };
}

function addPageToGroup(pageGroupId: string, pageId: string) {
    return {
        type: types.ADD_PAGE_TO_GROUP,
        pageGroupId,
        pageId
    };
}

export function createDrilldownPage(page: PageDefinition, newPageId: string) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        page,
        newPageId
    };
}

export function createPagesMap(pageMenuItems: PageMenuItem[]) {
    return _(pageMenuItems)
        .filter({ type: 'page' })
        .concat(_.flatMap(pageMenuItems, 'pages'))
        .compact()
        .keyBy('id')
        .value() as Record<string, PageDefinition>;
}

function createId(name: string, pages: PageMenuItem[]) {
    // Add suffix to make URL unique if same page name already exists
    let newPageId = _.snakeCase(name);
    let suffix = 1;
    _.each(pages, p => {
        if (p.id.startsWith(newPageId)) {
            const index = parseInt(p.id.substring(newPageId.length), 10) || suffix;
            suffix = Math.max(index + 1, suffix + 1);
        }
    });

    if (suffix > 1) {
        newPageId += suffix;
    }

    return newPageId;
}

export function changePageMenuItemName(pageMenuItemId: string, newName: string) {
    return {
        type: types.RENAME_PAGE_MENU_ITEM,
        pageMenuItemId,
        name: newName
    };
}

export function changePageMenuItemIcon(pageMenuItemId: string, icon?: SemanticICONS) {
    return {
        type: types.CHANGE_PAGE_MENU_ITEM_ICON,
        pageMenuItemId,
        icon
    };
}

export function selectPage(
    pageId: string,
    isDrilldown?: boolean,
    drilldownContext?: Record<string, any>,
    drilldownPageName?: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const location: LocationDescriptorObject = { pathname: `/page/${pageId}` };

        // Clear the widgets data since there is no point in saving data for widgets that are not in view
        dispatch(clearWidgetsData());

        dispatch(minimizeTabWidgets());

        // Update context and location depending on page is drilldown
        if (!isDrilldown) {
            dispatch(clearContext());
            if (drilldownContext) {
                const newDrilldownContext: DrilldownContext[] = [{ context: drilldownContext }];
                // eslint-disable-next-line scanjs-rules/assign_to_search
                location.search = stringify({ c: JSON.stringify(newDrilldownContext) });
            }
        } else {
            if (!_.isEmpty(drilldownPageName)) {
                // eslint-disable-next-line scanjs-rules/assign_to_pathname
                location.pathname += `/${drilldownPageName}`;
            }

            const newDrilldownContext = (getState().drilldownContext || []).slice();

            if (drilldownPageName || drilldownContext) {
                newDrilldownContext.push({
                    context: drilldownContext || {},
                    pageName: drilldownPageName
                });
            } else {
                throw new Error('Either drilldown page name or context have to be provided while doing a drilldown');
            }

            // eslint-disable-next-line scanjs-rules/assign_to_search
            location.search = stringify({ c: JSON.stringify(newDrilldownContext) });
        }

        dispatch(push(location));
    };
}

export function selectPageByName(
    pageName: string,
    context: Record<string, any>
): ThunkAction<void, ReduxState, never, AnyAction> {
    return dispatch => {
        if (context) {
            dispatch(clearContext());
        }
        const pageId = _.snakeCase(pageName);
        dispatch(selectPage(pageId, false, context));
    };
}

export function createGroupId(groupName: string, pages: PageMenuItem[]) {
    return createId(
        groupName,
        pages.filter(item => item.type === 'pageGroup')
    );
}

export function addPageGroup(name: string): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const newPageGroupId = createGroupId(name, getState().pages);

        dispatch(createPageGroup({ name }, newPageGroupId));

        return newPageGroupId;
    };
}

export function addPage(name: string): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const newPageId = createId(name, Object.values(createPagesMap(getState().pages)));

        dispatch(createPage({ name }, newPageId));
        dispatch(selectPage(newPageId, false));
    };
}

export function removeSinglePageMenuItem(pageMenuItemId: string) {
    return {
        type: types.REMOVE_PAGE_MENU_ITEM,
        pageMenuItemId
    };
}

export function removePageWithChildren(page: PageDefinition): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const pagesMap = createPagesMap(getState().pages);
        const removePage = (p: PageDefinition) => {
            if (p.children && !_.isEmpty(p.children)) {
                p.children.forEach(childPageId => {
                    removePage(pagesMap[childPageId]);
                });
            }
            dispatch(removeSinglePageMenuItem(p.id));
        };

        removePage(page);
    };
}

export function createPagesFromTemplate(): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const { manager } = getState();
        const tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        const internal = new Internal(manager);
        return internal.doGet('/templates/select', { params: { tenant } }).then(templateId => {
            log.debug('Selected template id', templateId);

            const storeTemplates = getState().templates;
            const { pages } = storeTemplates.templatesDef[templateId];

            log.debug('Create pages from selected template', pages);

            if (_.isEmpty(pages)) {
                return Promise.reject(NO_PAGES_FOR_TENANT_ERR);
            }

            _.each(pages, pageMenuItem => {
                function createPageAndLayout(pageId: string) {
                    const page = storeTemplates.pagesDef[pageId];
                    if (!page) {
                        log.error(`Cannot find page template: ${pageId}. Skipping... `);
                        return null;
                    }

                    const pageInstanceId = createId(page.name, getState().pages);
                    dispatch(createPage(page, pageInstanceId));
                    dispatch(addLayoutToPage(page, pageInstanceId));

                    return pageInstanceId;
                }

                if (pageMenuItem.type === 'page') {
                    createPageAndLayout(pageMenuItem.id);
                } else {
                    const pageGroup = storeTemplates.pageGroupsDef[pageMenuItem.id as string];
                    if (!pageGroup) {
                        log.error(`Cannot find page group: ${pageMenuItem.id}. Skipping... `);
                        return;
                    }

                    dispatch(createPageGroup(pageGroup, pageMenuItem.id));

                    _.each(pageGroup.pages, pageId => {
                        const pageInstanceId = createPageAndLayout(pageId);
                        if (pageInstanceId) dispatch(addPageToGroup(pageMenuItem.id, pageInstanceId));
                    });
                }
            });

            return Promise.resolve();
        });
    };
}

export function reorderPageMenu(sourceId: string, targetId: string, position: InsertPosition) {
    return {
        type: types.REORDER_PAGE_MENU,
        sourceId,
        targetId,
        position
    };
}

export function selectHomePage(): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const homePageId = getState().pages[0].id;

        dispatch(selectPage(homePageId));
    };
}

export function selectParentPage(): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const state = getState();

        // @ts-expect-error Missing type definitions for app reducer
        const pageId = state.app.currentPageId || state.pages[0].id;

        const pagesMap = createPagesMap(state.pages);
        const page = pagesMap[pageId];
        if (page && page.parent) {
            // NOTE: assume page is always found
            const parentPage = pagesMap[page.parent];
            dispatch(popDrilldownContext());
            dispatch(selectPage(parentPage.id, parentPage.isDrillDown));
        }
    };
}

export function findSelectedRootPageId(pagesMap: Record<string, PageDefinition>, selectedPageId: string) {
    const getParentPageId = (page: PageDefinition): string => {
        if (!page.parent) {
            return page.id;
        }
        return getParentPageId(pagesMap[page.parent]);
    };

    return getParentPageId(pagesMap[selectedPageId]);
}

export function removePageMenuItem(
    pageListItem: PageMenuItem,
    currentlySelectedPageId: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const { pages } = getState();
        const homePageId = pages[0].id;
        const pagesMap = createPagesMap(pages);
        const selectedRootPageId = findSelectedRootPageId(pagesMap, currentlySelectedPageId);

        if (pageListItem.type === 'page') {
            // Check if user removes current page
            if (selectedRootPageId === pageListItem.id) {
                // Check if current page is home page
                if (selectedRootPageId === homePageId) {
                    dispatch(selectPage(pages[1].id, false));
                } else {
                    dispatch(selectPage(homePageId, false));
                }
            }

            dispatch(removePageWithChildren(pageListItem));
        } else {
            // Check if current page is in group being removed
            if (find(pageListItem.pages, { id: selectedRootPageId })) {
                // Select first page that is not in the group
                dispatch(selectPage(find(pagesMap, page => !includes(pageListItem.pages, page))!.id));
            }

            dispatch(removeSinglePageMenuItem(pageListItem.id));
        }
    };
}

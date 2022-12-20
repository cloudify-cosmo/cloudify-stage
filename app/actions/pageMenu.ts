import { push } from 'connected-react-router';
import type { LocationDescriptorObject } from 'history';
import _, { find, includes } from 'lodash';
import log from 'loglevel';
import { stringify } from 'query-string';
import type { SemanticICONS } from 'semantic-ui-react';
import type { GetInitialTemplateIdResponse } from 'backend/routes/Templates.types';
import { NO_PAGES_FOR_TENANT_ERR } from '../utils/ErrorCodes';
import Internal from '../utils/Internal';
import { clearContext } from './context';
import type { DrilldownContext } from './drilldownContext';
import { popDrilldownContext } from './drilldownContext';
import type { PageDefinition } from './page';
import { addLayoutToPage } from './page';
import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import { clearWidgetsData } from './widgetData';
import { minimizeTabWidgets } from './widgets';
import type { TemplatePageDefinition } from './templateManagement/pages';
import type { LayoutPageGroupDefinition } from '../utils/layoutDefinitionsLoader';

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

type PageToAdd = Partial<PageDefinition> & Pick<PageDefinition, 'name'>;
type PageGroupToAdd = Partial<LayoutPageGroupDefinition> & Pick<LayoutPageGroupDefinition, 'name'>;

export type AddPageAction = PayloadAction<{ page: PageToAdd; newPageId: string }, ActionType.ADD_PAGE>;
export type AddPageGroupAction = PayloadAction<{ pageGroup: PageGroupToAdd; id: string }, ActionType.ADD_PAGE_GROUP>;
export type AddPageToGroupAction = PayloadAction<{ pageGroupId: string; pageId: string }, ActionType.ADD_PAGE_TO_GROUP>;
export type CreateDrilldownPageAction = PayloadAction<
    { page: TemplatePageDefinition; newPageId: string },
    ActionType.CREATE_DRILLDOWN_PAGE
>;
export type RenamePageMenuItemAction = PayloadAction<
    { pageMenuItemId: string; newName: string },
    ActionType.RENAME_PAGE_MENU_ITEM
>;
export type ChangePageMenuItemIconAction = PayloadAction<
    { pageMenuItemId: string; icon?: SemanticICONS },
    ActionType.CHANGE_PAGE_MENU_ITEM_ICON
>;
export type RemovePageMenuItemAction = PayloadAction<string, ActionType.REMOVE_PAGE_MENU_ITEM>;
export type ReorderPageMenuAction = PayloadAction<
    { sourceId: string; targetId: string; position: InsertPosition },
    ActionType.REORDER_PAGE_MENU
>;

export type PageMenuAction =
    | AddPageAction
    | AddPageGroupAction
    | AddPageToGroupAction
    | CreateDrilldownPageAction
    | RenamePageMenuItemAction
    | ChangePageMenuItemIconAction
    | RemovePageMenuItemAction
    | ReorderPageMenuAction;

export function createPage(page: PageToAdd, newPageId: string): AddPageAction {
    return {
        type: ActionType.ADD_PAGE,
        payload: { page, newPageId }
    };
}

function createPageGroup(pageGroup: PageGroupToAdd, id: string): AddPageGroupAction {
    return {
        type: ActionType.ADD_PAGE_GROUP,
        payload: { pageGroup, id }
    };
}

function addPageToGroup(pageGroupId: string, pageId: string): AddPageToGroupAction {
    return {
        type: ActionType.ADD_PAGE_TO_GROUP,
        payload: { pageGroupId, pageId }
    };
}

export function createDrilldownPage(page: TemplatePageDefinition, newPageId: string): CreateDrilldownPageAction {
    return {
        type: ActionType.CREATE_DRILLDOWN_PAGE,
        payload: { page, newPageId }
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

export function changePageMenuItemName(pageMenuItemId: string, newName: string): RenamePageMenuItemAction {
    return {
        type: ActionType.RENAME_PAGE_MENU_ITEM,
        payload: { pageMenuItemId, newName }
    };
}

export function changePageMenuItemIcon(pageMenuItemId: string, icon?: SemanticICONS): ChangePageMenuItemIconAction {
    return {
        type: ActionType.CHANGE_PAGE_MENU_ITEM_ICON,
        payload: { pageMenuItemId, icon }
    };
}

export function selectPage(
    pageId: string,
    isDrilldown?: boolean,
    drilldownContext?: Record<string, any>,
    drilldownPageName?: string
): ReduxThunkAction<void> {
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
                location.search = stringify({ c: JSON.stringify(newDrilldownContext) });
            }
        } else {
            if (!_.isEmpty(drilldownPageName)) {
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

            location.search = stringify({ c: JSON.stringify(newDrilldownContext) });
        }

        dispatch(push(location));
    };
}

export function selectPageByName(pageName: string, context: Record<string, any>): ReduxThunkAction<void> {
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

export function addPageGroup(name: string): ReduxThunkAction<void> {
    return (dispatch, getState) => {
        const newPageGroupId = createGroupId(name, getState().pages);

        dispatch(createPageGroup({ name }, newPageGroupId));

        return newPageGroupId;
    };
}

export function addPage(name: string): ReduxThunkAction<void> {
    return (dispatch, getState) => {
        const newPageId = createId(name, Object.values(createPagesMap(getState().pages)));

        dispatch(createPage({ name }, newPageId));
        dispatch(selectPage(newPageId, false));
    };
}

export function removeSinglePageMenuItem(pageMenuItemId: string): RemovePageMenuItemAction {
    return {
        type: ActionType.REMOVE_PAGE_MENU_ITEM,
        payload: pageMenuItemId
    };
}

export function removePageWithChildren(page: PageDefinition): ReduxThunkAction<void> {
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

export function createPagesFromTemplate(): ReduxThunkAction {
    return (dispatch, getState) => {
        const { manager } = getState();

        const internal = new Internal(manager);
        return internal.doGet<GetInitialTemplateIdResponse>('/templates/initial').then(templateId => {
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

export function reorderPageMenu(sourceId: string, targetId: string, position: InsertPosition): ReorderPageMenuAction {
    return {
        type: ActionType.REORDER_PAGE_MENU,
        payload: { sourceId, targetId, position }
    };
}

export function selectHomePage(): ReduxThunkAction<void> {
    return (dispatch, getState) => {
        const homePageId = getState().pages[0].id;

        dispatch(selectPage(homePageId));
    };
}

export function selectParentPage(): ReduxThunkAction<void> {
    return (dispatch, getState) => {
        const state = getState();

        const pageId = state.app.currentPageId || state.pages[0].id;

        const pagesMap = createPagesMap(state.pages);
        const page = pagesMap[pageId];
        if (page && page.parent) {
            // NOTE: assume page is always found
            const parentPage = pagesMap[page.parent];
            const { context, pageName } = state.drilldownContext?.[state.drilldownContext.length - 2];

            // FIXME: selectPage action needs refactoring
            //  Currently, when parent page is a drilldown page, we need to remove the last 2 entries
            //  from the drilldown context to make selectPage action setting proper context
            //  in the URL query string
            dispatch(popDrilldownContext(2));
            dispatch(selectPage(parentPage.id, parentPage.isDrillDown, context, pageName));
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
): ReduxThunkAction<void> {
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

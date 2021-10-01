import _ from 'lodash';
import log from 'loglevel';
import { push } from 'connected-react-router';
import { stringify } from 'query-string';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import type { LocationDescriptorObject } from 'history';

import * as types from './types';
import { clearContext } from './context';
import { popDrilldownContext } from './drilldownContext';
import { addWidget, minimizeTabWidgets } from './widgets';
import { clearWidgetsData } from './WidgetData';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';
import { NO_PAGES_FOR_TENANT_ERR } from '../utils/ErrorCodes';
import type { Widget, WidgetDefinition } from '../utils/StageAPI';
import type { ReduxState } from '../reducers';
import type { DrilldownContext } from '../reducers/drilldownContextReducer';

// TODO(RD-1645): rename type to Widget
// TODO(RD-1649): rename the added field to `definitionId`
export type SimpleWidgetObj = Omit<Widget, 'definition'> & { definition: string };

export interface WidgetsSection {
    type: 'widgets';
    content: SimpleWidgetObj[];
}

export interface TabContent {
    name: string;
    widgets: SimpleWidgetObj[];
    isDefault?: boolean;
}

export interface TabsSection {
    type: 'tabs';
    content: TabContent[];
}

export type LayoutSection = WidgetsSection | TabsSection;

export function isWidgetsSection(layoutSection: LayoutSection): layoutSection is WidgetsSection {
    return layoutSection.type === 'widgets';
}
export function isTabsSection(layoutSection: LayoutSection): layoutSection is TabsSection {
    return layoutSection.type === 'tabs';
}

export interface PageDefinition {
    id: string;
    name: string;
    type: 'page';
    description: string;
    layout: LayoutSection[];
    isDrillDown: boolean;
    parent?: string;
    children?: string[];
}

export interface PageGroup {
    id: string;
    name: string;
    type: 'pageGroup';
    pages: PageDefinition[];
}

export type PageMenuItem = PageDefinition | PageGroup;

export function addTab(pageId: string, layoutSection: number) {
    return {
        type: types.ADD_TAB,
        pageId,
        layoutSection
    } as const;
}

export function removeTab(pageId: string, layoutSection: number, tabIndex: number) {
    return {
        type: types.REMOVE_TAB,
        pageId,
        layoutSection,
        tabIndex
    } as const;
}

export function updateTab(pageId: string, layoutSection: number, tabIndex: number, name: string, isDefault: boolean) {
    return {
        type: types.UPDATE_TAB,
        pageId,
        layoutSection,
        tabIndex,
        name,
        isDefault
    } as const;
}

export function moveTab(pageId: string, layoutSection: number, oldTabIndex: number, newTabIndex: number) {
    return { type: types.MOVE_TAB, pageId, layoutSection, oldTabIndex, newTabIndex } as const;
}

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

export function forAllWidgets(
    page: Pick<PageDefinition, 'layout'>,
    widgetListModifier: (
        widget: SimpleWidgetObj[],
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => (SimpleWidgetObj | null | undefined)[]
) {
    _.each(page.layout, (layoutSection, layoutSectionIdx) => {
        if (isWidgetsSection(layoutSection))
            layoutSection.content = _.compact(widgetListModifier(layoutSection.content, layoutSectionIdx, null));
        else
            _.each(layoutSection.content, (tab, tabIdx) => {
                tab.widgets = _.compact(widgetListModifier(tab.widgets, layoutSectionIdx, tabIdx));
            });
    });
}

export function forEachWidget(
    page: Pick<PageDefinition, 'layout'>,
    widgetModifier: (
        widget: SimpleWidgetObj,
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => SimpleWidgetObj | null | undefined
) {
    forAllWidgets(page, (widgets, layoutSectionIdx, tabIdx) =>
        _.map(widgets, widget => widgetModifier(widget, layoutSectionIdx, tabIdx))
    );
}

export function getWidgetDefinitionById(
    definitionId: string,
    definitions: ReduxState['widgetDefinitions']
): WidgetDefinition | undefined {
    return _.find(definitions, { id: definitionId });
}

function createPageId(name: string, pages: PageMenuItem[]) {
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

export function changePageName(page: PageDefinition, newName: string) {
    return {
        type: types.RENAME_PAGE,
        pageId: page.id,
        name: newName
    };
}

export function changePageDescription(pageId: string, newDescription: string) {
    return {
        type: types.CHANGE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
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

export function addPage(name: string): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const newPageId = createPageId(name, getState().pages);

        dispatch(createPage({ name }, newPageId));
        dispatch(selectPage(newPageId, false));
    };
}

function removeSinglePage(pageId: string) {
    return {
        type: types.REMOVE_PAGE,
        pageId
    };
}

export function removePage(page: PageDefinition): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const pagesMap = createPagesMap(getState().pages);
        const removePageWithChildren = (p: PageDefinition) => {
            if (p.children && !_.isEmpty(p.children)) {
                p.children.forEach(childPageId => {
                    removePageWithChildren(pagesMap[childPageId]);
                });
            }
            dispatch(removeSinglePage(p.id));
        };

        removePageWithChildren(page);
    };
}

export function addLayoutToPage(
    page: Pick<PageDefinition, 'layout'>,
    pageId: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const { widgetDefinitions } = getState();
        forEachWidget(page, (widget, layoutSectionIdx, tabIdx) => {
            const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });
            dispatch(addWidget(pageId, layoutSectionIdx, tabIdx, widget, widgetDefinition));
            return widget;
        });
    };
}

export function addLayoutSectionToPage(pageId: string, layoutSection: LayoutSection, position: number) {
    return { type: types.ADD_LAYOUT_SECTION, pageId, layoutSection, position };
}

export function removeLayoutSectionFromPage(pageId: string, layoutSection: number) {
    return { type: types.REMOVE_LAYOUT_SECTION, pageId, layoutSection };
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

                    const pageInstanceId = createPageId(page.name, getState().pages);
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

export function reorderPage(pageIndex: number, newPageIndex: number) {
    return {
        type: types.REORDER_PAGE,
        pageIndex,
        newPageIndex
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const parentPage = pagesMap[page.parent];
            dispatch(popDrilldownContext());
            dispatch(selectPage(parentPage.id, parentPage.isDrillDown));
        }
    };
}

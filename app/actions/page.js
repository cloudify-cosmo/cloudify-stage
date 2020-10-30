/**
 * Created by kinneretzin on 30/08/2016.
 */

import _ from 'lodash';
import log from 'loglevel';
import { push } from 'connected-react-router';
import { stringify } from 'query-string';
import * as types from './types';
import { clearContext } from './context';
import { popDrilldownContext } from './drilldownContext';
import { addWidget } from './widgets';
import { clearWidgetsData } from './WidgetData';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';

export function addTab(pageId, layoutSection) {
    return {
        type: types.ADD_TAB,
        pageId,
        layoutSection
    };
}

export function removeTab(pageId, layoutSection, tabIndex) {
    return {
        type: types.REMOVE_TAB,
        pageId,
        layoutSection,
        tabIndex
    };
}

export function updateTab(pageId, layoutSection, tabIndex, name, isDefault) {
    return {
        type: types.UPDATE_TAB,
        pageId,
        layoutSection,
        tabIndex,
        name,
        isDefault
    };
}

export function moveTab(pageId, layoutSection, oldTabIndex, newTabIndex) {
    return { type: types.MOVE_TAB, pageId, layoutSection, oldTabIndex, newTabIndex };
}

export function createPage(page, newPageId) {
    return {
        type: types.ADD_PAGE,
        page,
        newPageId
    };
}

export function createDrilldownPage(page, newPageId) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        page,
        newPageId
    };
}

export function createPagesMap(pages) {
    return _.keyBy(pages, 'id');
}

export function forAllWidgets(page, widgetListModifier) {
    _.each(page.layout, (layoutSection, layoutSectionIdx) => {
        if (layoutSection.type === 'widgets')
            layoutSection.content = _.compact(widgetListModifier(layoutSection.content, layoutSectionIdx, null));
        else
            _.each(layoutSection.content, (tab, tabIdx) => {
                tab.widgets = _.compact(widgetListModifier(tab.widgets, layoutSectionIdx, tabIdx));
            });
    });
}

export function forEachWidget(page, widgetModifier) {
    forAllWidgets(page, (widgets, layoutSectionIdx, tabIdx) =>
        _.map(widgets, widget => widgetModifier(widget, layoutSectionIdx, tabIdx))
    );
}

function createPageId(name, pages) {
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

export function changePageName(page, newName) {
    return {
        type: types.RENAME_PAGE,
        pageId: page.id,
        name: newName
    };
}

export function changePageDescription(pageId, newDescription) {
    return {
        type: types.CHANGE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    };
}

export function selectPage(pageId, isDrilldown, drilldownContext, drilldownPageName) {
    return (dispatch, getState) => {
        const location = { pathname: `/page/${pageId}` };
        let newDrilldownContext = getState().drilldownContext || [];

        // Clear the widgets data since there is no point in saving data for widgets that are not in view
        dispatch(clearWidgetsData());

        // Update context and location depending on page is drilldown
        if (!isDrilldown) {
            dispatch(clearContext());
        } else {
            if (!_.isEmpty(drilldownPageName)) {
                // eslint-disable-next-line scanjs-rules/assign_to_pathname
                location.pathname += `/${drilldownPageName}`;
            }
            if (drilldownPageName || drilldownContext) {
                newDrilldownContext = [
                    ...newDrilldownContext,
                    {
                        context: drilldownContext || {},
                        pageName: drilldownPageName
                    }
                ];
            }

            // eslint-disable-next-line scanjs-rules/assign_to_search
            location.search = stringify({ c: JSON.stringify(newDrilldownContext) });
        }

        dispatch(push(location));
    };
}

export function selectPageByName(pageName) {
    const pageId = _.snakeCase(pageName);
    return selectPage(pageId, false);
}

export function addPage(name) {
    return (dispatch, getState) => {
        const newPageId = createPageId(name, getState().pages);

        dispatch(createPage({ name }, newPageId));
        dispatch(selectPage(newPageId, false));
    };
}

function removeSinglePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId
    };
}

export function removePage(page) {
    return (dispatch, getState) => {
        const pagesMap = createPagesMap(getState().pages);
        const removePageWithChildren = p => {
            if (!_.isEmpty(p.children)) {
                p.children.forEach(childPageId => {
                    removePageWithChildren(pagesMap[childPageId]);
                });
            }
            dispatch(removeSinglePage(p.id));
        };

        removePageWithChildren(page);
    };
}

export function addLayoutToPage(page, pageId) {
    return (dispatch, getState) => {
        const { widgetDefinitions } = getState();
        forEachWidget(page, (widget, layoutSectionIdx, tabIdx) => {
            const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });
            dispatch(addWidget(pageId, layoutSectionIdx, tabIdx, widget, widgetDefinition));
            return widget;
        });
    };
}

export function addLayoutSectionToPage(pageId, layoutSection) {
    return { type: types.ADD_LAYOUT_SECTION, pageId, layoutSection };
}

export function removeLayoutSectionFromPage(pageId, layoutSection) {
    return { type: types.REMOVE_LAYOUT_SECTION, pageId, layoutSection };
}

export function createPagesFromTemplate() {
    return (dispatch, getState) => {
        const { manager } = getState();
        const tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        const internal = new Internal(manager);
        return internal.doGet('/templates/select', { tenant }).then(templateId => {
            log.log('Selected template id', templateId);

            const storeTemplates = getState().templates;
            const { pages } = storeTemplates.templatesDef[templateId];

            log.log('Create pages from selected template', pages);

            _.each(pages, id => {
                const page = storeTemplates.pagesDef[id];
                if (!page) {
                    log.error(`Cannot find page template: ${id}. Skipping... `);
                    return;
                }

                const pageId = createPageId(page.name, getState().pages);
                dispatch(createPage(page, pageId));
                dispatch(addLayoutToPage(page, pageId));
            });
        });
    };
}

export function reorderPage(pageIndex, newPageIndex) {
    return {
        type: types.REORDER_PAGE,
        pageIndex,
        newPageIndex
    };
}

export function selectHomePage() {
    return (dispatch, getState) => {
        const homePageId = getState().pages[0].id;

        dispatch(selectPage(homePageId));
    };
}

export function selectParentPage() {
    return (dispatch, getState) => {
        const state = getState();

        const pageId = state.app.currentPageId || state.pages[0].id;

        const page = _.find(state.pages, { id: pageId });
        if (page && page.parent) {
            const parentPage = _.find(state.pages, { id: page.parent });
            dispatch(popDrilldownContext());
            dispatch(selectPage(parentPage.id, parentPage.isDrillDown));
        }
    };
}

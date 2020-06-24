/**
 * Created by kinneretzin on 30/08/2016.
 */

import { push } from 'connected-react-router';
import { stringify } from 'query-string';
import * as types from './types';
import { clearContext } from './context';
import { popDrilldownContext } from './drilldownContext';
import { addWidget } from './widgets';
import { clearWidgetsData } from './WidgetData';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';

export function addTab(pageId) {
    return {
        type: types.ADD_TAB,
        pageId
    };
}

export function removeTab(pageId, tabIndex) {
    return {
        type: types.REMOVE_TAB,
        pageId,
        tabIndex
    };
}

export function updateTab(pageId, tabIndex, name, isDefault) {
    return {
        type: types.UPDATE_TAB,
        pageId,
        tabIndex,
        name,
        isDefault
    };
}

export function moveTab(pageId, oldTabIndex, newTabIndex) {
    return { type: types.MOVE_TAB, pageId, oldTabIndex, newTabIndex };
}

export function createPage(page, newPageId) {
    return {
        type: types.ADD_PAGE,
        page,
        newPageId
    };
}

export function createDrilldownPage(newPageId, name) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        newPageId,
        name
    };
}

export function createPagesMap(pages) {
    return _.keyBy(pages, 'id');
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

export function createPagesFromTemplate() {
    return (dispatch, getState) => {
        const { manager } = getState();
        const tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        const internal = new Internal(manager);
        return internal.doGet('/templates/select', { tenant }).then(templateId => {
            console.log('Selected template id', templateId);

            const storeTemplates = getState().templates;
            const { widgetDefinitions } = getState();

            const { pages } = storeTemplates.templatesDef[templateId];

            console.log('Create pages from selected template', pages);

            _.each(pages, id => {
                const page = storeTemplates.pagesDef[id];
                if (!page) {
                    console.error(`Cannot find page template: ${id}. Skipping... `);
                    return;
                }

                const pageId = createPageId(page.name, getState().pages);
                dispatch(createPage(page, pageId));
                _.each(page.widgets, widget => {
                    const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });
                    dispatch(addWidget(pageId, null, widget, widgetDefinition));
                });
                _.each(page.tabs, (tab, tabIndex) =>
                    _.each(tab.widgets, tabWidget => {
                        const widgetDefinition = _.find(widgetDefinitions, { id: tabWidget.definition });
                        dispatch(addWidget(pageId, tabIndex, tabWidget, widgetDefinition));
                    })
                );
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

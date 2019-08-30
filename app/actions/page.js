/**
 * Created by kinneretzin on 30/08/2016.
 */

import { push } from 'connected-react-router';
import { stringify } from 'query-string';
import * as types from './types';
import { clearContext } from './context';
import { popDrilldownContext } from './drilldownContext';
import { setAppError } from './app';
import { addWidget } from './widgets';
import { clearWidgetsData } from './WidgetData';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';

export function createPage(name, newPageId) {
    return {
        type: types.ADD_PAGE,
        name,
        newPageId
    };
}

export function addPage(name) {
    return function(dispatch, getState) {
        const newPageId = createPageId(name, getState().pages);

        dispatch(createPage(name, newPageId));
        dispatch(selectPage(newPageId, false));
    };
}

export function createDrilldownPage(newPageId, name) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        newPageId,
        name
    };
}

export function renamePage(pageId, newName, newPageId) {
    return {
        type: types.RENAME_PAGE,
        pageId,
        name: newName,
        newPageId
    };
}

function createPageId(name, pages) {
    // Add suffix to make URL unique if same page name already exists
    let newPageId = _.snakeCase(name);
    let suffix = 1;
    _.each(pages, p => {
        if (p.id.startsWith(newPageId)) {
            const index = parseInt(p.id.substring(newPageId.length)) || suffix;
            suffix = Math.max(index + 1, suffix + 1);
        }
    });

    if (suffix > 1) {
        newPageId += suffix;
    }

    return newPageId;
}

export function changePageName(page, newName) {
    return function(dispatch, getState) {
        const newPageId = createPageId(newName, getState().pages);

        dispatch(renamePage(page.id, newName, newPageId));
        dispatch(selectPage(newPageId, page.isDrillDown, page.context, newName));
    };
}

export function updatePageDescription(pageId, newDescription) {
    return {
        type: types.UPDATE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    };
}

export function selectPage(pageId, isDrilldown, drilldownContext, drilldownPageName) {
    return function(dispatch, getState) {
        const state = getState();
        let dContext = state.drilldownContext || [];

        // Clear the widgets data since there is no point in saving data for widgets that are not in view
        dispatch(clearWidgetsData());

        if (!isDrilldown) {
            dispatch(clearContext());
        }

        const location = { pathname: `/page/${pageId}` };
        if (!_.isEmpty(drilldownPageName)) {
            location.pathname += `/${drilldownPageName}`;
        }

        if (isDrilldown) {
            if (drilldownPageName || drilldownContext) {
                dContext = [
                    ...dContext,
                    {
                        context: drilldownContext || {},
                        pageName: drilldownPageName
                    }
                ];
            }

            location.search = stringify({ c: JSON.stringify(dContext) });
        }

        dispatch(push(location));
    };
}

export function selectPageByName(pageName) {
    const pageId = _.snakeCase(pageName);
    return selectPage(pageId, false);
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId
    };
}

export function createPagesFromTemplate() {
    return function(dispatch, getState) {
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
                dispatch(createPage(page.name, pageId));
                _.each(page.widgets, widget => {
                    const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });
                    dispatch(
                        addWidget(
                            pageId,
                            widget.name,
                            widgetDefinition,
                            widget.width,
                            widget.height,
                            widget.x,
                            widget.y,
                            widget.configuration
                        )
                    );
                });
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
    return function(dispatch, getState) {
        const homePageId = getState().pages[0].id;

        dispatch(selectPage(homePageId));
    };
}

export function selectParentPage() {
    return function(dispatch, getState) {
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

export function selectRootPage() {
    return function(dispatch, getState) {
        const state = getState();

        const pageId = state.app.currentPageId;
        if (!pageId || !_.find(state.pages, { id: pageId })) {
            return dispatch(selectHomePage());
        }

        var _findRecurse = (pid, count) => {
            const page = _.find(state.pages, { id: pid });

            if (page && page.parent) {
                return _findRecurse(page.parent, count + 1);
            }

            return { page, count };
        };

        const found = _findRecurse(pageId, 0);
        if (found.count > 0) {
            dispatch(popDrilldownContext(found.count));
            dispatch(selectPage(found.page.id, found.page.isDrillDown));
        }
    };
}

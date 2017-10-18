/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from './types';
import { push } from 'react-router-redux';
import {v4} from 'node-uuid';
import {clearContext} from './context';
import {popDrilldownContext} from './drilldownContext';
import {setAppError} from './app';
import {addWidget} from './widgets';
import {clearWidgetsData} from './WidgetData';
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
    return function (dispatch, getState) {
        var newPageId = createPageId(name, getState().pages);

        dispatch(createPage(name, newPageId));
        dispatch(selectPage(newPageId,false))
    }
}

export function createDrilldownPage(newPageId,name) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        newPageId,
        name
    }
}

export function renamePage(pageId, newName, newPageId) {
    return {
        type: types.RENAME_PAGE,
        pageId,
        name: newName,
        newPageId
    }
}

function createPageId(name, pages) {
    //Add suffix to make URL unique if same page name already exists
    var newPageId = _.snakeCase(name);
    var suffix = 1;
    _.each(pages,(p)=>{
        if (p.id.startsWith(newPageId)) {
            var index = parseInt(p.id.substring(newPageId.length)) || suffix;
            suffix = Math.max(index + 1, suffix + 1);
        }
    });

    if (suffix > 1) {
        newPageId = newPageId + suffix;
    }

    return newPageId;
}

export function changePageName(page, newName) {
    return function (dispatch,getState) {
        var newPageId = createPageId(newName, getState().pages);

        dispatch(renamePage(page.id, newName, newPageId));
        dispatch(selectPage(newPageId,page.isDrillDown,page.context,newName));
    }
}

export function updatePageDescription(pageId,newDescription) {
    return {
        type: types.UPDATE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    }

}
export function selectPage(pageId,isDrilldown,drilldownContext,drilldownPageName) {
    return function (dispatch,getState) {
        var state = getState();
        var dContext = state.drilldownContext || [];

        // Clear the widgets data since there is no point in saving data for widgets that are not in view
        dispatch(clearWidgetsData());

        if (!isDrilldown) {
            dispatch(clearContext());
        }

        var location = {pathname: `page/${pageId}`};
        if (!_.isEmpty(drilldownPageName)){
            location.pathname +=`/${drilldownPageName}`;
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

            location.query = {c : JSON.stringify(dContext)};
        }

        dispatch(push(location));
    }
}
export function selectPageByName(pageName) {
    var pageId = _.snakeCase(pageName);
    return selectPage(pageId, false);
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId: pageId
        }
}

export function createPagesFromTemplate() {
    return function (dispatch, getState) {
        var manager = getState().manager;
        var tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        var internal = new Internal(manager);
        return internal.doGet('/templates/select', {tenant})
            .then(templateId => {
                console.log('Selected template id', templateId);

                var storeTemplates = getState().templates;
                var widgetDefinitions = getState().widgetDefinitions;

                var pages = storeTemplates.templatesDef[templateId];

                console.log('Create pages from selected template', pages);

                _.each(pages, id => {
                    var page = storeTemplates.pagesDef[id];
                    if (!page) {
                        console.error('Cannot find page template: ' + id + '. Skipping... ');
                        return;
                    }

                    var pageId = _.snakeCase(page.name);
                    dispatch(createPage(page.name, pageId));
                    _.each(page.widgets,(widget)=>{
                        var widgetDefinition = _.find(widgetDefinitions,{id:widget.definition});
                        dispatch(addWidget(pageId,widget.name,widgetDefinition,widget.width,widget.height,widget.x,widget.y,widget.configuration));
                    });
                });
            });
    }
}

export function reorderPage(pageIndex,newPageIndex) {
    return {
        type: types.REORDER_PAGE,
        pageIndex,
        newPageIndex
    }
}

export function selectHomePage() {
    return function (dispatch,getState) {
        var homePageId = getState().pages[0].id;

        dispatch(selectPage(homePageId));
    }
}

export function selectParentPage() {
    return function (dispatch,getState) {
        var state = getState();

        var pageId = state.app.currentPageId || state.pages[0].id;

        var page = _.find(state.pages, {'id': pageId});
        if (page && page.parent) {
            var parentPage = _.find(state.pages, {'id': page.parent});
            dispatch(popDrilldownContext());
            dispatch(selectPage(parentPage.id, parentPage.isDrillDown));
        }
    }
}

export function selectRootPage() {

    return function (dispatch,getState) {
        var state = getState();

        var pageId = state.app.currentPageId;
        if (!pageId || !_.find(state.pages, {'id': pageId})) {
            return dispatch(selectHomePage());
        }

        var _findRecurse = (pid, count) => {
            var page = _.find(state.pages, {'id': pid});

            if (page && page.parent) {
                return _findRecurse(page.parent, count + 1);
            }

            return {page, count};
        };

        var found = _findRecurse(pageId, 0);
        if (found.count > 0) {
            dispatch(popDrilldownContext(found.count));
            dispatch(selectPage(found.page.id, found.page.isDrillDown));
        }
    }
}
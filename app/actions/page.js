/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import { push } from 'react-router-redux';
import {v4} from 'node-uuid';
import {clearContext} from './context';
import {addWidget} from './widgets';
import {clearWidgetsData} from './WidgetData';

export function createPage(name, newPageId) {
    return {
        type: types.ADD_PAGE,
        name,
        newPageId
    };
}

export function addPage(name) {
    return function (dispatch) {
        var newPageId = v4();
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

export function renamePage(pageId,newName) {
    return {
        type: types.RENAME_PAGE,
        pageId,
        name: newName
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
    return function (dispatch) {

        // Clear the widgets data since there is no point in saving data for widgets that are not in view
        dispatch(clearWidgetsData());

        if (!isDrilldown) {
            dispatch(clearContext());
        }

        var location = {pathname:`/page/${pageId}`};
        if (!_.isEmpty(drilldownPageName)){
            location.pathname +=`/${drilldownPageName}`;
        }
        if (!_.isEmpty(drilldownContext)) {
            location.query=drilldownContext;
        }
        dispatch(push(location));
    }
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId: pageId
        }
}

export function createPageFromInitialTemplate(initialTemplate,templates,widgetDefinitions) {
    return function (dispatch) {

        let idIndex = 0;

        _.each(initialTemplate,(templateName)=>{
            var template = templates[templateName];
            if (!template) {
                console.error('Cannot find template : '+templateName + ' Skipping... ');
                return;
            }

            var currId = idIndex.toString();
            dispatch(createPage(template.name,currId));
            _.each(template.widgets,(widget)=>{
                var widgetDefinition = _.find(widgetDefinitions,{id:widget.definition});
                dispatch(addWidget(currId,widget.name,widgetDefinition,widget.width,widget.height,widget.x,widget.y,widget.configuration));
            });
            idIndex++;
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

/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import {createDrilldownPage,selectPage} from './page';
import {v4} from 'node-uuid';

export function addWidget(pageId,name,widgetDefinition,width,height,x,y,configuration) {
    return {
        type: types.ADD_WIDGET,
        pageId,
        name,
        widgetDefinition,
        width,
        height,
        x,
        y,
        configuration
    };
}

export function renameWidget(pageId,widgetId,newName) {
    return {
        type: types.RENAME_WIDGET,
        pageId,
        widgetId,
        name: newName
    }

}

export function removeWidget(pageId,widgetId) {
    return {
        type: types.REMOVE_WIDGET,
        pageId,
        widgetId
    }
}

export function editWidget(pageId, widgetId, configuration) {
    return {
        type: types.EDIT_WIDGET,
        pageId,
        widgetId,
        configuration
    }
}

export function changeWidgetGridData(pageId,widgetId,gridData) {
    return {
        type: types.CHANGE_WIDGET_GRID_DATA,
        pageId,
        widgetId,
        gridData

    }

}

export function setWidgetDrilldownPage(widgetId,drillDownPageId) {
    return {
        type : types.SET_DRILLDOWN_PAGE,
        widgetId,
        drillDownPageId
    }

}

export function drillDownToPage(widget,defaultTemplate,widgetDefinitions,drilldownContext,drilldownPageName) {

    return function (dispatch) {

        var pageId =  widget.drillDownPageId;
        if (!pageId) {
            var newPageId = v4();
            dispatch(createDrilldownPage(newPageId,defaultTemplate.name));
            _.each(defaultTemplate.widgets,(widget)=>{
                var widgetDefinition = _.find(widgetDefinitions,{id:widget.definition});
                dispatch(addWidget(newPageId,widget.name,widgetDefinition,widget.width,widget.height,widget.x,widget.y));
            });

            dispatch(setWidgetDrilldownPage(widget.id,newPageId));
            pageId = newPageId;
        }


        dispatch(selectPage(pageId,true,drilldownContext,drilldownPageName));
    }
}
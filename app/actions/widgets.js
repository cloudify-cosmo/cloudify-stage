/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';

export function addWidget(pageId,name,plugin) {
    return {
        type: types.ADD_WIDGET,
        pageId,
        name,
        plugin
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

export function changeWidgetGridData(pageId,widgetId,gridData) {
    return {
        type: types.CHANGE_WIDGET_GRID_DATA,
        pageId,
        widgetId,
        gridData

    }

}
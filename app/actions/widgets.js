/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import {createDrilldownPage,selectPage} from './page';
import {v4} from 'node-uuid';

export function addWidget(pageId,name,plugin,width,height,x,y,configuration) {
    return {
        type: types.ADD_WIDGET,
        pageId,
        name,
        plugin,
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

export function drillDownToPage(widget,defaultTemplate,plugins) {


    return function (dispatch) {

        if (widget.drillDownPageId) {
            // TODO dispatch set drill down (for breadcrumbs)
            dispatch(selectPage(widget.drillDownPageId,true));

        } else {
            var newPageId = v4();
            dispatch(createDrilldownPage(newPageId,defaultTemplate.name));
            _.each(defaultTemplate.widgets,(widget)=>{
                var plugin = _.find(plugins,{id:widget.plugin});
                dispatch(addWidget(newPageId,widget.name,plugin,widget.width,widget.height,widget.x,widget.y));
            });

            dispatch(setWidgetDrilldownPage(widget.id,newPageId));
            dispatch(selectPage(newPageId,true));
            //// dispatch action to create drilldown page. It will also drilldown to it
            //this._createDrillDownPage(widget,defaultTemplate);
        }

        //return PluginsLoader.load()
        //    .then(data => dispatch(receivePlugins(data)))
        //    .catch(err => dispatch(errorsPlugins(err)))
    }
}
/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import {createDrilldownPage,selectPage} from './page';
import {drillDownWarning} from './templateManagement';
import {v4} from 'node-uuid';
import widgetDefinitionLoader from '../utils/widgetDefinitionsLoader';
import Internal from '../utils/Internal';

export function storeWidgetDefinitions(widgetDefinitions) {
    return {
        type: types.STORE_WIDGETS,
        widgetDefinitions
    }
}

export function loadWidgetDefinitions() {
    return function (dispatch, getState) {
        return widgetDefinitionLoader.load(getState().manager)
            .then(result => dispatch(storeWidgetDefinitions(result)));
    }
}

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

export function maximizeWidget(pageId,widgetId,maximized) {
    return {
        type: types.MAXIMIZE_WIDGET,
        pageId,
        widgetId,
        maximized
    }
}

export function minimizeWidgets() {
    return {
        type: types.MINIMIZE_WIDGETS
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

export function addWidgetDrilldownPage(widgetId,drillDownName,drillDownPageId) {
    return {
        type : types.ADD_DRILLDOWN_PAGE,
        widgetId,
        drillDownPageId,
        drillDownName
    }

}

export function drillDownToPage(widget,defaultTemplate,widgetDefinitions,drilldownContext,drilldownPageName) {

    return function (dispatch, getState) {
        var isPageEditMode = _.get(getState().templateManagement, 'isPageEditMode');
        if (!_.isUndefined(isPageEditMode)) {
            return dispatch(drillDownWarning(true));
        }

        var pageId = widget.drillDownPages[defaultTemplate.name];
        if (!pageId) {
            var currentPage = _.replace(window.location.pathname, '/page/', '');
            var newPageId = _.snakeCase(currentPage + ' ' + defaultTemplate.name);

            dispatch(createDrilldownPage(newPageId,defaultTemplate.name));
            _.each(defaultTemplate.widgets,(widget)=>{
                var widgetDefinition = _.find(widgetDefinitions,{id:widget.definition});
                dispatch(addWidget(newPageId,widget.name,widgetDefinition,widget.width,widget.height,widget.x,widget.y,widget.configuration));
            });

            dispatch(addWidgetDrilldownPage(widget.id,defaultTemplate.name,newPageId));
            pageId = newPageId;
        }

        dispatch(selectPage(pageId,true,drilldownContext,drilldownPageName));
    }
}

export function setInstallWidget(widgetDefinitions) {
    return {
        type: types.INSTALL_WIDGET,
        widgetDefinitions
    };
}

export function installWidget(widgetFile, widgetUrl) {
    return function(dispatch,getState) {
        return widgetDefinitionLoader.install(widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinitions => dispatch(setInstallWidget(widgetDefinitions)));
    }
}

export function setUninstallWidget(widgetId) {
    return {
        type: types.UNINSTALL_WIDGET,
        widgetId
    };
}

export function uninstallWidget(widgetId) {
    return function(dispatch,getState) {
        return widgetDefinitionLoader.uninstall(widgetId, getState().manager)
            .then(() => dispatch(setUninstallWidget(widgetId)));
    }
}

export function setUpdateWidget(widgetDefinitions, widgetId) {
    return {
        type: types.UPDATE_WIDGET,
        widgetDefinitions,
        widgetId
    };
}

export function updateWidget(widgetId, widgetFile, widgetUrl) {
    return function(dispatch,getState) {
        return widgetDefinitionLoader.update(widgetId, widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinitions => dispatch(setUpdateWidget(widgetDefinitions, widgetId)));
    }
}

export function checkIfWidgetIsUsed(widgetId) {
    return function(dispatch,getState) {
        var internal = new Internal(getState().manager);
        return internal.doGet(`/widgets/${widgetId}/used`);
    }
}

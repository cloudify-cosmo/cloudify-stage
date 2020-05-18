/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from './types';
import widgetDefinitionLoader from '../utils/widgetDefinitionsLoader';
import Internal from '../utils/Internal';

export function storeWidgetDefinitions(widgetDefinitions) {
    return {
        type: types.STORE_WIDGETS,
        widgetDefinitions
    };
}

export function loadWidgetDefinitions() {
    return (dispatch, getState) =>
        widgetDefinitionLoader.load(getState().manager).then(result => dispatch(storeWidgetDefinitions(result)));
}

export function addWidget(pageId, name, widgetDefinition, width, height, x, y, configuration) {
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

export function renameWidget(pageId, widgetId, newName) {
    return {
        type: types.RENAME_WIDGET,
        pageId,
        widgetId,
        name: newName
    };
}

export function removeWidget(pageId, widgetId) {
    return {
        type: types.REMOVE_WIDGET,
        pageId,
        widgetId
    };
}

export function editWidget(pageId, widgetId, configuration) {
    return {
        type: types.EDIT_WIDGET,
        pageId,
        widgetId,
        configuration
    };
}

export function maximizeWidget(pageId, widgetId, maximized) {
    return {
        type: types.MAXIMIZE_WIDGET,
        pageId,
        widgetId,
        maximized
    };
}

export function minimizeWidgets() {
    return {
        type: types.MINIMIZE_WIDGETS
    };
}

export function changeWidgetGridData(pageId, widgetId, gridData) {
    return {
        type: types.CHANGE_WIDGET_GRID_DATA,
        pageId,
        widgetId,
        gridData
    };
}

export function setInstallWidget(widgetDefinitions) {
    return {
        type: types.INSTALL_WIDGET,
        widgetDefinitions
    };
}

export function installWidget(widgetFile, widgetUrl) {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .install(widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinitions => dispatch(setInstallWidget(widgetDefinitions)));
}

export function setUninstallWidget(widgetId) {
    return {
        type: types.UNINSTALL_WIDGET,
        widgetId
    };
}

export function uninstallWidget(widgetId) {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .uninstall(widgetId, getState().manager)
            .then(() => dispatch(setUninstallWidget(widgetId)));
}

export function setUpdateWidget(widgetDefinitions, widgetId) {
    return {
        type: types.UPDATE_WIDGET,
        widgetDefinitions,
        widgetId
    };
}

export function updateWidget(widgetId, widgetFile, widgetUrl) {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .update(widgetId, widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinitions => dispatch(setUpdateWidget(widgetDefinitions, widgetId)));
}

export function checkIfWidgetIsUsed(widgetId) {
    return (dispatch, getState) => {
        const internal = new Internal(getState().manager);
        return internal.doGet(`/widgets/${widgetId}/used`);
    };
}

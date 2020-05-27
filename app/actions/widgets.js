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

export function addWidget(pageId, tab, widget, widgetDefinition) {
    return {
        type: types.ADD_WIDGET,
        pageId,
        tab,
        widget,
        widgetDefinition
    };
}

export function updateWidget(pageId, widgetId, params) {
    return {
        type: types.UPDATE_WIDGET,
        pageId,
        widgetId,
        params
    };
}

export function removeWidget(pageId, widgetId) {
    return {
        type: types.REMOVE_WIDGET,
        pageId,
        widgetId
    };
}

export function minimizeWidgets() {
    return {
        type: types.MINIMIZE_WIDGETS
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

export function updateWidgetDefinition(widgetId, widgetFile, widgetUrl) {
    return (dispatch, getState) =>
        widgetDefinitionLoader.update(widgetId, widgetFile, widgetUrl, getState().manager).then(widgetDefinitions =>
            dispatch({
                type: types.UPDATE_WIDGET_DEFINITION,
                widgetDefinitions,
                widgetId
            })
        );
}

export function checkIfWidgetIsUsed(widgetId) {
    return (dispatch, getState) => {
        const internal = new Internal(getState().manager);
        return internal.doGet(`/widgets/${widgetId}/used`);
    };
}

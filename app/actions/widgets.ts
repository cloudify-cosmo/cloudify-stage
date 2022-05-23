// @ts-nocheck File not migrated fully to TS

import Internal from '../utils/Internal';
import widgetDefinitionLoader from '../utils/widgetDefinitionsLoader';
import * as types from './types';

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

export function addWidget(pageId, layoutSection, tab, widget, widgetDefinition) {
    return {
        type: types.ADD_WIDGET,
        pageId,
        layoutSection,
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

export function minimizeTabWidgets() {
    return {
        type: types.MINIMIZE_TAB_WIDGETS
    };
}

export function minimizeWidgets() {
    return {
        type: types.MINIMIZE_WIDGETS
    };
}

function setInstallWidget(widgetDefinition) {
    return {
        type: types.INSTALL_WIDGET,
        widgetDefinition
    };
}

export function installWidget(widgetFile, widgetUrl) {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .install(widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinition => dispatch(setInstallWidget(widgetDefinition)));
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

export function updateWidgetDefinition(widgetId, widgetDefinition) {
    return dispatch =>
        dispatch({
            type: types.UPDATE_WIDGET_DEFINITION,
            widgetDefinition,
            widgetId
        });
}

export function replaceWidget(widgetId, widgetFile, widgetUrl) {
    return (dispatch, getState) =>
        widgetDefinitionLoader.update(widgetId, widgetFile, widgetUrl, getState().manager).then(widgetDefinition =>
            dispatch({
                type: types.UPDATE_WIDGET_DEFINITION,
                widgetDefinition,
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

// @ts-nocheck File not migrated fully to TS

import Internal from '../utils/Internal';
import widgetDefinitionLoader from '../utils/widgetDefinitionsLoader';
import { ActionType } from './types';
import type { GetWidgetsUsedResponse } from '../../backend/routes/Widgets.types';

export function storeWidgetDefinitions(widgetDefinitions) {
    return {
        type: ActionType.STORE_WIDGETS,
        widgetDefinitions
    };
}

export function loadWidgetDefinitions() {
    return (dispatch, getState) =>
        widgetDefinitionLoader.load(getState().manager).then(result => dispatch(storeWidgetDefinitions(result)));
}

export function addWidget(pageId, layoutSection, tab, widget, widgetDefinition) {
    return {
        type: ActionType.ADD_WIDGET,
        pageId,
        layoutSection,
        tab,
        widget,
        widgetDefinition
    };
}

export function updateWidget(pageId, widgetId, params) {
    return {
        type: ActionType.UPDATE_WIDGET,
        pageId,
        widgetId,
        params
    };
}

export function removeWidget(pageId, widgetId) {
    return {
        type: ActionType.REMOVE_WIDGET,
        pageId,
        widgetId
    };
}

export function minimizeTabWidgets() {
    return {
        type: ActionType.MINIMIZE_TAB_WIDGETS
    };
}

export function minimizeWidgets() {
    return {
        type: ActionType.MINIMIZE_WIDGETS
    };
}

function setInstallWidget(widgetDefinition) {
    return {
        type: ActionType.INSTALL_WIDGET,
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
        type: ActionType.UNINSTALL_WIDGET,
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
            type: ActionType.UPDATE_WIDGET_DEFINITION,
            widgetDefinition,
            widgetId
        });
}

export function replaceWidget(widgetId, widgetFile, widgetUrl) {
    return (dispatch, getState) =>
        widgetDefinitionLoader.update(widgetId, widgetFile, widgetUrl, getState().manager).then(widgetDefinition =>
            dispatch({
                type: ActionType.UPDATE_WIDGET_DEFINITION,
                widgetDefinition,
                widgetId
            })
        );
}

export function checkIfWidgetIsUsed(widgetId) {
    return (dispatch, getState) => {
        const internal = new Internal(getState().manager);
        return internal.doGet<GetWidgetsUsedResponse>(`/widgets/${widgetId}/used`);
    };
}

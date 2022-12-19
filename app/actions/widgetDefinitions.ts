import type { GetWidgetsUsedResponse } from 'backend/routes/Widgets.types';
import type { WidgetDefinition } from '../utils/StageAPI';
import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import type { SimpleWidgetDefinition } from '../utils/widgetDefinitionsLoader';
import widgetDefinitionLoader from '../utils/widgetDefinitionsLoader';
import Internal from '../utils/Internal';

export type InstallWidgetAction = PayloadAction<WidgetDefinition, ActionType.INSTALL_WIDGET>;
export type UninstallWidgetAction = PayloadAction<string, ActionType.UNINSTALL_WIDGET>;
export type UpdateWidgetDefinitionAction = PayloadAction<
    { widgetId: string; widgetDefinition: WidgetDefinition },
    ActionType.UPDATE_WIDGET_DEFINITION
>;
export type StoreWidgetsDefinitionsAction = PayloadAction<
    SimpleWidgetDefinition[],
    ActionType.STORE_WIDGETS_DEFINITIONS
>;

export type WidgetDefinitionsAction =
    | InstallWidgetAction
    | UninstallWidgetAction
    | UpdateWidgetDefinitionAction
    | StoreWidgetsDefinitionsAction;

export type EnhancedWidgetDefinition = WidgetDefinition & SimpleWidgetDefinition;

function setInstallWidget(widgetDefinition: WidgetDefinition): InstallWidgetAction {
    return {
        type: ActionType.INSTALL_WIDGET,
        payload: widgetDefinition
    };
}

export function installWidget(
    widgetFile: File | null,
    widgetUrl: string
): ReduxThunkAction<Promise<InstallWidgetAction>, InstallWidgetAction> {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .install(widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinition => dispatch(setInstallWidget(widgetDefinition)));
}

function setUninstallWidget(widgetId: string): UninstallWidgetAction {
    return {
        type: ActionType.UNINSTALL_WIDGET,
        payload: widgetId
    };
}

export function uninstallWidget(
    widgetId: string
): ReduxThunkAction<Promise<UninstallWidgetAction>, UninstallWidgetAction> {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .uninstall(widgetId, getState().manager)
            .then(() => dispatch(setUninstallWidget(widgetId)));
}

function updateWidgetDef(widgetId: string, widgetDefinition: WidgetDefinition): UpdateWidgetDefinitionAction {
    return {
        type: ActionType.UPDATE_WIDGET_DEFINITION,
        payload: { widgetDefinition, widgetId }
    };
}

export function updateWidgetDefinition(
    widgetId: string,
    widgetDefinition: WidgetDefinition
): ReduxThunkAction<UpdateWidgetDefinitionAction, UpdateWidgetDefinitionAction> {
    return dispatch => dispatch(updateWidgetDef(widgetId, widgetDefinition));
}

export function replaceWidget(
    widgetId: string,
    widgetFile: File | null,
    widgetUrl: string
): ReduxThunkAction<Promise<UpdateWidgetDefinitionAction>, UpdateWidgetDefinitionAction> {
    return (dispatch, getState) =>
        widgetDefinitionLoader
            .update(widgetId, widgetFile, widgetUrl, getState().manager)
            .then(widgetDefinition => dispatch(updateWidgetDef(widgetId, widgetDefinition)));
}

export function checkIfWidgetIsUsed(widgetId: string): ReduxThunkAction<Promise<GetWidgetsUsedResponse>, never> {
    return (_dispatch, getState) => {
        const internal = new Internal(getState().manager);
        return internal.doGet<GetWidgetsUsedResponse>(`/widgets/${widgetId}/used`);
    };
}

function storeWidgetDefinitions(widgetDefinitions: SimpleWidgetDefinition[]): StoreWidgetsDefinitionsAction {
    return {
        type: ActionType.STORE_WIDGETS_DEFINITIONS,
        payload: widgetDefinitions
    };
}

export function loadWidgetDefinitions(): ReduxThunkAction<
    Promise<StoreWidgetsDefinitionsAction>,
    StoreWidgetsDefinitionsAction
> {
    return (dispatch, getState) =>
        widgetDefinitionLoader.load(getState().manager).then(result => dispatch(storeWidgetDefinitions(result)));
}

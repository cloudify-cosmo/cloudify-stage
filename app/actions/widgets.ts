import type { Action } from 'redux';
import type { PayloadAction } from './types';
import { ActionType } from './types';
import type { WidgetDefinition } from '../utils/StageAPI';
import type { SimpleWidgetObj } from './page';

export type AddWidgetAction = PayloadAction<
    {
        pageId: string;
        layoutSectionIndex: number;
        tabIndex: number;
        widget: SimpleWidgetObj;
        widgetDefinition: WidgetDefinition;
    },
    ActionType.ADD_WIDGET
>;
export type UpdateWidgetAction = PayloadAction<
    { pageId: string; widgetId: string; params: Partial<WidgetDefinition> },
    ActionType.UPDATE_WIDGET
>;
export type RemoveWidgetAction = PayloadAction<{ pageId: string; widgetId: string }, ActionType.REMOVE_WIDGET>;
export type MinimizeTabWidgetsAction = Action<ActionType.MINIMIZE_TAB_WIDGETS>;
export type MinimizeWidgetsAction = Action<ActionType.MINIMIZE_WIDGETS>;

export type WidgetAction =
    | AddWidgetAction
    | UpdateWidgetAction
    | RemoveWidgetAction
    | MinimizeTabWidgetsAction
    | MinimizeWidgetsAction;

export function addWidget(
    pageId: string,
    layoutSectionIndex: number,
    tabIndex: number,
    widget: SimpleWidgetObj,
    widgetDefinition: WidgetDefinition
): AddWidgetAction {
    return {
        type: ActionType.ADD_WIDGET,
        payload: {
            pageId,
            layoutSectionIndex,
            tabIndex,
            widget,
            widgetDefinition
        }
    };
}

export function updateWidget(pageId: string, widgetId: string, params: Partial<WidgetDefinition>): UpdateWidgetAction {
    return {
        type: ActionType.UPDATE_WIDGET,
        payload: { pageId, widgetId, params }
    };
}

export function removeWidget(pageId: string, widgetId: string): RemoveWidgetAction {
    return {
        type: ActionType.REMOVE_WIDGET,
        payload: { pageId, widgetId }
    };
}

export function minimizeTabWidgets(): MinimizeTabWidgetsAction {
    return {
        type: ActionType.MINIMIZE_TAB_WIDGETS
    };
}

export function minimizeWidgets(): MinimizeWidgetsAction {
    return {
        type: ActionType.MINIMIZE_WIDGETS
    };
}

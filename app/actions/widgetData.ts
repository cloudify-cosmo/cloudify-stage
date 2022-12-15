import log from 'loglevel';
import type { Action } from 'redux';
import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import WidgetDataFetcher from '../utils/widgetDataFetcher';
import StageUtils from '../utils/stageUtils';
import type { CancelablePromise } from '../utils/types';
import type { Widget, Toolbox } from '../utils/StageAPI';
import type WidgetParamsHandler from '../utils/WidgetParamsHandler';

export type FetchWidgetRequestAction = PayloadAction<string, ActionType.FETCH_WIDGET_REQUEST>;
export type FetchWidgetFailureAction = PayloadAction<{ widgetId: string; error: any }, ActionType.FETCH_WIDGET_FAILURE>;
export type FetchWidgetSuccessAction = PayloadAction<
    { widgetId: string; data: any; receivedAt: number },
    ActionType.FETCH_WIDGET_SUCCESS
>;
export type FetchWidgetCancelAction = PayloadAction<string, ActionType.FETCH_WIDGET_CANCEL>;
export type ClearWidgetDataAction = Action<ActionType.WIDGET_DATA_CLEAR>;

export type WidgetDataAction =
    | FetchWidgetRequestAction
    | FetchWidgetFailureAction
    | FetchWidgetSuccessAction
    | FetchWidgetCancelAction
    | ClearWidgetDataAction;

function fetchWidgetRequest(widgetId: string): FetchWidgetRequestAction {
    return {
        type: ActionType.FETCH_WIDGET_REQUEST,
        payload: widgetId
    };
}

function fetchWidgetFailure(widgetId: string, error: any): FetchWidgetFailureAction {
    return {
        type: ActionType.FETCH_WIDGET_FAILURE,
        payload: { widgetId, error }
    };
}

function fetchWidgetSuccess(widgetId: string, data: any): FetchWidgetSuccessAction {
    return {
        type: ActionType.FETCH_WIDGET_SUCCESS,
        payload: { widgetId, data, receivedAt: Date.now() }
    };
}

function fetchWidgetCancel(widgetId: string): FetchWidgetCancelAction {
    return {
        type: ActionType.FETCH_WIDGET_CANCEL,
        payload: widgetId
    };
}

export function clearWidgetsData(): ClearWidgetDataAction {
    return {
        type: ActionType.WIDGET_DATA_CLEAR
    };
}

export type FetchWidgetDataPromises = {
    cancelablePromise: CancelablePromise<unknown>;
    waitForPromise: Promise<unknown>;
};
export function fetchWidgetData(
    widget: Widget,
    toolbox: Toolbox,
    paramsHandler: WidgetParamsHandler
): ReduxThunkAction<FetchWidgetDataPromises, WidgetDataAction> {
    return dispatch => {
        dispatch(fetchWidgetRequest(widget.id));

        const widgetDataFetcher = new WidgetDataFetcher(widget, toolbox, paramsHandler);

        const fetchPromise = widget.definition.fetchUrl
            ? widgetDataFetcher.fetchByUrls()
            : widgetDataFetcher.fetchByFunc();

        const cancelablePromise = StageUtils.makeCancelable(fetchPromise);

        const waitForPromise = cancelablePromise.promise
            .then(response => {
                dispatch(fetchWidgetSuccess(widget.id, response));
                return response;
            })
            .catch(e => {
                if (e.isCanceled) {
                    log.log(`Widget '${widget.name}' data fetch canceled`);
                    dispatch(fetchWidgetCancel(widget.id));
                } else {
                    dispatch(fetchWidgetFailure(widget.id, e));
                }

                throw e;
            });

        return {
            cancelablePromise,
            waitForPromise
        };
    };
}

/**
 * Created by kinneretzin on 03/04/2017.
 */

import * as types from './types';
import WidgetDataFetcher from '../utils/widgetDataFetcher';
import StageUtils from '../utils/stageUtils';

function widgetFetchReq(widgetId) {
    return {
        type: types.WIDGET_FETCH_LOADING,
        widgetId
    };
}

function widgetFetchError(widgetId,error) {
    return {
        type: types.WIDGET_FETCH_ERROR,
        widgetId,
        error
    };
}

function widgetFetchRes(widgetId,data) {
    return {
        type: types.WIDGET_FETCH_RES,
        widgetId,
        data,
        receivedAt: Date.now()
    };
}

function widgetFetchCanceled(widgetId) {
    return {
        type: types.WIDGET_FETCH_CANCELED,
        widgetId
    }
}

export function fetchWidgetData(widget,toolbox,paramsHandler) {
    return function(dispatch) {
        dispatch(widgetFetchReq(widget.id));

        if (widget.definition.fetchUrl || _.isFunction(widget.definition.fetchData)) {

            var widgetDataFetcher = new WidgetDataFetcher(widget,toolbox,paramsHandler);

            var fetchPromise = widget.definition.fetchUrl ?
                widgetDataFetcher.fetchByUrls()
                :
                widgetDataFetcher.fetchByFunc();

            var cancelablePromise = StageUtils.makeCancelable(fetchPromise);

            var waitForPromise = cancelablePromise.promise
                .then((response)=> {
                    dispatch(widgetFetchRes(widget.id,response));
                    return response;
                })
                .catch((e)=>{
                    if (e.isCanceled) {
                        console.log(`Widget '${widget.name}' data fetch canceled`);
                        dispatch(widgetFetchCanceled(widget.id));
                    } else {
                        dispatch(widgetFetchError(widget.id,e));
                    }

                    throw e;
                });

            return {
                cancelablePromise,
                waitForPromise
            };
        }
    }
}

export function clearWidgetsData () {
    return {
        type: types.WIDGET_DATA_CLEAR
    }
}

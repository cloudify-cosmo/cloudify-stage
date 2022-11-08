import _ from 'lodash';
import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import type { WidgetDataAction } from '../actions/widgetData';

export interface WidgetData {
    id: string;
    data: any;
    loading: boolean;
    canceled: boolean;
    error: any;
    recievedAt?: number;
}
export type WidgetDataState = WidgetData[];

const widgetData: Reducer<WidgetDataState, WidgetDataAction> = (state = [], action) => {
    switch (action.type) {
        case ActionType.FETCH_WIDGET_REQUEST:
            if (!_.find(state, { id: action.payload })) {
                return [
                    ...state,
                    {
                        id: action.payload,
                        data: {},
                        loading: true,
                        canceled: false,
                        error: null
                    }
                ];
            }
            return state.map(w => {
                if (w.id === action.payload) {
                    return {
                        ...w,
                        ...{
                            loading: true,
                            canceled: false,
                            error: null
                        }
                    };
                }
                return w;
            });

        case ActionType.FETCH_WIDGET_FAILURE:
            return state.map(w => {
                if (w.id === action.payload.widgetId) {
                    return {
                        ...w,
                        ...{
                            loading: false,
                            error: action.payload.error,
                            canceled: false
                        }
                    };
                }
                return w;
            });
        case ActionType.FETCH_WIDGET_SUCCESS:
            return state.map(w => {
                if (w.id === action.payload.widgetId) {
                    return {
                        ...w,
                        ...{
                            loading: false,
                            data: action.payload.data,
                            recievedAt: action.payload.receivedAt,
                            error: null,
                            canceled: false
                        }
                    };
                }
                return w;
            });

        case ActionType.FETCH_WIDGET_CANCEL:
            return state.map(w => {
                if (w.id === action.payload) {
                    return {
                        ...w,
                        ...{
                            loading: false,
                            error: null,
                            canceled: true
                        }
                    };
                }
                return w;
            });
        case ActionType.WIDGET_DATA_CLEAR:
            return [];
        default:
            return state;
    }
};

export default widgetData;

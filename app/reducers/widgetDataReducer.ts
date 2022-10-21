// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';

const widgetData: Reducer = (state = [], action) => {
    switch (action.type) {
        case ActionType.WIDGET_FETCH_LOADING:
            if (!_.find(state, { id: action.widgetId })) {
                return [
                    ...state,
                    {
                        id: action.widgetId,
                        data: {},
                        loading: true,
                        canceled: false,
                        error: null
                    }
                ];
            }
            return state.map(w => {
                if (w.id === action.widgetId) {
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

        case ActionType.WIDGET_FETCH_ERROR:
            return state.map(w => {
                if (w.id === action.widgetId) {
                    return {
                        ...w,
                        ...{
                            loading: false,
                            error: action.error,
                            canceled: false
                        }
                    };
                }
                return w;
            });
        case ActionType.WIDGET_FETCH_RES:
            return state.map(w => {
                if (w.id === action.widgetId) {
                    return {
                        ...w,
                        ...{
                            loading: false,
                            data: action.data,
                            recievedAt: action.recievedAt,
                            error: null,
                            canceled: false
                        }
                    };
                }
                return w;
            });

        case ActionType.WIDGET_FETCH_CANCELED:
            return state.map(w => {
                if (w.id === action.widgetId) {
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

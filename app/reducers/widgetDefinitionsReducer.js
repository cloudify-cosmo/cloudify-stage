/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.STORE_WIDGETS:
            return [...action.widgetDefinitions];
        case types.INSTALL_WIDGET:
            return _.sortBy([...state, ...action.widgetDefinitions], ['name']);
        case types.UPDATE_WIDGET:
            var defs = _.reject(state, { 'id': action.widgetId });
            return _.sortBy([...defs, ...action.widgetDefinitions], ['name']);
        case types.UNINSTALL_WIDGET:
            return _.reject(state, { 'id': action.widgetId });

        default:
            return state;
    }
};


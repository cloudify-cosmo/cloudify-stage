/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const plugins = (state = {
    isFetching: false,
    err: null,
    items: []
}, action) => {
    switch (action.type) {
        case types.REQ_PLUGINS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case types.RES_PLUGINS:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.plugins,
                lastUpdated: action.receivedAt
            });
        case types.ERR_PLUGINS:
            return Object.assign({}, state, {
                isFetching: false,
                err: action.error,
                items: []
            });

        default:
            return state;
    }
};


export default plugins;

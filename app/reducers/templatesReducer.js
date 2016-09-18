/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const templates = (state = {
    isFetching: false,
    err: null,
    items: {}
}, action) => {
    switch (action.type) {
        case types.REQ_TEMPLATES:
            return Object.assign({}, state, {
                isFetching: true
            });
        case types.RES_TEMPLATES:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.templates,
                lastUpdated: action.receivedAt
            });
        case types.ERR_TEMPLATES:
            return Object.assign({}, state, {
                isFetching: false,
                err: action.error,
                items: {}
            });

        default:
            return state;
    }
};


export default templates;

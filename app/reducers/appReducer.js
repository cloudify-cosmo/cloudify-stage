/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const app = (state = {loading:true}, action) => {
    switch (action.type) {
        case types.SET_APP_LOADING:
            return {
                loading: action.isLoading
            }
        default:
            return state;
    }
};


export default app;

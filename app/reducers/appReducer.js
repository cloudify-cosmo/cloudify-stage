/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const app = (state = {loading:true}, action) => {
    switch (action.type) {
        case types.SET_APP_LOADING:
            return {
                loading: action.isLoading
            };
        case types.RES_LOGIN:
        case types.LOGOUT:
            return {
                loading: true
            };
        case types.APP_SIDEBAR_TOOGLE:
            return Object.assign({},state,{
                sidebarIsOpen: !state.sidebarIsOpen
            });
        default:
            return state;
    }
};


export default app;

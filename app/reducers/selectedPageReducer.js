/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import widgets from './widgetsReducer';

const selectedPage = (state = {}, action) => {
    switch (action.type) {
        case types.SELECT_PAGE:
            return action.page;
        case types.ADD_WIDGET:
            return Object.assign({}, state, {
                widgets: widgets(state.widgets,action)
            });
        default:
            return state;
    }
};


export default selectedPage;

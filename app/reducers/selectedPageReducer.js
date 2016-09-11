/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const selectedPage = (state = {}, action) => {
    switch (action.type) {
        case types.SELECT_PAGE:
            return action.page;
        default:
            return state;
    }
};


export default selectedPage;

/**
 * Created by edenp on 15/04/2018.
 */

import * as types from '../actions/types';

const tours = (state = [], action) => {
    switch (action.type) {
        case types.STORE_TOURS:
            return [...action.tours];
        default:
            return state;
    }
};

export default tours;

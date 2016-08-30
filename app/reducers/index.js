/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    // reducer,
    routing: routerReducer
});

export default rootReducer;

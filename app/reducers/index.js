/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import selectedPage from './selectedPageReducer';

const rootReducer = combineReducers({
    pages,
    selectedPage,
    routing: routerReducer
});

export default rootReducer;

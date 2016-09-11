/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import plugins from './pluginsReducer';
import selectedPage from './selectedPageReducer';

const rootReducer = combineReducers({
    pages,
    selectedPage,
    plugins,
    routing: routerReducer
});

export default rootReducer;

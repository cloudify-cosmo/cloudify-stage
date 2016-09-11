/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import plugins from './pluginsReducer';
import context from './contextReducer';
import selectedPage from './selectedPageReducer';

const rootReducer = combineReducers({
    pages,
    selectedPage,
    plugins,
    context,
    routing: routerReducer
});

export default rootReducer;

/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import plugins from './pluginsReducer';
import templates from './templatesReducer';
import context from './contextReducer';

const rootReducer = combineReducers({
    pages,
    plugins,
    templates,
    context,
    routing: routerReducer
});

export default rootReducer;

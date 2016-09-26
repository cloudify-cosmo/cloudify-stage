/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import plugins from './pluginsReducer';
import templates from './templatesReducer';
import context from './contextReducer';
import managers from './managersReducer';
import config from './configReducer';

const rootReducer = combineReducers({
    managers,
    pages,
    plugins,
    templates,
    context,
    config,
    routing: routerReducer
});

export default rootReducer;

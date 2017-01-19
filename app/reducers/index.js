/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import widgetDefinitions from './widgetDefinitionsReducer';
import templates from './templatesReducer';
import context from './contextReducer';
import manager from './managerReducer';
import config from './configReducer';

const rootReducer = combineReducers({
    manager,
    pages,
    widgetDefinitions,
    templates,
    context,
    config,
    routing: routerReducer
});

export default rootReducer;

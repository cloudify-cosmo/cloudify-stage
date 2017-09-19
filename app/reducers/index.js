/**
 * Created by kinneretzin on 30/08/2016.
 */

import { routerReducer} from 'react-router-redux';
import { combineReducers } from 'redux';
import pages from './pageReducer';
import widgetDefinitions from './widgetDefinitionsReducer';
import templates from './templatesReducer';
import templateManagement from './templateManagementReducer';
import context from './contextReducer';
import manager from './managerReducer';
import config from './configReducer';
import app from './appReducer';
import widgetData from './widgetDataReducer';
import drilldownContext from './drilldownContextReducer';

const rootReducer = combineReducers({
    app,
    manager,
    pages,
    widgetDefinitions,
    templates,
    templateManagement,
    context,
    drilldownContext,
    config,
    widgetData,
    routing: routerReducer
});

export default rootReducer;

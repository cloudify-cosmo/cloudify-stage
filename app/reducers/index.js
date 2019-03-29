/**
 * Created by kinneretzin on 30/08/2016.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import pages from './pageReducer';
import widgetDefinitions from './widgetDefinitionsReducer';
import tours from './toursReducer';
import templates from './templatesReducer';
import templateManagement from './templateManagementReducer';
import context from './contextReducer';
import manager from './managerReducer';
import config from './configReducer';
import app from './appReducer';
import widgetData from './widgetDataReducer';
import drilldownContext from './drilldownContextReducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    app,
    manager,
    pages,
    widgetDefinitions,
    tours,
    templates,
    templateManagement,
    context,
    drilldownContext,
    config,
    widgetData
});

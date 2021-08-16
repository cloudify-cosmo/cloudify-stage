// @ts-nocheck File not migrated fully to TS
/**
 * Created by kinneretzin on 30/08/2016.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';

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
import plugins from './plugins';

const rootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
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
        plugins
    });

export type ReduxState = ReturnType<ReturnType<typeof rootReducer>>;

export default rootReducer;

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';

import pageMenuItemsReducer from './pageReducer';
import widgetDefinitions from './widgetDefinitionsReducer';
import templates from './templatesReducer';
import templateManagement from './templateManagementReducer';
import context from './contextReducer';
import manager from './managerReducer';
import config from './configReducer';
import app from './appReducer';
import widgetData from './widgetDataReducer';
import drilldownContext from './drilldownContextReducer';
import plugins from './pluginsReducer';

const rootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
        app,
        manager,
        pages: pageMenuItemsReducer,
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

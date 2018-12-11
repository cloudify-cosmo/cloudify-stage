/**
 * Created by kinneretzin on 29/08/2016.
 */

import 'babel-polyfill';

window.$ = $;
import 'jquery-ui/ui/core.js';
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/mouse.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';

import './styles/style.scss';
import 'gs-ui-infra/app/styles/main-light.scss';

// Import semantic
import 'semantic-ui-css/semantic.min.css';

// Import react grid
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import highlight
import 'highlight.js/styles/xcode.css';

// Import hopscotch
import 'hopscotch/dist/css/hopscotch.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router-dom';

import configureStore  from './configureStore';
import {createToolbox} from './utils/Toolbox';
import ConfigLoader from './utils/ConfigLoader';
import EventBus from './utils/EventBus';
import Consts from './utils/consts';

import StatusPoller from './utils/StatusPoller';
import UserAppDataAutoSaver from './utils/UserAppDataAutoSaver';
import widgetDefinitionLoader from './utils/widgetDefinitionsLoader';
import Interceptor from './utils/Interceptor';

import Routes from './containers/Routes';

const browserHistory = createHistory({
    basename: Consts.CONTEXT_PATH
});

export default class app{
    static load (){
        window.React = React;

        window.onerror = function (message, source, lineno, colno, error) {
            EventBus.trigger('window:error', message, source, lineno, colno, error);
        };

        widgetDefinitionLoader.init();
        return ConfigLoader.load().then((result)=>{
            const store = configureStore(browserHistory,result);

            createToolbox(store);

            StatusPoller.create(store);
            UserAppDataAutoSaver.create(store);
            Interceptor.create(store);

            return store;
        });
    }

    static start (store) {
        ReactDOM.render(
            <Provider store={store}>
                <ConnectedRouter history={browserHistory}>
                    <Switch>
                        <Routes />
                    </Switch>
                </ConnectedRouter>
            </Provider>,
            document.getElementById('app')
        );
    }
}


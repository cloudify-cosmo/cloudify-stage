/**
 * Created by kinneretzin on 29/08/2016.
 */

import 'babel-polyfill';
import 'jquery-ui/ui/core.js';
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/mouse.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';

import './styles/style.scss';
import 'cloudify-ui-common/styles/font-cloudify.css';

// Import semantic
import 'semantic-ui-css/semantic.min.css';

// Import react grid
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import highlight
import 'highlight.js/styles/xcode.css';

// Import hopscotch
import 'hopscotch/dist/css/hopscotch.css';

// Import leaflet
import 'leaflet/dist/leaflet.css';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as Leaflet from 'leaflet';

import { connect, Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router-dom';

import configureStore from './configureStore';
import { createToolbox } from './utils/Toolbox';
import ConfigLoader from './utils/ConfigLoader';
import EventBus from './utils/EventBus';
import Consts from './utils/consts';

import StatusPoller from './utils/StatusPoller';
import UserAppDataAutoSaver from './utils/UserAppDataAutoSaver';
import widgetDefinitionLoader from './utils/widgetDefinitionsLoader';
import Interceptor from './utils/Interceptor';

import Routes from './containers/Routes';

window.$ = $;

const browserHistory = createBrowserHistory({
    basename: Consts.CONTEXT_PATH
});

export default class app {
    static load() {
        window.React = React;
        window.ReactDOM = ReactDOM;
        window.PropTypes = PropTypes;
        window.L = Leaflet;
        window.connectToStore = connect;

        window.onerror = function(message, source, lineno, colno, error) {
            EventBus.trigger('window:error', message, source, lineno, colno, error);
        };

        widgetDefinitionLoader.init();
        return ConfigLoader.load().then(result => {
            const store = configureStore(browserHistory, result);

            createToolbox(store);

            StatusPoller.create(store);
            UserAppDataAutoSaver.create(store);
            Interceptor.create(store);

            return store;
        });
    }

    static start(store) {
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

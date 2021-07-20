// @ts-nocheck File not migrated fully to TS

import './styles/style.scss';
import 'cloudify-ui-common/styles/font-cloudify.css';

// Import semantic
import 'semantic-ui-css-offline/semantic.min.css';

// Import react grid
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import leaflet
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import * as Leaflet from 'leaflet';
import 'leaflet.markercluster';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import log from 'loglevel';
import moment from 'moment';
import * as ReactQuery from 'react-query';
import { pick } from 'lodash';

import * as ReactRedux from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router-dom';

import i18n from 'i18next';
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
import translation from './translations/en.json';
import LoaderUtils from './utils/LoaderUtils';

window.$ = $;

const browserHistory = createBrowserHistory({
    basename: Consts.CONTEXT_PATH
});

const queryClient = new ReactQuery.QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

export default class app {
    static load() {
        i18n.init({
            resources: {
                en: {
                    translation
                }
            },
            lng: 'en',
            fallbackLng: 'en'
        });

        window.React = React;
        window.ReactDOM = ReactDOM;
        window.PropTypes = PropTypes;
        window.L = Leaflet;
        window.log = log;
        window.connectToStore = ReactRedux.connect;
        window.moment = moment;
        window.ReactRedux = pick(ReactRedux, 'useSelector');
        window.ReactQuery = ReactQuery;

        log.setLevel(log.levels.WARN);

        window.onerror = (message, source, lineno, colno, error) => {
            EventBus.trigger('window:error', message, source, lineno, colno, error);
        };

        widgetDefinitionLoader.init();

        return Promise.all([
            ConfigLoader.load().then(result => {
                const store = configureStore(browserHistory, result);

                createToolbox(store);

                StatusPoller.create(store);
                UserAppDataAutoSaver.create(store);
                Interceptor.create(store);

                return store;
            }),
            LoaderUtils.fetchResource('overrides.json', true).then(overrides =>
                i18n.addResourceBundle('en', 'translation', overrides, true, true)
            )
        ]).then(results => results[0]);
    }

    static start(store) {
        const { Provider } = ReactRedux;

        ReactDOM.render(
            <Provider store={store}>
                <ReactQuery.QueryClientProvider client={queryClient}>
                    <ConnectedRouter history={browserHistory}>
                        <Switch>
                            <Routes />
                        </Switch>
                    </ConnectedRouter>
                </ReactQuery.QueryClientProvider>
            </Provider>,
            document.getElementById('app')
        );
    }
}

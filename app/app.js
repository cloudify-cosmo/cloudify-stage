/**
 * Created by kinneretzin on 29/08/2016.
 */

import 'babel-polyfill';

//import $ from 'jquery'
window.$ = $;
import 'jquery-ui/ui/core.js';
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/mouse.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';

import _ from 'lodash';

//import '../styles/bootstrap.min.css';
import './styles/style.scss';

// Import semantic
import '../semantic/dist/semantic.min.css';
import '../semantic/dist/semantic.min';

// Import gridstack
import '../node_modules/gridstack/dist/gridstack.css';
import '../node_modules/gridstack/dist/gridstack.js';

// Import highlight
import '../node_modules/highlight.js/styles/github.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory ,useRouterHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore  from './configureStore';
import WidgetDefinitionsLoader from './utils/widgetDefinitionsLoader';
import {createToolbox} from './utils/Toolbox';
import ConfigLoader from './utils/ConfigLoader';
import createRoutes from './routes';

import TemplatesLoader from './utils/templatesLoader';

export default class app{
    static load (){
        window.React = React;

        WidgetDefinitionsLoader.init();

        Promise.all([
            TemplatesLoader.load(),
            WidgetDefinitionsLoader.load(),
            ConfigLoader.load()
        ]).then((result)=>{
            var templates = result[0];
            var widgetDefinitions = result[1];
            var config = result[2];

            const store = configureStore(browserHistory,templates,widgetDefinitions,config);

            const history = syncHistoryWithStore(browserHistory, store);

            createToolbox(store);


//history.listen(location => analyticsService.track(location.pathname))

            ReactDOM.render(
                <Provider store={store}>
                    <Router history={history} routes={createRoutes(store)} />
                </Provider>,
                document.getElementById('app')
            );
        });
    }
}


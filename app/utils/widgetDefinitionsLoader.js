/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'
import ScriptLoader from './scriptLoader';
import {v4} from 'node-uuid';
var ReactDOMServer = require('react-dom/server');

import 'angular';
import 'd3';
import momentImport from 'moment';

import '../../bower_components/cloudify-blueprint-topology/dist/styles/blueprint-topology.css';
import '../../bower_components/cloudify-blueprint-topology/dist/scripts/blueprint-topology-tpls.js';

import * as BasicComponents from '../components/basic';

import WidgetDefinition from './WidgetDefinition';
var widgetDefinitions = [];

function fetchWidgetTemplate(path) {
    return fetch(path)
        .then((response)=>{
            if (response.status >= 400) {
                console.error(response.statusText);
                return;
            }
            return response.text();
        });
}

export default class WidgetDefinitionsLoader {
    static init() {
        window.Stage = {
            defineWidget: (widgetDefinition)=> {
                widgetDefinitions.push(new WidgetDefinition(widgetDefinition));
            },
            Basic: BasicComponents,
            ComponentToHtmlString: (component)=>{
                return ReactDOMServer.renderToString(component);
            },
            GenericConfig
        };

        window.moment = momentImport;
    }

    static load() {

        return fetch('/widgets/widgets.json')
            .then(response => response.json())
            .then((data)=> {
                var promises = [];
                data.forEach((widgetName)=>{
                    promises.push(new ScriptLoader('/widgets/'+widgetName+'/widget.js').load());
                });
                return Promise.all(promises);
            })
            .then(()=> {
                var promises = [];
                widgetDefinitions.forEach((widgetDefinition)=> {
                    if (widgetDefinition.hasTemplate) {
                        promises.push(
                            fetchWidgetTemplate('/widgets/' + widgetDefinition.id + '/widget.html')
                                .then((widgetHtml)=> {
                                    if (widgetHtml) {
                                        widgetDefinition.template = widgetHtml;
                                    }
                                }));
                    }
                });
                return Promise.all(promises);
            })
            .then(()=> {
                _.each(widgetDefinitions,w=>{
                    if (w.init && typeof w.init === 'function') {
                        w.init();
                    }
                })
            })
            .then(()=> {
                var loadedWidgetDefinitions = _.clone(widgetDefinitions);
                widgetDefinitions = []; // Clear for next time
                return loadedWidgetDefinitions;
            })
            .catch((e)=>{
                console.error(e);
            });
    }
}

class GenericConfig {
    static PAGE_SIZE_CONFIG = (pageSize = BasicComponents.Pagination.PAGE_SIZE_LIST[0]) => {
        return {id: "pageSize",
                name: "Pagination page size",
                default: pageSize,
                items: BasicComponents.Pagination.PAGE_SIZE_LIST,
                type: BasicComponents.GenericField.NUMBER_EDITABLE_LIST_TYPE}
    };

    static POLLING_TIME_CONFIG = (pollingTime = 0) => {
        return {id: "pollingTime",
                name: "Refresh time interval",
                default: pollingTime,
                placeHolder: "Enter time interval in seconds",
                description: "Data of the widget will be refreshed per provided interval time in seconds",
                type: BasicComponents.GenericField.NUMBER_TYPE}
    };

}
/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'
import ScriptLoader from './scriptLoader';
import StyleLoader from './StyleLoader';

import {v4} from 'node-uuid';
var ReactDOMServer = require('react-dom/server');

import 'angular';
import 'd3';
import momentImport from 'moment';

import '../../bower_components/cloudify-blueprint-topology/dist/styles/blueprint-topology.css';
import '../../bower_components/cloudify-blueprint-topology/dist/scripts/blueprint-topology-tpls.js';

import * as BasicComponents from '../components/basic';
import StageUtils from './stageUtils';

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
            GenericConfig,
            Common: [],
            defineCommon: (def) =>{
                Stage.Common[def.name] = def.common;
            },
            Utils: StageUtils
        };

        window.moment = momentImport;
    }


    static load() {
        return Promise.all([
                    new ScriptLoader('/widgets/common/common.js').load(), // Commons has to load before the widgets
                    fetch('/widgets/widgets.json').then(response => response.json()) // We can load the list of widgets in the meanwhile
                ])
            .then((results)=> {
                var data = results[1]; // widgets data
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
                    if (widgetDefinition.hasStyle) {
                        promises.push(new StyleLoader('/widgets/'+widgetDefinition.id+'/widget.css').load());
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
    static POLLING_TIME_CONFIG = (pollingTime = 0) => {
        return {id: "pollingTime",
                name: "Refresh time interval",
                default: pollingTime,
                placeHolder: "Enter time interval in seconds",
                description: "Data of the widget will be refreshed per provided interval time in seconds",
                type: BasicComponents.GenericField.NUMBER_TYPE}
    };

    static PAGE_SIZE_CONFIG = (pageSize = BasicComponents.Pagination.PAGE_SIZE_LIST(5)[0]) => {
        return {id: "pageSize",
                default: pageSize,
                hidden: true}
    };

    static SORT_COLUMN_CONFIG = (sortColumn) => {
        return {id: 'sortColumn',
                default: sortColumn,
                hidden: true}
    };

    static SORT_ASCENDING_CONFIG = (sortAscending) => {
        return {id: 'sortAscending',
                default: sortAscending,
                hidden: true}
    };
}
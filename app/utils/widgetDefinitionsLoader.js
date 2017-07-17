/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'
import External from './External'
import Internal from './Internal'
import ScriptLoader from './scriptLoader';
import StyleLoader from './StyleLoader';

import {v4} from 'node-uuid';
var ReactDOMServer = require('react-dom/server');

import 'angular/angular';

import 'd3';
import momentImport from 'moment';

import '../../bower_components/cloudify-blueprint-topology/dist/styles/blueprint-topology.css';
import '../../bower_components/cloudify-blueprint-topology/dist/fonts/gigaspaces/style.css';
import '../../bower_components/cloudify-blueprint-topology/dist/scripts/blueprint-topology-tpls.js';

import * as BasicComponents from '../components/basic';
import StageUtils from './stageUtils';
import Pagination from '../components/basic/pagination/Pagination';

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
                widgetDefinitions.push(new WidgetDefinition({...widgetDefinition, id: document.currentScript.id}));
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

    static _loadWidgets() {
        console.log("Load widgets");

        var external = new External();
        return Promise.all([
                new ScriptLoader('/widgets/common/common.js').load(), // Commons has to load before the widgets
                external.doGet('/widgets/list') // We can load the list of widgets in the meanwhile
            ])
            .then((results)=> {
                var data = results[1]; // widgets data
                var promises = [];
                data.forEach((item)=>{
                    promises.push(WidgetDefinitionsLoader._loadWidget(item.id, false));
                });

                var output = _.keyBy(data, 'id');
                return Promise.all(promises).then(() => output);
            });
    }

    static _loadWidget(id, rejectOnError) {
        return new ScriptLoader(`/widgets/${id}/widget.js`).load(id, rejectOnError);
    }

    static _loadWidgetsResources(widgets) {
        console.log("Load widgets resources");

        var promises = [];
        widgetDefinitions.forEach((widgetDefinition)=> {
            //Mark system widgets to protect against uninstalling
            widgetDefinition.isCustom = widgets[widgetDefinition.id].isCustom;

            if (widgetDefinition.hasTemplate) {
                promises.push(
                    fetchWidgetTemplate(`/widgets/${widgetDefinition.id}/widget.html`)
                        .then((widgetHtml)=> {
                            if (widgetHtml) {
                                widgetDefinition.template = widgetHtml;
                            }
                        }));
            }
            if (widgetDefinition.hasStyle) {
                promises.push(new StyleLoader(`/widgets/${widgetDefinition.id}/widget.css`).load());
            }
        });

        return Promise.all(promises);
    }

    static _initWidgets() {
        console.log("Init widgets");

        _.each(widgetDefinitions,w=>{
            if (w.init && typeof w.init === 'function') {
                w.init();
            }
        })

        var loadedWidgetDefinitions = _.sortBy(widgetDefinitions, ['name']);
        widgetDefinitions = []; // Clear for next time

        return Promise.resolve(loadedWidgetDefinitions);
    }

    static load() {
        return WidgetDefinitionsLoader._loadWidgets()
            .then((widgets) => WidgetDefinitionsLoader._loadWidgetsResources(widgets))
            .then(() => WidgetDefinitionsLoader._initWidgets())
            .catch((e)=>{
                console.error(e);
                widgetDefinitions = []; // Clear for next time
            });
    }

    static _installWidget(widgetFile, widgetUrl, manager) {
        var internal = new Internal(manager);

        if (widgetUrl) {
            console.log("Install widget from url", widgetUrl);
            return internal.doPut(`/widgets/install`,{url: widgetUrl, username: manager.username});
        } else {
            console.log("Install widget from file");
            return internal.doUpload(`/widgets/install`,{username: manager.username},{widget:widgetFile});
        }
    }

    static _updateWidget(widgetId, widgetFile, widgetUrl, manager) {
        var internal = new Internal(manager);

        if (widgetUrl) {
            console.log("Update widget " + widgetId + " from url", widgetUrl);
            return internal.doPut(`/widgets/update`,{url: widgetUrl, id: widgetId});
        } else {
            console.log("Update widget " + widgetId + " from file");
            return internal.doUpload(`/widgets/update`,{id: widgetId},{widget:widgetFile});
        }
    }

    static install(widgetFile, widgetUrl, manager) {
        return WidgetDefinitionsLoader._installWidget(widgetFile, widgetUrl, manager)
            .then(data => WidgetDefinitionsLoader._loadWidget(data.id, true)
                .then(() => {
                    var error = "";
                    if (_.isEmpty(widgetDefinitions)) {
                        error = 'Widget not properly initialized. Please check if widget.js is correctly defined.';
                    } else if (widgetDefinitions.length > 1) {
                        error = 'Only single widget should be defined within widget.js';
                    };

                    if (error) {
                        return WidgetDefinitionsLoader.uninstall(data.id).then(() => { throw new Error(error) });
                    };

                    return Promise.resolve();
                })
                .then(() => WidgetDefinitionsLoader._loadWidgetsResources(_.keyBy([data], 'id'))))
            .then(() => WidgetDefinitionsLoader._initWidgets())
            .catch(err => {
                widgetDefinitions = []; // Clear for next time
                console.error(err);
                throw err;
            })
    }

    static update(widgetId, widgetFile, widgetUrl, manager) {
        return WidgetDefinitionsLoader._updateWidget(widgetId, widgetFile, widgetUrl, manager)
            .then(data => WidgetDefinitionsLoader._loadWidget(data.id, true)
                .then(() => WidgetDefinitionsLoader._loadWidgetsResources(_.keyBy([data], 'id'))))
            .then(() => WidgetDefinitionsLoader._initWidgets())
            .catch(err => {
                widgetDefinitions = []; // Clear for next time
                console.error(err);
                throw err;
            })
    }

    static uninstall(widgetId, manager) {
        var internal = new Internal(manager);
        return internal.doDelete(`/widgets/${widgetId}`)
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

    static PAGE_SIZE_CONFIG = (pageSize = Pagination.PAGE_SIZE_LIST(5)[0]) => {
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
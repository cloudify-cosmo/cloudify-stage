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

var plugins = [];

function fetchPluginTemplate(path) {
    return fetch(path)
        .then((response)=>{
            if (response.status >= 400) {
                console.error(response.statusText);
                return;
            }
            return response.text();
        });
}

class Plugin {

    constructor(data) {
        // Set default
        this.showHeader = true;
        this.showBorder = true;
        this.initialWidth = 3;
        this.initialHeight = 3;
        this.color = "blue";
        this.initialConfiguration = [];
        this.keepOnTop = false;

        // Override defaults with data
        Object.assign(this,data);

        this.zIndex = this.keepOnTop ? 5 : 0;

        this.initPollingTime();

        if (!this.name) {
            throw new Error('Missing plugin name. Plugin data is :',data);
        }
        if (!this.id) {
            throw new Error('Missing plugin id. Plugin data is :',data);
        }
    }

    initPollingTime() {
        const pollingTimeOption = {
            id: "pollingTime",
            name: "Refresh time interval",
            placeHolder: "Enter time interval in seconds",
            default: 0
        };

        let option = _.find(this.initialConfiguration,{id:"pollingTime"});
        if (option) {
            Object.assign(option, Object.assign({}, pollingTimeOption, option));
        } else {
            this.initialConfiguration.unshift(pollingTimeOption);
        }
    }
}

export default class PluginsLoader {
    static init() {
        window.Stage = {
            addPlugin: (pluginData)=> {
                plugins.push(new Plugin(pluginData));
            },
            Basic: BasicComponents,
            ComponentToHtmlString: (component)=>{
                return ReactDOMServer.renderToString(component);
            }
        };

        window.moment = momentImport;
    }

    static load() {

        return fetch('/plugins/plugins.json')
            .then(response => response.json())
            .then((data)=> {
                var promises = [];
                data.forEach((plugin)=>{
                    promises.push(new ScriptLoader('/plugins/'+plugin+'/widget.js').load());
                });
                return Promise.all(promises);
            })
            .then(()=> {
                var promises = [];
                plugins.forEach((plugin)=> {
                    if (plugin.hasTemplate) {
                        promises.push(
                            fetchPluginTemplate('/plugins/' + plugin.id + '/widget.html')
                                .then((pluginHtml)=> {
                                    if (pluginHtml) {
                                        plugin.template = pluginHtml;
                                    }
                                }));
                    }
                });
                return Promise.all(promises);
            })
            .then(()=> {
                _.each(plugins,p=>{
                    if (p.init && typeof p.init === 'function') {
                        p.init();
                    }
                })
            })
            .then(()=> {
                var loadedPlugins = _.clone(plugins);
                plugins = []; // Clear for next time
                return loadedPlugins;
            })
            .catch((e)=>{
                console.error(e);
            });
    }
}

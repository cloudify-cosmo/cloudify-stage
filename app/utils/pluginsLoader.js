/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'
import ScriptLoader from './scriptLoader';
import PluginUtils from './pluginUtils';

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
        //.then({response => response.text());
}

class Plugin {
    constructor(data) {
        // Set default
        this.showHeader = true;
        this.initialWidth = 3;
        this.initialHeight = 3;
        this.color = "blue";

        // Override defaults with data
        Object.assign(this,data);

        if (!this.name) {
            throw new Error('Missing plugin name. Plugin data is :',data);
        }
        if (!this.id) {
            throw new Error('Missing plugin id. Plugin data is :',data);
        }

    }
}
export default class PluginsLoader {
    static init() {
        window.addPlugin = function(pluginData) {
            plugins.push(new Plugin(pluginData));
        }

    }
    static load() {

        return fetch('/plugins/plugins.json')
            .then(response => response.json())
            .then((data)=> {
                var promises = [];
                data.forEach((plugin)=>{
                    promises.push(new ScriptLoader('/plugins/'+plugin.name+'/widget.js').load());
                });
                return Promise.all(promises);
            })
            .then(()=> {
                var promises = [];
                plugins.forEach((plugin)=> {
                    promises.push(
                        fetchPluginTemplate('/plugins/' + plugin.id + '/widget.html')
                            .then( (pluginHtml)=>{
                                if (pluginHtml) {
                                    plugin.template = pluginHtml;
                                }
                            }));
                });
                return Promise.all(promises);
            })
            .then(()=> {
                _.each(plugins,p=>{
                    if (p.init && typeof p.init === 'function') {
                        p.init(PluginUtils);
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

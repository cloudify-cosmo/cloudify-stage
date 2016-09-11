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

export default class PluginsLoader {
    static init() {
        window.addPlugin = function(pluginData) {
            plugins.push(pluginData);
        }

    }
    static load() {
        //return fetch('/plugins/plugins.json')
        //    .then(response => response.json());

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
                        fetchPluginTemplate('/plugins/' + plugin.name + '/widget.html')
                            .then( (pluginHtml)=>{
                                if (pluginHtml) {
                                    plugin.template = pluginHtml;
                                }
                            }));
                });
                return Promise.all(promises);
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

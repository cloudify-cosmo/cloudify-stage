/**
 * Created by kinneretzin on 03/04/2017.
 */

import StageUtils from './stageUtils';

export default class WidgetDataFetcher {
    constructor (widget,toolbox,paramsHandler) {
        this._widget = widget;
        this._toolbox = toolbox;
        this._paramsHandler = paramsHandler;
    }

    fetchByUrls() {
        var urls = _.isString(this._widget.definition.fetchUrl) ? [this._widget.definition.fetchUrl] : _.valuesIn(this._widget.definition.fetchUrl);

        var fetches = _.map(urls,(url)=> this._fetchByUrl(url));
        return Promise.all(fetches).then(data=>{

            // Parse the data per url key name
            var output = data;
            if (!_.isString(this._widget.definition.fetchUrl)) {
                output = {};
                let keys = _.keysIn(this._widget.definition.fetchUrl);
                for (var i=0; i < data.length; i++) {
                    output[keys[i]] = data[i];
                }
            } else {
                output = data[0];
            }
            return output;
        });

    }

    _handleUrl(prefix, url) {
        var baseUrl = url.substring(prefix.length);

        let params = {};
        let paramsMatch = this._getUrlRegExString('params').exec(baseUrl);
        if (!_.isNull(paramsMatch)) {
            let [paramsString, allowedParams] = paramsMatch;

            params = this._paramsHandler.buildParamsToSend(allowedParams);

            baseUrl = _.replace(baseUrl, paramsString, '');
        }

        return {url: baseUrl, params};
    }

    _fetchByUrl(url) {
        var fetchUrl = _.replace(url,this._getUrlRegExString('config'),(match,configName)=>{
            return this._widget.configuration ? this._widget.configuration[configName] : 'NA';
        });

        if (url.indexOf('[manager]') >= 0) {
            // User manager accessor if needs to go to the manager
            var data = this._handleUrl('[manager]', url);
            return this._toolbox.getManager().doGet(data.url, data.params);
        } else if (url.indexOf('[backend]') >= 0) {
            // User backend accessor if needs to go to the backend
            var data = this._handleUrl('[backend]', url);
            return this._toolbox.getInternal().doGet(data.url, data.params);
        } else {
            // User external if the url is not manager based
            return this._toolbox.getExternal().doGet(fetchUrl);
        }
    }


    fetchByFunc() {
        if (_.isFunction(this._widget.definition.fetchData)) {
            try {
                return this._widget.definition.fetchData(this._widget,this._toolbox,this._paramsHandler.buildParamsToSend());
            } catch (e) {
                console.error('Error fetching widget data',e);
                return Promise.reject({error: 'Error fetching widget data'});
            }
        } else {
            return Promise.reject({error: 'Widget doesnt have a fetchData function'});
        }
    }


    _getUrlRegExString(str) {
        return new RegExp('\\[' + str + ':?(.*)\\]', 'i');
    }

}
/**
 * Created by kinneretzin on 03/04/2017.
 */

import _ from 'lodash';
import log from 'loglevel';
import i18n from 'i18next';

function getUrlRegExString(str) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(`\\[${str}:?(.*)\\]`, 'i');
}

export default class WidgetDataFetcher {
    constructor(widget, toolbox, paramsHandler) {
        this.widget = widget;
        this.toolbox = toolbox;
        this.paramsHandler = paramsHandler;
    }

    fetchByUrls() {
        const urls = _.isString(this.widget.definition.fetchUrl)
            ? [this.widget.definition.fetchUrl]
            : _.valuesIn(this.widget.definition.fetchUrl);

        const fetches = _.map(urls, url => this.fetchByUrl(url));
        return Promise.all(fetches).then(data => {
            // Parse the data per url key name
            let output = data;
            if (!_.isString(this.widget.definition.fetchUrl)) {
                output = {};
                const keys = _.keysIn(this.widget.definition.fetchUrl);
                for (let i = 0; i < data.length; i += 1) {
                    output[keys[i]] = data[i];
                }
            } else {
                [output] = data;
            }
            return output;
        });
    }

    handleUrl(prefix, url) {
        let baseUrl = url.substring(prefix.length);

        let params = {};
        const paramsMatch = getUrlRegExString('params').exec(baseUrl);
        if (!_.isNull(paramsMatch)) {
            const [paramsString, allowedParams] = paramsMatch;

            params = this.paramsHandler.buildParamsToSend(allowedParams);

            baseUrl = _.replace(baseUrl, paramsString, '');
        }

        return { url: baseUrl, params };
    }

    fetchByUrl(url) {
        const fetchUrl = _.replace(url, getUrlRegExString('config'), (match, configName) => {
            return this.widget.configuration ? this.widget.configuration[configName] : 'NA';
        });

        if (url.indexOf('[manager]') >= 0) {
            // User manager accessor if needs to go to the manager
            const data = this.handleUrl('[manager]', url);
            return this.toolbox.getManager().doGet(data.url, data);
        }
        if (url.indexOf('[backend]') >= 0) {
            // User backend accessor if needs to go to the backend
            const data = this.handleUrl('[backend]', url);
            return this.toolbox.getInternal().doGet(data.url, data);
        }
        // User external if the url is not manager based
        return this.toolbox.getExternal().doGet(fetchUrl);
    }

    fetchByFunc() {
        if (_.isFunction(this.widget.definition.fetchData)) {
            try {
                return this.widget.definition.fetchData(
                    this.widget,
                    this.toolbox,
                    this.paramsHandler.buildParamsToSend()
                );
            } catch (e) {
                log.error('Error fetching widget data', e);
                return Promise.reject({ error: i18n.t('widget.fetchError', 'Error fetching widget data') });
            }
        } else {
            return Promise.reject({
                error: i18n.t('widget.fetchDataFunctionError', 'Widget doesnt have a fetchData function')
            });
        }
    }
}

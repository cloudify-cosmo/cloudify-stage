/**
 * Created by pawelposel on 09/11/2016.
 */

import md5 from 'blueimp-md5';
import {getToolbox} from './Toolbox';
import _ from 'lodash';

import GenericField from './../components/basic/form/GenericField';

import ExecutionUtils from './shared/ExecutionUtils';
import JsonUtils from './shared/JsonUtils';
import TimeUtils from './shared/TimeUtils';
import UrlUtils from './shared/UrlUtils';

import InfluxActions from './shared/InfluxActions';

export default class StageUtils {

    static Execution = ExecutionUtils;
    static Json = JsonUtils;
    static Time = TimeUtils;
    static Url = UrlUtils;

    static InfluxActions = InfluxActions;

    static makeCancelable(promise) {
        let hasCanceled_ = false;

        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then((val) =>
                hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
            );
            promise.catch((error) =>
                hasCanceled_ ? reject({isCanceled: true}) : reject(error)
            );
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled_ = true;
            },
        };
    };

    /**
     * @deprecated use TimeUtils.formatTimestamp
     */
    static formatTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern='YYYY-MM-DD HH:mm:ss') {
        return TimeUtils.formatTimestamp(timestamp, outputPattern, inputPattern);
    }

    /**
     * @deprecated use TimeUtils.formatLocalTimestamp
     */
    static formatLocalTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern=undefined) {
        return TimeUtils.formatLocalTimestamp(timestamp, outputPattern, inputPattern);
    }

    /**
     * Replace all occurrences of <Tag attr1="value1" attr1="value2" ...> to "tag value1 value2 ..."
     * @param message
     * @returns {*}
     */
    static resolveMessage(message) {
        var tagPattern = /<(\w+)[^<]*>/;
        var noValueAttrPattern = /[',",`]([^',^",^`]+)[',",`]/;
        var attrPattern = /(\w+)=[',",`]([^',^",^`]+)[',",`]/g;

        var matchedTag, matchedAttr, sentence = '';
        while (matchedTag = tagPattern.exec(message)) {
            var tag = matchedTag[0];
            var sentence = matchedTag[1].toLowerCase();

            var attributes = [];
            while (matchedAttr = attrPattern.exec(tag)) {
                attributes.push({key: matchedAttr[1], value: matchedAttr[2]});
            }

            if (attributes.length > 0) {
                if (attributes.length > 1) {
                    sentence += ' with';
                    _.each(attributes,(item, index)=> {
                        sentence += ` ${item.key}=${item.value} ${(index < attributes.length - 1) ? ' and' : ''}`;
                    })
                } else {
                    sentence += ` ${attributes[0].value}`;
                }
            } else {
                matchedAttr = noValueAttrPattern.exec(tag);
                if (matchedAttr) {
                    sentence += ` ${matchedAttr[1]}`;
                }
            }

            message = message.replace(tag, sentence);
        }

        return message;
    }

    static getMD5(str) {
        return md5(str);
    }

    /**
     * @deprecated use UrlUtils.url
     */
    static url(path) {
        return UrlUtils.url(path);
    }

    /**
     * @deprecated use UrlUtils.isUrl
     */
    static isUrl(str) {
        return UrlUtils.isUrl(str);
    }

    /**
     * @deprecated use UrlUtils.redirectToPage
     */
    static redirectToPage(url) {
        return UrlUtils.redirectToPage(url);
    }

    /**
     * @deprecated use UrlUtils.widgetResourceUrl
     */
    static widgetResourceUrl(widgetId, internalPath, isCustom = true, addContextPath = true) {
        return UrlUtils.widgetResourceUrl(widgetId, internalPath, isCustom, addContextPath);
    }

    static buildConfig(widgetDefinition) {
        var configs = {};

        _.each(widgetDefinition.initialConfiguration,(config)=>{
            if (!config.id) {
                console.log('Cannot process config for widget :"'+widgetDefinition.name+'" , because it missing an Id ',config);
                return;
            }

            var value = config.default && !config.value ? config.default : (_.isUndefined(config.value) ? null : config.value );

            configs[config.id] = GenericField.formatValue(config.type, value);
        });

        return configs;
    };

    static getToolbox(onRefresh, onLoading, widget) {
        return getToolbox(onRefresh, onLoading, widget);
    }

    static isUserAuthorized(permission, managerData) {
        var authorizedRoles = managerData.permissions[permission];

        var systemRole = managerData.auth.role;
        var groupSystemRoles = _.keys(managerData.auth.groupSystemRoles);
        var currentTenantRoles = managerData.auth.tenantsRoles[managerData.tenants.selected];
        var tenantRoles = currentTenantRoles ? currentTenantRoles.roles : [];
        var userRoles = _.uniq(tenantRoles.concat(systemRole, groupSystemRoles));
        return _.intersection(authorizedRoles, userRoles).length > 0;
    }
}
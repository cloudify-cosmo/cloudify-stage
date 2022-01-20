import md5 from 'blueimp-md5';
import _ from 'lodash';
import log from 'loglevel';
import { saveAs } from 'file-saver';
import { marked } from 'marked';
import { v4 } from 'uuid';
import i18n, { TFunction } from 'i18next';
import { GenericField } from '../components/basic';
import type { ManagerData } from '../reducers/managerReducer';

import ExecutionUtils from './shared/ExecutionUtils';
import JsonUtils from './shared/JsonUtils';
import TimeUtils from './shared/TimeUtils';
import UrlUtils from './shared/UrlUtils';
import combineClassNames from './shared/combineClassNames';
import mapGridParamsToManagerGridParams from './shared/mapGridParamsToManagerGridParams';
import { isEmptyWidgetData, WidgetDefinition } from './StageAPI';

export default class StageUtils {
    static Execution = ExecutionUtils;

    static Json = JsonUtils;

    static Time = TimeUtils;

    static Url = UrlUtils;

    static combineClassNames = combineClassNames;

    static mapGridParamsToManagerGridParams = mapGridParamsToManagerGridParams;

    static parseMarkdown = marked;

    static saveAs = saveAs;

    static makeCancelable<T>(promise: Promise<T>) {
        let hasCanceled = false;

        const wrappedPromise = new Promise<T>((resolve, reject) => {
            promise
                .then(val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)))
                .catch(error => (hasCanceled ? reject({ isCanceled: true }) : reject(error)));
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled = true;
            }
        };
    }

    /**
     * @deprecated use TimeUtils.formatTimestamp
     */
    static formatTimestamp = TimeUtils.formatTimestamp.bind(TimeUtils);

    /**
     * @deprecated use TimeUtils.formatLocalTimestamp
     */
    static formatLocalTimestamp = TimeUtils.formatLocalTimestamp.bind(TimeUtils);

    static formatDisplayName(data: Partial<{ id: string; displayName: string }>): string {
        if (data.id === undefined) {
            log.error('id is undefined');

            return '';
        }

        if (data.id === data.displayName) {
            return data.id;
        }

        if (data.displayName) {
            return `${data.displayName} (${data.id})`;
        }

        return data.id;
    }

    /**
     * Replace all occurrences of <Tag attr1="value1" attr1="value2" ...> to "tag value1 value2 ..."
     *
     * @param message
     * @returns {*}
     */
    static resolveMessage(message: string) {
        const tagPattern = /<(\w+)[^<]*>/;
        const noValueAttrPattern = /[',",`]([^',^",^`]+)[',",`]/;
        const attrPattern = /(\w+)=[',",`]([^',^",^`]+)[',",`]/g;

        let matchedTag;
        let matchedAttr;
        let sentence = '';
        let resolvedMessage = message;

        // eslint-disable-next-line no-cond-assign,scanjs-rules/accidental_assignment
        while ((matchedTag = tagPattern.exec(resolvedMessage))) {
            const tag = matchedTag[0];
            sentence = matchedTag[1].toLowerCase();

            const attributes = [];
            // eslint-disable-next-line no-cond-assign,scanjs-rules/accidental_assignment
            while ((matchedAttr = attrPattern.exec(tag))) {
                attributes.push({ key: matchedAttr[1], value: matchedAttr[2] });
            }

            if (attributes.length > 0) {
                if (attributes.length > 1) {
                    sentence += ' with';
                    // eslint-disable-next-line no-loop-func
                    _.each(attributes, (item, index) => {
                        sentence += ` ${item.key}=${item.value} ${index < attributes.length - 1 ? ' and' : ''}`;
                    });
                } else {
                    sentence += ` ${attributes[0].value}`;
                }
            } else {
                matchedAttr = noValueAttrPattern.exec(tag);
                if (matchedAttr) {
                    sentence += ` ${matchedAttr[1]}`;
                }
            }

            resolvedMessage = resolvedMessage.replace(tag, sentence);
        }

        return resolvedMessage;
    }

    static getMD5(str: string) {
        return md5(str);
    }

    /**
     * @deprecated use UrlUtils.url
     */
    static url = UrlUtils.url.bind(UrlUtils);

    /**
     * @deprecated use UrlUtils.isUrl
     */
    static isUrl = UrlUtils.isUrl.bind(UrlUtils);

    /**
     * @deprecated use UrlUtils.redirectToPage
     */
    static redirectToPage = UrlUtils.redirectToPage.bind(UrlUtils);

    /**
     * @deprecated use UrlUtils.widgetResourceUrl
     */
    static widgetResourceUrl = UrlUtils.widgetResourceUrl.bind(UrlUtils);

    static buildConfig(widgetDefinition: WidgetDefinition) {
        const configs: Record<string, any> = {};

        _.each(widgetDefinition.initialConfiguration, config => {
            if (!config.id) {
                log.debug(
                    `Cannot process config for widget :"${widgetDefinition.name}" , because it missing an Id `,
                    config
                );
                return;
            }

            let value: any;
            if (config.default && !config.value) {
                value = config.default;
            } else if (_.isUndefined(config.value)) {
                value = null;
            } else {
                value = config.value;
            }

            configs[config.id] = GenericField.formatValue(config.type, value);
        });

        return configs;
    }

    static isUserAuthorized(permission: string, managerData: ManagerData) {
        const authorizedRoles = managerData.permissions[permission];

        const systemRole = managerData.auth.role;
        const groupSystemRoles = _.keys(managerData.auth.groupSystemRoles);
        const currentTenantRoles = managerData.auth.tenantsRoles[managerData.tenants.selected];
        const tenantRoles = currentTenantRoles ? currentTenantRoles.roles : [];
        const userRoles = _.uniq(tenantRoles.concat(systemRole, groupSystemRoles));
        return _.intersection(authorizedRoles, userRoles).length > 0;
    }

    static isWidgetPermitted(widgetSupportedEditions: WidgetDefinition['supportedEditions'], managerData: any) {
        // Don't check the supported editions and keep backwards compatibility
        if (_.isEmpty(widgetSupportedEditions)) {
            return true;
        }

        const licenseEdition = _.get(managerData, 'license.data.license_edition', '');
        return _.includes(widgetSupportedEditions, licenseEdition);
    }

    static composeT(parentT: TFunction, keyNextPart: string): TFunction {
        return (keySuffix: string, ...params: any[]) => parentT(`${keyNextPart}.${keySuffix}`, ...params);
    }

    static getT(keyPrefix: string) {
        return StageUtils.composeT(i18n.t.bind(i18n), keyPrefix);
    }

    static isEmptyWidgetData = isEmptyWidgetData;

    static uuid = v4;

    /**
     * Similar to lodash's `memoize`, but uses a `WeakMap` for cache.
     * Reduces the risk of a memory leak as the keys are held weakly.
     */
    // NOTE: the `object` type is required by `WeakMap`
    // eslint-disable-next-line @typescript-eslint/ban-types
    static memoizeWithWeakMap = <K extends object, V>(fn: (key: K) => V) => {
        const cache = new WeakMap<K, V>();

        return (key: K): V => {
            const existingValue = cache.get(key);
            if (existingValue) {
                return existingValue;
            }

            const newValue = fn(key);
            cache.set(key, newValue);
            return newValue;
        };
    };

    static openComposer() {
        window.open(`/composer/`, '_blank');
    }
}
